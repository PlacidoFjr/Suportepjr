let lastScroll = 0;
const header = document.querySelector('.header');
let scrollTimer = null;

window.addEventListener('scroll', () => {
    // Limpa o timer anterior
    if (scrollTimer !== null) {
        clearTimeout(scrollTimer);
    }

    const currentScroll = window.pageYOffset;
    
    // Ignora pequenas mudanças de scroll
    if (Math.abs(currentScroll - lastScroll) < 5) return;

    // Esconde o header quando rola para baixo
    if (currentScroll > lastScroll && currentScroll > 50) {
        header.classList.add('header-hidden');
    } 
    // Mostra o header quando rola para cima
    else {
        header.classList.remove('header-hidden');
    }

    lastScroll = currentScroll;

    // Define um timer para remover a classe após parar de rolar
    scrollTimer = setTimeout(() => {
        if (currentScroll <= 50) {
            header.classList.remove('header-hidden');
        }
    }, 150);
}, { passive: true }); // Melhora a performance do evento de scroll 