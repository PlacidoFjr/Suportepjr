// FAQ Toggle
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const icon = question.querySelector('.faq-toggle i');
        
        answer.classList.toggle('active');
        icon.classList.toggle('fa-plus');
        icon.toggleClass('fa-minus');
    });
});

// Cookie Consent
const cookieConsent = document.getElementById('cookie-consent');
const acceptCookies = document.getElementById('accept-cookies');

if (cookieConsent && !localStorage.getItem('cookiesAccepted')) {
    cookieConsent.classList.add('active');
}

if (acceptCookies) {
    acceptCookies.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieConsent.classList.remove('active');
    });
}

// Newsletter Form com validação
document.querySelector('.newsletter-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = e.target.querySelector('input');
    const email = emailInput.value;
    
    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, insira um email válido');
        return;
    }
    
    try {
        const response = await fetch('http://localhost:3000/api/newsletter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Obrigado por se inscrever!');
            e.target.reset();
        } else {
            alert('Erro ao se inscrever. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao processar sua inscrição');
    }
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Animação do header ao rolar
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    
    lastScroll = currentScroll;
});

document.addEventListener('DOMContentLoaded', function() {
    // Menu Mobile
    const menuButton = document.querySelector('.menu-mobile');
    const menu = document.querySelector('.menu');

    if (menuButton) {
        menuButton.addEventListener('click', function() {
            this.classList.toggle('active');
            menu.classList.toggle('active');
        });
    }

    // Fechar menu ao clicar em um link
    const menuLinks = document.querySelectorAll('.menu a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            menuButton?.classList.remove('active');
        });
    });

    // Animação ao scroll
    function revelarAoScroll() {
        const elementos = document.querySelectorAll('.stat-item, .step-item, .plano-card, .contato-info, .contato-form');
        const alturaJanela = window.innerHeight;
        
        elementos.forEach(elemento => {
            const elementoTopo = elemento.getBoundingClientRect().top;
            if (elementoTopo < alturaJanela * 0.85) {
                elemento.classList.add('revelado');
            }
        });
    }

    window.addEventListener('scroll', revelarAoScroll);
    revelarAoScroll();

    // ============ FUNÇÕES DOS PLANOS ============
    
    // Configuração dos planos com IDs do PagSeguro
    const planos = {
        starter: {
            nome: 'Helpdesk Starter',
            preco: 42.99,
            periodo: 'mensal',
            pagSeguroId: 'SEU_ID_PLANO_STARTER'
        },
        pro: {
            nome: 'Helpdesk Pro',
            preco: 89.99,
            periodo: 'mensal',
            pagSeguroId: 'SEU_ID_PLANO_PRO'
        },
        servicedesk: {
            nome: 'Servicedesk Pro',
            preco: 129.99,
            periodo: 'mensal',
            pagSeguroId: 'SEU_ID_PLANO_SERVICEDESK'
        }
    };

    // Função para iniciar checkout com PagSeguro
    window.iniciarCheckout = function(plano) {
        const planoSelecionado = planos[plano];
        
        // Configuração do PagSeguro
        PagSeguroDirectPayment.setSessionId('<?php echo $sessionCode; ?>');

        // Criar modal de checkout
        const modal = document.createElement('div');
        modal.className = 'modal-checkout';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h3>Checkout - ${planoSelecionado.nome}</h3>
                <form id="form-pagamento" class="form-checkout">
                    <div class="form-group">
                        <label>Nome completo</label>
                        <input type="text" id="nome" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="email" required>
                    </div>
                    <div class="form-group">
                        <label>Número do Cartão</label>
                        <input type="text" id="numero-cartao" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Validade</label>
                            <input type="text" id="validade" placeholder="MM/AA" required>
                        </div>
                        <div class="form-group">
                            <label>CVV</label>
                            <input type="text" id="cvv" maxlength="4" required>
                        </div>
                    </div>
                    <button type="submit" class="btn-pagar">
                        Pagar R$ ${planoSelecionado.preco.toFixed(2)}/${planoSelecionado.periodo}
                    </button>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Fechar modal
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.onclick = () => modal.remove();

        // Processar pagamento
        const formPagamento = modal.querySelector('#form-pagamento');
        formPagamento.onsubmit = async (e) => {
            e.preventDefault();

            const btnPagar = formPagamento.querySelector('.btn-pagar');
            btnPagar.disabled = true;
            btnPagar.textContent = 'Processando...';

            try {
                // Obter hash do cartão
                const cardNumber = document.querySelector('#numero-cartao').value;
                const cvv = document.querySelector('#cvv').value;
                const expirationDate = document.querySelector('#validade').value;
                
                // Criar token do cartão
                PagSeguroDirectPayment.createCardToken({
                    cardNumber: cardNumber.replace(/\s/g, ''),
                    cvv: cvv,
                    expirationMonth: expirationDate.split('/')[0],
                    expirationYear: '20' + expirationDate.split('/')[1],
                    success: function(response) {
                        // Enviar para seu backend
                        fetch('/processar-pagamento', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                planoId: planoSelecionado.pagSeguroId,
                                token: response.card.token,
                                // outros dados necessários
                            })
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                alert('Pagamento realizado com sucesso!');
                                modal.remove();
                                window.location.href = '/sucesso';
                            } else {
                                throw new Error(data.message);
                            }
                        })
                        .catch(error => {
                            throw error;
                        });
                    },
                    error: function(response) {
                        throw new Error('Erro ao processar cartão');
                    }
                });
            } catch (error) {
                alert('Erro ao processar pagamento: ' + error.message);
            } finally {
                btnPagar.disabled = false;
                btnPagar.textContent = `Pagar R$ ${planoSelecionado.preco.toFixed(2)}/${planoSelecionado.periodo}`;
            }
        };
    };

    // ============ FUNÇÕES DO CONTATO ============
    
    // Validação de email
    function validarEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Validação de telefone
    function validarTelefone(telefone) {
        return /^\(?([0-9]{2})\)?[-. ]?([0-9]{4,5})[-. ]?([0-9]{4})$/.test(telefone);
    }

    // Formulário de Contato
    const formContato = document.getElementById('form-contato');
    if (formContato) {
        formContato.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            // Validações
            if (data.nome?.length < 3) {
                alert('Por favor, insira um nome válido');
                return;
            }

            if (!validarEmail(data.email)) {
                alert('Por favor, insira um email válido');
                return;
            }

            if (data.telefone && !validarTelefone(data.telefone)) {
                alert('Por favor, insira um telefone válido');
                return;
            }

            if (data.mensagem?.length < 10) {
                alert('Por favor, escreva uma mensagem mais detalhada');
                return;
            }

            try {
                // Simulando envio para o backend
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Aqui você integra com seu backend
                console.log('Dados do contato:', data);
                
                alert('Mensagem enviada com sucesso! Retornaremos em breve.');
                this.reset();
            } catch (error) {
                alert('Erro ao enviar mensagem. Por favor, tente novamente.');
            }
        });
    }

    // Máscara para telefone
    const telefoneInputs = document.querySelectorAll('input[type="tel"]');
    telefoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            
            if (value.length > 2) {
                value = `(${value.slice(0,2)}) ${value.slice(2)}`;
            }
            if (value.length > 9) {
                value = `${value.slice(0,9)}-${value.slice(9)}`;
            }
            
            e.target.value = value;
        });
    });

    // Interseção Observer para animações
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.plano-card, .stat-item, .step-item').forEach(item => {
        observer.observe(item);
    });
});
