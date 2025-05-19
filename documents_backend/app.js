const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

const documentRoutes = require('./routes/documentRoutes');
app.use('/api/documents', documentRoutes);

app.get('/', (req, res) => {
  res.send('Document Management Backend is running ');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
