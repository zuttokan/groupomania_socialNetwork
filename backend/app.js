// Express, is a framework for created API
const express = require('express');
// MongoDB, is a schema-less NoSQL document database
const mongoose = require('mongoose');
const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');
require('dotenv').config({ path: './config/.env' });
// Path, gives the path to the file
const path = require('path');
// CORS, is a browser security feature that restricts cross-origin HTTP requests which domains access your resources.
const cors = require('cors');
// create an express application
const app = express();

// connexion to mongoDB
mongoose
  .connect(
    'mongodb+srv://Groupomania:FormationOP@cluster0.h28gvjq.mongodb.net/?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((e) => console.log('Connexion à MongoDB échouée !', e));

// CORS in the header
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

// app.use() allows to assign a middleware to a specific route of the application.
app.use(express.json());
app.use(cors());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/posts', postsRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;
