let slotToDelete = null;

function renderTeacherSessions() {
    const sessions = MOCK_DATA.getSessions();
    
    const upcomingContainer = document.getElementById('teacher-upcoming-container');
    const slotsContainer = document.getElementById('teacher-slots-container');
    const historyTbody = document.getElementById('teacher-history-tbody');
    
    upcomingContainer.innerHTML = '';
    slotsContainer.innerHTML = '';
    historyTbody.innerHTML = '';

    let hasUpcoming = false;
    let hasSlots = false;
    let hasHistory = false;

    sessions.forEach(session => {
        // Slots overview
        if (['Available', 'Booked', 'Blocked'].includes(session.status)) {
            hasSlots = true;
            let actionBtn = session.status === 'Available' 
                ? `<button class="btn btn-sm btn-secondary" onclick="blockSlot('${session.id}')">Block</button>` 
                : (session.status === 'Blocked' ? `<button class="btn btn-sm btn-secondary" onclick="unblockSlot('${session.id}')">Unblock</button>` : '');
            
            let deleteBtn = `<button class="btn btn-sm btn-danger" style="margin-left: 0.5rem;" onclick="promptDelete('${session.id}')"><i class="ph ph-trash"></i></button>`;

            slotsContainer.innerHTML += `
                <div class="slot-card ${session.status.toLowerCase()}">
                    <div>
                        <p style="margin:0; font-size:0.9rem; font-weight:600;">${session.startTime} - ${session.endTime}</p>
                        <p style="margin:0; font-size:0.8rem; color:var(--text-muted);">${session.date} &middot; ${session.status}</p>
                    </div>
                    <div style="display: flex;">
                        ${actionBtn}
                        ${deleteBtn}
                    </div>
                </div>
            `;
        }

        // Upcoming bookings
        if ((session.status === 'Booked' || session.status === 'Upcoming' || session.status === 'In Progress') && session.studentName) {
            hasUpcoming = true;
            upcomingContainer.innerHTML += `
                <div class="list-card">
                    <div class="list-card-header" style="align-items:flex-start;">
                        <div>
                            <h4 style="margin:0 0 0.25rem 0;">${session.startTime} - ${session.endTime}</h4>
                            <p class="text-muted" style="font-size: 0.85rem; margin:0;">Student: ${session.studentName} (${session.class}-${session.division})</p>
                            <p class="text-muted" style="font-size: 0.85rem; margin:0.25rem 0 0 0;">Subject: ${session.subject}</p>
                        </div>
                        <span class="badge badge-warning">${session.status}</span>
                    </div>
                    <div style="margin-top: 1rem; display:flex; gap: 0.5rem;">
                        <a href="session-room.html?id=${session.id}" class="btn btn-primary" style="flex:1; text-align:center;">Join Session</a>
                    </div>
                </div>
            `;
        }

        // History
        if (['Completed', 'Cancelled', 'Student Absent', 'Teacher Absent'].includes(session.status)) {
            hasHistory = true;
            let badgeClass = session.status === 'Completed' ? 'badge-success' : 'badge-danger';
            historyTbody.innerHTML += `
                <tr>
                    <td>${session.date}<br><small class="text-muted">${session.startTime} - ${session.endTime}</small></td>
                    <td>${session.studentName || '-'}</td>
                    <td>${session.subject}</td>
                    <td><span class="badge ${badgeClass}">${session.status}</span></td>
                </tr>
            `;
        }
    });

    if(!hasUpcoming) upcomingContainer.innerHTML = '<p class="text-muted">No upcoming booked sessions.</p>';
    if(!hasSlots) slotsContainer.innerHTML = '<p class="text-muted">No slots generated.</p>';
    if(!hasHistory) historyTbody.innerHTML = '<tr><td colspan="4" class="text-muted text-center">No session history.</td></tr>';
}

function blockSlot(id) {
    MOCK_DATA.updateSession(id, { status: 'Blocked' });
    renderTeacherSessions();
}

function unblockSlot(id) {
    MOCK_DATA.updateSession(id, { status: 'Available' });
    renderTeacherSessions();
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
        // Cancel the booking instead of hard deleting
        MOCK_DATA.updateSession(slotToDelete.id, { status: 'Cancelled' });
        // Notify the student
        MOCK_DATA.addNotification(`1:1 Session Cancelled\nYour ${slotToDelete.subject} doubt-resolution session scheduled for ${slotToDelete.date} at ${slotToDelete.startTime} has been cancelled.`, 'STUDENT');
    } else {
        // Hard delete available/blocked slot
        MOCK_DATA.deleteSession(slotToDelete.id);
    }
    
    closeDeleteModal();
    renderTeacherSessions();
}

function openAvailabilityModal() {
    document.getElementById('availability-modal').style.display = 'flex';
}

function closeAvailabilityModal() {
    document.getElementById('availability-modal').style.display = 'none';
}

function saveAvailability() {
    const date = document.getElementById('avail-date').value;
    const subject = document.getElementById('avail-subject').value;
    const cls = document.getElementById('avail-class').value;
    const div = document.getElementById('avail-division').value;
    const currentUser = MOCK_DATA.getUser();
    const teacherName = currentUser.role === 'MENTOR' || currentUser.name.includes('Teacher') ? currentUser.name : 'Mr. Sharma (Demo)';
    
    // Generate multiple slots
    MOCK_DATA.addSession({
        teacherName: teacherName,
        subject: subject, class: cls, division: div,
        date: date, startTime: '10:00 AM', endTime: '10:30 AM',
        status: 'Available', studentName: null, relatedDoubt: null, notes: ''
    });
    MOCK_DATA.addSession({
        teacherName: teacherName,
        subject: subject, class: cls, division: div,
        date: date, startTime: '10:30 AM', endTime: '11:00 AM',
        status: 'Available', studentName: null, relatedDoubt: null, notes: ''
    });
    
    closeAvailabilityModal();
    renderTeacherSessions();
    alert('Slots generated successfully!');
}

document.addEventListener('DOMContentLoaded', renderTeacherSessions);

window.addEventListener('storage', function(e) {
    if (e.key === 'mockSessions') {
        renderTeacherSessions();
    }
});
window.addEventListener('storage-local', renderTeacherSessions);
