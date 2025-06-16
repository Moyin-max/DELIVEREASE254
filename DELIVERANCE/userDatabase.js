// User Database Simulation
class UserDatabase {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.orders = JSON.parse(localStorage.getItem('orders')) || [];
        this.userActivity = JSON.parse(localStorage.getItem('userActivity')) || [];
        
        // Create default admins if none exist
        if (!this.users.some(user => user.isAdmin)) {
            this.createDefaultAdmins();
        }
    }

    createDefaultAdmins() {
        const adminUsers = [
            {
                id: this.generateUserId(),
                name: 'Admin',
                email: 'admin@deliverease.com',
                password: this.hashPassword('Admin@123'),
                isAdmin: true,
                createdAt: new Date().toISOString(),
                lastLogin: null,
                loginCount: 0,
                profileImage: null
            },
            {
                id: this.generateUserId(),
                name: 'Super Admin',
                email: 'superadmin@deliverease.com',
                password: this.hashPassword('SuperAdmin@123'),
                isAdmin: true,
                createdAt: new Date().toISOString(),
                lastLogin: null,
                loginCount: 0,
                profileImage: null
            }
        ];

        this.users.push(...adminUsers);
        this.saveData();
        console.log('Admin users created:', adminUsers);
    }

    saveData() {
        localStorage.setItem('users', JSON.stringify(this.users));
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        localStorage.setItem('orders', JSON.stringify(this.orders));
        localStorage.setItem('userActivity', JSON.stringify(this.userActivity));

        // Dispatch event for real-time updates
        window.dispatchEvent(new CustomEvent('databaseUpdate', {
            detail: {
                users: this.users,
                orders: this.orders,
                activity: this.userActivity
            }
        }));
    }

    generateUserId() {
        return 'USR' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    generateOrderId() {
        return 'ORD' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    generateTrackingNumber() {
        return 'TRK' + Math.random().toString(36).substr(2, 6).toUpperCase();
    }

    hashPassword(password) {
        return btoa(password); // Simple encoding for demo
    }

    registerUser(userData) {
        if (!userData || !userData.name || !userData.email || !userData.password) {
            throw new Error('Please provide all required fields');
        }

        if (this.users.some(user => user.email === userData.email)) {
            throw new Error('Email already registered');
        }

        const newUser = {
            id: this.generateUserId(),
            name: userData.name,
            email: userData.email,
            password: this.hashPassword(userData.password),
            isAdmin: false,
            createdAt: new Date().toISOString(),
            lastLogin: null,
            loginCount: 0,
            profileImage: null
        };

        this.users.push(newUser);
        this.logUserActivity(newUser.id, 'register');
        this.saveData();
        return newUser;
    }

    loginUser(email, password) {
        console.log('Attempting login for:', email); // Debug log
        const user = this.users.find(u => u.email === email);
        
        if (!user) {
            console.log('User not found'); // Debug log
            throw new Error('Invalid credentials');
        }

        const hashedPassword = this.hashPassword(password);
        console.log('Password check:', hashedPassword === user.password); // Debug log

        if (user.password !== hashedPassword) {
            throw new Error('Invalid credentials');
        }

        // Update user activity
        user.lastLogin = new Date().toISOString();
        user.loginCount = (user.loginCount || 0) + 1;
        
        // Log user activity
        this.logUserActivity(user.id, 'login');
        
        this.currentUser = user;
        this.saveData();
        console.log('Login successful:', user); // Debug log
        return user;
    }

    logoutUser() {
        if (this.currentUser) {
            this.logUserActivity(this.currentUser.id, 'logout');
        }
        this.currentUser = null;
        this.saveData();
    }

    logUserActivity(userId, action) {
        const activity = {
            userId,
            action,
            timestamp: new Date().toISOString(),
            details: {}
        };
        this.userActivity.push(activity);
        this.saveData();
    }

    createOrder(userId, serviceType, details) {
        const order = {
            id: this.generateOrderId(),
            userId,
            serviceType,
            details,
            status: 'pending',
            createdAt: new Date().toISOString(),
            trackingNumber: this.generateTrackingNumber(),
            updates: [{
                status: 'pending',
                timestamp: new Date().toISOString(),
                location: 'Processing Center',
                description: 'Order received'
            }]
        };

        this.orders.push(order);
        this.logUserActivity(userId, 'create_order', { orderId: order.id });
        this.saveData();
        return order;
    }

    updateOrderStatus(orderId, status, location, description) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) {
            throw new Error('Order not found');
        }

        order.status = status;
        order.updates.push({
            status,
            timestamp: new Date().toISOString(),
            location,
            description
        });

        this.logUserActivity(order.userId, 'order_update', { orderId, status });
        this.saveData();
        return order;
    }

    getAdminStats() {
        const now = new Date();
        const last24Hours = new Date(now - 24 * 60 * 60 * 1000);
        const last7Days = new Date(now - 7 * 24 * 60 * 60 * 1000);
        const last30Days = new Date(now - 30 * 24 * 60 * 60 * 1000);

        // Get monthly user registrations
        const monthlyRegistrations = Array(12).fill(0);
        this.users.forEach(user => {
            const userDate = new Date(user.createdAt);
            if (userDate > last30Days) {
                const monthIndex = userDate.getMonth();
                monthlyRegistrations[monthIndex]++;
            }
        });

        // Get daily login activity
        const dailyLogins = Array(7).fill(0);
        this.userActivity.forEach(activity => {
            if (activity.action === 'login') {
                const activityDate = new Date(activity.timestamp);
                if (activityDate > last7Days) {
                    const dayIndex = activityDate.getDay();
                    dailyLogins[dayIndex]++;
                }
            }
        });

        return {
            totalUsers: this.users.length,
            activeUsers: this.users.filter(u => u.lastLogin && new Date(u.lastLogin) > last24Hours).length,
            totalOrders: this.orders.length,
            recentOrders: this.orders.filter(o => new Date(o.createdAt) > last24Hours).length,
            weeklyOrders: this.orders.filter(o => new Date(o.createdAt) > last7Days).length,
            pendingOrders: this.orders.filter(o => o.status === 'pending').length,
            completedOrders: this.orders.filter(o => o.status === 'delivered').length,
            recentActivity: this.userActivity.slice(-10).reverse(),
            monthlyRegistrations,
            dailyLogins,
            userLoginStats: this.users.map(u => ({
                id: u.id,
                name: u.name,
                email: u.email,
                lastLogin: u.lastLogin,
                loginCount: u.loginCount || 0
            }))
        };
    }

    getOrderDetails(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) {
            throw new Error('Order not found');
        }

        const user = this.users.find(u => u.id === order.userId);
        return {
            ...order,
            user: user ? {
                name: user.name,
                email: user.email
            } : null
        };
    }

    getUserOrders(userId) {
        return this.orders.filter(o => o.userId === userId);
    }

    getUserActivity(userId) {
        return this.userActivity.filter(a => a.userId === userId);
    }

    isCurrentUserAdmin() {
        console.log('Current user:', this.currentUser); // Debug log
        return this.currentUser && this.currentUser.isAdmin === true;
    }

    getAllUsers() {
        return this.users.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            isAdmin: u.isAdmin,
            createdAt: u.createdAt,
            lastLogin: u.lastLogin,
            loginCount: u.loginCount || 0
        }));
    }

    getAllOrders() {
        return this.orders.map(o => ({
            ...o,
            user: this.users.find(u => u.id === o.userId)?.name || 'Unknown User'
        }));
    }

    updateUser(userData) {
        const userIndex = this.users.findIndex(u => u.id === userData.id);
        if (userIndex === -1) {
            throw new Error('User not found');
        }

        // Preserve sensitive data
        const currentUser = this.users[userIndex];
        userData.password = currentUser.password;
        userData.isAdmin = currentUser.isAdmin;

        this.users[userIndex] = { ...currentUser, ...userData };
        this.saveData();

        // Update current user if it's the same user
        if (this.currentUser && this.currentUser.id === userData.id) {
            this.currentUser = this.users[userIndex];
        }

        return this.users[userIndex];
    }
}

// Initialize the database
const userDB = new UserDatabase();

export default userDB; 