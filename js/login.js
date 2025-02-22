document.getElementById('loginBtn').addEventListener('click', function(e) {
    e.preventDefault();
    
    // Adiciona classe de loading
    this.classList.add('loading');
    
    // Simula processo de login
    setTimeout(() => {
        this.classList.remove('loading');
        // Aqui você adiciona sua lógica de login
    }, 2000);
}); 