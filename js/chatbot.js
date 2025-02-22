let isOpen = false;
const messageSound = new Audio('path/to/message-sound.mp3');
let soundEnabled = true;

// Categorias do sistema
const categorias = {
    suporte: {
        emoji: '🔧',
        titulo: 'Suporte Técnico',
        opcoes: [
            'Computador não liga',
            'Internet lenta',
            'Problemas com software',
            'Backup de dados'
        ]
    },
    vendas: {
        emoji: '💰',
        titulo: 'Vendas',
        opcoes: [
            'Orçamento',
            'Produtos disponíveis',
            'Formas de pagamento',
            'Prazos de entrega'
        ]
    },
    agendamento: {
        emoji: '📅',
        titulo: 'Agendamento',
        opcoes: [
            'Marcar visita técnica',
            'Consultar disponibilidade',
            'Reagendar atendimento',
            'Cancelar agendamento'
        ]
    }
};

// Base de conhecimento para respostas
const knowledgeBase = {
    saudacoes: {
        palavras: ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'hey'],
        respostas: [
            "Olá! Como posso ajudar você hoje?",
            "Oi! Em que posso ser útil?",
            "Olá! Estou aqui para ajudar!"
        ]
    },
    
    servicos: {
        palavras: ['serviço', 'servicos', 'fazem', 'trabalho', 'realizam'],
        respostas: [
            "Oferecemos diversos serviços:\n✅ Manutenção de Computadores\n✅ Instalação de Redes\n✅ Suporte Técnico\n✅ Consultoria em TI\n\nQual serviço você precisa?",
            "Nossa empresa é especializada em:\n🔹 Manutenção de PCs e Notebooks\n🔹 Redes e Infraestrutura\n🔹 Suporte Técnico\n🔹 Consultoria\n\nPosso detalhar algum serviço?"
        ]
    },
    
    precos: {
        palavras: ['preço', 'preco', 'valor', 'quanto', 'custa', 'orçamento'],
        respostas: [
            "Os preços variam conforme o serviço. Posso te passar algumas opções:\n1. Visita técnica: R$XX\n2. Manutenção básica: R$XX\n3. Consultoria: R$XX/hora\n\nQuer um orçamento específico?",
            "Para fazer um orçamento preciso, preciso de alguns detalhes do seu caso. Pode me contar mais sobre o que você precisa?"
        ]
    },
    
    horarios: {
        palavras: ['horário', 'horario', 'funcionamento', 'aberto', 'atendimento'],
        respostas: [
            "📅 Nosso horário de atendimento:\nSegunda a Sexta: 8h às 18h\nSábado: 8h às 12h",
            "Estamos disponíveis:\n⏰ Segunda a Sexta: 8h às 18h\n⏰ Sábado: 8h às 12h\n\nQuer agendar um horário?"
        ]
    },
    
    contato: {
        palavras: ['contato', 'telefone', 'whatsapp', 'email', 'falar'],
        respostas: [
            "Você pode entrar em contato conosco:\n📱 WhatsApp: (71) 99919-5766\n📧 Email: placidojunior34@gmail.com",
            "Quer falar diretamente conosco?\n💬 WhatsApp: (71) 99919-5766\n✉️ Email: placidojunior34@gmail.com"
        ]
    },
    
    problemas: {
        palavras: ['problema', 'computador', 'pc', 'notebook', 'lento', 'internet', 'rede'],
        respostas: [
            "Entendi que você está com um problema técnico. Para melhor atendê-lo, preciso saber:\n1. Qual equipamento?\n2. Qual o problema específico?\n3. Desde quando está acontecendo?",
            "Para resolver seu problema, vou precisar de algumas informações:\n▫️ Descrição do problema\n▫️ Quando começou\n▫️ Já tentou alguma solução?"
        ]
    },
    
    agradecimento: {
        palavras: ['obrigado', 'obrigada', 'valeu', 'thanks', 'grato'],
        respostas: [
            "Por nada! Estou aqui para ajudar! 😊",
            "Disponha! Se precisar de mais alguma coisa, é só chamar! 👍",
            "O prazer é meu em ajudar! 🤝"
        ]
    }
};

function toggleChat() {
    const chatbox = document.getElementById('chatbox');
    const helpButton = document.querySelector('.help-button');
    isOpen = !isOpen;
    
    chatbox.style.display = isOpen ? 'flex' : 'none';
    helpButton.classList.toggle('hidden', isOpen);
    
    if (isOpen && document.getElementById('chat-messages').children.length === 0) {
        checkAvailability();
        sendBotMessageWithDelay("Olá! Como posso ajudar você hoje?");
        mostrarCategorias();
        addQuickButtons();
    }
}

function isBusinessHours() {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    
    if (day >= 1 && day <= 5) {
        return hour >= 8 && hour < 18;
    }
    if (day === 6) {
        return hour >= 8 && hour < 12;
    }
    return false;
}

function checkAvailability() {
    if (!isBusinessHours()) {
        sendBotMessageWithDelay("Olá! Estamos fora do horário de atendimento. "+
            "Deixe sua mensagem e retornaremos no próximo dia útil.\n\n"+
            "Horário de atendimento:\n"+
            "Segunda a Sexta: 8h às 18h\n"+
            "Sábado: 8h às 12h");
    }
}

function mostrarCategorias() {
    let menuHTML = `<div class="categories-menu">`;
    for (let key in categorias) {
        const cat = categorias[key];
        menuHTML += `
            <div class="category-item" onclick="selecionarCategoria('${key}')">
                <span class="category-emoji">${cat.emoji}</span>
                <span class="category-title">${cat.titulo}</span>
            </div>
        `;
    }
    menuHTML += `</div>`;
    
    document.getElementById('chat-messages').insertAdjacentHTML('beforeend', menuHTML);
}

function selecionarCategoria(categoria) {
    const cat = categorias[categoria];
    let opcoesHTML = `<div class="options-menu">`;
    cat.opcoes.forEach(opcao => {
        opcoesHTML += `
            <button onclick="selecionarOpcao('${opcao}')">${opcao}</button>
        `;
    });
    opcoesHTML += `</div>`;
    
    sendBotMessage(`${cat.emoji} ${cat.titulo} - Escolha uma opção:`);
    document.getElementById('chat-messages').insertAdjacentHTML('beforeend', opcoesHTML);
}

function selecionarOpcao(opcao) {
    addMessage(opcao, 'user-message');
    handleBotResponse(opcao);
}

function showTypingIndicator() {
    const messages = document.getElementById('chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator bot-message';
    typingDiv.innerHTML = '<span>.</span><span>.</span><span>.</span>';
    messages.appendChild(typingDiv);
    messages.scrollTop = messages.scrollHeight;
    return typingDiv;
}

function sendBotMessageWithDelay(message) {
    const typingIndicator = showTypingIndicator();
    setTimeout(() => {
        typingIndicator.remove();
        sendBotMessage(message);
        if (soundEnabled) playMessageSound();
    }, 1500);
}

function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    
    if (message) {
        addMessage(message, 'user-message');
        saveChat(message, true);
        input.value = '';
        handleBotResponse(message);
    }
}

function addMessage(text, className) {
    const messages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;
    messageDiv.textContent = text;
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
}

function sendBotMessage(text) {
    addMessage(text, 'bot-message');
}

// Função para encontrar a melhor resposta
function findBestResponse(message) {
    const messageLower = message.toLowerCase();
    let bestMatch = null;
    let maxMatches = 0;

    for (const category in knowledgeBase) {
        const keywords = knowledgeBase[category].palavras;
        let matches = 0;

        for (const word of keywords) {
            if (messageLower.includes(word)) {
                matches++;
            }
        }

        if (matches > maxMatches) {
            maxMatches = matches;
            bestMatch = category;
        }
    }

    if (bestMatch) {
        const responses = knowledgeBase[bestMatch].respostas;
        return responses[Math.floor(Math.random() * responses.length)];
    }

    return "Desculpe, não entendi completamente. Pode reformular sua pergunta? Ou se preferir, entre em contato pelo WhatsApp (71) 99919-5766 para um atendimento mais personalizado.";
}

// Atualizar a função handleBotResponse
function handleBotResponse(userMessage) {
    const response = findBestResponse(userMessage);
    sendBotMessageWithDelay(response);
}

function addQuickButtons() {
    const buttonsHtml = `
        <div class="quick-buttons">
            <button onclick="handleQuickButton('orçamento')">Solicitar Orçamento</button>
            <button onclick="handleQuickButton('horário')">Ver Horários</button>
            <button onclick="handleQuickButton('serviços')">Nossos Serviços</button>
            <button onclick="handleQuickButton('contato')">Contato Direto</button>
        </div>
    `;
    if (!document.querySelector('.quick-buttons')) {
        document.querySelector('.chat-input').insertAdjacentHTML('beforebegin', buttonsHtml);
    }
}

function handleQuickButton(type) {
    const messages = {
        'orçamento': 'Gostaria de solicitar um orçamento',
        'horário': 'Qual o horário de atendimento?',
        'serviços': 'Quais serviços vocês oferecem?',
        'contato': 'Preciso falar com um atendente'
    };
    
    const message = messages[type];
    if (message) {
        addMessage(message, 'user-message');
        handleBotResponse(message);
    }
}

function addFeedbackButtons(messageId) {
    return `
        <div class="feedback-buttons">
            <button onclick="rateChatbot('helpful', ${messageId})">👍</button>
            <button onclick="rateChatbot('unhelpful', ${messageId})">👎</button>
        </div>
    `;
}

function showSuggestions(input) {
    const suggestions = [
        'Qual o horário de atendimento?',
        'Preciso de um orçamento',
        'Como faço para agendar?',
        'Quais serviços vocês oferecem?'
    ];
    
    const matchingSuggestions = suggestions.filter(s => 
        s.toLowerCase().includes(input.toLowerCase())
    );

    // Mostrar sugestões
    if (matchingSuggestions.length > 0) {
        showSuggestionsList(matchingSuggestions);
    }
}

// Histórico e armazenamento
function saveChat(message, isUser) {
    let chatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    chatHistory.push({
        message: message,
        isUser: isUser,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

function loadChatHistory() {
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    chatHistory.forEach(item => {
        addMessage(item.message, item.isUser ? 'user-message' : 'bot-message');
    });
}

// Avaliação de satisfação
function finalizarAtendimento() {
    const satisfacaoHTML = `
        <div class="satisfaction-survey">
            <p>Como foi seu atendimento?</p>
            <div class="rating-buttons">
                <button onclick="avaliarAtendimento(1)">😞</button>
                <button onclick="avaliarAtendimento(2)">😐</button>
                <button onclick="avaliarAtendimento(3)">😊</button>
                <button onclick="avaliarAtendimento(4)">😄</button>
                <button onclick="avaliarAtendimento(5)">😍</button>
            </div>
        </div>
    `;
    
    document.getElementById('chat-messages').insertAdjacentHTML('beforeend', satisfacaoHTML);
}

function avaliarAtendimento(nota) {
    sendBotMessage(`Obrigado pela sua avaliação! ${nota >= 4 ? '😊' : '🙏'}`);
    // Aqui você pode adicionar código para salvar a avaliação
}

// Eventos
document.getElementById('user-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
}); 