const axios = require('axios');
const cors = require('cors');

const firebaseUrl = 'https://banan-85195-default-rtdb.firebaseio.com/.json';

const corsHandler = cors({
  origin: '*',
  methods: '*',
  allowedHeaders: ['Content-Type'],
});

module.exports = async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      if (req.method === 'POST' || req.method === 'PUT') {
        if (!req.body || typeof req.body !== 'object') {
          return res.status(400).json({ message: 'Dados inválidos.' });
        }

        const camposPermitidos = ['address', 'balance', 'key_private', 'salt', 'iv'];
        const chavesRecebidas = Object.keys(req.body);

        if (
          chavesRecebidas.length !== camposPermitidos.length ||
          !chavesRecebidas.every((chave) => camposPermitidos.includes(chave))
        ) {
          return res.status(400).json({ message: 'Campos inválidos.' });
        }

        if (req.body.balance !== 0) {
          return res.status(400).json({ message: 'O valor de balance deve ser 0.' });
        }

        const response = await axios({
          method: req.method.toLowerCase(),
          url: firebaseUrl,
          data: req.body,
          headers: { 'Content-Type': 'application/json' },
        });

        return res.status(200).json({ message: 'Operação bem-sucedida', data: response.data });

      } else {
        const response = await axios.get(firebaseUrl);
        return res.status(200).json(response.data);
      }
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao processar requisição', error: error.message });
    }
  });
};
