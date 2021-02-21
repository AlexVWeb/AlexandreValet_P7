const http = require('http');
const app = require('./app');
const Message = require("./models/Message");

const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const server = http.createServer(app);


const io = require('socket.io')(server, {
    cors: {
        origin: process.env.APP_URL,
        methods: ["GET", "POST"],
        credentials: true
    },
    allowEIO3: true
});
let interval;

io.on("connection", (socket) => {
    // console.log("New client connected");
    if (interval) {
        clearInterval(interval);
    }

    socket.on("message", async (message) => {
        await (new Message()).createTable()
        console.log(message)
        let insert = (new Message()).insert({
            userID: message.user.id,
            date: message.date,
            content: message.content
        })
        console.log(insert)
        socket.broadcast.emit("newMessage", message);
    });

    socket.on("disconnect", () => {
        // console.log("Client disconnected");
        clearInterval(interval);
    });
});

server.on('error', errorHandler);
server.listen(port, () => console.log(`Listening on port ${port}`));