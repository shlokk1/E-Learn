/**
 * Mock Data Store
 * Provides default prototype data and handles state for 1:1 sessions.
 */
const MOCK_DATA = {
    getUser: () => {
        const sessionStored = sessionStorage.getItem('currentUser');
        if (sessionStored) return JSON.parse(sessionStored);
        const stored = localStorage.getItem('currentUser');
        return stored ? JSON.parse(stored) : { name: 'Demo Student', class: '10', division: 'A', role: 'STUDENT' };
    },

    // Session Management State
    getSessions: () => {
        const stored = localStorage.getItem('mockSessions');
        if (stored) return JSON.parse(stored);
        
        // Default Mock Sessions
        const defaultSessions = [
            { id: 's1', teacherName: 'Mr. Sharma', subject: 'Mathematics', class: '10', division: 'A', date: '2026-10-02', startTime: '10:00 AM', endTime: '10:30 AM', status: 'Available', studentName: null, relatedDoubt: null, notes: '' },
            { id: 's2', teacherName: 'Mr. Sharma', subject: 'Mathematics', class: '10', division: 'A', date: '2026-10-02', startTime: '10:30 AM', endTime: '11:00 AM', status: 'Booked', studentName: 'Demo Student', relatedDoubt: 'D-1042', notes: '' },
            { id: 's3', teacherName: 'Mrs. Gupta', subject: 'Science', class: '10', division: 'A', date: '2026-10-02', startTime: '11:00 AM', endTime: '11:30 AM', status: 'Completed', studentName: 'Demo Student', relatedDoubt: null, notes: 'Discussed physics formulas.' }
        ];
        localStorage.setItem('mockSessions', JSON.stringify(defaultSessions));
        return defaultSessions;
    },

    saveSessions: (sessions) => {
        localStorage.setItem('mockSessions', JSON.stringify(sessions));
        // Manually dispatch storage event for same-tab cross-component reactivity if needed
        window.dispatchEvent(new Event('storage-local'));
    },

    addSession: (sessionObj) => {
        const sessions = MOCK_DATA.getSessions();
        sessionObj.id = 's' + Date.now() + Math.floor(Math.random() * 1000);
        sessions.push(sessionObj);
        MOCK_DATA.saveSessions(sessions);
        return sessionObj;
    },

    updateSession: (id, updates) => {
        const sessions = MOCK_DATA.getSessions();
        const index = sessions.findIndex(s => s.id === id);
        if (index > -1) {
            sessions[index] = { ...sessions[index], ...updates };
            MOCK_DATA.saveSessions(sessions);
        }
    },

    deleteSession: (id) => {
        const sessions = MOCK_DATA.getSessions();
        const index = sessions.findIndex(s => s.id === id);
        if (index > -1) {
            sessions.splice(index, 1);
            MOCK_DATA.saveSessions(sessions);
        }
    },

    getDoubts: () => {
        return [
            { id: 'D-1042', title: 'Why does the quadratic formula work for every quadratic equation?', subject: 'Mathematics', status: 'Approved' },
            { id: 'D-1043', title: 'Why does velocity change in circular motion?', subject: 'Physics', status: 'In Progress' }
        ];
    },

    // Notification Mock Management
    getNotifications: () => {
        const stored = localStorage.getItem('mockNotifications');
        if (stored) return JSON.parse(stored);
        return [];
    },

    addNotification: (message, role) => {
        const notifs = MOCK_DATA.getNotifications();
        notifs.unshift({ id: 'n'+Date.now(), message, role, date: new Date().toLocaleDateString() });
        localStorage.setItem('mockNotifications', JSON.stringify(notifs));
    }
};
