const API_URL = 'http://localhost:3000/api';

// Funções de formatação
function formatCardNumber(input) {
    let value = input.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    input.value = value.substring(0, 19); // Limita a 16 dígitos + espaços
}

function formatExpiry(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2);
    }
    input.value = value.substring(0, 5); // Limita a MM/AA
}

function formatCVV(input) {
    let value = input.value.replace(/\D/g, '');
    input.value = value.substring(0, 3); // Limita a 3 dígitos
}

// Função para validar cartão
function validarCartao(numero, expiry, cvv) {
    // Validar número do cartão (algoritmo de Luhn)
    const numeros = numero.replace(/\s/g, '');
    if (!/^\d{16}$/.test(numeros)) return false;
    
    let soma = 0;
    let dobrar = false;
    
    for (let i = numeros.length - 1; i >= 0; i--) {
        let digito = parseInt(numeros.charAt(i));
        if (dobrar) {
            digito *= 2;
            if (digito > 9) digito -= 9;
        }
        soma += digito;
        dobrar = !dobrar;
    }
    
    // Validar data de expiração
    const [mes, ano] = expiry.split('/');
    const dataAtual = new Date();
    const anoAtual = dataAtual.getFullYear() % 100;
    const mesAtual = dataAtual.getMonth() + 1;
    
    if (parseInt(ano) < anoAtual || 
        (parseInt(ano) === anoAtual && parseInt(mes) < mesAtual)) {
        return false;
    }
    
    // Validar CVV
    if (!/^\d{3}$/.test(cvv)) return false;
    
    return soma % 10 === 0;
}

function fecharModal() {
    const modal = document.getElementById('payment-modal');
    modal.classList.remove('active');
    // Limpar formulário
    document.getElementById('payment-form').reset();
}

async function iniciarCheckout(plano) {
    try {
        const precos = {
            'starter': 42.99,
            'pro': 89.99,
            'servicedesk': 129.99
        };

        const modal = document.getElementById('payment-modal');
        modal.classList.add('active');

        // Adicionar formatação aos campos
        const cardNumber = document.querySelector('[name="cardNumber"]');
        const cardExpiry = document.querySelector('[name="cardExpiry"]');
        const cardCVV = document.querySelector('[name="cardCVV"]');

        cardNumber.addEventListener('input', () => formatCardNumber(cardNumber));
        cardExpiry.addEventListener('input', () => formatExpiry(cardExpiry));
        cardCVV.addEventListener('input', () => formatCVV(cardCVV));

        // Eventos para fechar
        document.querySelector('.close-modal').onclick = fecharModal;
        document.querySelector('.btn-cancelar').onclick = fecharModal;
        
        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') fecharModal();
        });

        // Fechar clicando fora
        modal.onclick = (e) => {
            if (e.target === modal) fecharModal();
        };

        // Submit do formulário
        document.getElementById('payment-form').onsubmit = async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const cardName = formData.get('cardName');
            const cardNumber = formData.get('cardNumber');
            const cardExpiry = formData.get('cardExpiry');
            const cardCVV = formData.get('cardCVV');

            // Validações
            if (cardName.length < 3) {
                alert('Nome inválido');
                return;
            }

            if (!validarCartao(cardNumber, cardExpiry, cardCVV)) {
                alert('Dados do cartão inválidos');
                return;
            }

            try {
                const loadingBtn = e.target.querySelector('button[type="submit"]');
                loadingBtn.textContent = 'Processando...';
                loadingBtn.disabled = true;

                const response = await fetch(`${API_URL}/payment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        plano,
                        paymentData: {
                            creditCardHolderName: cardName,
                            creditCardNumber: cardNumber.replace(/\s/g, ''),
                            creditCardExpiration: cardExpiry,
                            creditCardCVV: cardCVV
                        }
                    })
                });

                const result = await response.json();
                
                if (result.success) {
                    alert('Pagamento processado com sucesso!');
                    fecharModal();
                } else {
                    alert('Erro ao processar pagamento: ' + result.error);
                }
            } catch (error) {
                alert('Erro ao processar pagamento: ' + error.message);
            } finally {
                loadingBtn.textContent = 'Pagar';
                loadingBtn.disabled = false;
            }
        };
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao processar pagamento');
    }
} 