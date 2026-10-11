let slotToDelete = null;

function getInitials(name) {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function handleFilterChange() {
    renderAdminDashboard();
}

function resetFilters() {
    const searchInput = document.getElementById('sessionSearch');
    const statusFilter = document.getElementById('statusFilter');
    const subjectFilter = document.getElementById('subjectFilter');
    if (searchInput) searchInput.value = '';
    if (statusFilter) statusFilter.value = '';
    if (subjectFilter) subjectFilter.value = '';
    renderAdminDashboard();
}

function renderAdminDashboard() {
    const sessions = MOCK_DATA.getSessions();
    
    // Overall platform statistics
    let total = sessions.length;
    let upcoming = sessions.filter(s => s.status === 'Booked' || s.status === 'Upcoming' || s.status === 'In Progress').length;
    let completed = sessions.filter(s => s.status === 'Completed').length;
    let available = sessions.filter(s => s.status === 'Available').length;

    const statTotalEl = document.getElementById('stat-total');
    const statUpcomingEl = document.getElementById('stat-upcoming');
    const statCompletedEl = document.getElementById('stat-completed');
    const statAvailableEl = document.getElementById('stat-available');

    if (statTotalEl) statTotalEl.textContent = total;
    if (statUpcomingEl) statUpcomingEl.textContent = upcoming;
    if (statCompletedEl) statCompletedEl.textContent = completed;
    if (statAvailableEl) statAvailableEl.textContent = available;

    // Filter controls
    const searchQuery = (document.getElementById('sessionSearch')?.value || '').trim().toLowerCase();
    const statusVal = document.getElementById('statusFilter')?.value || '';
    const subjectVal = document.getElementById('subjectFilter')?.value || '';

    const filteredSessions = sessions.filter(session => {
        // Status filter
        if (statusVal && session.status !== statusVal) {
            return false;
        }
        // Subject filter
        if (subjectVal && session.subject !== subjectVal) {
            return false;
        }
        // Search query
        if (searchQuery) {
            const teacher = (session.teacherName || '').toLowerCase();
            const student = (session.studentName || '').toLowerCase();
            const subject = (session.subject || '').toLowerCase();
            const cls = (session.class || '').toString().toLowerCase();
            const div = (session.division || '').toLowerCase();
            const date = (session.date || '').toLowerCase();
            
            const match = teacher.includes(searchQuery) ||
                          student.includes(searchQuery) ||
                          subject.includes(searchQuery) ||
                          cls.includes(searchQuery) ||
                          div.includes(searchQuery) ||
                          date.includes(searchQuery);
            if (!match) return false;
        }
        return true;
    });

    // Update Counter Badge
    const counterBadge = document.getElementById('session-counter-badge');
    if (counterBadge) {
        if (filteredSessions.length === total) {
            counterBadge.textContent = `Showing all ${total} sessions`;
        } else {
            counterBadge.textContent = `Showing ${filteredSessions.length} of ${total} sessions`;
        }
    }

    const tbody = document.getElementById('admin-table-body');
    const emptyState = document.getElementById('empty-state-container');
    const tableWrapper = document.querySelector('.sessions-table-wrapper');

    if (!tbody) return;
    tbody.innerHTML = '';

    if (filteredSessions.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        if (tableWrapper) tableWrapper.style.display = 'none';
        return;
    } else {
        if (emptyState) emptyState.style.display = 'none';
        if (tableWrapper) tableWrapper.style.display = 'block';
    }

    filteredSessions.forEach(session => {
        let badgeClass = 'badge-secondary';
        let badgeIcon = 'ph-info';
        if (session.status === 'Available') {
            badgeClass = 'badge-info';
            badgeIcon = 'ph-clock';
        } else if (session.status === 'Booked') {
            badgeClass = 'badge-warning';
            badgeIcon = 'ph-calendar-check';
        } else if (session.status === 'In Progress') {
            badgeClass = 'badge-primary';
            badgeIcon = 'ph-broadcast';
        } else if (session.status === 'Completed') {
            badgeClass = 'badge-success';
            badgeIcon = 'ph-check-circle';
        } else if (['Blocked', 'Cancelled', 'Student Absent'].includes(session.status)) {
            badgeClass = 'badge-danger';
            badgeIcon = 'ph-x-circle';
        }

        let actions = '';
        if (session.status === 'Booked' || session.status === 'In Progress') {
            actions = `
                <div class="table-actions">
                    <a href="../teacher/session-room.html?id=${session.id}" class="btn btn-sm btn-primary" title="Live Monitor" target="_blank">
                        <i class="ph ph-video-camera"></i> Monitor
                    </a>
                    <button class="btn btn-sm btn-danger" onclick="promptDelete('${session.id}')" title="Cancel Session">
                        <i class="ph ph-x-circle"></i> Cancel
                    </button>
                </div>
            `;
        } else if (session.status === 'Available') {
            actions = `
                <div class="table-actions">
                    <button class="btn btn-sm btn-danger" onclick="promptDelete('${session.id}')" title="Delete Slot">
                        <i class="ph ph-trash"></i> Delete Slot
                    </button>
                </div>
            `;
        } else if (session.status === 'Completed') {
            actions = `
                <span class="badge badge-success"><i class="ph ph-check"></i> Resolved</span>
            `;
        } else {
            actions = `<span class="text-muted" style="font-size: 0.85rem;">No actions</span>`;
        }

        const teacherInitials = getInitials(session.teacherName);
        const studentInitials = session.studentName ? getInitials(session.studentName) : '';

        const studentCol = session.studentName ? `
            <div class="user-pill">
                <div class="user-avatar-sm" style="background: rgba(16, 185, 129, 0.12); color: var(--status-success);">
                    ${studentInitials}
                </div>
                <div>
                    <div style="font-weight: 500;">${session.studentName}</div>
                    ${session.relatedDoubt ? `<small class="text-muted"><i class="ph ph-question"></i> Doubt #${session.relatedDoubt}</small>` : ''}
                </div>
            </div>
        ` : `
            <span class="unassigned-badge"><i class="ph ph-user-minus"></i> Unassigned Slot</span>
        `;

        tbody.innerHTML += `
            <tr>
                <td>
                    <div class="user-pill">
                        <div class="user-avatar-sm">
                            ${teacherInitials}
                        </div>
                        <div>
                            <div style="font-weight: 600;">${session.teacherName}</div>
                            <small class="text-muted">Instructor</small>
                        </div>
                    </div>
                </td>
                <td>${studentCol}</td>
                <td>
                    <span class="subject-pill">${session.subject}</span>
                    <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem;">Class ${session.class} &bull; Div ${session.division}</div>
                </td>
                <td>
                    <div style="font-weight: 500; display: flex; align-items: center; gap: 0.35rem;">
                        <i class="ph ph-calendar" style="color: var(--primary-color);"></i> ${session.date}
                    </div>
                    <small class="text-muted"><i class="ph ph-clock"></i> ${session.startTime} - ${session.endTime}</small>
                </td>
                <td>
                    <span class="badge ${badgeClass}" style="display: inline-flex; align-items: center; gap: 0.3rem;">
                        <i class="ph ${badgeIcon}"></i> ${session.status}
                    </span>
                </td>
                <td>${actions}</td>
            </tr>
        `;
    });
}

function promptDelete(id) {
    slotToDelete = MOCK_DATA.getSessions().find(s => s.id === id);
    if (!slotToDelete) return;
    
    const msgEl = document.getElementById('delete-modal-msg');
    if (slotToDelete.status === 'Booked') {
        msgEl.innerText = `This slot is booked by ${slotToDelete.studentName} for ${slotToDelete.subject}.\nDeleting it will cancel the scheduled 1:1 doubt session and notify both the teacher and student.`;
    } else {
        msgEl.innerText = `Are you sure you want to delete this open slot for ${slotToDelete.teacherName} (${slotToDelete.subject})?\nStudents will no longer be able to book this time slot.`;
    }
    document.getElementById('delete-modal').style.display = 'flex';
}

function closeDeleteModal() {
    document.getElementById('delete-modal').style.display = 'none';
    slotToDelete = null;
}

function confirmDelete() {
    if (!slotToDelete) return;

    if (slotToDelete.status === 'Booked') {
        MOCK_DATA.updateSession(slotToDelete.id, { status: 'Cancelled' });
        // Notify student and teacher
        MOCK_DATA.addNotification(`1:1 Session Cancelled\nYour ${slotToDelete.subject} doubt-resolution session scheduled for ${slotToDelete.date} at ${slotToDelete.startTime} has been cancelled by Admin.`, 'STUDENT');
        MOCK_DATA.addNotification(`1:1 Session Cancelled\nYour booked session with ${slotToDelete.studentName} on ${slotToDelete.date} was cancelled by Admin.`, 'TEACHER');
    } else {
        MOCK_DATA.deleteSession(slotToDelete.id);
    }
    
    closeDeleteModal();
    renderAdminDashboard();
}

document.addEventListener('DOMContentLoaded', renderAdminDashboard);

window.addEventListener('storage', function(e) {
    if (e.key === 'mockSessions') {
        renderAdminDashboard();
    }
});
window.addEventListener('storage-local', renderAdminDashboard);
