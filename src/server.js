require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const usersPortal = require('./routes/usersPortal'); 
const PORT = process.env.PORT || 3000;
const app = express();
const bodyParser = require('body-parser');
const path = require('path');


app.use('/userimages', express.static(path.join(__dirname, '../public/userimages')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  exposedHeaders: 'Content-Length,X-Kuma-Revision',
  credentials: true,
  maxAge: 600
}));

app.use(cors());
app.use(express.json());

app.use('/api/users', usersPortal);
app.get('/', (req, res) => {
  res.send('Server started');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
