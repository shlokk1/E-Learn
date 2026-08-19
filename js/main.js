/**
 * Main Application Logic
 * Handles global UI interactions like the mobile sidebar.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Sidebar Toggle for Mobile
    const menuToggleBtn = document.getElementById('mobile-menu-toggle');
    const sidebar = document.getElementById('app-sidebar');
    
    if (menuToggleBtn && sidebar) {
        menuToggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
        
        // Optional: Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && 
                sidebar.classList.contains('open') && 
                !sidebar.contains(e.target) && 
                !menuToggleBtn.contains(e.target)) {
                
                sidebar.classList.remove('open');
            }
        });
    }

    // 2. Theme Toggle Buttons
    const themeToggleBtns = document.querySelectorAll('.theme-toggle');
    themeToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (typeof toggleTheme === 'function') {
                toggleTheme();
            }
        });
    });

});
