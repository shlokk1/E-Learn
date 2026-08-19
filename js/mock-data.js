/**
 * Mock Data Store
 * Provides default prototype data.
 */
const MOCK_DATA = {
    getUser: () => {
        const stored = localStorage.getItem('currentUser');
        return stored ? JSON.parse(stored) : { name: 'Demo Student', class: '10', division: 'A', role: 'STUDENT' };
    }
};
