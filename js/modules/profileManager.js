/**
 * UniLab - Gestão de Perfis
 * Autor: Rafael V. Gogge
 * Copyright © 2025 Rafael V. Gogge
 */

import { StorageUtils, ValidationUtils, FormatUtils } from '../utils/helpers.js';
import { notifications } from '../utils/notifications.js';

export class ProfileManager {
    constructor() {
        this.storageKey = 'registeredProfiles';
        this.profiles = this.loadProfiles();
    }

    // Carrega perfis do localStorage
    loadProfiles() {
        return StorageUtils.load(this.storageKey, []);
    }

    // Salva perfis no localStorage
    saveProfiles() {
        return StorageUtils.save(this.storageKey, this.profiles);
    }

    // Valida dados do perfil
    validateProfile(profileData) {
        const errors = [];

        if (!ValidationUtils.isRequired(profileData.name)) {
            errors.push('Nome é obrigatório');
        }

        if (!ValidationUtils.isRequired(profileData.email)) {
            errors.push('Email é obrigatório');
        } else if (!ValidationUtils.isValidEmail(profileData.email)) {
            errors.push('Email inválido');
        }

        if (!ValidationUtils.isRequired(profileData.matricula)) {
            errors.push('Matrícula é obrigatória');
        } else if (!ValidationUtils.isValidMatricula(profileData.matricula)) {
            errors.push('Matrícula deve conter apenas números');
        }

        if (!ValidationUtils.isRequired(profileData.departamento)) {
            errors.push('Departamento é obrigatório');
        }

        return errors;
    }

    // Verifica duplicatas
    checkDuplicates(profileData, excludeId = null) {
        const duplicates = {};

        // Verifica matrícula duplicada
        const existingMatricula = this.profiles.find(profile =>
            profile.matricula === profileData.matricula && profile.id !== excludeId
        );
        if (existingMatricula) {
            duplicates.matricula = existingMatricula;
        }

        // Verifica email duplicado
        const existingEmail = this.profiles.find(profile =>
            profile.email === profileData.email && profile.id !== excludeId
        );
        if (existingEmail) {
            duplicates.email = existingEmail;
        }

        return duplicates;
    }

    // Adiciona novo perfil
    addProfile(profileData) {
        // Valida dados
        const errors = this.validateProfile(profileData);
        if (errors.length > 0) {
            notifications.error(errors.join(', '));
            return { success: false, errors };
        }

        // Verifica duplicatas
        const duplicates = this.checkDuplicates(profileData);
        if (duplicates.matricula || duplicates.email) {
            const message = duplicates.matricula ?
                `Matrícula já cadastrada para: ${duplicates.matricula.name}` :
                `Email já cadastrado para: ${duplicates.email.name}`;
            notifications.warning(message);
            return { success: false, duplicates };
        }

        // Cria perfil
        const newProfile = {
            id: Date.now(),
            ...profileData,
            dataCreation: FormatUtils.formatDate()
        };

        this.profiles.push(newProfile);
        this.saveProfiles();

        notifications.success('Perfil cadastrado com sucesso!');
        return { success: true, profile: newProfile };
    }

    // Atualiza perfil existente
    updateProfile(id, profileData) {
        const index = this.profiles.findIndex(p => p.id === id);
        if (index === -1) {
            notifications.error('Perfil não encontrado');
            return { success: false };
        }

        // Valida dados
        const errors = this.validateProfile(profileData);
        if (errors.length > 0) {
            notifications.error(errors.join(', '));
            return { success: false, errors };
        }

        // Verifica duplicatas (excluindo o perfil atual)
        const duplicates = this.checkDuplicates(profileData, id);
        if (duplicates.matricula || duplicates.email) {
            const message = duplicates.matricula ?
                `Matrícula já cadastrada para: ${duplicates.matricula.name}` :
                `Email já cadastrado para: ${duplicates.email.name}`;
            notifications.warning(message);
            return { success: false, duplicates };
        }

        // Atualiza perfil
        const originalProfile = this.profiles[index];
        this.profiles[index] = {
            ...originalProfile,
            ...profileData
        };

        this.saveProfiles();
        notifications.success('Perfil atualizado com sucesso!');
        return { success: true, profile: this.profiles[index] };
    }

    // Remove perfil
    removeProfile(id) {
        const index = this.profiles.findIndex(p => p.id === id);
        if (index === -1) {
            notifications.error('Perfil não encontrado');
            return { success: false };
        }

        this.profiles.splice(index, 1);
        this.saveProfiles();

        notifications.success('Perfil removido com sucesso!');
        return { success: true };
    }

    // Obtém perfil por ID
    getProfile(id) {
        return this.profiles.find(p => p.id === id);
    }

    // Obtém todos os perfis
    getAllProfiles() {
        return [...this.profiles];
    }

    // Limpa todos os perfis
    clearAllProfiles() {
        this.profiles = [];
        this.saveProfiles();
        notifications.warning('Todos os perfis foram removidos');
        return { success: true };
    }

    // Exporta dados dos perfis
    exportProfiles() {
        const data = {
            exportDate: FormatUtils.formatDate(),
            totalProfiles: this.profiles.length,
            profiles: this.profiles
        };

        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `perfis_unilab_${new Date().toISOString().split('T')[0]}.json`;

        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);

        notifications.success('Dados exportados com sucesso!');
    }
}