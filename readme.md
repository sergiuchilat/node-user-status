1. Run ``nmp install``
2. Run ``nodemon src/index.js``

# API documentation

Available statuses:
- available - user is online and available 
- busy - user is online but is busy
- away - user is away

### Ping user activity

Request method: POST

Request URL ``/users/ping?key=env.ACCESS_KEY``

Request body:
```
{
    "user": id,
    "status": string
}
```

Response:
```
{
    "data": {
        "user": "3",
        "status": "busy",
        "time": 1676735121
    }
}
```

### Get list of users in a specified status

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
            "status": "busy",
            "time": 1676735121
        },
        {
            "user": "3",
            "status": "busy",
            "time": 1676735121
        }
    ]
}
```

### Count userers grouped by status

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


### Flush database - will clear all data

Request method: GET
Request URL ``/database/clear?key=env.ACCESS_KEY_SYSTEM``

> status = all: will return all useers

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