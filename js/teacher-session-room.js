let currentSessionId = null;

function loadRoom() {
    const params = new URLSearchParams(window.location.search);
    currentSessionId = params.get('id');
    if(!currentSessionId) return;

    const session = MOCK_DATA.getSessions().find(s => s.id === currentSessionId);
    if(!session) return;

    document.getElementById('room-title').textContent = session.subject + ' Doubt Session';
    document.getElementById('room-subtitle').textContent = '1:1 Discussion';
    document.getElementById('student-name').textContent = session.studentName || 'Unknown Student';
    document.getElementById('student-class').textContent = `Class ${session.class}-${session.division}`;
    document.getElementById('room-date').textContent = session.date;
    document.getElementById('room-time').textContent = session.startTime + ' - ' + session.endTime;

    if(session.relatedDoubt) {
        const doubt = MOCK_DATA.getDoubts().find(d => d.id === session.relatedDoubt);
        if(doubt) {
            document.getElementById('room-doubt').innerHTML = `<strong>${doubt.id}</strong><br/>${doubt.title}`;
        } else {
            document.getElementById('room-doubt').innerHTML = `<strong>${session.relatedDoubt}</strong>`;
        }
    } else {
        document.getElementById('resolve-doubt-cb').disabled = true;
    }
}

function completeSession() {
    if(!currentSessionId) return;
    const notes = document.getElementById('session-notes').value;
    const resolveDoubt = document.getElementById('resolve-doubt-cb').checked;

    MOCK_DATA.updateSession(currentSessionId, {
        status: 'Completed',
        notes: notes
    });

    MOCK_DATA.addNotification('A 1:1 session has been completed by the teacher.', 'STUDENT');

    if(resolveDoubt) {
        alert('Session completed and associated doubt marked as resolved!');
    } else {
        alert('Session completed successfully!');
    }
    window.location.href = 'sessions.html';
}

function markAbsent() {
    if(!currentSessionId) return;
    MOCK_DATA.updateSession(currentSessionId, { status: 'Student Absent' });
    alert('Marked student as absent.');
    window.location.href = 'sessions.html';
}

document.addEventListener('DOMContentLoaded', loadRoom);
