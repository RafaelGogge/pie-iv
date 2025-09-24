/**
 * UniLab - Interface de Perfis
 * Autor: Rafael V. Gogge
 * Copyright © 2025 Rafael V. Gogge
 */

import { DOMUtils, FormatUtils } from '../utils/helpers.js';
import { notifications } from '../utils/notifications.js';

export class ProfileUI {
    constructor(profileManager, avatarManager) {
        this.profileManager = profileManager;
        this.avatarManager = avatarManager;
        this.editingProfileId = null;

        this.init();
    }

    // Inicializa interface
    init() {
        // Verifica se a página atual tem os elementos necessários antes de inicializar
        if (this.hasRequiredElements()) {
            this.bindFormEvents();
            this.loadInitialData();
        }
    }

    // Verifica se a página tem os elementos necessários
    hasRequiredElements() {
        const form = document.getElementById('profileForm');
        if (!form) return false;
        // Pelo menos um conjunto de IDs reconhecidos
        const anyField = document.getElementById('userName') || document.getElementById('name') ||
            document.getElementById('userEmail') || document.getElementById('email');
        return !!anyField;
    }

    // Vincula eventos do formulário
    bindFormEvents() {
        const form = document.getElementById('profileForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Validação em tempo real
        this.bindRealTimeValidation();
    }

    // Validação em tempo real
    bindRealTimeValidation() {
        const matriculaField = document.getElementById('userMatricula') || document.getElementById('matricula');
        const emailField = document.getElementById('userEmail') || document.getElementById('email');

        if (matriculaField) {
            matriculaField.addEventListener('blur', () => {
                this.validateUniqueField(matriculaField.id, 'matricula', 'Esta matrícula já está em uso');
            });
            matriculaField.addEventListener('input', () => {
                DOMUtils.removeFieldError('matriculaError');
                DOMUtils.clearValidationClasses(matriculaField);
            });
        }

        if (emailField) {
            emailField.addEventListener('blur', () => {
                this.validateUniqueField(emailField.id, 'email', 'Este email já está em uso');
            });
            emailField.addEventListener('input', () => {
                DOMUtils.removeFieldError('emailError');
                DOMUtils.clearValidationClasses(emailField);
            });
        }
    }

    // Valida campo único
    validateUniqueField(fieldId, property, errorMessage) {
        const field = document.getElementById(fieldId);
        if (!field) return;

        const value = field.value.trim();

        if (!value) return;

        const profiles = this.profileManager.getAllProfiles();
        const existing = profiles.find(profile =>
            profile[property] === value && profile.id !== this.editingProfileId
        );

        DOMUtils.removeFieldError(`${property}Error`);

        if (existing) {
            DOMUtils.showFieldError(fieldId, `${property}Error`, `${errorMessage}: ${existing.name}`);
        } else if (value.length > 0) {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        }
    }

    // Manipula envio do formulário
    handleFormSubmit(event) {
        event.preventDefault();

        // Coleta dados do formulário
        const formData = this.collectFormData();
        if (!formData) return;

        // Adiciona avatar atual
        formData.avatar = this.avatarManager.getCurrentAvatar();

        let result;
        if (this.editingProfileId) {
            // Modo edição
            result = this.profileManager.updateProfile(this.editingProfileId, formData);
        } else {
            // Modo cadastro
            result = this.profileManager.addProfile(formData);
        }

        if (result.success) {
            this.clearForm();
            this.renderProfilesList();
            this.addToHistory(result.profile);
        } else {
            this.showValidationErrors(result);
        }
    }

    // Coleta dados do formulário
    collectFormData() {
        const nameField = document.getElementById('userName') || document.getElementById('name');
        const emailField = document.getElementById('userEmail') || document.getElementById('email');
        const matriculaField = document.getElementById('userMatricula') || document.getElementById('matricula');
        const departamentoField = document.getElementById('userDepartamento') || document.getElementById('departamento');
        const statusField = document.getElementById('userStatus') || document.getElementById('status');
        // Novos campos opcionais
        const telefoneField = document.getElementById('userTelefone') || document.getElementById('telefone');
        const cursoField = document.getElementById('userCurso') || document.getElementById('curso');
        const tipoUsuarioField = document.getElementById('userTipoUsuario') || document.getElementById('tipoUsuario');
        const observacoesField = document.getElementById('userObservacoes') || document.getElementById('observacoes');
        const avatarField = document.getElementById('userAvatar') || document.getElementById('avatar');

        if (!nameField || !emailField || !matriculaField || !departamentoField || !statusField) {
            // Se estivermos numa página que possui o formulário mas usa outro script (ex: cadastro customizado), evitamos duplicar erro
            console.warn('ProfileUI: campos esperados não encontrados – ignorando submissão nesta página.');
            notifications.error('Erro no formulário: campos não encontrados');
            return null;
        }

        return {
            name: nameField.value.trim(),
            email: emailField.value.trim(),
            matricula: matriculaField.value.trim(),
            departamento: departamentoField.value,
            status: statusField.value,
            telefone: telefoneField ? telefoneField.value.trim() : '',
            curso: cursoField ? cursoField.value.trim() : '',
            tipoUsuario: tipoUsuarioField ? tipoUsuarioField.value : '',
            observacoes: observacoesField ? observacoesField.value.trim() : '',
            avatar: avatarField ? avatarField.value.trim() : ''
        };
    }

    // Mostra erros de validação
    showValidationErrors(result) {
        if (result.duplicates) {
            if (result.duplicates.matricula) {
                DOMUtils.showFieldError('userMatricula', 'matriculaError',
                    `Matrícula já cadastrada para: ${result.duplicates.matricula.name}`);
            }
            if (result.duplicates.email) {
                DOMUtils.showFieldError('userEmail', 'emailError',
                    `Email já cadastrado para: ${result.duplicates.email.name}`);
            }
        }
    }

    // Limpa formulário
    clearForm() {
        const form = document.getElementById('profileForm');
        if (form) {
            form.reset();
        }

        // Define valores padrão
        const statusField = document.getElementById('userStatus');
        if (statusField) {
            statusField.value = 'ativo';
        }

        // Remove classes de validação
        document.querySelectorAll('.is-valid, .is-invalid').forEach(field => {
            DOMUtils.clearValidationClasses(field);
        });

        // Remove mensagens de erro
        DOMUtils.removeFieldError('matriculaError');
        DOMUtils.removeFieldError('emailError');

        // Reset modo edição
        this.editingProfileId = null;
    }

    // Renderiza lista de perfis
    renderProfilesList() {
        const container = document.getElementById('listaPerfisCadastrados');
        if (!container) return;

        const profiles = this.profileManager.getAllProfiles();

        if (profiles.length === 0) {
            container.innerHTML = this.getEmptyStateHTML();
            return;
        }

        const html = `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h5><i class="bi bi-people-fill me-2"></i>Total de perfis: ${profiles.length}</h5>
                <button class="btn btn-outline-danger btn-sm" onclick="window.profileUI.clearAllProfiles()">
                    <i class="bi bi-trash me-1"></i>Limpar Todos
                </button>
            </div>
            ${profiles.map(profile => this.getProfileCardHTML(profile)).join('')}
        `;

        container.innerHTML = html;
    }

    // HTML para estado vazio
    getEmptyStateHTML() {
        return `
            <div class="text-center py-5">
                <i class="bi bi-person-plus fs-1 text-muted"></i>
                <h4 class="mt-3 text-muted">Nenhum perfil cadastrado</h4>
                <p class="text-muted">Cadastre o primeiro perfil na aba "Meu Perfil"</p>
            </div>
        `;
    }

    // HTML para card de perfil
    getProfileCardHTML(profile) {
        return `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-2 text-center">
                            <div class="avatar-circle mb-3 mb-md-0">
                                <img src="${profile.avatar}" alt="Avatar de ${profile.name}" class="avatar-img">
                            </div>
                        </div>
                        <div class="col-md-7">
                            <h5 class="card-title mb-1">
                                <i class="bi bi-person-badge me-2"></i>${profile.name}
                            </h5>
                            <p class="card-text">
                                <small class="text-muted">
                                    <i class="bi bi-envelope me-2"></i>${profile.email}<br>
                                    <i class="bi bi-card-heading me-2"></i>Matrícula: ${profile.matricula}<br>
                                    <i class="bi bi-building me-2"></i>Departamento: ${FormatUtils.getDepartmentName(profile.departamento)}<br>
                                    <i class="bi bi-calendar-plus me-2"></i>Cadastrado em: ${profile.dataCreation}
                                </small>
                            </p>
                        </div>
                        <div class="col-md-3 text-end">
                            <span class="badge ${profile.status === 'ativo' ? 'bg-success' : 'bg-danger'} mb-2">
                                ${profile.status === 'ativo' ? 'Ativo' : 'Inativo'}
                            </span>
                            <div class="btn-group-vertical d-grid gap-1">
                                <button class="btn btn-sm btn-outline-primary" onclick="window.profileUI.editProfile(${profile.id})">
                                    <i class="bi bi-pencil me-1"></i>Editar
                                </button>
                                <button class="btn btn-sm btn-outline-danger" onclick="window.profileUI.deleteProfile(${profile.id})">
                                    <i class="bi bi-trash me-1"></i>Excluir
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Carrega dados iniciais
    loadInitialData() {
        this.clearForm();
        this.renderProfilesList();
    }

    // Edita perfil
    editProfile(profileId) {
        const profile = this.profileManager.getProfile(profileId);
        if (!profile) {
            notifications.error('Perfil não encontrado');
            return;
        }

        this.editingProfileId = profileId;

        // Preenche formulário (apenas se os elementos existirem)
        const nameField = document.getElementById('userName') || document.getElementById('name');
        const emailField = document.getElementById('userEmail') || document.getElementById('email');
        const matriculaField = document.getElementById('userMatricula') || document.getElementById('matricula');
        const departamentoField = document.getElementById('userDepartamento') || document.getElementById('departamento');
        const statusField = document.getElementById('userStatus') || document.getElementById('status');

        if (nameField) nameField.value = profile.name;
        if (emailField) emailField.value = profile.email;
        if (matriculaField) matriculaField.value = profile.matricula;
        if (departamentoField) departamentoField.value = profile.departamento;
        if (statusField) statusField.value = profile.status;

        // Remove mensagens de erro
        DOMUtils.removeFieldError('matriculaError');
        DOMUtils.removeFieldError('emailError');

        // Remove classes de validação
        document.querySelectorAll('.is-valid, .is-invalid').forEach(field => {
            DOMUtils.clearValidationClasses(field);
        });

        // Atualiza avatar
        this.avatarManager.setAvatar(profile.avatar);

        // Volta para aba "Meu Perfil" (se existir)
        const tabElement = document.getElementById('meu-perfil-tab');
        if (tabElement) {
            const tab = new bootstrap.Tab(tabElement);
            tab.show();
        }

        notifications.info('Perfil carregado para edição!');
    }

    // Exclui perfil
    deleteProfile(profileId) {
        if (!confirm('Tem certeza que deseja excluir este perfil?')) {
            return;
        }

        const result = this.profileManager.removeProfile(profileId);
        if (result.success) {
            this.renderProfilesList();
        }
    }

    // Limpa todos os perfis
    clearAllProfiles() {
        if (!confirm('Tem certeza que deseja excluir TODOS os perfis cadastrados? Esta ação não pode ser desfeita.')) {
            return;
        }

        const result = this.profileManager.clearAllProfiles();
        if (result.success) {
            this.renderProfilesList();
        }
    }

    // Adiciona ao histórico
    addToHistory(profile) {
        // Implementação simplificada
        const history = JSON.parse(localStorage.getItem('profileHistory') || '[]');
        const action = this.editingProfileId ? 'Perfil atualizado' : 'Novo perfil cadastrado';

        history.unshift({
            action,
            details: `Perfil de ${profile.name}`,
            date: FormatUtils.formatDate()
        });

        localStorage.setItem('profileHistory', JSON.stringify(history.slice(0, 20)));
    }
}

// Função global para resetar formulário
window.resetForm = function () {
    if (window.profileUI) {
        window.profileUI.clearForm();
        notifications.info('Formulário limpo!');
    }
};