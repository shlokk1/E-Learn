/**
 * Authentication Logic
 * Handles prototype dummy login/registration behaviors.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Handle Login
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Dummy authentication process
            const email = document.getElementById('email').value;
            const roleElement = document.getElementById('role');
            const role = roleElement ? roleElement.value : 'student';
            
            // Mock user data setup for the prototype
            const mockUser = {
                name: role === 'admin' ? 'System Administrator' : (role === 'mentor' ? 'Mr. Teacher' : 'Student User'), 
                email: email,
                role: role.toUpperCase(),
                class: '10',
                division: 'A'
            };
            
            // Store user in localStorage
            localStorage.setItem('currentUser', JSON.stringify(mockUser));
            
            // Redirect based on role
            if (role === 'admin') {
                window.location.href = 'admin/dashboard.html';
            } else if (role === 'mentor') {
                window.location.href = 'teacher/dashboard.html';
            } else {
                window.location.href = 'student/dashboard.html';
            }
        });
    }

    // Handle Registration
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Dummy registration process
            const name = document.getElementById('regName').value;
            const email = document.getElementById('regEmail').value;
            const studentClass = document.getElementById('regClass').value;
            const division = document.getElementById('regDiv').value;
            
            const roleElement = document.getElementById('regRole');
            const role = roleElement ? roleElement.value : 'student';
            
            const mockUser = {
                name: name || 'New User',
                email: email,
                role: role.toUpperCase(),
                class: studentClass || '10',
                division: division || 'A'
            };
            
            // Store user in localStorage
            localStorage.setItem('currentUser', JSON.stringify(mockUser));
            
            // Redirect based on role
            if (role === 'admin') {
                window.location.href = 'admin/dashboard.html';
            } else if (role === 'mentor') {
                alert('Teacher/Mentor portal is pending Phase 10 implementation. Redirecting to student view for now.');
                window.location.href = 'student/dashboard.html';
            } else {
                window.location.href = 'student/dashboard.html';
            }
        });
    }
});
