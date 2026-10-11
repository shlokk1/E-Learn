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
    },

    // Community Discussions State Management
    getDiscussions: () => {
        const stored = localStorage.getItem('mockCommunityDiscussions');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {}
        }
        const defaultDiscussions = [
            {
                id: 'disc-1',
                topic: 'mathematics',
                badgeClass: 'badge-info',
                subject: 'Mathematics',
                title: 'How can I understand quadratic equations easily?',
                author: 'Rohan',
                timeAgo: '2 days ago',
                content: 'I\'m struggling with the quadratic formula. Does anyone have a trick to memorize it or understand it better?',
                likes: 12,
                likedBy: [],
                replies: [
                    {
                        id: 'r-1',
                        author: 'Priya',
                        timeAgo: 'Yesterday',
                        content: 'Try singing it to the tune of "Pop Goes the Weasel". It actually helps! "x equals negative b, plus or minus the square root..."'
                    },
                    {
                        id: 'r-2',
                        userId: 'Amit',
                        author: 'Amit (Mentor)',
                        timeAgo: 'Today',
                        content: 'In addition to memorizing, try completing the square on the standard form ax^2 + bx + c = 0. The formula is literally just the result of that process. Once you do the proof once, it makes total sense.'
                    },
                    {
                        id: 'r-demo',
                        userId: 'Demo Student',
                        author: 'Demo Student',
                        timeAgo: '1 hour ago',
                        content: 'Thank you both! The completing the square method really made the formula click for me.'
                    }
                ]
            },
            {
                id: 'disc-2',
                topic: 'science',
                badgeClass: 'badge-success',
                subject: 'Science',
                title: 'Can someone explain Newton\'s third law?',
                author: 'Kavita',
                timeAgo: '3 days ago',
                content: 'With a real life example if possible! Especially how forces act on two different bodies.',
                likes: 8,
                likedBy: [],
                replies: [
                    {
                        id: 'r-3',
                        author: 'Rahul',
                        timeAgo: '2 days ago',
                        content: 'When you jump off a rowing boat onto a dock, you push the boat backward while the boat pushes you forward. That is action and reaction!'
                    }
                ]
            },
            {
                id: 'disc-3',
                topic: 'english',
                badgeClass: 'badge-warning',
                subject: 'English',
                title: 'Tips for writing formal letters in Board Exams?',
                author: 'Aditya',
                timeAgo: '4 days ago',
                content: 'What is the latest CBSE format for letter to editor and complaint letter? How to score full marks in format?',
                likes: 15,
                likedBy: [],
                replies: [
                    {
                        id: 'r-4',
                        author: 'Mrs. Sen (Teacher)',
                        timeAgo: '1 day ago',
                        content: 'Always ensure: Sender Address -> Date -> Receiver Address -> Subject -> Salutation -> Body in 3 paragraphs -> Complimentary close (Yours sincerely).'
                    }
                ]
            },
            {
                id: 'disc-4',
                topic: 'science',
                badgeClass: 'badge-success',
                subject: 'Science',
                title: 'Best way to prepare for Class 10 Chemistry Practicals?',
                author: 'Sneha',
                timeAgo: '5 days ago',
                content: 'Any tips for the acid-base indicator and salt analysis questions in the board practicals?',
                likes: 7,
                likedBy: [],
                replies: []
            }
        ];
        localStorage.setItem('mockCommunityDiscussions', JSON.stringify(defaultDiscussions));
        return defaultDiscussions;
    },

    saveDiscussions: (discussions) => {
        localStorage.setItem('mockCommunityDiscussions', JSON.stringify(discussions));
        window.dispatchEvent(new Event('community-updated'));
    },

    getDiscussion: (id) => {
        const list = MOCK_DATA.getDiscussions();
        return list.find(d => d.id === id) || list[0];
    },

    addDiscussion: (newDisc) => {
        const list = MOCK_DATA.getDiscussions();
        newDisc.id = 'disc-' + Date.now();
        newDisc.likes = 0;
        newDisc.likedBy = [];
        newDisc.replies = [];
        newDisc.timeAgo = 'Just now';
        list.unshift(newDisc);
        MOCK_DATA.saveDiscussions(list);
        return newDisc;
    },

    addReply: (discId, replyText) => {
        const list = MOCK_DATA.getDiscussions();
        const disc = list.find(d => d.id === discId);
        if (!disc) return null;
        const user = MOCK_DATA.getUser();
        const userId = user.email || user.name || 'current_user';
        const newReply = {
            id: 'r-' + Date.now(),
            userId: userId,
            author: user.name + (user.role === 'MENTOR' ? ' (Mentor)' : user.role === 'ADMIN' ? ' (Admin)' : ''),
            timeAgo: 'Just now',
            content: replyText
        };
        disc.replies.push(newReply);
        MOCK_DATA.saveDiscussions(list);
        return newReply;
    },

    deleteReply: (discId, replyId) => {
        const list = MOCK_DATA.getDiscussions();
        const disc = list.find(d => d.id === discId);
        if (!disc || !disc.replies) return false;
        const index = disc.replies.findIndex(r => r.id === replyId);
        if (index > -1) {
            disc.replies.splice(index, 1);
            MOCK_DATA.saveDiscussions(list);
            return true;
        }
        return false;
    },

    toggleLike: (discId) => {
        const list = MOCK_DATA.getDiscussions();
        const disc = list.find(d => d.id === discId);
        if (!disc) return { liked: false, likes: 0 };
        const user = MOCK_DATA.getUser();
        const userId = user.email || user.name || 'current_user';
        
        if (!disc.likedBy) disc.likedBy = [];

        const index = disc.likedBy.indexOf(userId);
        let liked = false;
        if (index === -1) {
            // User has not liked yet -> add 1 like
            disc.likedBy.push(userId);
            disc.likes = (disc.likes || 0) + 1;
            liked = true;
        } else {
            // User already liked -> toggle off
            disc.likedBy.splice(index, 1);
            disc.likes = Math.max(0, (disc.likes || 1) - 1);
            liked = false;
        }
        MOCK_DATA.saveDiscussions(list);
        return { liked, likes: disc.likes };
    },

    isLikedByUser: (discId) => {
        const list = MOCK_DATA.getDiscussions();
        const disc = list.find(d => d.id === discId);
        if (!disc || !disc.likedBy) return false;
        const user = MOCK_DATA.getUser();
        const userId = user.email || user.name || 'current_user';
        return disc.likedBy.includes(userId);
    }
};
