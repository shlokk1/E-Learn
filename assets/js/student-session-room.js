function loadRoom() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if(!id) return;

    const session = MOCK_DATA.getSessions().find(s => s.id === id);
    if(!session) return;

    document.getElementById('room-title').textContent = session.subject + ' Doubt Session';
    document.getElementById('room-subtitle').textContent = '1:1 Discussion';
    document.getElementById('teacher-name').textContent = session.teacherName;
    document.getElementById('room-subject').textContent = session.subject;
    document.getElementById('room-date').textContent = session.date;
    document.getElementById('room-time').textContent = session.startTime + ' - ' + session.endTime;

    if(session.relatedDoubt) {
        const doubt = MOCK_DATA.getDoubts().find(d => d.id === session.relatedDoubt);
        if(doubt) {
            document.getElementById('room-doubt').innerHTML = `<strong>${doubt.id}</strong><br/>${doubt.title}`;
        }
    }
}

function leaveSession() {
    // MOCK: Leaving doesn't mark it complete, teacher does.
}

document.addEventListener('DOMContentLoaded', loadRoom);
