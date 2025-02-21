const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Configuração do PagSeguro
const PAGSEGURO_CONFIG = {
    email: process.env.PAGSEGURO_EMAIL,
    token: process.env.PAGSEGURO_TOKEN,
    sandbox: process.env.NODE_ENV !== 'production'
};

// Rota para processar pagamento
app.post('/api/payment', async (req, res) => {
    try {
        const { plano, paymentData } = req.body;
        
        const precos = {
            'starter': 42.99,
            'pro': 89.99,
            'servicedesk': 129.99
        };

        const pagamentoData = {
            email: PAGSEGURO_CONFIG.email,
            token: PAGSEGURO_CONFIG.token,
            paymentMode: 'default',
            paymentMethod: 'creditCard',
            currency: 'BRL',
            itemId1: `plano-${plano}`,
            itemDescription1: `Plano ${plano.charAt(0).toUpperCase() + plano.slice(1)}`,
            itemAmount1: precos[plano],
            itemQuantity1: 1,
            reference: `REF${Date.now()}`,
            ...paymentData
        };

        const url = PAGSEGURO_CONFIG.sandbox 
            ? 'https://ws.sandbox.pagseguro.uol.com.br/v2/transactions'
            : 'https://ws.pagseguro.uol.com.br/v2/transactions';

        const response = await axios.post(url, pagamentoData);
        
        res.json({ success: true, data: response.data });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}); 