# 🎨 Estrutura CSS Modular - UniLab

## 📁 Organização dos Arquivos

```
css/
├── main.css                    # Arquivo principal (importa todos os outros)
├── modules/                    # Componentes reutilizáveis
│   ├── navbar.css             # Navegação
│   ├── cards.css              # Cards e containers
│   ├── forms.css              # Formulários e inputs
│   └── avatar.css             # Sistema de avatares
├── pages/                     # Estilos específicos por página
│   ├── dashboard.css          # Dashboard principal
│   ├── cadastro.css           # Página de cadastro
│   ├── lista.css              # Lista de perfis
│   └── edicao.css             # Edição de perfis
└── utils/                     # Utilitários e helpers
    ├── variables.css          # Variáveis CSS
    ├── base.css               # Estilos base globais
    └── utilities.css          # Classes utilitárias
```

## 🎯 Principais Melhorias

### ✅ **Organização Modular**
- Código dividido por responsabilidade
- Fácil manutenção e atualização
- Reutilização de componentes

### ✅ **Performance**
- Carregamento otimizado via CSS imports
- Separação de estilos por página
- Redução de CSS não utilizado

### ✅ **Manutenibilidade**
- Variáveis CSS centralizadas
- Estrutura consistente
- Documentação clara

### ✅ **Flexibilidade**
- Fácil personalização por página
- Sistema de utilitários
- Componentes independentes

## 🔧 Como Usar

### Importação Principal
Todas as páginas agora importam apenas um arquivo:
```html
<link rel="stylesheet" href="css/main.css">
<!-- ou para páginas em subpastas -->
<link rel="stylesheet" href="../css/main.css">
```

### Variáveis CSS Disponíveis
```css
/* Cores */
--primary-color: #030a8c;
--secondary-color: #0511f2;
--accent-color: #0D6EFD;

/* Espaçamento */
--spacing-xs: 0.25rem;
--spacing-sm: 0.5rem;
--spacing-md: 1rem;
--spacing-lg: 1.5rem;
--spacing-xl: 2.5rem;

/* Transições */
--transition-normal: all 0.3s ease;
--transition-bounce: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

/* Sombras */
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 8px rgba(0, 0, 0, 0.2);
--shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.3);
```

### Classes Utilitárias
```css
/* Espaçamento */
.p-md { padding: var(--spacing-md); }
.spacing-lg { margin: var(--spacing-lg); }

/* Efeitos */
.hover-lift:hover { transform: translateY(-5px); }
.transition-normal { transition: var(--transition-normal); }

/* Layout */
.flex-center { display: flex; align-items: center; justify-content: center; }
.flex-between { display: flex; align-items: center; justify-content: space-between; }
```

## 📋 Componentes Disponíveis

### 🧩 **Cards**
```css
.card-base          # Card básico reutilizável
.profile-photo-card # Card específico para foto
.profile-info-card  # Card de informações
```

### 📝 **Formulários**
```css
.form-control       # Campos de entrada estilizados
.form-label         # Labels com ícones
.btn-primary        # Botões com efeitos hover
```

### 👤 **Avatares**
```css
.profile-avatar     # Avatar principal
.avatar-grid        # Grade de seleção
.avatar-option      # Opções de avatar
.avatar-speech-bubble # Balões de fala
```

### 🧭 **Navegação**
```css
.navbar            # Navbar com efeito glass
.nav-link          # Links com transições
```

## 🎨 Personalização

### Adicionando Novos Componentes
1. Crie um arquivo em `css/modules/`
2. Importe no `main.css`
3. Use as variáveis CSS definidas

### Criando Estilos de Página
1. Crie um arquivo em `css/pages/`
2. Importe no `main.css`
3. Use namespacing com classe da página

### Exemplo de Novo Componente:
```css
/* css/modules/notifications.css */
.notification {
    background-color: var(--card-bg);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-md);
    transition: var(--transition-normal);
    box-shadow: var(--shadow-sm);
}

.notification:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
}
```

## 📱 Responsividade

Todos os componentes incluem breakpoints responsivos:
- **Desktop**: > 768px (layout completo)
- **Mobile**: ≤ 768px (layout simplificado)

Utilitários móveis disponíveis:
```css
.mobile-hidden      # Oculta em mobile
.mobile-full-width  # Largura total em mobile
.mobile-text-center # Centraliza texto em mobile
```

## 🔄 Migração do Sistema Antigo

### ❌ **Antes** (perfil.css monolítico):
```html
<link rel="stylesheet" href="css/perfil.css">
```

### ✅ **Agora** (sistema modular):
```html
<link rel="stylesheet" href="css/main.css">
```

### Benefícios da Migração:
- 📦 **Modular**: Fácil de manter
- 🚀 **Performance**: Carregamento otimizado
- 🎯 **Específico**: Estilos por página
- 🔧 **Flexível**: Fácil customização
- 📚 **Documentado**: Estrutura clara

---

**Data**: 23/09/2025  
**Autor**: Rafael V. Gogge  
**Versão**: 2.0