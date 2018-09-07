module.exports = function(app, http) {
    const io = require('socket.io')(http);
    const path = require("path");
    let chatroom;
    let nsp;


    app.get("/messages/:chatroom", (req, res) => {
        chatroom = "/chat/" + req.params.chatroom;
        nsp = io.of(chatroom);

        res.redirect(chatroom);
    })

    app.get("/chat/:chatroom", (req, res) => {
        res.render("socket", { mynsp: chatroom });
        
        nsp.on('connection', function(socket){
            socket.removeAllListeners();
            socket.on('chat message', function(msg){
                socket.broadcast.emit('chat message', msg);
            });
    
            // socket.on('disconnect', function(){
                // possibly broadcast this to other user so they know this person is gone?
            // });
        });
    });
}