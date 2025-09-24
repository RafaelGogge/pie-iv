# UniLab - Sistema de Gerenciamento de Laboratórios

Sistema web para gerenciamento de perfis de usuários e laboratórios universitários.

## 📁 Estrutura do Projeto

```
pie-iv - Copia/
├── 📄 perfil.html              # Página principal
├── 📁 js/                      # Scripts JavaScript
│   ├── 📄 main.js             # Arquivo principal da aplicação
│   ├── 📁 modules/            # Módulos principais
│   │   ├── 📄 profileManager.js   # Gerenciamento de perfis
│   │   ├── 📄 avatarManager.js    # Gerenciamento de avatares
│   │   └── 📄 profileUI.js        # Interface de usuário
│   └── 📁 utils/              # Utilitários
│       ├── 📄 helpers.js          # Funções auxiliares
│       └── 📄 notifications.js    # Sistema de notificações
├── 📁 css/                     # Estilos
│   └── 📄 perfil.css          # Estilos principais
├── 📁 assets/                  # Recursos estáticos
│   ├── 📁 images/             # Imagens
│   │   └── 📄 LogoUnilab.png  # Logo da aplicação
│   └── 📁 avatares/           # Avatares por departamento
│       ├── 📁 computacao/     # Avatares de Computação
│       ├── 📁 biologia/       # Avatares de Biologia
│       ├── 📁 fisica/         # Avatares de Física
│       └── 📁 quimica/        # Avatares de Química
└── 📄 README.md               # Este arquivo
```

## 🚀 Funcionalidades

### ✅ Gerenciamento de Perfis
- **Cadastro** de novos perfis de usuários
- **Edição** de perfis existentes
- **Exclusão** de perfis com confirmação
- **Validação** em tempo real de dados duplicados
- **Exportação** de dados em formato JSON

### ✅ Sistema de Avatares
- **Seleção** de avatares temáticos por departamento
- **Preview** instantâneo de avatares
- **Persistência** de avatar selecionado

### ✅ Validações
- **Email único** - Impede cadastro de emails duplicados
- **Matrícula única** - Impede cadastro de matrículas duplicadas
- **Campos obrigatórios** - Validação de preenchimento
- **Feedback visual** - Indicação de campos válidos/inválidos

### ✅ Interface
- **Design responsivo** - Funciona em mobile e desktop
- **Notificações toast** - Feedback visual para ações
- **Abas organizadas** - "Meu Perfil" e "Perfis Cadastrados"
- **Modo escuro** - Alternância de tema (se implementado)

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilos e animações
- **JavaScript ES6+** - Lógica da aplicação com módulos
- **Bootstrap 5** - Framework CSS e componentes
- **Bootstrap Icons** - Ícones
- **LocalStorage** - Persistência de dados no navegador

## 📋 Como Usar

### 1. Abrir a Aplicação
- Abra o arquivo `perfil.html` em um navegador web moderno
- Certifique-se de que o navegador suporta ES6 modules

### 2. Cadastrar Perfil
1. Preencha os campos obrigatórios na aba "Meu Perfil"
2. Selecione um avatar clicando em "Alterar Avatar"
3. Clique em "Salvar Alterações"

### 3. Visualizar Perfis
- Acesse a aba "Perfis Cadastrados" para ver todos os perfis salvos
- Use os botões "Editar" ou "Excluir" para gerenciar perfis

### 4. Exportar Dados
- Use o botão "Exportar Dados" para baixar todos os perfis em JSON

## 🔧 Desenvolvimento

### Estrutura Modular
O código foi organizado em módulos para melhor manutenção:

- **ProfileManager**: Gerencia CRUD de perfis e validações
- **AvatarManager**: Controla seleção e persistência de avatares  
- **ProfileUI**: Interface e interações com usuário
- **NotificationSystem**: Sistema de notificações toast
- **Helpers**: Utilitários e funções auxiliares

### Validações Implementadas
- ✅ Validação de email único
- ✅ Validação de matrícula única
- ✅ Validação de campos obrigatórios
- ✅ Validação em tempo real
- ✅ Feedback visual de erros

### Recursos Técnicos
- ✅ ES6 Modules para organização
- ✅ Classes e métodos modernos
- ✅ LocalStorage para persistência
- ✅ Tratamento de erros
- ✅ Código limpo e documentado

## 📝 Autor

**Rafael V. Gogge**  
Copyright © 2025 Rafael V. Gogge  
Projeto: UniLab - Sistema de Gerenciamento de Laboratórios

## 📄 Licença

Este projeto está sob a licença especificada no arquivo `LICENSE`.

---

**Status**: ✅ **Pronto para Produção**

Todas as funcionalidades principais foram implementadas e testadas. O código está organizado, documentado e otimizado para manutenção.