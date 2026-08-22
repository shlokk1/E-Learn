document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('app-sidebar');
    const header = document.getElementById('app-header');
    
    // Determine active page
    const activePage = document.body.getAttribute('data-teacher-page') || 'dashboard';

    const navItems = [
        { id: 'dashboard', icon: 'squares-four', text: 'Dashboard', link: 'dashboard.html' },
        { id: 'doubt-review', icon: 'magnifying-glass', text: 'Doubt Review', link: 'doubt-review.html' },
        { id: 'my-doubts', icon: 'chat-teardrop-text', text: 'My Doubts', link: 'my-doubts.html' },
        { id: 'students', icon: 'users', text: 'Students', link: 'students.html' },
        { id: 'materials', icon: 'books', text: 'Class Materials', link: 'materials.html' },
        { id: 'moderation', icon: 'shield-warning', text: 'Community Moderation', link: 'moderation.html' },
        { id: 'announcements', icon: 'megaphone', text: 'Announcements', link: 'announcements.html' },
        { id: 'notifications', icon: 'bell', text: 'Notifications', link: 'notifications.html' },
        { id: 'activity', icon: 'chart-line-up', text: 'My Activity', link: 'activity.html' }
    ];

    if (sidebar) {
        let navHtml = navItems.map(item => `
            <a href="${item.link}" class="nav-item ${activePage === item.id ? 'active' : ''}">
                <i class="ph ph-${item.icon}"></i> ${item.text}
            </a>
        `).join('');

        sidebar.innerHTML = `
            <div class="app-sidebar-header">
                <i class="ph ph-chalkboard-teacher"></i>
                <span>Teacher Portal</span>
            </div>
            <nav class="app-sidebar-nav">${navHtml}</nav>
            <div style="padding: 1rem; border-top: 1px solid rgba(255,255,255,0.1);">
                <a href="profile.html" class="nav-item ${activePage === 'profile' ? 'active' : ''}"><i class="ph ph-user"></i> Profile</a>
                <a href="settings.html" class="nav-item ${activePage === 'settings' ? 'active' : ''}"><i class="ph ph-gear"></i> Settings</a>
                <a href="../login.html" class="nav-item"><i class="ph ph-sign-out"></i> Logout</a>
            </div>
        `;
    }

    if (header) {
        header.innerHTML = `
            <div class="header-left">
                <button class="menu-toggle" onclick="document.querySelector('.app-container').classList.toggle('sidebar-collapsed')">
                    <i class="ph ph-list"></i>
                </button>
                <h2 style="font-size: 1.1rem; margin: 0; font-weight: 600;">EduPortal Mentorship</h2>
            </div>
            <div class="header-right">
                <button class="btn-icon theme-toggle" onclick="toggleTheme()" title="Toggle Theme">
                    <i class="ph ph-moon"></i>
                </button>
                <a href="notifications.html" class="btn-icon" style="position: relative;">
                    <i class="ph ph-bell"></i>
                    <span style="position: absolute; top: 0px; right: 0px; width: 8px; height: 8px; background: var(--status-danger); border-radius: 50%;"></span>
                </a>
                <div class="user-profile" style="display: flex; align-items: center; gap: 0.5rem; font-weight: 500;">
                    <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--primary-color); color: white; display: flex; align-items: center; justify-content: center;">
                        <i class="ph ph-user"></i>
                    </div>
                    <span>Teacher</span>
                </div>
            </div>
        `;
    }
});
