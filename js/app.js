document.addEventListener('DOMContentLoaded', () => {
    const splash = document.getElementById('splash-screen');
    const mainContent = document.getElementById('main-content');

    // Simula o tempo de carregamento do terminal
    setTimeout(() => {
        splash.style.transition = 'opacity 0.8s ease';
        splash.style.opacity = '0';
        
        setTimeout(() => {
            splash.style.display = 'none';
            mainContent.style.display = 'block';
            document.body.style.overflow = 'auto'; // Habilita scroll
        }, 800);
    }, 3000); // 3 segundos de impacto da marca
});

// Futura função de Login
const loginBtn = document.getElementById('loginBtn');
loginBtn.addEventListener('click', () => {
    alert('Conectando ao Firebase Auth... Em breve você terá acesso exclusivo!');
});
