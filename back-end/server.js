const http = require('http');
const app = require('./app');
const Message = require("./models/Message");
const User = require("./models/User");

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
    }
});

let interval;
io.on("connection", (socket) => {
    if (interval) {
        clearInterval(interval);
    }

    socket.on("message", async (message) => {
        await (new Message()).createTable()
        //TODO: Check if user exist
        await (new Message()).insert({
            userID: message.user.id,
            date: message.date,
            content: message.content
        })
        socket.broadcast.emit("newMessage", message);
    });

    socket.on("message.delete", async ({id, currentUser}) => {
        const userMessage = await (new Message()).exist(id)
        if (currentUser.role === "ROLE_MEMBER" && currentUser.userId === userMessage.user_id ||
            currentUser.role === "ROLE_ADMIN") {
            await (new Message()).delete(id)
        }
        socket.broadcast.emit("message.deleted", id)
    })

    socket.on("user.role", async ({id, role, currentUser}) => {
        const getUser = await (new User()).findById(id)
        // TODO: vérifier si le currentUser à les permissions
        await User.updateOne(id, 'roles', JSON.stringify([role]))
        socket.broadcast.emit("user.newRole", {id, role})
    })

    socket.on('disconnect', () => {
        clearInterval(interval);
    })
});
global.io = io;

server.on('error', errorHandler);
server.listen(port, () => console.log(`Listening on port ${port}`));