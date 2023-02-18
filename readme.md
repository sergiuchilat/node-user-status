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
    "status": string,
    "time": datetime
}
```

Response:
```
{
    "data": {
        "user": "3",
        "status": "busy",
        "time": "2023-02-18 16:33:13"
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
            "time": "2023-02-18 16:40:29"
        },
        {
            "user": "2",
            "status": "busy",
            "time": "2023-02-18 16:40:27"
        },
        {
            "user": "3",
            "status": "busy",
            "time": "2023-02-18 16:40:24"
        }
    ]
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