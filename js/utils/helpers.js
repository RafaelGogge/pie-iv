/**
 * UniLab - Utilitários Gerais
 * Autor: Rafael V. Gogge
 * Copyright © 2025 Rafael V. Gogge
 */

// Utilitários para manipulação do DOM
export const DOMUtils = {
    // Seleciona elemento por ID com verificação
    getElementById: (id, silent = false) => {
        const element = document.getElementById(id);
        if (!element && !silent) {
            console.warn(`Elemento com ID '${id}' não encontrado`);
        }
        return element;
    },

    // Versão silenciosa para uso interno
    getElementByIdSilent: (id) => {
        return document.getElementById(id);
    },

    // Remove classes de validação
    clearValidationClasses: (element) => {
        element.classList.remove('is-valid', 'is-invalid');
    },

    // Mostra erro em campo do formulário
    showFieldError: (fieldId, errorId, message) => {
        const field = DOMUtils.getElementById(fieldId);
        if (!field) return;

        field.classList.add('is-invalid');
        field.classList.remove('is-valid');

        // Remove erro anterior se existir
        const existingError = document.getElementById(errorId);
        if (existingError) existingError.remove();

        // Cria nova mensagem de erro
        const errorDiv = document.createElement('div');
        errorDiv.id = errorId;
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    },

    // Remove mensagem de erro
    removeFieldError: (errorId) => {
        const errorElement = document.getElementById(errorId);
        if (errorElement) errorElement.remove();
    }
};

// Utilitários para localStorage
export const StorageUtils = {
    // Salva dados no localStorage
    save: (key, data) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
            return false;
        }
    },

    // Carrega dados do localStorage
    load: (key, defaultValue = null) => {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('Erro ao carregar do localStorage:', error);
            return defaultValue;
        }
    },

    // Remove dados do localStorage
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Erro ao remover do localStorage:', error);
            return false;
        }
    }
};

// Utilitários para validação
export const ValidationUtils = {
    // Valida email
    isValidEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Valida campo obrigatório
    isRequired: (value) => {
        return value && value.trim().length > 0;
    },

    // Valida matrícula (apenas números)
    isValidMatricula: (matricula) => {
        const matriculaRegex = /^\d+$/;
        return matriculaRegex.test(matricula);
    }
};

// Utilitários para formatação
export const FormatUtils = {
    // Formata data para pt-BR
    formatDate: (date = new Date()) => {
        return date.toLocaleString('pt-BR');
    },

    // Capitaliza primeira letra
    capitalize: (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    },

    // Obtém nome do departamento
    getDepartmentName: (dept) => {
        const departments = {
            'computacao': 'Computação',
            'biologia': 'Biologia',
            'fisica': 'Física',
            'quimica': 'Química'
        };
        return departments[dept] || dept;
    },

    // Obtém nome amigável do tipo de usuário
    getUserTypeName: (type) => {
        const types = {
            'estudante': 'Estudante',
            'professor': 'Professor',
            'funcionario': 'Funcionário',
            'pesquisador': 'Pesquisador'
        };
        return types[type] || type || '—';
    }
};