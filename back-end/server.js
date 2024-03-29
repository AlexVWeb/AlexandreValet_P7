const http = require('http');
const app = require('./app');
const Message = require("./models/Message");
const User = require("./models/User");
const fs = require("fs");
const {purgePublicUser} = require("./controllers/user");

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

    socket.on("message", async (message, callback) => {
        await (new Message()).createTable()
        const userMessage = await (new User()).findById(message.user.id)
        if (userMessage) {
            let insert = await (new Message()).insert({
                userID: message.user.id,
                date: message.date,
                content: message.content
            })
            message.id = insert.insertId
            callback({
                message
            })
            socket.broadcast.emit("newMessage", message);
        }
    });

    socket.on("message.delete", async ({id, currentUser}) => {
        const userMessage = await (new Message()).exist(id)
        console.log(userMessage)
        if (userMessage) {
            if (currentUser.role === "ROLE_MEMBER" && currentUser.userId === userMessage.user_id ||
                currentUser.role === "ROLE_ADMIN") {
                if (userMessage.image) {
                    fs.unlink(`uploads/${userMessage.image}`, async () => {
                        await (new Message()).delete(id)
                    })
                } else {
                    await (new Message()).delete(id)
                }
                socket.broadcast.emit("message.deleted", id)
            }
        }
    })

    socket.on("user.role", async ({id, role, currentUser}) => {
        const getUser = purgePublicUser(await (new User()).findById(currentUser.userId))
        if (getUser.roles === 'ROLE_ADMIN' && getUser.id !== id) {
            socket.broadcast.emit("user.newRole", {id, role})
            await User.updateOne(id, 'roles', JSON.stringify([role]))
        }
    })

    socket.on('disconnect', () => {
        clearInterval(interval);
    })
});
global.io = io;

server.on('error', errorHandler);
server.listen(port, () => console.log(`Listening on port ${port}`));