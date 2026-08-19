/**
 * Student Layout Logic
 * Injects the sidebar and header into all student pages to keep HTML DRY.
 */
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('app-sidebar');
    const header = document.getElementById('app-header');
    const currentPage = document.body.getAttribute('data-page');

    if(sidebar) {
        sidebar.innerHTML = `
            <div class="app-sidebar-header">
                <i class="ph ph-book-open"></i> <span>EduPortal</span>
            </div>
            <nav class="app-sidebar-nav">
                <a href="dashboard.html" class="nav-item ${currentPage === 'dashboard' ? 'active' : ''}"><i class="ph ph-squares-four"></i> Dashboard</a>
                <a href="doubts.html" class="nav-item ${['doubts', 'ask-doubt', 'doubt-details'].includes(currentPage) ? 'active' : ''}"><i class="ph ph-question"></i> My Doubts</a>
                <a href="library.html" class="nav-item ${['library', 'resource-viewer'].includes(currentPage) ? 'active' : ''}"><i class="ph ph-books"></i> Digital Library</a>
                <a href="community.html" class="nav-item ${['community', 'discussion'].includes(currentPage) ? 'active' : ''}"><i class="ph ph-users"></i> Student Community</a>
                <a href="announcements.html" class="nav-item ${currentPage === 'announcements' ? 'active' : ''}"><i class="ph ph-megaphone"></i> Announcements</a>
                <a href="notifications.html" class="nav-item ${currentPage === 'notifications' ? 'active' : ''}"><i class="ph ph-bell"></i> Notifications</a>
                <a href="activity.html" class="nav-item ${currentPage === 'activity' ? 'active' : ''}"><i class="ph ph-chart-line-up"></i> My Activity</a>
                <a href="profile.html" class="nav-item ${currentPage === 'profile' ? 'active' : ''}"><i class="ph ph-user"></i> Profile</a>
                <a href="settings.html" class="nav-item ${currentPage === 'settings' ? 'active' : ''}"><i class="ph ph-gear"></i> Settings</a>
                <a href="../login.html" class="nav-item mt-4" onclick="localStorage.removeItem('currentUser')"><i class="ph ph-sign-out"></i> Logout</a>
            </nav>
        `;
    }

    if(header) {
        const user = MOCK_DATA.getUser();
        header.innerHTML = `
            <div class="header-left">
                <button class="menu-toggle" id="main-menu-toggle" title="Toggle Sidebar"><i class="ph ph-list"></i></button>
                <div class="hide-on-mobile">
                    <h2 style="margin: 0; font-size: 1.15rem; color: var(--text-main);">Class ${user.class} &middot; Division ${user.division}</h2>
                </div>
            </div>
            <div class="header-right">
                <button class="btn-icon theme-toggle" onclick="if(typeof toggleTheme === 'function') toggleTheme()" title="Toggle Theme"><i class="ph ph-moon"></i></button>
                <a href="notifications.html" class="btn-icon" style="position:relative;" title="Notifications">
                    <i class="ph ph-bell"></i>
                    <span style="position:absolute; top:4px; right:4px; width:8px; height:8px; background:var(--status-danger); border-radius:50%;"></span>
                </a>
                <a href="profile.html" style="display:flex; align-items:center; gap:0.5rem; text-decoration:none; margin-left: 0.5rem;">
                    <div style="width:36px; height:36px; border-radius:50%; background:var(--primary-color); color:white; display:flex; align-items:center; justify-content:center; font-weight: 600;">
                        ${user.name.charAt(0)}
                    </div>
                </a>
            </div>
        `;
        
        // Bind Sidebar Toggle (Mobile & Desktop)
        const menuBtn = document.getElementById('main-menu-toggle');
        const appContainer = document.querySelector('.app-container');
        if (menuBtn && sidebar && appContainer) {
            menuBtn.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    sidebar.classList.toggle('open');
                } else {
                    appContainer.classList.toggle('sidebar-collapsed');
                }
            });
        }
    }
});
