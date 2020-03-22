const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const socketio = require('socket.io');
const http = require('http');

const routes = require('./routes');

const app = express();
const server = http.Server(app);
const io = socketio(server);

//trocar <user> e <pass> para o usario e senha usados no moongoDB Atlas
mongoose.connect('mongodb+srv://<user>:<pass>@cluster0-fnrs7.mongodb.net/aircnc?retryWrites=true&w=majority',{
  useNewUrlParser: true,
  useUnifiedTopology: true,  
})

const connectedUsers = {};

io.on('connection', socket => {
  const { user_id } = socket.handshake.query;

  connectedUsers[user_id] = socket.id;
});

app.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;

  return next();
})

// GET, POST, PUT, DELETE - verbos
// req.query = Acessar query params (para filtros - GET) 
// req.params = Acessar route params (para edição, delete - PUT e DELETE)
// req.body = Acessar corpo da requisição (para criação, edição - POST e PUT)

app.use(cors());
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(routes);

server.listen(3333);