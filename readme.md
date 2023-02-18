# Instalation 
1. Run ``nmp install``
2. Run ``nodemon src/index.js``

# Statuses description

Available statuses:
- available - user is online and available 
- busy - user is online but is busy

Generated status:
- away - is generated from available or busy after a timeout

# REST API documentation

## Ping user activity

Request method: POST

Request URL ``/users/ping?key=env.ACCESS_KEY``

Request body:
```
{
    "id": id,
    "status": string
}
```

Response:
```
{
    "data": {
        "available": 12,
        "busy": 2,
        "away": 8
    }
}
```

## Get list of users in a specified status

Request method: GET

Request URL ``/users/list/{status}?key=env.ACCESS_KEY``

> status = all: will return all useers

Request body:
```
NULL
```

Response:
```
{
    "data": [
        {
            "user": "1",
            "status": "busy",
            "time": 1676735121
        },
        {
            "user": "2",
            "status": "away",
            "time": 1676735121
        },
        {
            "user": "3",
            "status": "available",
            "time": 1676735121
        }
    ]
}
```

## Count users grouped by status

Request method: GET

Request URL ``/users/count?key=env.ACCESS_KEY``


Request body:
```
NULL
```

Response:
```
{
    "data": {
        "available": 6,
        "busy": 19,
        "away": 22
    }
}
```


## Flush database - will clear all data

Request method: GET
Request URL ``/database/clear?key=env.ACCESS_KEY_SYSTEM``

> status = all: will return all useers

> will be used ACCESS_KEY_SYSTEM

Request body:
```
NULL
```

Response:
```
{
    "data": "success"
}
```

# Socket documentation

# Track user activity

Emit event to socket.

Event name: ``user-ping``

Event message 
```
{
    "id": 1,
    "status": "available"
}
```

## Get list of users in a specified status

Listen event.

Event name: ``online-users-list``

Response:
```
{
    "data": [
        {
            "user": "1",
            "status": "busy",
            "time": 1676735121
        },
        {
            "user": "2",
            "status": "away",
            "time": 1676735121
        },
        {
            "user": "3",
            "status": "available",
            "time": 1676735121
        }
    ]
}
```

## Count users grouped by status

Listen event.

Event name: ``online-users-count``

Response:
```
{
    "data": {
        "available": 6,
        "busy": 19,
        "away": 22
    }
}
```