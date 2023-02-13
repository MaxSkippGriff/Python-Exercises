## API Descriptions / Specification

- API address:  http://localhost:3000/api (default)   ||   http://localhost:${process.env.PORT}/api
- Interface authentication: Uniform use of Token authentication (based on JSON Web Token)
- Interfaces that require authorization must provide the request header field X-Access-Token information
- Use the HTTP Status Code to identify the Status
- The data is transferred in a uniform format using JSON
- User password is encrypted using blueimp-md5
- Web APIs are designed according to the Representational State Transfer (REST) architectural style.
<br>
<br>

### Returned Status Code Specification

| status code | Meaning                              | Notes                                                        |
| ----------- | ------------------------------------ | ------------------------------------------------------------ |
| 200         | OK                                   |                                                              |
| 201         | CREATED                              |                                                              |
| 204         | DELETED                              |                                                              |
| 400         | BAD REQUEST                          | The requested address does not exist or contains an unsupported parameter |
| 401         | UNAUTHORIZED                         | A validation error occurred while checking permission (e.g. invalid username or password) |
| 403         | FORBIDDEN                            |                                                              |
| 404         | NOT FOUND                            |                                                              |
| 409         | CONFLICT                             | A validation error occurred while creating an object, (e.g. conflict username) |
| 422         | Unprocesable entity [POST/PUT/PATCH] | A validation error occurred while creating an object         |
| 500         | INTERNAL SERVER ERROR                |                                                              |

<br>

### Handling Error 

When an error occurs, the HTTP Status Code is 4xx error, such as `400,403,404`

**Example response**

case: the user attempts to login with incorrect password

returned status code: `401`

returned data:

```
{
  error: 'invalid password'
}
```
<br>
<br>

## API Request & Response

**Overview**

- [x] [User Register](#User_Register)
- [x] [User Log in](#User_Log_In)
- [x] [User Sign out](#User_Log_Out)
- [x] [Get a user 's personal information](#Get_a_user's_personal_information)
- [x] [Get a user's friendlist](#Get_a_user's_friendlist)
- [x] [Get a user's game history](#Get_a_user's_game_history)
- [x] [Update a user's personal information](#Update_a_user's_personal_information)
- [x] [Add a friend to a user's friendlist](#Add_a_friend_to_a_user's_friendlist)
- [x] [Add a new game instance](#Add_a_new_game_instance)
- [x] [Get top users according to winning times](#Get_top_users_according_to_winning_times)
- [x] [Get top users of a specific game according to the game score](#Get_top_users_of_a_specific_game_according_to_the_game_score)

<br>
<br>

### User Register

**Request:**

- HTTP Method: `POST`
- Path: `/users`
- Sent data:

```
{
   "username": "aaa",
   "email": "aaa@email.com",
   "password": "12345"
}
```

**Response:**

- Status code: `201`
- Returned data:

```
{
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MTk2NTQ0NzI0Nzh9.Ha9QrGrexSwW_qhkXM6Rt6oPTxFmyWzpBUeDTbklvLg",
    "user": "aaa"
}
```



### User Log In

**Request:**

- HTTP Method: `POST`
- Path: `/users/session`
- Sent data:

```
{
   "username": "ccc",
   "password": "12345"
}
```

**Response:**

- Status code: `201`
- Returned data:

```
{
    {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI2MDc4ZTAzZTBiNWEzMDNmNGNmZjJmYTciLCJleHAiOjE2MTk2NTQ1MTIxMzl9.nR3kFnBseD8oeEfcPFrmKe8eLEExRiIzwlUZv_5ABXY",
    "user": "ccc"
}
}
```

### User Log Out

**Request:**

- HTTP Method: `DELETE`
- Path: `/users/session`

**Response:**

- Status code: `204`



### Get a user 's personal information

**Request:**

- HTTP Method: `GET`
- Path: `/users/info/:username`

| parameters | isRequired | explanation |
| ---------- | ---------- | ----------- |
| username   | YES        | username    |

**Response:**

- Status code: `200`
- Returned data:

```
{
        "username": "aaa",
        "email": "aaa@email.com",
        "name": "aaa" ,
        "surname": "Smith",
        "age": 70,
        "gender": "male",
        "location": "bristol"
}
```

### Get a user's friendlist

**Request:**

- HTTP Method: `GET`
- Path: `/users/friends/:username`

| parameters | isRequired | explanation |
| ---------- | ---------- | ----------- |
| username   | YES        | username    |

**Response:**

- Status code: `200`
- Returned data:

```
{
   "friends": [
        "aaa",
        "bbb"
    ]
}
```

### Get a user's game history

**Request:**

- HTTP Method: `GET`
- Path: `/users/games/:username/:limit`

| parameters | isRequired | explanation                                      |
| ---------- | ---------- | ------------------------------------------------ |
| username   | YES        | username                                         |
| limit      | YES        | the number of games returned (from the most recent) |

**Response:**

- Status code: `200`
- Returned data:

```
{
    "gamesPlayed": [
        {
            "playedWith": [
                "bbb"
            ],
            "_id": "6080bfd26216e5aaeee2049d",
            "gamename": "Memory Game",
            "result": "win",
            "date": "2021-04-22T00:14:10.968Z"
        },
        {
            "playedWith": [
                "bbb"
            ],
            "_id": "6080bfff6216e5aaeee204a2",
            "gamename": "Connect 4",
            "result": "win",
            "date": "2021-04-22T00:14:55.965Z"
        }
    ]
}
```

### Update a user's personal information

**Request:**

- HTTP Method: `PUT`
- Path: `/users/info/:username`

| parameters | isRequired | explanation |
| ---------- | ---------- | ----------- |
| username   | YES        | username    |

- Sent data:

```
{
   "email": "aaa@email.com",
   "name": "aaa" ,
   "surname": "Smith",
   "age": 70,
   "gender": "male",
   "location": "bristol"
}
        
```

**Response:**

- Status code: `201`
- Returned data:

```
{
    "result": "updated successfully"
}
```

### Add a friend to a user's friendlist

**Request:**

- HTTP Method: `POST`
- Path: `/users/friends/:username`

| parameters | isRequired | explanation |
| ---------- | ---------- | ----------- |
| username   | YES        | username    |

- Sent data:

```
{
   "friendName": "aaa"
}
        
```

**Response:**

- Status code: `201`
- Returned data:

```
{
    "result": "friend aaa is added successfully",
    "friends": [
        "bbb",
        "aaa"
    ]
}
```


### Add a new game instance

**Request:**
- HTTP Method: `POST`
- Path: `/games/memorygame` OR `/games/connect4`
- Sent data:
```
{
   "players": [
      {
         "username" : "aaa",
         "result" : "WIN",
         "score": 23  //not required, add it if there is a score
      },
      {
         "username" :"bbb",
         "result": "LOSE"
      }
   ],
   "difficultyLevel": "easy" //if there is a choice of difficulty level
}
```

**Response:**

- status code: 201

```
{
    "result": "game added"
}
```


### Get top users according to winning times

**Request:**

- HTTP Method: `GET`
- Path:  `/users/leaderboard/:limit`

| parameters | isRequired | explanation                        |
| ---------- | ---------- | ---------------------------------- |
| Limit      | YES        | the number of top players returned |

**Response:**

- status code: 200
- Returned data:

```
[
    {
        "username": "aaa",
        "wins": 5
    },
    {
        "username": "bbb",
        "wins": 1
    }
]
```



### Get top users of a specific game according to the game score

**Request:**

- HTTP Method: `GET`
- Path:  `/games/scores/:gamename/:limit/:order`

| parameters | isRequired | explanation                        |
| ---------- | ---------- | ---------------------------------- |
| Limit      | YES        | e.g. 3 means the top 3 scores      |
| gamename   | YES        | e.g. memorygame OR connect4        |
| order      | YES        | sort order: 1 -> sort in ascending order， 0 -> sort in descending order       |

**Response:**

- status code: 200
- Returned data:

```
{
  [
    {
        "score": 19,
        "username": "aaa"
    },
    {
        "score": 20,
        "username": "ddd"
    }
  ]
}
```

