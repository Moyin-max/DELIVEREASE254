import userDB from './userDatabase.js';

// Check if user is admin
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = userDB.getCurrentUser();
    if (!currentUser || !currentUser.isAdmin) {
        window.location.href = 'login.html';
        return;
    }

    // Initialize dashboard
    initializeDashboard();
    loadRecentOrders();
    setupEventListeners();
});

// Initialize dashboard
function initializeDashboard() {
    // Update admin profile
    const adminProfile = document.querySelector('.admin-profile span');
    if (adminProfile) {
        adminProfile.textContent = userDB.getCurrentUser().name;
    }

    // Update stats
    updateDashboardStats();
}

// Load recent orders
function loadRecentOrders() {
    const orders = userDB.getRecentOrders();
    const tableBody = document.getElementById('recentOrdersTable');
    
    if (tableBody) {
        tableBody.innerHTML = orders.map(order => `
            <tr>
                <td>#${order.id}</td>
                <td>${order.customerName}</td>
                <td>
                    <span class="status-badge ${order.status.toLowerCase()}">
                        ${order.status}
                    </span>
                </td>
                <td>$${order.amount.toFixed(2)}</td>
                <td>
                    <button onclick="viewOrder(${order.id})" class="btn-icon">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="editOrder(${order.id})" class="btn-icon">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteOrder(${order.id})" class="btn-icon">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

// Update dashboard stats
function updateDashboardStats() {
    const stats = userDB.getDashboardStats();
    
    // Update each stat card
    document.querySelectorAll('.stat-number').forEach(stat => {
        const statType = stat.closest('.stat-card').querySelector('h3').textContent;
        switch(statType) {
            case 'Total Orders':
                stat.textContent = stats.totalOrders;
                break;
            case 'Active Customers':
                stat.textContent = stats.activeCustomers;
                break;
            case 'Active Drivers':
                stat.textContent = stats.activeDrivers;
                break;
            case 'Revenue':
                stat.textContent = `$${stats.revenue.toFixed(2)}`;
                break;
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.querySelector('.header-search input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filterOrders(searchTerm);
        });
    }

    // Notification button
    const notificationBtn = document.querySelector('.btn-notification');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', showNotifications);
    }

    // Sidebar navigation
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.target.getAttribute('href').substring(1);
            navigateToSection(section);
        });
    });
}

// Navigation functions
function navigateToSection(section) {
    // Remove active class from all sections
    document.querySelectorAll('.sidebar-nav li').forEach(item => {
        item.classList.remove('active');
    });

    // Add active class to current section
    const currentSection = document.querySelector(`.sidebar-nav a[href="#${section}"]`);
    if (currentSection) {
        currentSection.parentElement.classList.add('active');
    }

    // Load section content
    loadSectionContent(section);
}

// Load section content
function loadSectionContent(section) {
    const content = document.querySelector('.dashboard-content');
    if (!content) return;

    switch(section) {
        case 'dashboard':
            content.innerHTML = document.querySelector('.dashboard-content').innerHTML;
            break;
        case 'orders':
            loadOrdersSection();
            break;
        case 'customers':
            loadCustomersSection();
            break;
        case 'drivers':
            loadDriversSection();
            break;
        case 'reports':
            loadReportsSection();
            break;
        case 'settings':
            loadSettingsSection();
            break;
    }
}

// Action functions
function addNewOrder() {
    // Implement new order form
    console.log('Add new order');
}

function addNewDriver() {
    // Implement new driver form
    console.log('Add new driver');
}

function generateReport() {
    // Implement report generation
    console.log('Generate report');
}

function viewAnalytics() {
    // Implement analytics view
    console.log('View analytics');
}

function viewOrder(orderId) {
    // Implement order view
    console.log('View order:', orderId);
}

function editOrder(orderId) {
    // Implement order edit
    console.log('Edit order:', orderId);
}

function deleteOrder(orderId) {
    if (confirm('Are you sure you want to delete this order?')) {
        // Implement order deletion
        console.log('Delete order:', orderId);
    }
}

function viewAllOrders() {
    navigateToSection('orders');
}

function showNotifications() {
    // Implement notifications panel
    console.log('Show notifications');
}

function filterOrders(searchTerm) {
    const rows = document.querySelectorAll('#recentOrdersTable tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        userDB.logout();
        window.location.href = 'login.html';
    }
}

// Export functions for use in HTML
window.addNewOrder = addNewOrder;
window.addNewDriver = addNewDriver;
window.generateReport = generateReport;
window.viewAnalytics = viewAnalytics;
window.viewOrder = viewOrder;
window.editOrder = editOrder;
window.deleteOrder = deleteOrder;
window.viewAllOrders = viewAllOrders;
window.logout = logout; 