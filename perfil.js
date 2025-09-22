// Autor: Rafael V. Gogge
// Copyright © 2025 Rafael V. Gogge
// Projeto: UniLab - Sistema de Gerenciamento de Laboratórios

document.addEventListener('DOMContentLoaded', function () {
    // Elementos do DOM
    const profileForm = document.getElementById('profileForm');
    const avatarModal = document.getElementById('avatarModal');
    const saveAvatarBtn = document.getElementById('saveAvatarBtn');
    const avatarItems = document.querySelectorAll('.avatar-item');
    const currentAvatarImg = document.getElementById('currentAvatarImg');
    const headerAvatarImg = document.getElementById('headerAvatarImg');
    const previewAvatars = {
        default: document.getElementById('previewAvatar'),
        bio: document.getElementById('previewAvatarBio'),
        fis: document.getElementById('previewAvatarFis'),
        quim: document.getElementById('previewAvatarQuim')
    };

    // Variável para armazenar o avatar selecionado
    let selectedAvatar = null;

    // Função para carregar os dados do perfil
    function loadProfileData() {
        // Aqui você faria uma chamada à API para carregar os dados do usuário
        // Por enquanto, vamos simular com dados estáticos
        const savedAvatar = localStorage.getItem('selectedAvatar');
        const userData = {
            name: 'Rafael Gogge',
            email: 'rafaelgogge@souunisales.com.br',
            matricula: '123456',
            departamento: 'computacao',
            status: 'ativo',
            avatar: savedAvatar ? savedAvatar : 'avatares/computacao/computacao-1.png'
        };

        // Preenche os campos do formulário
        document.getElementById('userName').value = userData.name;
        document.getElementById('userEmail').value = userData.email;
        document.getElementById('userMatricula').value = userData.matricula;
        document.getElementById('userDepartamento').value = userData.departamento;
        document.getElementById('userStatus').value = userData.status;

        // Atualiza as imagens de avatar
        currentAvatarImg.src = userData.avatar;
        headerAvatarImg.src = userData.avatar;
    }

    // Função para salvar os dados do perfil
    function saveProfileData(event) {
        event.preventDefault();

        // Validação do formulário com feedback visual
        let isValid = true;
        const requiredFields = document.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            } else {
                field.classList.remove('is-invalid');
                field.classList.add('is-valid');
            }
        });

        if (!isValid) {
            showNotification('Por favor, preencha todos os campos obrigatórios.', 'warning');
            return;
        }

        // Antes de salvar, verifica alterações
        const prevData = {
            name: document.getElementById('userName').defaultValue,
            email: document.getElementById('userEmail').defaultValue,
            matricula: document.getElementById('userMatricula').defaultValue,
            departamento: document.getElementById('userDepartamento').defaultValue,
            status: document.getElementById('userStatus').defaultValue
        };

        const formData = {
            name: document.getElementById('userName').value,
            email: document.getElementById('userEmail').value,
            matricula: document.getElementById('userMatricula').value,
            departamento: document.getElementById('userDepartamento').value,
            status: document.getElementById('userStatus').value
        };

        // Detecta e registra alterações
        Object.keys(formData).forEach(key => {
            if (formData[key] !== prevData[key]) {
                addToHistory('Alteração de perfil', `Campo "${key}" alterado de "${prevData[key]}" para "${formData[key]}"`);
            }
        });

        // Aqui você faria uma chamada à API para salvar os dados
        console.log('Dados a serem salvos:', formData);

        // Simula sucesso no salvamento
        showNotification('Perfil atualizado com sucesso!', 'success');

        // Adiciona animação de sucesso aos campos
        requiredFields.forEach(field => {
            field.classList.add('is-valid');
            setTimeout(() => {
                field.classList.remove('is-valid');
            }, 3000);
        });

        // Atualiza valores default para próxima comparação
        document.getElementById('userName').defaultValue = formData.name;
        document.getElementById('userEmail').defaultValue = formData.email;
        document.getElementById('userMatricula').defaultValue = formData.matricula;
        document.getElementById('userDepartamento').defaultValue = formData.departamento;
        document.getElementById('userStatus').defaultValue = formData.status;

        renderHistory();
    }

    // Função para selecionar um avatar com preview instantâneo
    function selectAvatar(event) {
        const avatarItem = event.currentTarget;
        const avatarImage = avatarItem.querySelector('img');
        const tabId = avatarItem.closest('.tab-pane').id;

        // Remove a seleção anterior
        document.querySelectorAll('.avatar-item.selected').forEach(item => {
            item.classList.remove('selected');
        });

        // Adiciona a seleção ao avatar clicado com efeito visual
        avatarItem.classList.add('selected');

        // Efeito sonoro leve (se permitido pelo navegador)
        try {
            const audio = new Audio('sons/click.mp3');
            audio.volume = 0.2;
            audio.play();
        } catch (e) {
            console.log('Efeito sonoro não suportado');
        }

        // Refatoração: previewId dinâmico
        const previewIdMap = {
            computacao: 'previewAvatar',
            biologia: 'previewAvatarBio',
            fisica: 'previewAvatarFis',
            quimica: 'previewAvatarQuim'
        };
        const previewImg = document.getElementById(previewIdMap[tabId] || '');

        if (previewImg) {
            // Efeito de fade out
            previewImg.style.opacity = '0';

            // Após fade out, muda a imagem e faz fade in
            setTimeout(() => {
                previewImg.src = avatarImage.src;
                previewImg.style.opacity = '1';
            }, 300);
        }

        selectedAvatar = avatarImage.src;

        // Efeito de pulsação no botão de salvar
        saveAvatarBtn.classList.add('btn-pulse');
    }

    // Função para salvar o avatar selecionado
    function saveSelectedAvatar() {
        if (selectedAvatar) {
            currentAvatarImg.src = selectedAvatar;
            headerAvatarImg.src = selectedAvatar;

            // Salva o avatar selecionado no localStorage
            localStorage.setItem('selectedAvatar', selectedAvatar);

            // Animação de transição suave
            currentAvatarImg.classList.add('scale-in-center');
            headerAvatarImg.classList.add('scale-in-center');

            setTimeout(() => {
                currentAvatarImg.classList.remove('scale-in-center');
                headerAvatarImg.classList.remove('scale-in-center');
            }, 500);

            // Aqui você faria uma chamada à API para salvar o avatar
            showNotification('Avatar atualizado com sucesso!', 'success');

            addToHistory('Alteração de avatar', `Avatar alterado para "${selectedAvatar.split('/').pop()}"`);
            renderHistory();

            // Fecha o modal
            bootstrap.Modal.getInstance(avatarModal).hide();

            // Remove o efeito de pulsação
            saveAvatarBtn.classList.remove('btn-pulse');

            // Mostra mensagem de agradecimento
            showThankYouMessage();
        }
    }

    // Função para mostrar notificações
    function showNotification(message, type = 'success') {
        // Implementação de notificação toast
        const toastContainer = document.createElement('div');
        toastContainer.className = `toast-container position-fixed bottom-0 end-0 p-3`;

        const toast = document.createElement('div');
        toast.className = `toast bg-${type} text-white`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');

        toast.innerHTML = `
            <div class="toast-header bg-${type} text-white">
                <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'} me-2"></i>
                <strong class="me-auto">UniLab</strong>
                <small>Agora</small>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        `;

        toastContainer.appendChild(toast);
        document.body.appendChild(toastContainer);

        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();

        // Remover após fechar
        toast.addEventListener('hidden.bs.toast', function () {
            document.body.removeChild(toastContainer);
        });
    }

    // Função para resetar o formulário
    window.resetForm = function () {
        profileForm.reset();
        document.querySelectorAll('.is-valid, .is-invalid').forEach(field => {
            field.classList.remove('is-valid', 'is-invalid');
        });
        loadProfileData();
        showNotification('Formulário resetado!', 'info');
    };


    // Event Listeners
    profileForm.addEventListener('submit', saveProfileData);
    saveAvatarBtn.addEventListener('click', saveSelectedAvatar);
    avatarItems.forEach(item => {
        item.addEventListener('click', selectAvatar);
    });

    // Funcionalidade do botão de sair
    const logoutButton = document.querySelector('.logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function (e) {
            e.preventDefault();
            // Limpa dados do localStorage relacionados ao usuário
            localStorage.removeItem('selectedAvatar');
            localStorage.removeItem('darkMode');
            // Adicione aqui outros dados que desejar limpar
            // Redireciona para a tela de login (ajuste o caminho se necessário)
            window.location.href = 'index.html';
        });
    }

    // Reset da seleção quando o modal é fechado
    avatarModal.addEventListener('hidden.bs.modal', function () {
        document.querySelectorAll('.avatar-item.selected').forEach(item => {
            item.classList.remove('selected');
        });
        selectedAvatar = null;
        saveAvatarBtn.classList.remove('btn-pulse');
    });

    // Carrega os dados iniciais
    loadProfileData();

    // Animação de entrada da página
    document.body.classList.remove('opacity-0');

    // Adiciona efeito de flutuação aos cards estatísticos
    document.querySelectorAll('.stat-card').forEach(card => {
        card.classList.add('float-effect');
    });

    // Animação de entrada para os elementos da página
    const elementsToAnimate = [
        '.welcome-section',
        '.profile-photo-card',
        '.profile-info-card',
        '.stat-card',
        '.stats-overview',
        '.timeline-item'
    ];

    // Aplica animações com delay progressivo
    elementsToAnimate.forEach((selector, index) => {
        document.querySelectorAll(selector).forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 100 + (index * 150));
        });
    });

    // Inicializa tooltips
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(tooltipTriggerEl => {
        new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Animação para timeline
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'all 0.5s ease';

        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 500 + (index * 200));
    });

    // Inicialização do departamento selecionado no modal de avatar
    const userDepartamento = document.getElementById('userDepartamento').value;
    if (userDepartamento) {
        // Ativa a aba correspondente ao departamento
        try {
            const tabToShow = document.getElementById(`${userDepartamento}-tab`);
            if (tabToShow) {
                new bootstrap.Tab(tabToShow).show();
            }
        } catch (e) {
            console.log('Erro ao ativar aba:', e);
        }
    }

    // Ajusta o layout baseado no tamanho da tela
    adjustLayoutForScreenSize();
});

// Função para alternar o modo escuro
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    // Salva a preferência do usuário
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Verifica se o modo escuro estava ativo
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

// Função para exportar os dados do usuário
window.exportUserData = function () {
    // Coleta os dados do usuário diretamente dos campos do perfil
    const userData = {
        informacoesPerfil: {
            perfilAtivo: true,
            nomeCompleto: document.getElementById('userName').value,
            emailInstitucional: document.getElementById('userEmail').value,
            matricula: document.getElementById('userMatricula').value,
            departamento: document.getElementById('userDepartamento').value,
            status: document.getElementById('userStatus').value,
            avatar: currentAvatarImg.src,
            ultimaAtualizacao: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
        },
        estatisticas: {
            agendamentos: document.getElementById('agendamentos') ? document.getElementById('agendamentos').textContent.trim() : 12,
            horasReservadas: document.getElementById('horasReservadas') ? document.getElementById('horasReservadas').textContent.trim() : '36h',
            labsUtilizados: document.getElementById('labsUtilizados') ? document.getElementById('labsUtilizados').textContent.trim() : 5
        }
    };

    // Converte para JSON
    const dataStr = JSON.stringify(userData, null, 2);

    // Cria um objeto Blob
    const blob = new Blob([dataStr], { type: 'application/json' });

    // Cria um link temporário
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meus_dados_unilab.json';

    // Simula um clique no link
    document.body.appendChild(a);
    a.click();

    // Limpa
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showNotification('Dados exportados com sucesso!', 'success');
    }, 100);
};

// Adicionando funções para melhorar a responsividade

// Ajustar layout baseado no tamanho da tela
function adjustLayoutForScreenSize() {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 992;

    // Ajusta tamanho das grades de avatar para diferentes tamanhos de tela
    const avatarGrids = document.querySelectorAll('.avatar-selection-grid');
    avatarGrids.forEach(grid => {
        if (isMobile) {
            grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(60px, 1fr))';
        } else if (isTablet) {
            grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(75px, 1fr))';
        } else {
            grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(90px, 1fr))';
        }
    });

    // Ajusta o preview do avatar para diferentes tamanhos de tela
    const previewSelections = document.querySelectorAll('.current-selection');
    previewSelections.forEach(preview => {
        if (isMobile) {
            preview.style.width = '120px';
            preview.style.height = '120px';
        } else if (isTablet) {
            preview.style.width = '150px';
            preview.style.height = '150px';
        } else {
            preview.style.width = '180px';
            preview.style.height = '180px';
        }
    });
}

// Adiciona o listener para o redimensionamento da janela
window.addEventListener('resize', adjustLayoutForScreenSize);

// Inicializa o ajuste de layout quando a página carrega
document.addEventListener('DOMContentLoaded', function () {
    // Melhora a experiência em dispositivos móveis para o modal
    const avatarModal = document.getElementById('avatarModal');
    if (avatarModal) {
        avatarModal.addEventListener('shown.bs.modal', function () {
            adjustLayoutForScreenSize();

            // Scroll suave para as abas em dispositivos móveis
            const tabsContainer = document.getElementById('avatarTabs');
            if (tabsContainer) {
                tabsContainer.addEventListener('scroll', function (e) {
                    e.stopPropagation();
                });

                // Centralizar aba ativa no scroll horizontal
                const activeTab = tabsContainer.querySelector('.nav-link.active');
                if (activeTab && window.innerWidth < 768) {
                    const tabCenter = activeTab.offsetLeft + (activeTab.offsetWidth / 2);
                    const containerCenter = tabsContainer.offsetWidth / 2;
                    tabsContainer.scrollLeft = tabCenter - containerCenter;
                }
            }
        });
    }
});

// Função para mostrar mensagem de agradecimento
function showThankYouMessage() {
    const speechBubble = document.querySelector('.avatar-speech-bubble');
    // Agora temos 12 mensagens em vez de 5
    const randomNum = Math.floor(Math.random() * 12) + 1;

    // Remove todas as classes de mensagem anteriores
    for (let i = 1; i <= 12; i++) {
        speechBubble.classList.remove(`message-${i}`);
    }

    // Adiciona uma mensagem aleatória
    speechBubble.classList.add(`message-${randomNum}`);

    // Mostra o balão
    speechBubble.classList.add('show');

    // Esconde após 5 segundos
    setTimeout(() => {
        speechBubble.classList.remove('show');
    }, 5000);
}

// Função para registrar alterações no histórico
function addToHistory(action, details) {
    const history = JSON.parse(localStorage.getItem('profileHistory')) || [];
    history.unshift({
        action,
        details,
        date: new Date().toLocaleString('pt-BR')
    });
    // Mantém apenas os 20 registros mais recentes
    localStorage.setItem('profileHistory', JSON.stringify(history.slice(0, 20)));
}

// Função para exibir o histórico na interface
function renderHistory() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    const history = JSON.parse(localStorage.getItem('profileHistory')) || [];
    historyList.innerHTML = history.length === 0
        ? '<li class="list-group-item">Nenhuma atividade registrada.</li>'
        : history.map(item => `
            <li class="list-group-item">
                <strong>${item.action}</strong> - ${item.details}
                <br><small class="text-muted">${item.date}</small>
            </li>
        `).join('');
}

// Ao carregar a página, renderiza o histórico
document.addEventListener('DOMContentLoaded', function () {
    // ...existing code...
    renderHistory();
    // ...existing code...
});