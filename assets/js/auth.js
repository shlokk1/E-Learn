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
            
            // Store user in localStorage and sessionStorage
            localStorage.setItem('currentUser', JSON.stringify(mockUser));
            sessionStorage.setItem('currentUser', JSON.stringify(mockUser));
            
            // Redirect based on role
            if (role === 'admin') {
                window.location.href = '../admin/dashboard.html';
            } else if (role === 'mentor') {
                window.location.href = '../teacher/dashboard.html';
            } else {
                window.location.href = '../student/dashboard.html';
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
            
            // Store user in localStorage and sessionStorage
            localStorage.setItem('currentUser', JSON.stringify(mockUser));
            sessionStorage.setItem('currentUser', JSON.stringify(mockUser));
            
            // Redirect based on role
            if (role === 'admin') {
                window.location.href = '../admin/dashboard.html';
            } else if (role === 'mentor') {
                window.location.href = '../teacher/dashboard.html';
            } else {
                window.location.href = '../student/dashboard.html';
            }
        });
    }

    // Social Authentication Placeholder Handling (Prevents page jumps and gives feedback)
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const provider = btn.getAttribute('data-provider') || 'Social provider';
            alert(`${provider} sign-in is not configured in this offline prototype. Please sign in with your email and role.`);
        });
    });

    // Smooth navigation between separate auth pages
    document.querySelectorAll('.auth-switch-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) return; // Allow normal instant navigation

            const targetHref = link.getAttribute('href');
            const card = document.querySelector('.auth-card');
            if (card && targetHref) {
                e.preventDefault();
                card.style.transition = 'opacity 200ms ease, transform 200ms cubic-bezier(0.22, 1, 0.36, 1)';
                card.style.opacity = '0';
                card.style.transform = 'translateY(-12px)';
                setTimeout(() => {
                    window.location.href = targetHref;
                }, 200);
            }
        });
    });

    // Backwards-compatible URL hash / query param routing
    const sliderContainer = document.getElementById('slider-container');
    if (sliderContainer) {
        if (window.location.hash === '#signup' || window.location.hash === '#register' || new URLSearchParams(window.location.search).get('action') === 'signup') {
            sliderContainer.classList.add('right-panel-active');
        } else if (window.location.hash === '#signin' || window.location.hash === '#login' || new URLSearchParams(window.location.search).get('action') === 'signin') {
            sliderContainer.classList.remove('right-panel-active');
        }
    }
});
