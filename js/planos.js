document.addEventListener('DOMContentLoaded', function() {
    // Máscaras para os campos
    const cnpjInput = document.querySelector('input[name="cnpj"]');
    const telefoneInput = document.querySelector('input[name="telefone"]');
    
    // Máscara CNPJ
    if(cnpjInput) {
        cnpjInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 14) value = value.slice(0, 14);
            
            value = value.replace(/^(\d{2})(\d)/, '$1.$2');
            value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
            value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
            value = value.replace(/(\d{4})(\d)/, '$1-$2');
            
            e.target.value = value;
        });
    }
    
    // Máscara Telefone
    if(telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
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
    }

    // Função para abrir formulário de contratação
    window.abrirFormularioContrato = function(plano) {
        const formContratacao = document.getElementById('form-contratacao');
        formContratacao.classList.remove('hidden');
        
        // Scroll suave até o formulário
        formContratacao.scrollIntoView({ behavior: 'smooth' });
        
        // Armazena o plano selecionado
        formContratacao.dataset.plano = plano;
    }

    // Processar formulário de contratação
    const formContrato = document.getElementById('contrato-form');
    if(formContrato) {
        formContrato.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const planoSelecionado = this.closest('.form-contratacao').dataset.plano;
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            // Validações
            if(!validarCNPJ(data.cnpj)) {
                alert('CNPJ inválido');
                return;
            }
            
            try {
                const btnSubmit = this.querySelector('button[type="submit"]');
                btnSubmit.disabled = true;
                btnSubmit.textContent = 'Processando...';

                // Aqui você pode adicionar a lógica para enviar para seu backend
                const response = await fetch('/api/contratar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        ...data,
                        plano: planoSelecionado
                    })
                });

                const result = await response.json();

                if(result.success) {
                    // Redirecionar para checkout do PagSeguro
                    window.iniciarCheckout(planoSelecionado);
                } else {
                    throw new Error(result.message);
                }

            } catch(error) {
                alert('Erro ao processar contratação: ' + error.message);
            } finally {
                btnSubmit.disabled = false;
                btnSubmit.textContent = 'Prosseguir para Pagamento';
            }
        });
    }

    // Função para validar CNPJ
    function validarCNPJ(cnpj) {
        cnpj = cnpj.replace(/[^\d]/g, '');
        
        if(cnpj.length !== 14) return false;
        
        // Validação completa do CNPJ
        if(/^(\d)\1+$/.test(cnpj)) return false;
        
        let tamanho = cnpj.length - 2;
        let numeros = cnpj.substring(0, tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;
        
        for(let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if(pos < 2) pos = 9;
        }
        
        let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if(resultado != digitos.charAt(0)) return false;
        
        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        
        for(let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if(pos < 2) pos = 9;
        }
        
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if(resultado != digitos.charAt(1)) return false;
        
        return true;
    }
}); 