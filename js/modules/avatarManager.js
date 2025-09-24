/**
 * UniLab - Gerenciamento de Avatar
 * Autor: Rafael V. Gogge
 * Copyright © 2025 Rafael V. Gogge
 */

import { StorageUtils } from '../utils/helpers.js';
import { notifications } from '../utils/notifications.js';

export class AvatarManager {
    constructor() {
        this.selectedAvatar = null;
        this.currentAvatarImg = null;
        this.headerAvatarImg = null;
        this.modal = null;
        this.saveBtn = null;
        this.avatarCategories = {
            computacao: 6,
            biologia: 6,
            fisica: 4,
            quimica: 4
        };

        this.init();
    }

    // Inicializa o gerenciador de avatar
    init() {
        this.currentAvatarImg = document.getElementById('currentAvatarImg');
        this.headerAvatarImg = document.getElementById('headerAvatarImg');
        this.modal = document.getElementById('avatarModal');
        this.saveBtn = document.getElementById('saveAvatarBtn');

        this.loadSavedAvatar();
        this.bindEvents();
    }

    // Carrega avatar salvo do localStorage
    loadSavedAvatar() {
        const savedAvatar = StorageUtils.load('selectedAvatar');
        const basePath = this.getBasePath();
        const defaultAvatar = `${basePath}assets/avatares/computacao/computacao-1.png`;

        const avatarSrc = savedAvatar || defaultAvatar;

        if (this.currentAvatarImg) {
            this.currentAvatarImg.src = avatarSrc;
        }
        if (this.headerAvatarImg) {
            this.headerAvatarImg.src = avatarSrc;
        }
    }

    // Vincula eventos
    bindEvents() {
        // Eventos de seleção de avatar
        const avatarItems = document.querySelectorAll('.avatar-item');
        avatarItems.forEach(item => {
            item.addEventListener('click', (e) => this.selectAvatar(e));
        });

        // Evento de salvar avatar
        if (this.saveBtn) {
            this.saveBtn.addEventListener('click', () => this.saveSelectedAvatar());
        }

        // Reset de seleção quando modal é fechado
        if (this.modal) {
            this.modal.addEventListener('hidden.bs.modal', () => this.resetSelection());
        }
    }

    // Seleciona um avatar
    selectAvatar(event) {
        const avatarItem = event.currentTarget;
        const avatarImage = avatarItem.querySelector('img');
        const tabId = avatarItem.closest('.tab-pane').id;

        // Remove seleção anterior
        document.querySelectorAll('.avatar-item.selected').forEach(item => {
            item.classList.remove('selected');
        });

        // Adiciona seleção ao avatar clicado
        avatarItem.classList.add('selected');

        // Atualiza preview
        this.updatePreview(tabId, avatarImage.src);

        // Armazena avatar selecionado
        this.selectedAvatar = avatarImage.src;

        // Adiciona efeito visual no botão salvar
        if (this.saveBtn) {
            this.saveBtn.classList.add('btn-pulse');
        }
    }

    // Atualiza preview do avatar
    updatePreview(tabId, avatarSrc) {
        const previewIdMap = {
            computacao: 'previewAvatar',
            biologia: 'previewAvatarBio',
            fisica: 'previewAvatarFis',
            quimica: 'previewAvatarQuim'
        };

        const previewImg = document.getElementById(previewIdMap[tabId]);
        if (previewImg) {
            // Efeito de fade
            previewImg.style.opacity = '0';

            setTimeout(() => {
                previewImg.src = avatarSrc;
                previewImg.style.opacity = '1';
            }, 150);
        }
    }

    // Salva avatar selecionado
    saveSelectedAvatar() {
        if (!this.selectedAvatar) {
            notifications.warning('Selecione um avatar primeiro');
            return;
        }

        // Atualiza imagens
        if (this.currentAvatarImg) {
            this.currentAvatarImg.src = this.selectedAvatar;
        }
        if (this.headerAvatarImg) {
            this.headerAvatarImg.src = this.selectedAvatar;
        }

        // Salva no localStorage
        StorageUtils.save('selectedAvatar', this.selectedAvatar);

        // Feedback visual
        notifications.success('Avatar atualizado com sucesso!');

        // Fecha modal
        if (this.modal) {
            const bsModal = bootstrap.Modal.getInstance(this.modal);
            if (bsModal) {
                bsModal.hide();
            }
        }

        // Remove efeito visual
        if (this.saveBtn) {
            this.saveBtn.classList.remove('btn-pulse');
        }

        // Registra no histórico
        this.addToHistory();
    }

    // Reset de seleção
    resetSelection() {
        document.querySelectorAll('.avatar-item.selected').forEach(item => {
            item.classList.remove('selected');
        });

        this.selectedAvatar = null;

        if (this.saveBtn) {
            this.saveBtn.classList.remove('btn-pulse');
        }
    }

    // Adiciona ao histórico
    addToHistory() {
        // Implementação simplificada do histórico
        const history = StorageUtils.load('profileHistory', []);
        history.unshift({
            action: 'Alteração de avatar',
            details: 'Avatar alterado',
            date: new Date().toLocaleString('pt-BR')
        });

        // Mantém apenas os 20 registros mais recentes
        StorageUtils.save('profileHistory', history.slice(0, 20));
    }

    // Obtém avatar atual
    getCurrentAvatar() {
        return this.currentAvatarImg ? this.currentAvatarImg.src : null;
    }

    // Define avatar programaticamente
    setAvatar(avatarSrc) {
        if (this.currentAvatarImg) {
            this.currentAvatarImg.src = avatarSrc;
        }
        if (this.headerAvatarImg) {
            this.headerAvatarImg.src = avatarSrc;
        }

        StorageUtils.save('selectedAvatar', avatarSrc);
    }

    // Inicializa avatares nas páginas
    initializeAvatars(containerId = 'avatarGrid') {
        console.log(`Inicializando avatares para container: ${containerId}`);

        // Aguarda um pouco para garantir que o DOM esteja pronto
        setTimeout(() => {
            this.loadAvatarGrid(containerId, 'computacao');
            this.setupCategoryButtons(containerId);
        }, 100);
    }

    // Carrega grid de avatares para uma categoria
    loadAvatarGrid(containerId, category) {
        console.log(`Carregando avatares para: ${containerId}, categoria: ${category}`);

        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container ${containerId} não encontrado!`);
            return;
        }

        const avatarCount = this.avatarCategories[category] || 6;
        const basePath = this.getBasePath();

        console.log(`Base path: ${basePath}, Avatar count: ${avatarCount}`);

        container.innerHTML = '';

        for (let i = 1; i <= avatarCount; i++) {
            const avatarPath = `${basePath}assets/avatares/${category}/${category}-${i}.png`;
            console.log(`Criando avatar: ${avatarPath}`);

            const avatarOption = document.createElement('div');
            avatarOption.className = 'avatar-option';
            avatarOption.innerHTML = `
                <img src="${avatarPath}" alt="${category} ${i}" class="avatar-img" 
                     onerror="console.error('Erro ao carregar avatar: ${avatarPath}')"
                     onload="console.log('Avatar carregado: ${avatarPath}')">
            `;

            avatarOption.addEventListener('click', () => {
                this.selectAvatarOption(avatarOption, avatarPath, containerId);
            });

            container.appendChild(avatarOption);
        }

        console.log(`${avatarCount} avatares adicionados ao container ${containerId}`);
    }

    // Configura botões de categoria
    setupCategoryButtons(containerId) {
        const categoryButtons = document.querySelectorAll('.category-btn');

        categoryButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active de todos os botões
                categoryButtons.forEach(b => b.classList.remove('active'));

                // Adiciona active ao botão clicado
                e.target.closest('.category-btn').classList.add('active');

                // Carrega avatares da categoria
                const category = e.target.closest('.category-btn').dataset.category;
                this.loadAvatarGrid(containerId, category);
            });
        });
    }

    // Seleciona uma opção de avatar
    selectAvatarOption(option, avatarPath, containerId) {
        // Remove seleção anterior
        const container = document.getElementById(containerId);
        if (container) {
            container.querySelectorAll('.avatar-option.selected').forEach(opt => {
                opt.classList.remove('selected');
            });
        }

        // Adiciona seleção atual
        option.classList.add('selected');
        this.selectedAvatar = avatarPath;

        // Atualiza preview se existir
        const preview = document.getElementById('avatarPreview');
        if (preview) {
            preview.src = avatarPath;
        }

        // Atualiza campo oculto do formulário se existir
        const avatarInput = document.getElementById('avatar');
        if (avatarInput) {
            avatarInput.value = avatarPath;
        }
    }

    // Obtém caminho base baseado na localização da página
    getBasePath() {
        let path = window.location.pathname.replace(/\\/g, '/');
        // Em ambientes file:// pode vir só nome; garantir barra inicial opcional
        console.log(`Current path: ${path}`);

        if (path.includes('/pages/')) {
            return '../';
        }
        // Se assets não estiver acessível, tentaremos fallback depois
        return '';
    }

    // Método alternativo para inicializar avatares com fallback
    initializeAvatarsCompat() {
        console.log('Inicializando avatares com método de compatibilidade');

        // Tenta encontrar o container de avatares
        const possibleContainers = ['avatarGrid', 'modalAvatarGrid'];
        let foundContainer = null;

        for (const containerId of possibleContainers) {
            const container = document.getElementById(containerId);
            if (container) {
                foundContainer = containerId;
                break;
            }
        }

        if (foundContainer) {
            console.log(`✅ Container de avatar encontrado: ${foundContainer}`);
            this.loadAvatarGrid(foundContainer, 'computacao');
            this.setupCategoryButtons(foundContainer);
        } else {
            console.warn('⚠️ Nenhum container de avatar encontrado nesta verificação');
            // Tenta novamente após um delay (máx 5 tentativas)
            this._avatarRetryCount = (this._avatarRetryCount || 0) + 1;
            if (this._avatarRetryCount <= 5) {
                setTimeout(() => this.initializeAvatarsCompat(), 600);
            } else {
                console.error('❌ Falha ao localizar container de avatares após múltiplas tentativas');
            }
        }
    }
}