let selectedSlotId = null;

function renderSessions() {
    const sessions = MOCK_DATA.getSessions();
    const currentUser = MOCK_DATA.getUser();
    
    const availableContainer = document.getElementById('available-slots-container');
    const upcomingContainer = document.getElementById('upcoming-sessions-container');
    const historyContainer = document.getElementById('history-container');
    
    availableContainer.innerHTML = '';
    upcomingContainer.innerHTML = '';
    historyContainer.innerHTML = '';

    let hasUpcoming = false;
    let hasHistory = false;
    let hasAvailable = false;

    sessions.forEach(session => {
        if (session.status === 'Available') {
            hasAvailable = true;
            availableContainer.innerHTML += `
                <div class="slot-card available">
                    <div>
                        <h4 style="margin:0 0 0.25rem 0;">${session.subject}</h4>
                        <p style="margin:0; font-size:0.85rem; color:var(--text-muted);">Teacher: ${session.teacherName}</p>
                        <p style="margin:0.25rem 0 0 0; font-size:0.85rem; font-weight:600;"><i class="ph ph-calendar"></i> ${session.date} &middot; ${session.startTime} - ${session.endTime}</p>
                    </div>
                    <button class="btn btn-primary" onclick="openBookingModal('${session.id}')">Book</button>
                </div>
            `;
        } else if ((session.status === 'Booked' || session.status === 'Upcoming' || session.status === 'In Progress') && session.studentName === currentUser.name) {
            hasUpcoming = true;
            upcomingContainer.innerHTML += `
                <div class="list-card">
                    <div class="list-card-header">
                        <div>
                            <h4>${session.subject} Session</h4>
                            <p class="text-muted" style="font-size: 0.85rem;">Teacher: ${session.teacherName} &middot; ${session.date}</p>
                            <p style="font-size: 0.85rem; margin-top:0.25rem; font-weight:600;">${session.startTime} - ${session.endTime}</p>
                        </div>
                        <span class="badge badge-warning">${session.status}</span>
                    </div>
                    <div style="margin-top: 1rem; display:flex; gap: 0.5rem;">
                        <a href="session-room.html?id=${session.id}" class="btn btn-primary" style="flex:1; text-align:center;">Join Session</a>
                    </div>
                </div>
            `;
        } else if (['Completed', 'Cancelled', 'Student Absent', 'Teacher Absent'].includes(session.status) && session.studentName === currentUser.name) {
            hasHistory = true;
            let badgeClass = session.status === 'Completed' ? 'badge-success' : 'badge-danger';
            historyContainer.innerHTML += `
                <div class="list-card">
                    <div class="list-card-header">
                        <div>
                            <h4>${session.subject} Session</h4>
                            <p class="text-muted" style="font-size: 0.85rem;">${session.date} &middot; Teacher: ${session.teacherName}</p>
                        </div>
                        <span class="badge ${badgeClass}">${session.status}</span>
                    </div>
                    ${session.notes ? `<div style="margin-top: 0.75rem; padding: 0.75rem; background: var(--bg-color); border-radius: 4px; font-size: 0.85rem;"><strong>Notes:</strong> ${session.notes}</div>` : ''}
                </div>
            `;
        }
    });

    if(!hasAvailable) availableContainer.innerHTML = '<p class="text-muted">No available slots at the moment.</p>';
    if(!hasUpcoming) upcomingContainer.innerHTML = '<p class="text-muted">No upcoming sessions.</p>';
    if(!hasHistory) historyContainer.innerHTML = '<p class="text-muted">No session history.</p>';
}

function openBookingModal(slotId) {
    selectedSlotId = slotId;
    const session = MOCK_DATA.getSessions().find(s => s.id === slotId);
    
    document.getElementById('modal-slot-details').innerHTML = `
        <p style="margin:0 0 0.5rem 0;"><strong>Teacher:</strong> ${session.teacherName}</p>
        <p style="margin:0 0 0.5rem 0;"><strong>Subject:</strong> ${session.subject}</p>
        <p style="margin:0 0 0.5rem 0;"><strong>Date:</strong> ${session.date}</p>
        <p style="margin:0;"><strong>Time:</strong> ${session.startTime} - ${session.endTime}</p>
    `;

    const doubtSelect = document.getElementById('related-doubt');
    doubtSelect.innerHTML = '<option value="">New discussion topic</option>';
    MOCK_DATA.getDoubts().forEach(d => {
        doubtSelect.innerHTML += `<option value="${d.id}">${d.id} - ${d.title}</option>`;
    });

    document.getElementById('booking-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('booking-modal').style.display = 'none';
    selectedSlotId = null;
}

function confirmBooking() {
    if(!selectedSlotId) return;
    const currentUser = MOCK_DATA.getUser();
    const doubtId = document.getElementById('related-doubt').value;
    
    MOCK_DATA.updateSession(selectedSlotId, {
        status: 'Booked',
        studentName: currentUser.name,
        relatedDoubt: doubtId || null
    });

    MOCK_DATA.addNotification('Your 1:1 session has been booked successfully.', 'STUDENT');
    
    closeModal();
    renderSessions();
    alert('Session Booked Successfully!');
}

document.addEventListener('DOMContentLoaded', renderSessions);

window.addEventListener('storage', function(e) {
    if (e.key === 'mockSessions') {
        renderSessions();
    }
});
window.addEventListener('storage-local', renderSessions);
