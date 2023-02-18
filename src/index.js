require('dotenv').config()
const express = require('express');
const webApp = express();
const bodyParser = require('body-parser');
const http = require('http');
const socketIO = require('socket.io');
const { InMemoryDatabase } = require('in-memory-database');

const user = require('./core/User.js')
const appSecurity = require('./core/AppSecurity.js')

webApp.use(bodyParser.json());
webApp.use(bodyParser.urlencoded({ extended: true }));
webApp.use(express.json());

const socketServer = http.createServer(webApp);
const io = socketIO(socketServer);

const database = new InMemoryDatabase();

user.init(database);

webApp.post('/users/ping', (request, response) => {
    try {
        appSecurity.checkAccess(request.query.key)
        user.validateStatus(request.body.status)
        user.put(request.body);
        //user.updateUsetStatusInTime();
        io.emit('online-users-count', user.countByStatus())
        //io.emit('online-users-list', user.get('all'))
        response.send({
            data: user.countByStatus()
        })
    } catch (e) {
        response.send({error: e.message});
    }
})

webApp.get('/users/list/:status', (request, response) => {
    try {
        appSecurity.checkAccess(request.query.key)
        user.validateStatus(request.params.status)
        //user.updateUsetStatusInTime();
        response.send({
            data: user.get(request.params.status)
        })
    } catch (e) {
        response.send({errer: e.message});
    }
})

webApp.get('/users/count', (request, response) => {
    try {
        appSecurity.checkAccess(request.query.key)
        //user.updateUsetStatusInTime();
        response.send({
            data: user.countByStatus()
        })
    } catch (e) {
        response.send({error: e.message});
    }
})

webApp.get('/database/clear', (request, response) => {
    try {
        appSecurity.checkAccess(request.query.key, 'SYSTEM')
        database.flush();
        response.send({
            data: 'success'
        })
    } catch (e) {
        response.send({error: e.message});
    }
})

webApp.get('/health', (request, response) => {
    try {
        appSecurity.checkAccess(request.query.key)
        response.send({data: 'healthy'})
    } catch (e) {
        response.send({error: e.message});
    }
})

webApp.listen(process.env.SERVER_PORT, process.env.SERVER_URL, () => {
    console.log(`Web app listening on port ${process.env.SERVER_PORT}`)
    setInterval(() => {
        user.updateStatusInTime();
    }, 1000)
})

io.on('connection', (socket) => {
    socket.on('user-ping', (data) => {
        try{
            user.put({ ...data, time: Date.now() });
            io.emit('online-users-count', user.countByStatus())
            //io.emit('online-users-list', user.get('all'))
        } catch(e){
            console.log(e.message);
        }
    });
})

socketServer.listen(process.env.SOCKET_PORT, process.env.SERVER_URL, () => {
    console.log(`Socket IO listening on port 3030`)
});