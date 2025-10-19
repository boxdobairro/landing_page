const sgMail = require('@sendgrid/mail');

// 1. A chave API é lida da configuração do Azure
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = async function (context, req) {
    context.log('Tentativa de envio de email - V2');
    
    // 2. Extrair dados do formulário
    const { name, email, message } = req.body;
    
    // Verificação de segurança básica
    if (!name || !email || !message) {
        context.res = { status: 400, body: "Por favor, preencha todos os campos." };
        return;
    }

    // 3. Configuração do Email
    const msg = {
        to: 'a.box.do.bairro@gmail.com', // <--- O SEU EMAIL DE RECEÇÃO
        from: 'no-reply@seu-dominio.com', // <--- TEM DE SER UM EMAIL VERIFICADO NO SENDGRID
        subject: `Nova Reserva de Box: ${name}`,
        text: `Nome: ${name}\nEmail: ${email}\nMensagem: ${message}`,
        html: `
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Mensagem:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
        `,
    };

    try {
        // 4. Enviar o email
        await sgMail.send(msg);
        
        // 5. Redirecionar para o início do site após o sucesso
        context.res = {
            status: 302, 
            headers: { 'Location': '/' },
            body: ''
        };
    } catch (error) {
        context.log.error(error);
        context.res = {
            status: 500,
            body: 'Erro interno ao enviar o email. Por favor, tente novamente.'
        };
    }
};
