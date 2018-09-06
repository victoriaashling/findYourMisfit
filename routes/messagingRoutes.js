module.exports = function(app, http) {
    const io = require('socket.io')(http);
    const mynsp = "/my-namespace"
    const nsp = io.of(mynsp);
    const path = require("path");


    app.get(mynsp, function(req, res){
        res.render("socket", { mynsp: mynsp });
    });

    nsp.on('connection', function(socket){
        console.log('someone connected');
        socket.on('chat message', function(msg){
            console.log('message: ' + msg);
            nsp.emit('chat message', msg);
        });

        socket.on('disconnect', function(){
            console.log('user disconnected');
        });
    });
}