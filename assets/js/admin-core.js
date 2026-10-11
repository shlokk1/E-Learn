/**
 * Admin Core Logic
 * Handles reusable interactive components like Modals and Toasts.
 */

const AdminCore = {
    showModal: (modalId) => {
        const modal = document.getElementById(modalId);
        if(modal) modal.classList.add('active');
    },
    
    closeModal: (modalId) => {
        const modal = document.getElementById(modalId);
        if(modal) modal.classList.remove('active');
    },
    
    showToast: (message, type = 'info') => {
        const container = document.getElementById('toast-container') || AdminCore.createToastContainer();
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon = 'ph-info';
        let colorVar = 'var(--status-info)';
        
        if(type === 'success') {
            icon = 'ph-check-circle';
            colorVar = 'var(--status-success)';
        }
        if(type === 'error') {
            icon = 'ph-warning-circle';
            colorVar = 'var(--status-danger)';
        }
        if(type === 'warning') {
            icon = 'ph-warning';
            colorVar = 'var(--status-warning)';
        }
        
        toast.innerHTML = `
            <i class="ph ${icon}" style="font-size: 1.5rem; color: ${colorVar}"></i>
            <span style="font-weight: 500; font-size: 0.95rem;">${message}</span>
        `;
        
        container.appendChild(toast);
        
        // Trigger reflow for animation
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Remove after delay
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300); // Wait for transition
        }, 4000);
    },
    
    createToastContainer: () => {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    }
};

// Bind generic modal close buttons on load
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modalId = e.target.closest('.modal-overlay').id;
            AdminCore.closeModal(modalId);
        });
    });
});
