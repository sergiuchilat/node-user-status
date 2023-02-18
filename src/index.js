const express = require('express');
require('dotenv').config()
const app = express();
app.use(express.json());
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { InMemoryDatabase } = require('in-memory-database');

const database = new InMemoryDatabase();

const accessGranted = (key, level = '') => {
    if(level === 'SYSTEM'){
        return process.env.ACCESS_KEY_SYSTEM === key;
    }
    return process.env.ACCESS_KEY === key;
    
}

const getUsers = (status = 'all') => {
    const keys = database.keys();
    const users = [];
    keys.forEach(key => {
        const user = {...database.get(key)};

        if(status === 'all' || user.status === status){
            users.push(user)
        }
    })

    return users;
}

const isSupportedStatus = (status) => ['all', 'available', 'busy', 'away'].includes(status);

app.post('/users/ping', (request, response) => {
    if(!accessGranted(request.query.key)){
        response.send({'error': 'access-denied'})
        return;
    }
    try{
        const status = request.body.status;
        if(!isSupportedStatus(status)){
            response.send({'error': 'invalid-status'});
            return;
        }
        database.set(request.body.user, request.body);
        response.send({
            data: database.get(request.body.user)
        })
    } catch(e){
        response.send({
            error: e
        });
    }
})

app.get('/users/list/:status', (request, response) => {
    if(!accessGranted(request.query.key)){
        response.send({'error': 'access-denied'})
        return;
    }
    try{   
        const status = request.params.status;
        if(!isSupportedStatus(status)){
            response.send({'error': 'invalid-status'})
            return;
        }
        response.send({
            data: getUsers(status)
        })
    }catch(e){
        response.send({
            errer: e
        });
    }
})

app.get('/users/count', (request, response) => {
    if(!accessGranted(request.query.key)){
        response.send({'error': 'access-denied'})
        return;
    }
    const counter = {
        available: 0,
        busy: 0,
        away: 0
    }
    try{   
        getUsers('all').forEach(user => {
            counter[user.status]++;
        })
        response.send({
            data: counter
        })
    }catch(e){
        response.send({
            error: e
        });
    }
})

app.get('/database/clear', (request, response) => {
    if(!accessGranted(request.query.key, 'SYSTEM')){
        response.send({'error': 'access-denied'})
        return;
    }
    try{   
        database.flush();
        response.send({
            data: 'success'
        })
    }catch(e){
        response.send({
            error: e
        });
    }
})

app.listen(process.env.SERVER_PORT, process.env.SERVER_URL, () => {
    console.log(`Example app listening on port ${process.env.SERVER_PORT}`)
})