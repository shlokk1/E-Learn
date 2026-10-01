let slotToDelete = null;

function renderAdminDashboard() {
    const sessions = MOCK_DATA.getSessions();
    
    let total = sessions.length;
    let upcoming = sessions.filter(s => s.status === 'Booked' || s.status === 'Upcoming' || s.status === 'In Progress').length;
    let completed = sessions.filter(s => s.status === 'Completed').length;
    let available = sessions.filter(s => s.status === 'Available').length;

    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-upcoming').textContent = upcoming;
    document.getElementById('stat-completed').textContent = completed;
    document.getElementById('stat-available').textContent = available;

    const tbody = document.getElementById('admin-table-body');
    tbody.innerHTML = '';
    
    sessions.forEach(session => {
        let badgeClass = 'badge-secondary';
        if(session.status === 'Available') badgeClass = 'badge-info';
        if(session.status === 'Booked') badgeClass = 'badge-warning';
        if(session.status === 'Completed') badgeClass = 'badge-success';
        if(['Blocked', 'Cancelled', 'Student Absent'].includes(session.status)) badgeClass = 'badge-danger';

        let actions = '';
        if (['Available', 'Booked', 'Blocked'].includes(session.status)) {
            actions = `<button class="btn btn-sm btn-danger" onclick="promptDelete('${session.id}')"><i class="ph ph-trash"></i> Delete</button>`;
        }

        tbody.innerHTML += `
            <tr>
                <td style="font-weight: 500;">${session.teacherName}</td>
                <td>${session.studentName || '-'}</td>
                <td>${session.subject}<br><small class="text-muted">${session.class}-${session.division}</small></td>
                <td>${session.date}<br><small class="text-muted">${session.startTime} - ${session.endTime}</small></td>
                <td><span class="badge ${badgeClass}">${session.status}</span></td>
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
        msgEl.innerText = "This slot is already booked by a student.\nDeleting it will cancel the scheduled 1:1 session.";
    } else {
        msgEl.innerText = "Are you sure you want to delete this slot?\nStudents will no longer be able to book this time.";
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
