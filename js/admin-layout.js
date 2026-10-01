document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('app-sidebar');
    const header = document.getElementById('app-header');
    const page = document.body.getAttribute('data-admin-page');

    if(sidebar) {
        sidebar.innerHTML = `
            <div class="app-sidebar-header">
                <i class="ph ph-shield-check"></i> <span>Admin Portal</span>
            </div>
            <nav class="app-sidebar-nav">
                <a href="dashboard.html" class="nav-item ${page==='dashboard'?'active':''}"><i class="ph ph-squares-four"></i> Dashboard</a>
                
                <div style="padding: 1rem 1.5rem 0.5rem; font-size: 0.75rem; font-weight: 600; color: #64748b; text-transform: uppercase;">Users</div>
                <a href="students.html" class="nav-item ${page==='students'?'active':''}"><i class="ph ph-users"></i> Students</a>
                <a href="teachers.html" class="nav-item ${page==='teachers'?'active':''}"><i class="ph ph-chalkboard-teacher"></i> Teachers</a>
                <a href="mentor-applications.html" class="nav-item ${page==='mentor-apps'?'active':''}"><i class="ph ph-file-text"></i> Mentor Apps <span class="badge badge-warning" style="margin-left:auto; padding:0.15rem 0.4rem; font-size:0.65rem;">7</span></a>
                
                <div style="padding: 1rem 1.5rem 0.5rem; font-size: 0.75rem; font-weight: 600; color: #64748b; text-transform: uppercase;">Academic</div>
                <a href="classes.html" class="nav-item ${page==='classes'?'active':''}"><i class="ph ph-buildings"></i> Classes & Divs</a>
                <a href="subjects.html" class="nav-item ${page==='subjects'?'active':''}"><i class="ph ph-books"></i> Subjects</a>
                <a href="library.html" class="nav-item ${page==='library'?'active':''}"><i class="ph ph-book-bookmark"></i> Digital Library</a>
                
                <div style="padding: 1rem 1.5rem 0.5rem; font-size: 0.75rem; font-weight: 600; color: #64748b; text-transform: uppercase;">Platform</div>
                <a href="doubts.html" class="nav-item ${page==='doubts'?'active':''}"><i class="ph ph-question"></i> Doubt Mgt</a>
                <a href="sessions.html" class="nav-item ${page==='sessions'?'active':''}"><i class="ph ph-video-camera"></i> 1:1 Sessions</a>
                <a href="community-moderation.html" class="nav-item ${page==='moderation'?'active':''}"><i class="ph ph-shield-warning"></i> Moderation</a>
                <a href="announcements.html" class="nav-item ${page==='announcements'?'active':''}"><i class="ph ph-megaphone"></i> Announcements</a>
                
                <div style="padding: 1rem 1.5rem 0.5rem; font-size: 0.75rem; font-weight: 600; color: #64748b; text-transform: uppercase;">System</div>
                <a href="reports.html" class="nav-item ${page==='reports'?'active':''}"><i class="ph ph-chart-bar"></i> Reports</a>
            </nav>
            <div style="padding: 1rem; border-top: 1px solid rgba(255,255,255,0.1);">
                <a href="settings.html" class="nav-item ${page==='settings'?'active':''}"><i class="ph ph-gear"></i> Settings</a>
                <a href="../login.html" class="nav-item" onclick="sessionStorage.removeItem('currentUser'); localStorage.removeItem('currentUser');"><i class="ph ph-sign-out"></i> Logout</a>
            </div>
        `;
    }

    if(header) {
        header.innerHTML = `
            <div class="header-left">
                <button class="menu-toggle" id="main-menu-toggle" title="Toggle Sidebar"><i class="ph ph-list"></i></button>
                <div class="hide-on-mobile">
                    <h2 style="margin: 0; font-size: 1.15rem; color: var(--text-main);">Administrator</h2>
                </div>
            </div>
            <div class="header-right">
                <button class="btn-icon theme-toggle" onclick="if(typeof toggleTheme === 'function') toggleTheme()" title="Toggle Theme"><i class="ph ph-moon"></i></button>
                <a href="notifications.html" class="btn-icon" style="position:relative;" title="Notifications">
                    <i class="ph ph-bell"></i>
                    <span style="position:absolute; top:4px; right:4px; width:8px; height:8px; background:var(--status-danger); border-radius:50%;"></span>
                </a>
                <a href="settings.html" style="display:flex; align-items:center; gap:0.5rem; text-decoration:none; margin-left: 0.5rem;">
                    <div style="width:36px; height:36px; border-radius:50%; background:var(--text-main); color:var(--bg-color); display:flex; align-items:center; justify-content:center; font-weight: 600;">
                        AD
                    </div>
                </a>
            </div>
        `;
    }
    
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
});
