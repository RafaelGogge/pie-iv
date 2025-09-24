/**
 * UniLab - Sistema de Notificações
 * Autor: Rafael V. Gogge
 * Copyright © 2025 Rafael V. Gogge
 */

export class NotificationSystem {
    constructor() {
        this.toastContainer = null;
        this.createContainer();
    }

    // Cria container para toasts se não existir
    createContainer() {
        if (!this.toastContainer) {
            this.toastContainer = document.createElement('div');
            this.toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            this.toastContainer.style.zIndex = '9999';
            document.body.appendChild(this.toastContainer);
        }
    }

    // Mostra notificação
    show(message, type = 'success') {
        const toast = this.createToast(message, type);
        this.toastContainer.appendChild(toast);

        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();

        // Remove após fechar
        toast.addEventListener('hidden.bs.toast', () => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        });
    }

    // Cria elemento toast
    createToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast bg-${type} text-white`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');

        const icon = this.getIcon(type);

        toast.innerHTML = `
            <div class="toast-header bg-${type} text-white">
                <i class="bi bi-${icon} me-2"></i>
                <strong class="me-auto">UniLab</strong>
                <small>Agora</small>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        `;

        return toast;
    }

    // Retorna ícone baseado no tipo
    getIcon(type) {
        const icons = {
            'success': 'check-circle',
            'warning': 'exclamation-triangle',
            'danger': 'x-circle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    // Métodos de conveniência
    success(message) {
        this.show(message, 'success');
    }

    warning(message) {
        this.show(message, 'warning');
    }

    error(message) {
        this.show(message, 'danger');
    }

    info(message) {
        this.show(message, 'info');
    }
}

// Instância global
export const notifications = new NotificationSystem();