const http = require('http');
const url = require('url');
const fs = require('fs');

// Criação do servidor
const server = http.createServer((req, res) => {
    // Roteamento de solicitações
    const path = url.parse(req.url).pathname;

    if (req.method === 'POST' && path === '/save') {
        let body = '';
        
        // Receber dados do formulário
        req.on('data', (data) => {
            body += data;
        });

        // Processar os dados recebidos
        req.on('end', () => {
            const formData = JSON.parse(body);
            // Aqui você pode salvar os dados em um banco de dados, arquivo, ou realizar outras operações

            // Envie uma resposta de confirmação ao cliente
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Dados recebidos com sucesso!');
        });
    } else {
        // Servir a página HTML
        fs.readFile('tens.html', (err, data) => {
            if (err) {
                res.writeHead(404);
                res.write('404 - Página não encontrada');
                return res.end();
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            return res.end();
        });
    }
});

// Define a porta em que o servidor irá escutar
const PORT = process.env.PORT || 3000;

// Inicia o servidor
server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
