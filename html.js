// api/html.js

module.exports = (req, res) => {
    const { query, params } = req;
    const { url } = query;

    if (!url) {
        return res.status(400).send('Opa');
    }

    // Remove a extensão .html
    const urlSemHtml = url.replace('.html', '');

    // Redireciona para a URL sem .html
    res.writeHead(302, { Location: urlSemHtml });
    res.end();
};
