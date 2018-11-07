var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var users = [];


io.on('connection', function(socket){

    var userId;

    socket.on('send_message', (obj) => {
        io.sockets.in(obj.to).emit('receive_message', obj);
    });

    socket.on('join', (data) => {
        userId = data.email;
        users = users.filter(u=> u != data.email);
        users.push(data.email);
        socket.join(data.email, ()=>{
            
            io.sockets.in(data.email).emit('get_all_users', users);

            users.map(u=>{
                u != data.email ? io.sockets.in(u).emit('connect_user', data.email) : false;
            });
        });
    });

    socket.on('disconnect', () => {
        if(userId != undefined){
            users.map(u=>{
                u != userId ? io.sockets.in(u).emit('dis_connect', userId) : false;
            });
            users = users.filter(u => u != userId);
        }
    });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});