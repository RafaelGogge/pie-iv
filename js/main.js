/**
 * UniLab - Sistema de Gerenciamento de Laboratórios
 * Arquivo Principal
 * Autor: Rafael V. Gogge
 * Copyright © 2025 Rafael V. Gogge
 */

import { ProfileManager } from './modules/profileManager.js';
import { AvatarManager } from './modules/avatarManager.js';
import { ProfileUI } from './modules/profileUI.js';
import { notifications } from './utils/notifications.js';

// Classe principal da aplicação
class UnilabApp {
    constructor() {
        this.profileManager = null;
        this.avatarManager = null;
        this.profileUI = null;
        this.init();
    }

    // Inicializa aplicação
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupManagers();
            this.setupGlobalFunctions();
            this.setupPageAnimations();
            this.setupLogoutHandler();

            // Inicialização explícita do grid de avatares se o container existir
            setTimeout(() => {
                const needsAvatarGrid = /perfil-cadastro|perfil-edicao/.test(window.location.pathname);
                if (!needsAvatarGrid) return; // não tenta inicializar em páginas que não usam
                const avatarGrid = document.getElementById('avatarGrid');
                if (avatarGrid && this.avatarManager) {
                    console.log('🔄 Inicializando grid de avatares via main.js');
                    this.avatarManager.initializeAvatars('avatarGrid');
                } else {
                    console.log('⚠️ avatarGrid não encontrado no DOM apesar de esperado');
                }
            }, 150);
        });
    }

    // Configura gerenciadores
    setupManagers() {
        try {
            this.profileManager = new ProfileManager();
            this.avatarManager = new AvatarManager();
            this.profileUI = new ProfileUI(this.profileManager, this.avatarManager);

            // Disponibiliza globalmente para uso em onclick
            window.profileUI = this.profileUI;

            console.log('✅ Todos os módulos carregados com sucesso');
        } catch (error) {
            console.error('❌ Erro ao carregar módulos:', error);
            notifications.error('Erro ao inicializar aplicação');
        }
    }

    // Configura funções globais
    setupGlobalFunctions() {
        // Função de exportar dados
        window.exportUserData = () => {
            if (this.profileManager) {
                this.profileManager.exportProfiles();
            }
        };

        // Função de alternar modo escuro (se implementado)
        window.toggleDarkMode = () => {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        };

        // Carrega modo escuro salvo
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
        }
    }

    // Configura animações da página
    setupPageAnimations() {
        // Remove opacidade inicial
        setTimeout(() => {
            document.body.classList.remove('opacity-0');
        }, 100);

        // Animação simples de entrada
        setTimeout(() => {
            document.querySelectorAll('.profile-section, .stat-card').forEach(el => {
                if (el) {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }
            });
        }, 200);

        // Inicializa tooltips Bootstrap
        this.initTooltips();
    }

    // Inicializa tooltips
    initTooltips() {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // Configura handler de logout
    setupLogoutHandler() {
        const logoutButton = document.querySelector('.logout-button');
        if (logoutButton) {
            logoutButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }
    }

    // Manipula logout
    handleLogout() {
        if (confirm('Tem certeza que deseja sair?')) {
            // Limpa dados sensíveis (mantém perfis cadastrados)
            localStorage.removeItem('selectedAvatar');
            localStorage.removeItem('darkMode');

            // Redireciona para página de login
            window.location.href = 'index.html';
        }
    }

    // Método para debug (desenvolvimento)
    debug() {
        console.log('🔍 Debug Info:', {
            profileManager: this.profileManager,
            avatarManager: this.avatarManager,
            profileUI: this.profileUI,
            profiles: this.profileManager ? this.profileManager.getAllProfiles() : null
        });
    }
}

// Inicializa aplicação
const app = new UnilabApp();

// Disponibiliza app globalmente para debug (apenas desenvolvimento)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.unilabApp = app;
    console.log('🚀 UniLab App inicializada - Digite "unilabApp.debug()" para informações de debug');
}