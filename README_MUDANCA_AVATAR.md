# Registro de Mudança - Correção de Bug e Melhoria de Acessibilidade nos Avatares (17/09/2025)


## Arquivos alterados
- `perfil.html`
- `perfil.js`
## Refatoração JavaScript

Foi realizada uma refatoração na função de seleção de avatar no arquivo `perfil.js` para evitar repetição de código e facilitar a manutenção. Agora, o código utiliza um objeto de mapeamento para identificar dinamicamente o preview do avatar de acordo com o departamento, tornando a lógica mais clara e escalável.

**Antes:**
```js
// ...
let previewId = '';
if (tabId === 'computacao') {
    previewId = 'previewAvatar';
} else if (tabId === 'biologia') {
    previewId = 'previewAvatarBio';
} else if (tabId === 'fisica') {
    previewId = 'previewAvatarFis';
} else if (tabId === 'quimica') {
    previewId = 'previewAvatarQuim';
}
const previewImg = document.getElementById(previewId);
// ...
```

**Depois:**
```js
// ...
const previewIdMap = {
    computacao: 'previewAvatar',
    biologia: 'previewAvatarBio',
    fisica: 'previewAvatarFis',
    quimica: 'previewAvatarQuim'
};
const previewImg = document.getElementById(previewIdMap[tabId] || '');
// ...
```

Essa refatoração reduz a duplicidade, facilita futuras manutenções e ampliações, e deixa o código mais limpo e compreensível.


## Descrição das correções e melhorias
- Corrigido um bug na aba de seleção de avatares do departamento de **Biologia**, onde havia dois itens com o mesmo atributo `data-avatar="biologia-3"`, mas exibindo imagens diferentes. Isso poderia causar seleção incorreta do avatar.
- Agora cada avatar de Biologia possui um `data-avatar` único e correspondente à imagem correta (`biologia-1` até `biologia-6`).
- **Melhoria de acessibilidade:** Todos os avatares dos departamentos de Computação, Biologia, Física e Química receberam descrições detalhadas e específicas no atributo `alt`, facilitando o uso por leitores de tela e promovendo inclusão digital.


## Exemplos das alterações

**Antes:**
```html
<div class="avatar-item" data-avatar="computacao-1">
    <img src="avatares/computacao/computacao-1.png" alt="Avatar Computação 1">
</div>
<div class="avatar-item" data-avatar="fisica-1">
    <img src="avatares/fisica/fisica-1.png" alt="Avatar Física 1">
</div>
<div class="avatar-item" data-avatar="quimica-1">
    <img src="avatares/quimica/quimica-1.png" alt="Avatar Química 1">
</div>
```

**Depois:**
```html
<div class="avatar-item" data-avatar="computacao-1">
    <img src="avatares/computacao/computacao-1.png" alt="Avatar Computação 1 - Robô Azul">
</div>
<div class="avatar-item" data-avatar="fisica-1">
    <img src="avatares/fisica/fisica-1.png" alt="Avatar Física 1 - Átomo">
</div>
<div class="avatar-item" data-avatar="quimica-1">
    <img src="avatares/quimica/quimica-1.png" alt="Avatar Química 1 - Tubo de Ensaio">
</div>
```

---
Essas mudanças garantem que a seleção de avatar funcione corretamente e melhoram a experiência de acessibilidade para usuários de leitores de tela, promovendo inclusão e usabilidade.