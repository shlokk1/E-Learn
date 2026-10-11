document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('app-sidebar');
    const header = document.getElementById('app-header');
    
    // Determine active page
    const activePage = document.body.getAttribute('data-teacher-page') || 'dashboard';

    const navItems = [
        { id: 'dashboard', icon: 'squares-four', text: 'Dashboard', link: 'dashboard.html' },
        { id: 'doubt-review', icon: 'magnifying-glass', text: 'Doubt Review', link: 'doubt-review.html' },
        { id: 'my-doubts', icon: 'chat-teardrop-text', text: 'My Doubts', link: 'my-doubts.html' },
        { id: 'sessions', icon: 'chalkboard-teacher', text: '1:1 Sessions', link: 'sessions.html' },
        { id: 'students', icon: 'users', text: 'Students', link: 'students.html' },
        { id: 'materials', icon: 'books', text: 'Class Materials', link: 'materials.html' },
        { id: 'moderation', icon: 'shield-warning', text: 'Community Moderation', link: 'moderation.html' },
        { id: 'announcements', icon: 'megaphone', text: 'Announcements', link: 'announcements.html' },
        { id: 'notifications', icon: 'bell', text: 'Notifications', link: 'notifications.html' },
        { id: 'activity', icon: 'chart-line-up', text: 'My Activity', link: 'activity.html' }
    ];

    if (sidebar) {
        let navHtml = navItems.map(item => {
            const isMyDoubtsGroup = ['my-doubts', 'my-doubts-in-progress', 'my-doubts-resolved', 'answer-doubt'].includes(activePage);
            const isDoubtReviewGroup = ['doubt-review', 'doubt-details'].includes(activePage);
            const isActive = (item.id === 'my-doubts' && isMyDoubtsGroup) ||
                             (item.id === 'doubt-review' && isDoubtReviewGroup) ||
                             (activePage === item.id);
            return `
                <a href="${item.link}" class="nav-item ${isActive ? 'active' : ''}">
                    <i class="ph ph-${item.icon}"></i> ${item.text}
                </a>
            `;
        }).join('');

        sidebar.innerHTML = `
            <div class="app-sidebar-header">
                <i class="ph ph-chalkboard-teacher"></i>
                <span>Teacher Portal</span>
            </div>
            <nav class="app-sidebar-nav">${navHtml}</nav>
            <div style="padding: 1rem; border-top: 1px solid rgba(255,255,255,0.1);">
                <a href="profile.html" class="nav-item ${activePage === 'profile' ? 'active' : ''}"><i class="ph ph-user"></i> Profile</a>
                <a href="settings.html" class="nav-item ${activePage === 'settings' ? 'active' : ''}"><i class="ph ph-gear"></i> Settings</a>
                <a href="../auth/login.html" class="nav-item" onclick="localStorage.removeItem('currentUser')"><i class="ph ph-sign-out"></i> Logout</a>
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
                <a href="profile.html" class="user-profile" title="View Profile" style="display: flex; align-items: center; gap: 0.5rem; font-weight: 500; text-decoration: none; color: inherit; cursor: pointer; padding: 0.25rem 0.5rem; border-radius: var(--border-radius); transition: background-color 0.2s;">
                    <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--primary-color); color: white; display: flex; align-items: center; justify-content: center;">
                        <i class="ph ph-user"></i>
                    </div>
                    <span>Teacher</span>
                </a>
            </div>
        `;
    }

    // Doubt Review Filter
    if (activePage === 'doubt-review') {
        initDoubtReviewFilters();
    }

    // My Students Filter
    if (activePage === 'students') {
        initStudentsFilters();
    }

    // Class Materials Filter
    if (activePage === 'materials') {
        initMaterialsFilters();
    }
});

// ==========================================
// Doubt Review: Search, Filters & Rejected Doubts
// ==========================================
function initDoubtReviewFilters() {
    const searchInput = document.getElementById('doubtSearchInput');
    const classFilter = document.getElementById('doubtClassFilter');
    const subjectFilter = document.getElementById('doubtSubjectFilter');
    const statusFilter = document.getElementById('doubtStatusFilter');
    const resetBtn = document.getElementById('doubtResetBtn');
    const tableBody = document.querySelector('.admin-table tbody');
    if (!tableBody) return;

    loadDynamicallyRejectedDoubts();

    function filterDoubts() {
        const rows = tableBody.querySelectorAll('tr:not(.no-results-row):not(.table-section-divider)');
        const query = (searchInput ? searchInput.value : '').trim().toLowerCase();
        const selectedClass = (classFilter ? classFilter.value : 'all').toLowerCase();
        const selectedSubject = (subjectFilter ? subjectFilter.value : 'all').toLowerCase();
        const selectedStatus = (statusFilter ? statusFilter.value : 'all').toLowerCase();

        let visibleCount = 0;
        let visibleRejectedCount = 0;

        rows.forEach(row => {
            const rowText = row.textContent.toLowerCase();
            const rowClass = (row.getAttribute('data-class') || '').toLowerCase();
            const rowSubject = (row.getAttribute('data-subject') || '').toLowerCase();
            const rowStatus = (row.getAttribute('data-status') || '').toLowerCase();

            const matchesQuery = !query || rowText.includes(query);
            const matchesClass = selectedClass === 'all' || rowClass.includes(selectedClass) || rowText.includes(selectedClass);
            const matchesSubject = selectedSubject === 'all' || rowSubject.includes(selectedSubject) || rowText.includes(selectedSubject);
            const matchesStatus = selectedStatus === 'all' || rowStatus === selectedStatus;

            if (matchesQuery && matchesClass && matchesSubject && matchesStatus) {
                row.style.display = '';
                visibleCount++;
                if (rowStatus === 'rejected') visibleRejectedCount++;
            } else {
                row.style.display = 'none';
            }
        });

        const divider = tableBody.querySelector('.table-section-divider');
        if (divider) {
            divider.style.display = (visibleRejectedCount > 0 && selectedStatus !== 'under review') ? '' : 'none';
        }

        let noResultRow = tableBody.querySelector('.no-results-row');
        if (visibleCount === 0) {
            if (!noResultRow) {
                noResultRow = document.createElement('tr');
                noResultRow.className = 'no-results-row';
                noResultRow.innerHTML = `<td colspan="6" style="text-align: center; padding: 2.5rem; color: var(--text-muted);"><i class="ph ph-magnifying-glass" style="font-size: 2rem; display: block; margin-bottom: 0.5rem;"></i>No doubts match your search criteria. <a href="javascript:void(0)" onclick="resetDoubtFilters()" style="color: var(--primary-color); font-weight: 500; margin-left: 0.25rem;">Clear filters</a></td>`;
                tableBody.appendChild(noResultRow);
            } else {
                noResultRow.style.display = '';
            }
        } else if (noResultRow) {
            noResultRow.style.display = 'none';
        }

        if (resetBtn) {
            const isFiltered = query !== '' || selectedClass !== 'all' || selectedSubject !== 'all' || selectedStatus !== 'all';
            resetBtn.style.display = isFiltered ? 'inline-flex' : 'none';
        }
    }

    if (searchInput) searchInput.addEventListener('input', filterDoubts);
    if (classFilter) classFilter.addEventListener('change', filterDoubts);
    if (subjectFilter) subjectFilter.addEventListener('change', filterDoubts);
    if (statusFilter) statusFilter.addEventListener('change', filterDoubts);
    if (resetBtn) resetBtn.addEventListener('click', (e) => { e.preventDefault(); resetDoubtFilters(); });
}

function loadDynamicallyRejectedDoubts() {
    const tableBody = document.querySelector('.admin-table tbody');
    if (!tableBody) return;
    const dynamicList = JSON.parse(localStorage.getItem('teacher_rejected_doubts') || '[]');
    if (!dynamicList.length) return;

    dynamicList.forEach(item => {
        const existingRows = tableBody.querySelectorAll('tr:not(.table-section-divider):not(.no-results-row)');
        existingRows.forEach(r => {
            if (r.getAttribute('data-status') === 'under review' && r.textContent.includes(item.student)) {
                r.remove();
            }
        });

        const exists = Array.from(tableBody.querySelectorAll('tr[data-status="rejected"]')).some(r => r.textContent.includes(item.topic));
        if (!exists) {
            const tr = document.createElement('tr');
            tr.setAttribute('data-class', (item.cls || 'class 10-a').toLowerCase());
            tr.setAttribute('data-subject', (item.subject || 'mathematics').toLowerCase());
            tr.setAttribute('data-status', 'rejected');
            tr.innerHTML = `
                <td><div style="font-weight: 500;">${item.student}</div><div class="text-muted" style="font-size: 0.8rem;">${item.cls}</div></td>
                <td>${item.subject}</td>
                <td>${item.topic}</td>
                <td>${item.time || 'Just now'}</td>
                <td><span class="badge badge-danger">Rejected</span></td>
                <td>
                    <button class="btn btn-secondary" onclick="viewRejectionReason('${item.student}', '${item.cls}', '${item.subject}', '${item.category}', '${(item.feedback || '').replace(/'/g, "\\'")}')" style="padding: 0.3rem 0.75rem; font-size: 0.85rem;">
                        <i class="ph ph-info"></i> Reason
                    </button>
                </td>
            `;
            tableBody.appendChild(tr);
        }
    });
}

window.resetDoubtFilters = function() {
    const searchInput = document.getElementById('doubtSearchInput');
    const classFilter = document.getElementById('doubtClassFilter');
    const subjectFilter = document.getElementById('doubtSubjectFilter');
    const statusFilter = document.getElementById('doubtStatusFilter');
    const resetBtn = document.getElementById('doubtResetBtn');
    if (searchInput) searchInput.value = '';
    if (classFilter) classFilter.value = 'all';
    if (subjectFilter) subjectFilter.value = 'all';
    if (statusFilter) statusFilter.value = 'all';
    if (resetBtn) resetBtn.style.display = 'none';

    const tableBody = document.querySelector('.admin-table tbody');
    if (tableBody) {
        tableBody.querySelectorAll('tr').forEach(r => {
            if (r.classList.contains('no-results-row')) r.style.display = 'none';
            else r.style.display = '';
        });
    }
};

window.viewRejectionReason = function(student, cls, subject, category, feedback) {
    const modal = document.getElementById('rejectionReasonModal');
    if (!modal) {
        alert(`Rejected Doubt\nStudent: ${student} (${cls})\nSubject: ${subject}\nCategory: ${category}\nFeedback: ${feedback}`);
        return;
    }
    const infoEl = document.getElementById('rejectModalStudentInfo');
    const subjEl = document.getElementById('rejectModalSubject');
    const catEl = document.getElementById('rejectModalCategory');
    const feedEl = document.getElementById('rejectModalFeedback');

    if (infoEl) infoEl.textContent = `${student} • ${cls}`;
    if (subjEl) subjEl.textContent = subject;
    if (catEl) catEl.textContent = category;
    if (feedEl) feedEl.textContent = feedback;

    modal.classList.add('active');
};

window.closeRejectionReasonModal = function() {
    const modal = document.getElementById('rejectionReasonModal');
    if (modal) modal.classList.remove('active');
};

// ==========================================
// My Students: Search & Division Filter
// ==========================================
function initStudentsFilters() {
    const searchInput = document.getElementById('studentSearchInput');
    const classFilter = document.getElementById('studentClassFilter');
    const resetBtn = document.getElementById('studentResetBtn');
    const tableBody = document.querySelector('.admin-table tbody');
    if (!tableBody) return;

    function filterStudents() {
        const rows = tableBody.querySelectorAll('tr:not(.no-results-row)');
        const query = (searchInput ? searchInput.value : '').trim().toLowerCase();
        const selectedClass = (classFilter ? classFilter.value : 'all').toLowerCase();

        let visibleCount = 0;

        rows.forEach(row => {
            const rowText = row.textContent.toLowerCase();
            const rowClass = (row.getAttribute('data-class') || '').toLowerCase();

            const matchesQuery = !query || rowText.includes(query);
            const matchesClass = selectedClass === 'all' || rowClass.includes(selectedClass) || rowText.includes(selectedClass);

            if (matchesQuery && matchesClass) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });

        let noResultRow = tableBody.querySelector('.no-results-row');
        if (visibleCount === 0) {
            if (!noResultRow) {
                noResultRow = document.createElement('tr');
                noResultRow.className = 'no-results-row';
                noResultRow.innerHTML = `<td colspan="6" style="text-align: center; padding: 2.5rem; color: var(--text-muted);"><i class="ph ph-user-circle" style="font-size: 2rem; display: block; margin-bottom: 0.5rem;"></i>No students match your search criteria. <a href="javascript:void(0)" onclick="resetStudentFilters()" style="color: var(--primary-color); font-weight: 500; margin-left: 0.25rem;">Clear filters</a></td>`;
                tableBody.appendChild(noResultRow);
            } else {
                noResultRow.style.display = '';
            }
        } else if (noResultRow) {
            noResultRow.style.display = 'none';
        }

        if (resetBtn) {
            const isFiltered = query !== '' || selectedClass !== 'all';
            resetBtn.style.display = isFiltered ? 'inline-flex' : 'none';
        }
    }

    if (searchInput) searchInput.addEventListener('input', filterStudents);
    if (classFilter) classFilter.addEventListener('change', filterStudents);
    if (resetBtn) resetBtn.addEventListener('click', (e) => { e.preventDefault(); resetStudentFilters(); });
}

window.resetStudentFilters = function() {
    const searchInput = document.getElementById('studentSearchInput');
    const classFilter = document.getElementById('studentClassFilter');
    const resetBtn = document.getElementById('studentResetBtn');
    if (searchInput) searchInput.value = '';
    if (classFilter) classFilter.value = 'all';
    if (resetBtn) resetBtn.style.display = 'none';

    const tableBody = document.querySelector('.admin-table tbody');
    if (tableBody) {
        tableBody.querySelectorAll('tr').forEach(r => {
            if (r.classList.contains('no-results-row')) r.style.display = 'none';
            else r.style.display = '';
        });
    }
};

// ==========================================
// Class Materials: Main Class Boxes & Actions
// ==========================================
function initMaterialsFilters() {
    const searchInput = document.getElementById('materialSearchInput');
    const classFilter = document.getElementById('materialClassFilter');
    const typeFilter = document.getElementById('materialTypeFilter');
    const subjectFilter = document.getElementById('materialSubjectFilter');
    const resetBtn = document.getElementById('materialResetBtn');
    const boxes = document.querySelectorAll('.class-material-box');
    if (!boxes.length) return;

    function filterMaterials() {
        const query = (searchInput ? searchInput.value : '').trim().toLowerCase();
        const selectedClass = (classFilter ? classFilter.value : 'all').toLowerCase();
        const selectedType = (typeFilter ? typeFilter.value : 'all').toLowerCase();
        const selectedSubject = (subjectFilter ? subjectFilter.value : 'all').toLowerCase();

        let totalVisibleAcrossAll = 0;

        boxes.forEach(box => {
            const boxClass = (box.getAttribute('data-class') || '').toLowerCase();
            const classMatches = selectedClass === 'all' || boxClass === selectedClass;

            if (!classMatches) {
                box.style.display = 'none';
                return;
            }

            const rows = box.querySelectorAll('tbody tr:not(.no-results-row):not(.empty-state-row)');
            let visibleInBox = 0;

            rows.forEach(row => {
                const rowText = row.textContent.toLowerCase();
                const rowType = (row.getAttribute('data-type') || '').toLowerCase();
                const rowSubject = (row.getAttribute('data-subject') || '').toLowerCase();

                const matchesQuery = !query || rowText.includes(query);
                const matchesType = selectedType === 'all' || rowType === selectedType || rowText.includes(selectedType);
                const matchesSubject = selectedSubject === 'all' || rowSubject === selectedSubject || rowText.includes(selectedSubject);

                if (matchesQuery && matchesType && matchesSubject) {
                    row.style.display = '';
                    visibleInBox++;
                    totalVisibleAcrossAll++;
                } else {
                    row.style.display = 'none';
                }
            });

            const tbody = box.querySelector('tbody');
            let noResultRow = tbody ? tbody.querySelector('.no-results-row') : null;

            if (visibleInBox === 0 && rows.length > 0) {
                if (!noResultRow && tbody) {
                    noResultRow = document.createElement('tr');
                    noResultRow.className = 'no-results-row';
                    noResultRow.innerHTML = `<td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted);"><i class="ph ph-magnifying-glass" style="font-size: 1.5rem; display: block; margin-bottom: 0.5rem;"></i>No materials match in this class.</td></tr>`;
                    tbody.appendChild(noResultRow);
                } else if (noResultRow) {
                    noResultRow.style.display = '';
                }
                box.style.display = (query || selectedType !== 'all' || selectedSubject !== 'all') && visibleInBox === 0 ? 'none' : '';
            } else {
                if (noResultRow) noResultRow.style.display = 'none';
                box.style.display = '';
            }
        });

        let globalEmpty = document.getElementById('globalMaterialsEmpty');
        if (totalVisibleAcrossAll === 0) {
            if (!globalEmpty) {
                globalEmpty = document.createElement('div');
                globalEmpty.id = 'globalMaterialsEmpty';
                globalEmpty.className = 'card text-center';
                globalEmpty.style.padding = '3rem';
                globalEmpty.innerHTML = `
                    <i class="ph ph-books" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 0.75rem;"></i>
                    <h3 style="color: var(--text-main); margin-bottom: 0.5rem;">No Materials Found</h3>
                    <p class="text-muted" style="margin-bottom: 1rem;">No resources match your current search and filter criteria.</p>
                    <button class="btn btn-secondary" onclick="resetMaterialFilters()"><i class="ph ph-arrow-counter-clockwise"></i> Reset Filters</button>
                `;
                const container = document.getElementById('classBoxesContainer');
                if (container) container.appendChild(globalEmpty);
            } else {
                globalEmpty.style.display = 'block';
            }
        } else if (globalEmpty) {
            globalEmpty.style.display = 'none';
        }

        if (resetBtn) {
            const isFiltered = query !== '' || selectedClass !== 'all' || selectedType !== 'all' || selectedSubject !== 'all';
            resetBtn.style.display = isFiltered ? 'inline-flex' : 'none';
        }
    }

    if (searchInput) searchInput.addEventListener('input', filterMaterials);
    if (classFilter) classFilter.addEventListener('change', filterMaterials);
    if (typeFilter) typeFilter.addEventListener('change', filterMaterials);
    if (subjectFilter) subjectFilter.addEventListener('change', filterMaterials);
    if (resetBtn) resetBtn.addEventListener('click', (e) => { e.preventDefault(); resetMaterialFilters(); });
}

window.resetMaterialFilters = function() {
    const searchInput = document.getElementById('materialSearchInput');
    const classFilter = document.getElementById('materialClassFilter');
    const typeFilter = document.getElementById('materialTypeFilter');
    const subjectFilter = document.getElementById('materialSubjectFilter');
    const resetBtn = document.getElementById('materialResetBtn');
    if (searchInput) searchInput.value = '';
    if (classFilter) classFilter.value = 'all';
    if (typeFilter) typeFilter.value = 'all';
    if (subjectFilter) subjectFilter.value = 'all';
    if (resetBtn) resetBtn.style.display = 'none';

    const globalEmpty = document.getElementById('globalMaterialsEmpty');
    if (globalEmpty) globalEmpty.style.display = 'none';

    document.querySelectorAll('.class-material-box').forEach(box => {
        box.style.display = '';
        box.querySelectorAll('tbody tr').forEach(r => {
            if (r.classList.contains('no-results-row')) r.style.display = 'none';
            else r.style.display = '';
        });
    });
};

function updateBoxMaterialCount(box) {
    if (!box) return;
    const countEl = box.querySelector('.class-material-count');
    const rows = box.querySelectorAll('tbody tr:not(.no-results-row):not(.empty-state-row)');
    if (countEl) {
        countEl.innerHTML = `<i class="ph ph-files"></i> ${rows.length} ${rows.length === 1 ? 'Material' : 'Materials'}`;
    }
    const tbody = box.querySelector('tbody');
    if (rows.length === 0 && tbody) {
        tbody.innerHTML = `<tr class="empty-state-row"><td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted);"><i class="ph ph-files" style="font-size: 2rem; display: block; margin-bottom: 0.5rem;"></i>No materials uploaded for this class yet.</td></tr>`;
    }
}

window.archiveMaterial = function(btn) {
    if (confirm('Are you sure you want to archive this material? It will no longer be visible to students in the Digital Library.')) {
        const row = btn.closest('tr');
        if (row) {
            const statusBadge = row.querySelector('.material-status-badge') || row.querySelector('.badge-success, .badge-warning');
            if (statusBadge) {
                statusBadge.className = 'material-status-badge badge';
                statusBadge.style.background = 'var(--text-muted)';
                statusBadge.style.color = '#fff';
                statusBadge.textContent = 'Archived';
                row.setAttribute('data-status', 'archived');
            }
        }
        if (window.TeacherCore) {
            TeacherCore.showToast('Material archived successfully', 'info');
        }
    }
};

window.deleteMaterial = function(btn) {
    if (confirm('Are you sure you want to permanently delete this material?')) {
        const row = btn.closest('tr');
        const box = btn.closest('.class-material-box');
        if (row) {
            row.style.transition = 'opacity 0.25s, transform 0.25s';
            row.style.opacity = '0';
            row.style.transform = 'scale(0.96)';
            setTimeout(() => {
                row.remove();
                if (box) updateBoxMaterialCount(box);
            }, 250);
        }
        if (window.TeacherCore) {
            TeacherCore.showToast('Material deleted successfully', 'info');
        }
    }
};

window.openUploadModal = function(cls = 'Class 10', div = 'A') {
    const modal = document.getElementById('uploadMaterialModal');
    if (!modal) {
        window.location.href = `upload-material.html?class=${cls}&div=${div}`;
        return;
    }
    const classInput = document.getElementById('uploadModalClass');
    const divInput = document.getElementById('uploadModalDiv');
    const targetLabel = document.getElementById('uploadModalTargetLabel');
    if (classInput) classInput.value = cls;
    if (divInput) divInput.value = div;
    if (targetLabel) targetLabel.textContent = `${cls} - Division ${div}`;
    
    const form = document.getElementById('uploadMaterialForm');
    if (form) form.reset();
    if (classInput) classInput.value = cls;
    if (divInput) divInput.value = div;
    
    modal.classList.add('active');
};

window.closeUploadModal = function() {
    const modal = document.getElementById('uploadMaterialModal');
    if (modal) modal.classList.remove('active');
};

window.handleUploadMaterialSubmit = function(e) {
    e.preventDefault();
    const title = document.getElementById('uploadMaterialTitle').value.trim();
    const topic = document.getElementById('uploadMaterialTopic').value.trim();
    const subject = document.getElementById('uploadMaterialSubject').value;
    const type = document.getElementById('uploadMaterialType').value;
    const cls = document.getElementById('uploadModalClass').value;
    const div = document.getElementById('uploadModalDiv').value;
    const status = document.getElementById('uploadMaterialStatus').value || 'Published';

    let boxKey = '10-a';
    if (cls.includes('10') && div === 'B') boxKey = '10-b';
    else if (cls.includes('9')) boxKey = '9-a';

    const box = document.querySelector(`.class-material-box[data-class="${boxKey}"]`);
    if (box) {
        const tbody = box.querySelector('tbody');
        const emptyRow = tbody ? tbody.querySelector('.empty-state-row') : null;
        if (emptyRow) emptyRow.remove();

        const newId = 'mat-' + Date.now();
        const typeIcon = type.toLowerCase() === 'pdf' ? '<i class="ph ph-file-pdf" style="color: red;"></i>' :
                         type.toLowerCase() === 'ppt' ? '<i class="ph ph-presentation-chart" style="color: orange;"></i>' :
                         type.toLowerCase() === 'video' ? '<i class="ph ph-video" style="color: dodgerblue;"></i>' :
                         '<i class="ph ph-file-text" style="color: seagreen;"></i>';
        const badgeClass = status === 'Published' ? 'badge-success' : 'badge-warning';

        const tr = document.createElement('tr');
        tr.setAttribute('data-id', newId);
        tr.setAttribute('data-type', type.toLowerCase());
        tr.setAttribute('data-class', boxKey);
        tr.setAttribute('data-subject', subject.toLowerCase());
        tr.setAttribute('data-status', status.toLowerCase());
        tr.innerHTML = `
            <td>
                <div class="material-title" style="font-weight: 500;">${title}</div>
                <div class="material-topic text-muted" style="font-size: 0.8rem;">${topic}</div>
            </td>
            <td>
                <span class="material-type-badge badge" style="background: var(--bg-color); color: var(--text-main);">${typeIcon} ${type}</span>
            </td>
            <td class="material-subject">${subject}</td>
            <td><span class="material-status-badge badge ${badgeClass}">${status}</span></td>
            <td style="text-align: right; padding-right: 1.5rem;">
                <div style="display: inline-flex; gap: 0.4rem; align-items: center;">
                    <button class="btn btn-secondary btn-sm" onclick="viewMaterial('${title.replace(/'/g, "\\'")}', '${topic.replace(/'/g, "\\'")}', '${subject}', '${type}', '${status}')" title="View Material" style="padding: 0.3rem 0.65rem; font-size: 0.85rem;">
                        <i class="ph ph-eye"></i> View
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="openUpdateModal('${newId}', '${title.replace(/'/g, "\\'")}', '${topic.replace(/'/g, "\\'")}', '${cls}', '${div}', '${subject}', '${type}', '${status}')" title="Update Material" style="padding: 0.3rem 0.65rem; font-size: 0.85rem;">
                        <i class="ph ph-pencil-simple"></i> Update
                    </button>
                    <button class="btn-icon text-muted" title="Archive" onclick="archiveMaterial(this)"><i class="ph ph-archive"></i></button>
                    <button class="btn-icon" style="color: var(--status-danger);" title="Delete" onclick="deleteMaterial(this)"><i class="ph ph-trash"></i></button>
                </div>
            </td>
        `;
        if (tbody) tbody.prepend(tr);
        updateBoxMaterialCount(box);
    }

    closeUploadModal();
    if (window.TeacherCore) {
        TeacherCore.showToast(`Material "${title}" uploaded to ${cls} - Div ${div}!`, 'success');
    }
};

window.openUpdateModal = function(id, title, topic, cls, div, subject, type, status) {
    const modal = document.getElementById('updateMaterialModal');
    if (!modal) return;

    const idInput = document.getElementById('updateMaterialId');
    const titleInput = document.getElementById('updateMaterialTitle');
    const topicInput = document.getElementById('updateMaterialTopic');
    const subjInput = document.getElementById('updateMaterialSubject');
    const typeInput = document.getElementById('updateMaterialType');
    const statusInput = document.getElementById('updateMaterialStatus');
    const labelTarget = document.getElementById('updateModalClassTarget');

    if (idInput) idInput.value = id || '';
    if (titleInput) titleInput.value = title || '';
    if (topicInput) topicInput.value = topic || '';
    if (subjInput) subjInput.value = subject || 'Mathematics';
    if (typeInput) typeInput.value = type || 'PDF';
    if (statusInput) statusInput.value = status || 'Published';
    if (labelTarget) labelTarget.textContent = `${cls || 'Class 10'} - Division ${div || 'A'}`;

    modal.classList.add('active');
};

window.closeUpdateModal = function() {
    const modal = document.getElementById('updateMaterialModal');
    if (modal) modal.classList.remove('active');
};

window.handleUpdateMaterialSubmit = function(e) {
    e.preventDefault();
    const id = document.getElementById('updateMaterialId').value;
    const title = document.getElementById('updateMaterialTitle').value.trim();
    const topic = document.getElementById('updateMaterialTopic').value.trim();
    const subject = document.getElementById('updateMaterialSubject').value;
    const type = document.getElementById('updateMaterialType').value;
    const status = document.getElementById('updateMaterialStatus').value;

    const row = document.querySelector(`tr[data-id="${id}"]`);
    if (row) {
        const titleEl = row.querySelector('.material-title');
        const topicEl = row.querySelector('.material-topic');
        const subjEl = row.querySelector('.material-subject');
        const typeBadge = row.querySelector('.material-type-badge');
        const statusBadge = row.querySelector('.material-status-badge');

        if (titleEl) titleEl.textContent = title;
        if (topicEl) topicEl.textContent = topic;
        if (subjEl) subjEl.textContent = subject;

        const typeIcon = type.toLowerCase() === 'pdf' ? '<i class="ph ph-file-pdf" style="color: red;"></i>' :
                         type.toLowerCase() === 'ppt' ? '<i class="ph ph-presentation-chart" style="color: orange;"></i>' :
                         type.toLowerCase() === 'video' ? '<i class="ph ph-video" style="color: dodgerblue;"></i>' :
                         '<i class="ph ph-file-text" style="color: seagreen;"></i>';

        if (typeBadge) {
            typeBadge.innerHTML = `${typeIcon} ${type}`;
        }
        if (statusBadge) {
            statusBadge.textContent = status;
            statusBadge.className = `material-status-badge badge ${status === 'Published' ? 'badge-success' : status === 'Draft' ? 'badge-warning' : ''}`;
            if (status === 'Archived') {
                statusBadge.style.background = 'var(--text-muted)';
                statusBadge.style.color = '#fff';
            } else {
                statusBadge.style.background = '';
                statusBadge.style.color = '';
            }
        }

        row.setAttribute('data-type', type.toLowerCase());
        row.setAttribute('data-subject', subject.toLowerCase());
        row.setAttribute('data-status', status.toLowerCase());

        const viewBtn = row.querySelector('button[title="View Material"]');
        if (viewBtn) {
            viewBtn.setAttribute('onclick', `viewMaterial('${title.replace(/'/g, "\\'")}', '${topic.replace(/'/g, "\\'")}', '${subject}', '${type}', '${status}')`);
        }
        const updateBtn = row.querySelector('button[title="Update Material"]');
        if (updateBtn) {
            updateBtn.setAttribute('onclick', `openUpdateModal('${id}', '${title.replace(/'/g, "\\'")}', '${topic.replace(/'/g, "\\'")}', 'Class 10', 'A', '${subject}', '${type}', '${status}')`);
        }
    }

    closeUpdateModal();
    if (window.TeacherCore) {
        TeacherCore.showToast(`Material "${title}" updated successfully!`, 'success');
    }
};

window.viewMaterial = function(title, topic, subject, type, status) {
    const modal = document.getElementById('viewMaterialModal');
    if (!modal) {
        window.location.href = '../student/resource-viewer.html';
        return;
    }
    const titleEl = document.getElementById('viewModalTitle');
    const topicEl = document.getElementById('viewModalTopic');
    const metaEl = document.getElementById('viewModalMeta');
    const iconEl = document.getElementById('viewModalIcon');

    if (titleEl) titleEl.textContent = title;
    if (topicEl) topicEl.textContent = topic;
    if (metaEl) metaEl.textContent = `${subject} • ${type} • ${status}`;
    if (iconEl) {
        iconEl.className = type.toLowerCase() === 'video' ? 'ph ph-video' :
                           type.toLowerCase() === 'ppt' ? 'ph ph-presentation-chart' : 'ph ph-file-pdf';
    }
    modal.classList.add('active');
};

window.closeViewModal = function() {
    const modal = document.getElementById('viewMaterialModal');
    if (modal) modal.classList.remove('active');
};

// ==========================================
// Announcements: Actions (Archive & Publish)
// ==========================================
window.archiveAnnouncement = function(btn) {
    if (confirm('Are you sure you want to archive this announcement? It will no longer appear on student dashboards.')) {
        const row = btn.closest('tr');
        if (row) {
            const badge = row.querySelector('.badge');
            if (badge) {
                badge.className = 'badge';
                badge.style.background = 'var(--text-muted)';
                badge.style.color = '#fff';
                badge.textContent = 'Archived';
            }
            btn.title = 'Unarchive';
            btn.innerHTML = '<i class="ph ph-arrow-u-up-left"></i>';
            btn.setAttribute('onclick', 'unarchiveAnnouncement(this)');
        }
        if (window.TeacherCore) {
            TeacherCore.showToast('Announcement archived successfully', 'info');
        }
    }
};

window.unarchiveAnnouncement = function(btn) {
    const row = btn.closest('tr');
    if (row) {
        const badge = row.querySelector('.badge');
        if (badge) {
            badge.className = 'badge badge-success';
            badge.style.background = '';
            badge.style.color = '';
            badge.textContent = 'Published';
        }
        btn.title = 'Archive';
        btn.innerHTML = '<i class="ph ph-archive"></i>';
        btn.setAttribute('onclick', 'archiveAnnouncement(this)');
    }
    if (window.TeacherCore) {
        TeacherCore.showToast('Announcement unarchived and published!', 'success');
    }
};

window.publishAnnouncement = function(btn) {
    const row = btn.closest('tr');
    if (row) {
        const badge = row.querySelector('.badge');
        if (badge) {
            badge.className = 'badge badge-success';
            badge.textContent = 'Published';
        }
        const dateCell = row.cells[2];
        if (dateCell && dateCell.textContent.trim() === '-') {
            dateCell.textContent = 'Oct 21, 2026';
        }
        btn.title = 'Archive';
        btn.innerHTML = '<i class="ph ph-archive"></i>';
        btn.setAttribute('onclick', 'archiveAnnouncement(this)');
    }
    if (window.TeacherCore) {
        TeacherCore.showToast('Announcement published to students!', 'success');
    }
};

window.deleteAnnouncement = function(btn) {
    if (confirm('Are you sure you want to permanently delete this announcement? This action cannot be undone.')) {
        const row = btn.closest('tr');
        if (row) {
            row.style.transition = 'opacity 0.25s, transform 0.25s';
            row.style.opacity = '0';
            row.style.transform = 'scale(0.95)';
            setTimeout(() => {
                row.remove();
                const tableBody = document.querySelector('.admin-table tbody');
                if (tableBody && tableBody.children.length === 0) {
                    tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 2.5rem; color: var(--text-muted);"><i class="ph ph-megaphone" style="font-size: 2rem; display: block; margin-bottom: 0.5rem;"></i>No announcements found.</td></tr>`;
                }
            }, 250);
        }
        if (window.TeacherCore) {
            TeacherCore.showToast('Announcement deleted successfully.', 'info');
        }
    }
};

