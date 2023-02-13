<div align="center">

![alt text](../Logo/NotSoBoredGamesTitleAnim.gif)

</div>

___

# System Implementation

In this section, we discuss the the system implementation of the app. We start with a stack architecture and system design overview. Then, we look closely at the middle tier covering Express, Node, RESTful API. After that we move to the front end and go over Angular, before moving on to authentication and deployment and integration.

## Table of contents

* [**Stack architecture and system design**](#Stack-architecture-and-system-design)
   * [Overview of stack](#overview-of-stack)
* [**Back End**](#back-end)
   * [MongoDB](#mongodb)
   * [Mongoose](#mongoose)
   * [Back End : Details of Implementation](#back-end--details-of-implementation)
* [**Middle tier**](#middle-tier)
   * [Express](#express)
   * [Node](#node)
   * [RESTful API](#restful-api)
   * [Middle Tier : Details of Implementation](#middle-tier--details-of-implementation)
* [**Front end**](#front-end)
   * [Front End : Details of Implementation](#front-end--details-of-implementation)
* [**Additional elements and components**](#additional-elements-and-components)
   * [Additional elements: Details of Implementation](#additional-elements-and-components)
* [**Deployment and integration**](#deployment-and-integration)
   * [Deployment: Details of Implementation](#deployment-and-integration)


## Stack architecture and system design

In this section, we will now give a quick overview of the architecture and how it functions. First, let's define key terms, starting with a single page application (SPA). What is a SPA?

<div align="center">

![alt text](../Logo/implementation5.png)

</div>

In an angular app, we have one root index.html file. We serve that from our node server or from a different server (it can be decoupled from node).

This html page includes script imports that houses our angular app, the angular framework and our code. We use that application to dynamically re-render what the user sees without sending a request for a second page to be rendered by the server because we never need to reload the page. We instead navigate to the page directly. We add new elements, helped out by the angular framework. This offers a powerful way to change the page, and provides a really interactive and fast webpage. Instant re-rendering, instant user feedback, and makes building an engaging UI easy to do with the page dynamically re-rendered all the time by Angular.

How does the MEAN stack work then?

### Overview of stack

Let's have a look at the architecture.

<div align="center">

![alt text](../Logo/implementation1.png)

</div>

We have the client side in the browser and the server side where we run our business logic which the user only indiretly uses. In the client side we use angular. On the server-side, we use node.js, expresss and mongoDB (not direcly connected to by Anglar).

Client(browser) is presentation and UI. This can be served by Amazon Web Services (AWS), it doesn't have to be served by the node backend.

<div align="center">

![alt text](../Logo/implementation6.png)

</div>


Sever side we have the business logic, persistent data storage and authentication. Below is a diagram of a MEAN stack request/response data flow between client-server-database:

<div align="center">

![alt text](../Logo/implementation7.png)

</div>

How do we connect these two? We send requests and responses. These are called AJAX (Background) requests and responses. We get JSON formatted data from this.

This is the big picture view of the MEAN stack. Now, let's turn to class and sequence diagrams.


With this information in mind, we will turn our attention to the back-end of the stack and provide a detailed overview of its implementation.

## Back end

<a name="mongodb"></a>
### MongoDB
<div align="center">

![alt text](../Logo/implementation2.png)

</div>

For our database, we used MongoDB. MongoDB is a NoSQL database which stores documents in collections instead of records in tables as with a SQL database. MongoDB stores application data (e.g., users and products) and enforces no data schema or relations. For this reason is is much less strict than a SQL database. It is also easily connected to Node.js and Express. However, importantly, it is not easily connected to Angular for security reasons. But why did we choose MongoDB?

There are several reasons. Firstly, MongoDB is a powerful database that can be easily integrated into a Node/Express environment. For this reason, it was an obvious choice, as we were looking to build our application quickly and with as little problems as possible. The 'M' in MEAN was, therefore, very important to ensure everything worked well and without issues. Secondly, MongoDB is highly scalable. Were we to continue with NotSoBored games and try make it into a business, mongoDB would allow for us to scale in size.

So, why didn't we use a SQL database instead? We decided not to do this because we wanted to use the MEAN stack, which is a recognised stack that enables quick builds, and we also recognised that, for our purposes, we don't require a database to hold data with lots of connections. Instead, the data we will be storing requires very few. Give this fact, we felt it wasn't necessary to use SQL.

<a name="mongoose"></a>
### Mongoose

<div align="center">

![alt text](../Logo/Mongooseicon.png)

</div>

With the MongoDB database working we then looked to create our data model. This was done using Mongoose which is a more straight-forward, schema-based solution of modelling our MongoDB database. Mongoose utilises an object-orientated approach with the creation of an instance of a collection (equivalent to tables in relational databases). These created collections can then be referenced by the API to populate with the required information. This straightforward approach supports the production of the API and allows us to capture and send the data wherever needed for easy front-end use.

### Back End : Details of Implementation

With Lizhao and Harri working on the backend they had to maintain good communication throughout production. Harri was in charge of creating the database structure whilst Lizhao focused her attention on the API. The team collaborated on an initial idea for a schema (collection) shown in the ERD diagram below. The team noted that the priority was the user login information as well as the specific game information such as the Users involved. Furthermore, some extra details were added such as top scores, statistics about the game and any extras such as avatars. This allowed potential to expand the app to have a leaderboard element and some customization.

![alt text](../Logo/ERD1.png)

Upon implementation of this proposed schema we noted a few issues in the design. Firstly, the 'GameManager' part of the collection was largely obsolete and thus was removed. We also decided against the 'avatar' extra for the moment given the large workload we still had. Once all concerns had been discussed between the back-end team, Harri produced the initial database. From there on Lizhao took over in writing her API to write and use the stored data as needed. Lizhao needed to make some final tweaks to the database to work alongside the API. A final Database Class Diagram was produced to represent our database below:

![alt text](../Logo/DatabaseClassDiagram.png)

Based on the diagram, we defined the User schema and Game schema using Mongoose as the following:

[user.js](../server/models/user.js)
```javascript
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema ({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  email: {type: String, required: true},
  name: {type: String},
  surname: {type:String},
  age: {type: Number},
  gender: {type: String},
  location: {type: String},
  wins: {type: Number},
  friends: [{type: String}],
  gamesPlayed: [{
    gamename:{type: String},
    date: {type: Date, default: Date.now},
    playedWith: [{type: String}],
    result:{type: String}}]
});

module.exports = mongoose.model('User', User);
```

[game.js](../server/models/game.js)
```javascript
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Game = new Schema({
    gameName: {type: String, required: true},
    date: {type: Date, default: Date.now},
    players: [{
        username: {type: String, required: true}, //player1's username
        result: {type: String, required: true},
        score: {type: Number}
    }],
    difficultyLevel: {type: String}, // not required
  });

  module.exports = mongoose.model('Game', Game);
```

Having gone over the database implementation, we move to the middle tier of our system.

## Middle tier

Turning to the middle tier, we have Express, Node.js and RESTful API.


<div align="center">

![alt text](../Logo/implementation3.png)

</div>

### Node

Node.js is the language used for the backend. Specifically, it is a server-side library with javascript on the server-side. It listens to requests and responds accordingly. It executes server-side logic and interacts with databases and files.

This is an alternative to PHP.

### Express

Express is a Node.js framework which simplifies writing server-side logic. It is build on top of the node.js framework, and enhances its functionality. It offers the same functionalities as node and is middleware-based, funnelling requests through functions. Its functionality includes routing, view-rendering and more, and depending on the client requests, it uses 'routes' to assist in directing users to different parts of a web application, thereby fast tracking the process improving the speed of server-based applications.  


### RESTful API

RESTful API makes it easy to decouple the backend code from the front end so that it can be used across multiple applications/platforms. To build a RESTful API, we use Node.js as our backend language, express.js to create routes easier and middlewares, and mongodb together with mongoose to create schemas and models and store the data.

### Middle Tier : Details of Implementation

We now give a detailed overview of the API implementation, beginning with the API work flow.

### API Work Flow

- API route:  http://localhost:3000/api
    - Request game data: http://localhost:3000/api/games
    - Request user data: http://localhost:3000/api/users

**Here is a flowchart of how our api will handle a request**

<p align="center">
<img src="../Portfolio/images/api%20call%20flowchart.png">
</p>


**[api.js](../server/routes/api.js)** catches all api routes and sends the requests based on the request data type (game or user) to the corresponding router file (games.js and users.js)

**[games.js](../server/routes/games.js)** handles with all api requests that query about game data (i.e. [Add a new game instance](#Add-a-new-game-instance), [Get top users of a specific game according to the game score](#Get-top-users-of-a-specific-game-according-to-the-game-score))

**[users.js](../server/routes/users.js)** handles with all api requests that query about user data (i.e. [User Register](#User-Register), [User Log in](#User-Log-In), [Get a user's friendlist](#Get-a-user's-friendlist), [Get a user's game history](#Get-a-user's-game-history))

**[middleware.js](../server/routes/middleware.js)** serves as a middleware which prevents unauthorised access without valid token and makes sure every request comes with a valid and unexpired X-Acess-Token.

### Use the HTTP Status Code to identify the Status

**Returned Status Code Specification**

| status code | Meaning                              | Notes                                                        |
| ----------- | ------------------------------------ | ------------------------------------------------------------ |
| 200         | OK                                   | A successful get request                                     |
| 201         | CREATED                              | A successful post/put request                                |
| 204         | DELETED                              | A successful delete request                                  |
| 400         | BAD REQUEST                          | The requested address does not exist or contains an unsupported parameter |
| 401         | UNAUTHORIZED                         | A validation error occurred while checking permission (e.g. invalid username or password) |
| 403         | FORBIDDEN                            |                                                              |
| 404         | NOT FOUND                            |                                                              |
| 409         | CONFLICT                             | A validation error occurred while creating an object, (e.g. conflict username) |
| 422         | Unprocesable entity [POST/PUT/PATCH] | A validation error occurred while creating an object         |
| 500         | INTERNAL SERVER ERROR                |                                                              |


### Error Handling
When an error occurs, the returned HTTP Status Code is 4xx error, such as `400,403,404`. And an error message will be returned to indicate the problem.

**Example response**

case: the user attempts to login with incorrect password

returned status code: `401`

returned data:

```json
{
  error: 'invalid password'
}
```

### API Request & Response data are set in a uniform format using JSON

**Request Overview**

- [x] [User Register](#User-Register)
- [x] [User Log in](#User-Log-In)
- [x] [User Sign out](#User-Log-Out)
- [x] [Get a user 's personal information](#Get-a-user's-personal-information)
- [x] [Get a user's friendlist](#Get-a-user's-friendlist)
- [x] [Get a user's game history](#Get-a-user's-game-history)
- [x] [Update a user's personal information](#Update-a-user's-personal-information)
- [x] [Add a friend to a user's friendlist](#Add-a-friend-to-a-user's-friendlist)
- [x] [Add a new game instance](#Add-a-new-game-instance)
- [x] [Get top users according to winning times](#Get-top-users-according-to-winning-times)
- [x] [Get top users of a specific game according to the game score](#Get-top-users-of-a-specific-game-according-to-the-game-score)

#### User Register

**Request:**

- HTTP Method: `POST`
- Path: `/users`
- Sent data:

```json
{
   "username": "aaa",
   "email": "aaa@email.com",
   "password": "12345"
}
```

**Response:**

- Status code: `201`
- Returned data:

```json
{
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MTk2NTQ0NzI0Nzh9.Ha9QrGrexSwW_qhkXM6Rt6oPTxFmyWzpBUeDTbklvLg",
    "user": "aaa"
}
```


#### User Log In

**Request:**

- HTTP Method: `POST`
- Path: `/users/session`
- Sent data:

```json
{
   "username": "ccc",
   "password": "12345"
}
```

**Response:**

- Status code: `201`
- Returned data:

```json
{
    {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI2MDc4ZTAzZTBiNWEzMDNmNGNmZjJmYTciLCJleHAiOjE2MTk2NTQ1MTIxMzl9.nR3kFnBseD8oeEfcPFrmKe8eLEExRiIzwlUZv_5ABXY",
    "user": "ccc"
    }
}
```

#### User Log Out

**Request:**

- HTTP Method: `DELETE`
- Path: `/users/session`

**Response:**

- Status code: `204`


<a name="Get-a-user's-personal-information"></a>
#### Get a user 's personal information

**Request:**

- HTTP Method: `GET`
- Path: `/users/info/:username`

| parameters | isRequired | explanation |
| ---------- | ---------- | ----------- |
| username   | YES        | username    |

**Response:**

- Status code: `200`
- Returned data:

```json
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

<a name="Get-a-user's-friendlist"></a>
#### Get a user's friendlist

**Request:**

- HTTP Method: `GET`
- Path: `/users/friends/:username`

| parameters | isRequired | explanation |
| ---------- | ---------- | ----------- |
| username   | YES        | username    |

**Response:**

- Status code: `200`
- Returned data:

```json
{
   "friends": [
        "aaa",
        "bbb"
    ]
}
```
<a name="Get-a-user's-game-history"></a>
#### Get a user's game history

**Request:**

- HTTP Method: `GET`
- Path: `/users/games/:username/:limit`

| parameters | isRequired | explanation                                         |
| ---------- | ---------- | --------------------------------------------------- |
| username   | YES        | username                                            |
| limit      | YES        | the number of games returned (from the most recent) |

**Response:**

- Status code: `200`
- Returned data:

```json
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

<a name="Update-a-user's-personal-information"></a>
#### Update a user's personal information

**Request:**

- HTTP Method: `PUT`
- Path: `/users/info/:username`

| parameters | isRequired | explanation |
| ---------- | ---------- | ----------- |
| username   | YES        | username    |

- Sent data:

```json
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

```json
{
    "result": "updated successfully"
}
```
<a name="Add-a-friend-to-a-user's-friendlist"></a>
#### Add a friend to a user's friendlist

**Request:**

- HTTP Method: `POST`
- Path: `/users/friends/:username`

| parameters | isRequired | explanation |
| ---------- | ---------- | ----------- |
| username   | YES        | username    |

- Sent data:

```json
{
   "friendName": "aaa"
}

```

**Response:**

- Status code: `201`
- Returned data:

```json
{
    "result": "friend aaa is added successfully",
    "friends": [
        "bbb",
        "aaa"
    ]
}
```


#### Add a new game instance

**Request:**

- HTTP Method: `POST`
- Path: `/games/memorygame` OR `/games/connect4`
- Sent data:

```json
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

```json
{
    "result": "game added"
}
```


#### Get top users according to winning times

**Request:**

- HTTP Method: `GET`
- Path:  `/users/leaderboard/:limit`

| parameters | isRequired | explanation                        |
| ---------- | ---------- | ---------------------------------- |
| Limit      | YES        | the number of top players returned |

**Response:**

- status code: 200
- Returned data:

```json
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

#### Get top users of a specific game according to the game score

**Request:**

- HTTP Method: `GET`
- Path:  `/games/scores/:gamename/:limit/:order`

| parameters | isRequired | explanation                                                  |
| ---------- | ---------- | ------------------------------------------------------------ |
| Limit      | YES        | e.g. 3 means the top 3 scores                                |
| gamename   | YES        | e.g. memorygame OR connect4                                  |
| order      | YES        | sort order: 1 -> sort in ascending order， 0 -> sort in descending order |

**Response:**

- status code: 200
- Returned data:

```json
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



### User Authentication (Backend)

<p align="center">
<img src="../Portfolio/images/userauth(backend).png">
</p>
<b><p align= "center">user authentication process to deal with a request (backend) </p></b>

To prevent the unauthorized access from the frontend, we implemented the interface authentication with uniform use of Token authentication (based on [JSON Web Token](https://jwt.io/)), which include the following features:

1. The token (JWT string with secret) is created when the user login/signup and will be sent back to the client with the user information.
```javascript

    const token = jwt.encode({
    iss: body.id,
    exp: moment().add( 7, 'days').valueOf()}, 'secret')
    delete body.password
    res.status(201).json({
    token,
    user: body.username
  })
```
2. Interfaces that require authorization must provide the request header field X-Access-Token information

To implement that, we created a [middleware.js](../server/routes/middleware.js) to check the token validity before handling the requests in the server, which can be seen below:

```javascript
exports.check_api_token = (req, res, next) => {
    const token = req.get('x-access-token')
    //check if the request contains a X-Access-Token
    if (!token) {
      return res.status(401).json({
        error: 'Authentication failure: X-Access-Token information could not be found in the request'
      })
    }
   //check if the token is valid
    try {
      const decodedToken = jwt.decode(token, 'secret')
      // check if the token is expired
      if (decodedToken.exp < moment().valueOf()) {
        return res.status(401).json({
          error: 'Authentication failed: Token has expired'
        })
      }
      req.body.userId = decodedToken.iss
      next()
    } catch (err) {
      res.status(401).json({
        error: 'Authentication failed: Invalid Token'
      })
    }
  }
```

### User data protection
In order to keep the password secure before saving to the database, we used [blueimp-md5](https://www.npmjs.com/package/blueimp-md5) to encrypt the user password, which can be seen below:

Case: User Register:
```javascript
   //encrypt password
    body.password = md5(body.password)
```
Case: User Log in:
```javascript
    //check password
    if (md5(body.password) !== targetUser.password) {
        return res.status(401).json({
           error: 'invalid password'
        })
    }
```



We now turn our attention to the front-end of our application.

## Front end

For the front end, we decided to use Angular.

<div align="center">

![alt text](../Logo/implementation4.png)

</div>

Angular is a client-side framework which is really effective at building SPAs. This is because it simultaneously renders UI with dynamic data, handles user input and communicates with the services in the back end. This, in many ways, creates an experience similar to that of a mobile app.

Angular is great for getting creating a professional UI in very little time. The tree of angular components are really useful for several reasons. First, it's easily maintainable. Second, readability is improved. Third, reusability. The details of our front-end implementation now follow.


### Front End : Details of Implementation


Below is an image of the front-end class diagram:

![image](../Portfolio/images/frontend%20tree.png)

And below is the front-end flowchart:

![image](../Portfolio/images/(updated)flowchart%20frontend.png)

### User Authentication (Frontend)

To implement user authentication with Angular in the frontend, we referred to the following struture:

<p align="center">
<img src="../Portfolio/images/userauth%20angular.png">
</p>

<b><p align= "center">User Authentication with Router and HttpInterceptor</p></b>

To introduce the detailed features of how we implement user authentication in the frontend, we'll start with the user registration and login process:

#### User registration and user login

The [`Login`](../src/app/login-page) & [`Register`](../src/app/signup-page) components have forms for submission data (with support of Form Validation). Then, they use [`auth.service`](../src/app/_services/auth.service.ts) which uses Angular `HttpClient` ($http service) for sending signin/signup requests (shown below).

```javascript
export class AuthService {
  private USER_AUTH_API = "http://localhost:3000/api/users";

  constructor(private httpClient: HttpClient) {}

  register(userData: any){
    return this.httpClient.post(this.USER_AUTH_API, userData)
  }

  login(credentials: any){
    return this.httpClient.post(this.USER_AUTH_API+'/session', credentials)
  }

  signout(username: String){
    return this.httpClient.delete(this.USER_AUTH_API+'/session')
  }
}
```

With the functions provided in [`auth.service`](../src/app/_services/auth.service.ts), the client is able to communicate with the backend as shown below:

<p align="center">
<img src="../Portfolio/images/sign%20up.png">
</p>

<b><p align= "center">User Registration Sequence Diagram</p></b>

<p align="center">
<img src="../Portfolio/images/login.png">
</p>

<b><p align= "center">User Log In Sequence Diagram</p></b>

As we can see, the token (JWT) will be generated and returned with every successful login/signup request which will then be needed as a passport for further requests on protected resources. Therefore, the token will be saved to the Browser Session Storage with the use of `token-storage.service`

#### Use token-storage.service to save the token and username to or get the token and username from the Browser Session Storage

The [`token-storage.service`](../src/app/_services/token-storage.service.ts) is an Angular injectable service file which can save the token and username to or get the token and username from the `Browser Session Storage`. This includes the following functions:

```javascript
export class TokenStorageService {
  constructor() { }

  clearToken(): void {
    window.sessionStorage.clear();
    console.log('signed out')
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return window.sessionStorage.getItem(TOKEN_KEY)|| '{}'
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    return window.sessionStorage.getItem(USER_KEY)|| '{}'
  }
}
```

#### Use auth.interceptor to add the token to HTTP Authorization Header before sending request to the backend

Every HTTP request by `$http` service will be inspected and transformed before being sent by [`auth.interceptor`](../src/app/_services/auth.interceptor.ts), which can be seen below:

```javascript
const TOKEN_HEADER_KEY = 'X-Access-Token';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private token: TokenStorageService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let authReq = request;
    const token = this.token.getToken();
    if (token != null) {
      authReq = request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, token)});
    }
    return next.handle(authReq);
  }
}
```

#### Use auth-guard.guard to block unauthorized access to protected routes

We use [`auth-guard.guard`](../src/app/_services/auth-guard.guard.ts) to block the routes from loading based on some permissions or blocking a route based if not authenticated. If the access attemps are unauthorized, we use `router` to navigate to the login page:

```javascript
export class AuthGuard implements CanActivate {
  constructor(private router:Router, private tokenStorageService:TokenStorageService){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token=this.tokenStorageService.getToken()
    if(!token){
      this.router.navigate(['/signin'])
      return false
    }
    return true
  }
}
```

In the [`app-routing.module.ts`](../src/app/app-routing.module.ts), any attempts to access the home page will be passed to [`auth-guard.guard`](../src/app/_services/auth-guard.guard.ts) to check the permission.

An example to use [`auth-guard.guard`](../src/app/_services/auth-guard.guard.ts) in the [`app-routing.module.ts`](../src/app/app-routing.module.ts) can be seen below:

```javascript
  { path: 'home',
    component: HomePageComponent,
    canActivate: [AuthGuard], //Prevent unauthorized access
    children: [
      {
        path: '',
        component: GameMenuComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'leaderboard',
        component: LeaderboardComponent
      }
   ]
 },
 { path: "connect4start", component: StartConnectFourComponent, canActivate: [AuthGuard]},   
```

Therefore, we updated our flowchart to include [`auth-guard.guard`](../src/app/_services/auth-guard.guard.ts):

<p align="center">
<img src="../Portfolio/images/flowchart%20frontend(with%20authguard).png">
</p>


For our front-end, we had a number of separate pages. Each of these pages consisted of a number of components linked together via Angular router. Angular router allowed the user to navigate from one page to another. Let's consider these pages, identify notable features with relevant links to the code.

### Start page

The first page of our application is the start page. This is shown below.


<p align="center">
<img src="../Portfolio/images/startpage.gif" width="100%">
</p>

As mentioned in the subsection on [digital literacy](../Portfolio/Background.md#digital-literacy) in the Background section of this report, a digital game for the elderly should be designed with the needs of the target user in mind. As such, we decided to make the user interface bright, bold and easy to use. So, we decided to have a bright, engaging background, a clear bold title and two buttons, one to 'sign up' and another 'login'. For the `background component`, we added a color changing animation and transparent squares animations to engage the users using CSS. The `title component` was designed with a bouncy animation of the letters to create a happy and vibrant first impression for our users. The two `buttons` were designed with a hover effect for our users to indicate them the next action in a straightforward way. Each of the button will be linked to signup and login page respectively using Angular `Routerlink`.

### Login/sign up page

<div align="center">


![alt text](../Logo/login-page.png)

</div>
<div align="center">


![alt text](../Portfolio/images/formvalidation.png)

</div>

The signup and login page include the static `title component` which inherits the style of the title from the start page, the `background component` and the `reactive form component` provided by Angular. [Angular reactive forms](https://angular.io/guide/reactive-forms) provide a model-driven approach to handling form inputs whose values change over time. In order to validate form input and display useful validation messages, we added the `required` validator to the registration/login forms and used the Angular built-in `NgModel` to check for control states such as `valid` and `dirty` and display messages which can be seen below:

```html
<div class="textbox">
   <i class="fas fa-user"></i>
   <input type="text" placeholder="Username" name="username"  required [(ngModel)]="signUpForm.username" #username="ngModel">
</div>
<div [hidden]="username.valid || username.pristine"class="alert alert-danger">Username is required</div>
```

To check the email format:

```html
<div *ngIf="email.invalid && (email.dirty || email.touched)" class="alert alert-danger">
    <div *ngIf="email.errors">Invalid email address</div>
</div>
```

The submit button will be disabled if the form data is not valid:

```html
<button [disabled]="!registerForm.form.valid" class="btn" type="submit">Sign up</button>
```

As we mentioned earlier in the user authentication part, the user form data recieved from the user input will be transferred to the backend with the use of `authService`. Then, the returned token and username from the API call will be saved to the `browser session storage` with the use of `tokenStorageService` . Once the users are successful logged in, they will be redirected to the home page using `Router`. See the code below:

```typescript
login(){
    const formData = this.checkLoginForm
    this.authService.login(formData).subscribe(
      (data:any)=>{
        this.errMsg = ''
        this.tokenStorageService.saveToken(data.token)
        this.tokenStorageService.saveUser(data.user)
        this.router.navigate(['/home']) //navigate to the home page
      },
      error=>{
        if(error.status === 401) {
          this.errMsg ="invalid username/password"
        }
      }
    )
  }
```

### Home Page

The `home-page` component is the parent component of `game-menu`, `leaderboard` and `profile` components. To navigate between these subcomponents, we choosed to use the `navbar` component from [Bootstrap](https://getbootstrap.com/docs/5.0/getting-started/introduction/). To match the style of our project, the navbar was made as transparent and fixed at the top of the page.
<p align="center">
<img src="../Portfolio/images/home.gif" width="100%">
</p>

Everytime the user hits the home page url, the `navbar` and `background` components will be loaded first before the child components. We included `<router-outlet>` into your `home-page` component to let `Angular` loads child routes' components there. The routes are defined in the `app-routing.module.ts` like this:

```typescript
{
    path: 'home',
    component: HomePageComponent,
    canActivate: [AuthGuard], //Prevent unauthorized access
    children: [
      {
        path: '',
        component: GameMenuComponent //redirect to game menu page by default with the path /home
      },
      {
        path: 'profile', // path : /home/profile
        component: ProfileComponent
      },
      {
        path: 'leaderboard', //path: /home/leaderboard
        component: LeaderboardComponent
      }
    ]
  },
```

Now, we are going to look at the child components of the `home-page` component:

#### Game-menu

<div align="center">


![alt text](../Portfolio/images/homepage.png)

</div>
The `game menu component` is composed of a `title component` and `button group component` which serves as an interface for the specific gameplay page with the two buttons of game names.

#### Leaderboard

<div align="center">

![alt text](../Logo/leaderboard.png)

</div>

The `leaderboard component` is another important part of our product which presents the leading players' names and their winning times. The data is loaded from the backend once the leaderboard component is called.

```typescript
 ngOnInit(): void {
    this.dataService.getWinsLeaderboard(10).subscribe(
      (data:any)=>{
        this.players=data
        console.log(data)
      },
      error=>{
        console.log("fail to load the data")
      }
    )
  }
```


#### Profile

<p align="center">
<img src="../Portfolio/images/profile.gif" width="100%">
</p>

The `profile component` is where the user data is presented. This includes the friendlist, personal information and the recent matches. The "edit profile" button is added for user to update their information. Once it is clicked, we use the [Angular reactive form](https://angular.io/guide/reactive-forms) to collect user information and pass to the backend. For the friendlist, users can choose to view their friend's profile page by clicking on their names and press "back" button to go back to their own profile. The recent matches are presented in a table format which includes the other player's username, the game name, and the date. The table is sorted according to the date. Only the most recent 10 game records will be presented.

### Games

### Memory Game
<p align="center">
<img src="../Portfolio/images/memorygame.png" width="100%">
</p>


The memory game is composed of components for the buttons, cards, heading, and board layout as well as a folder of 'services' which contain the game logic for the cards, gameplay, and leaderboard. Below you can find a brief description of the cards and their functionality:

* **Cards** - The card component consists of an id, an image reference and two simple functions to hide and show the face of the cards during gameplay.
* **Board layout** - The cards are contained within a CSS flexbox set with the times to wrap and flow in rows.

The main game logic is split across two TypeScript files; one for the game logic and one for the card logic. The card logic file consists of two functions. The first of which creates an array of every card required for the game. The second shuffles the cards before playing. When the game service is instantiated, it creates a card service and then gets this shuffled array of cards. When the player takes their turn, the card they selected is pushed onto an activeCards array, and if the proceeding card matches (via a comparison of the card IDs), they remain visible. After each turn is complete, an isGameFinished() function is called, which determines whether all of the cards are visible. If they are, then the game ends.



### Connect 4
<p align="center">
<img src="../Portfolio/images/connect4.png" width="100%">
</p>

The Connect 4 game is not as modularised as the memory game. The game was initially built in vanilla JavaScript and then re-written in TypeScript so that it would function within Angular. The board consists of 49 (7x7) divs that are contained by using CSS flexbox to form a grid structure. After the page has loaded, an event listener is added to each div (via ngAfterViewInit()), so that when the slot is clicked by the user, the game functions according to the ruleset. Depending on which player is currently taking their turn, the div is coloured accordingly and classes are added to determine that the slot is taken and which player has taken it. This prevents users from placing their tokens in slots that have already been taken or slots that do not have tokens below them. To solve this issue at the start of the game, there is a row of invisible divs that have been assigned the "bottom" class, which allows players to place their tokens in the bottom row.  After each turn, the current player type is changed so that players are unable to take two turns in a row. To determine if there is a winner, after each turn has been taken, the board is checked for any of the winning four-in-a-row combinations, all of which are stored in a winningArrays array.

### Page Responsiveness

The following ways were used to make the screen responsive to different variations in screen size, including mobile responsiveness. This was important as we were aware that some users would want to access and view their profile and the leaderboard using their smartphones and/or tablets.

- **Use of media queries**

We added breakpoints where certain parts of the design will behave differently on each side of the breakpoint, such as changing the element sizes, hiding elements on different screen sizes.

For example, we changed the title font size to fit different screen sizes. (See exammples below)

<p align="center">
<img src="../Portfolio/images/login(mobile).png" width="300px">
<img src="../Portfolio/images/signup(mobile).png" width="300px">
<img src="../Portfolio/images/startpage(mobile).png" width="300px">
</p>

For the games, we hid the game choice buttons on screen which has width less that 1440px (the minimal standard size for web page) so that the users are not able to access the game on their mobile devices/tablets.
<p align="center">
<img src="../Portfolio/images/home(mobile.png" width="300px">
</p>


- **Use of Bootstrap's grid system**

[Bootstrap’s grid system](https://getbootstrap.com/docs/4.0/layout/grid/) uses a series of containers, rows, and columns to layout and align content. It’s built with [flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox) and is fully responsive. Based on that, we divided the profile page into 3 columns without a specified width to make the page properly presented on small screens.
<p align="center">
<img src="../Portfolio/images/mobileprofile.gif" width="300px">
</p>


- **Use of Bootstrap's navbar component**

The navigation bar often takes up too much space on a small screen. So, we implemented Bootstrap's navbar component which will be automatically collapsed with a small screen, which can be seen below:

<p align="center">
<img src="../Portfolio/images/navbar.png" width="100%">
</p>
<b><p align= "center">navbar on web page </p></b>
<br>

<p align="center">
<img src="../Portfolio/images/navbar(mobile.png" width="50%">
</p>
<b><p align= "center">navbar on mobile device </p></b>


## Additional elements and components

### Additional elements: Details of Implementation

We now turn to the additional elements and components that were added to our application. We begin by looking at the multiplayer functionality.

## Multiplayer Functionality

## WebSockets
Reliable real-time data communication is essential on the modern Internet. To meet these demands, in 2011 the WebSocket protocol was developed. This protocol allows web applications to send and receive data instantly. It can be used for purposes such as chat applications, location information-based applications or multiplayer games.

The WebSocket protocol works by providing full-duplex (bi-directional, or both ways) communication between the client and a server over a single TCP connection. A HTTP system (which is implemented in your typical webpage) consists of a server that is responsible for responding to HTTP messages from the client; the client sends a request, the server sends a response. With the use of WebSockets, both can send and receive requests simultaneously.

HTTP is stateless, which means that the server does not know where the request is coming from and it treats each request as independent. This functionality is sufficient for the serving of basic webpages, but when data is of increasing complexity and time-sensitivity, such as real-time chat, it falls short. WebSockets are stateful, meaning the server will "remember" the client and can in turn handle the management of communication between multiple clients, or separate groups of clients.

The process of WebSocket communcation is as follows:

* The client sends a HTTP handshake request to the server for a WebSocket connection
* If the server is able to fulfill this request, it sends a successful handshake response, with the HTTP code 101
* The connection is then upgraded from HTTP to a WebSocket connection
* TCP is still the underlying protocol and it is full-duplex, allowing bi-directional communication between the client and server
* When it is time for the connection to terminate, both the client and server can initiate the closing of the connection

![alt text](https://images.techhive.com/images/article/2016/06/websockets-100668229-primary.idge.jpg)

## Socket.io
One of the key objectives of this project was to enable real-time multiplayer functionality for the games that have been developed for the application. Initially APIs such as PubNub and Phaser.io were explored as potential solutions for this. However, on evaluation, a less fully-featured solution such as WebSockets was deemed more appropriate and Socket.io was chosen to implement it.

![alt_text](https://miro.medium.com/max/1624/0*xAADmPJN52Yy6XJV.jpg)

Socket.io is a JavaScript library that enables real-time communication for web applications that is predominantly built on the WebSocket protocol. However, it has additional functionality such as implementing HTTP long-polling if a WebSocket connection cannot be initiated and automatic reconnection.

A typical implementation of Socket.io can be seen below:

#### Server-side
* Create a HTTP server/listener and a Socket.io object

<img width="336" alt="Screenshot 2021-05-07 at 00 16 16" src="https://user-images.githubusercontent.com/29493918/117377857-2018f500-aecc-11eb-9e50-a8a59c928164.png">

* The Socket.io object will then listen on the specified port for a connection and then execute specified code (in this case giving the player a number and emitting the number back to the client)

<img width="398" alt="Screenshot 2021-05-07 at 00 38 10" src="https://user-images.githubusercontent.com/29493918/117378033-856ce600-aecc-11eb-8841-3a66d5b06a57.png">

#### Client-side
* Create a Socket.io connection to a specified port
* Wait for specific messages from the server, or emit specific messages to the server

<img width="419" alt="Screenshot 2021-05-07 at 00 41 44" src="https://user-images.githubusercontent.com/29493918/117378383-36738080-aecd-11eb-99c9-b2df7d191409.png">

### Real-time Video Chat
Along with multiplayer functionality, providing a real-time video chat solution was another key objective. Initially, we had discussed developing a video chat application from the ground up using ASP.NET and Angular, however we decided that focusing our development time on our own application was a more effective use of our time.

We began researching which services would meet our needs. We explored Twilio, PubNub, Sinch and Jitsi. We ultimately ended up choosing Jitsi, as it provided all the functionality we needed, without additional bloat. Providing we kept the Jitsi logo on the video feed, you are also able to leverage their API for free.

<img src="https://jitsi.org/wp-content/uploads/2018/11/jitsi-logo-blue-grey-text.png" width="500" height="400">

Firstly, we needed to call the Jitsi Meet script in the index.html file of the project. We then generated a component to house all of the Jitsi component logic.
At this point, we were then easily able to use the component in any of the other components that required the real-time video chat.

Having now covered the additional elements and components, we now turn our attention to the deployment and integration.

## Deployment and Integration

The deployment of our app utilized the software known as Docker. Compatibility for differing components of our app can be troublesome, alonside OS requirements. Docker allows each component of the app to be ran it's own personalized environment known as a container. This technique is not specific to Docker software but it's functionality and versatility make it one of the best containerising softwares in deployment today.      

![alt text](../Logo/Docker_Image.png)

### Deployment: Details of Implementation

Initially a Dockerfile was created so that the node element of our app could be containerised and served. This allowed us to view the front-end from very early stages in the production.

In preparation for the back-end a wait-script was added which allowed the MongoDB database to always start-up prior to the node element of our app. This allowed synchronisation between the containers.

Once the back-end work had begun we could then create the docker-compose configuration file. This allowed us to containise the database seperate to the node element. Once implemented the back-end could 'talk' to the front-end easily without any trouble. With our multiplayer aspect of the app we needed to tweak the docker-compose slightly to accept some extra ports in order for this to work as expected.

### Deploying to Microsoft Azure
![alt_text](https://miro.medium.com/max/3840/1*_HYOZExV1wV2f0OrfZ9YcA.png)
The platform chosen to deploy a live version of the application was Microsoft's cloud platform Azure as one of our team members, Chris, holds Microsoft-accredited certifcations for the platform. Azure provides Docker support in the form of Azure Container Instances (ACI), which allows the deployment of containers without managing the underlying servers and Azure Container Registry (ACR) for the storage of private Docker container images, which allows easy, scalable deployment.

There are many benefits of using a cloud platform as opposed to your own web server for deploying your applications:

* **Scalability** - as your business grows or your application becomes more popular, if your application is deployed on only one server, it may struggle to keep up with demand. By using cloud servers, you can either scale up (increase the compute power of your instance) or scale out (increase the number of instances on which your application is deployed). You can also use burstable instances, which only scale up or out for a short period whilst your application is experiencing heavy traffic - meaning you only pay for what you need.

* **Integration** - Azure has support for many services that may be of use for your application. For example, it provides integration for MongoDB, Docker, Big Data analytics, cheap scalable storage and IoT solutions.

* **Automation** - Azure provides services such as Logic Apps and Functions, which allow you to automate processes for your systems and minimise the time administrating.

During the project, we deployed our application to Azure by using two different solutions. For the initial testing of the container in a live environment, we deployed the container using the Azure App Service. Azure App Service allows you to deploy a container, or code, using the language or framework of your choice. It is a fully managed platform, meaning you don't have to handle any of the management of the underlying servers, such as patching or scaling. In a production environment, you can also use the built-in CI/CD integration do minimise downtime.

There are different levels of App Service plans. The plan used for this deployment was the Basic Plan, with the B1 instance, information for which can be found below.

<img width="1291" alt="Screenshot 2021-05-08 at 22 48 09" src="https://user-images.githubusercontent.com/29493918/117554442-9e51d480-b04f-11eb-96c0-1182b0653506.png">.

Azure Web Apps only allows you to expose two ports; port 80 for HTTP and port 443 for HTTPS. As the application became more complex through the development of the multiplayer functionality, the WebSockets we were using required exposing ports 3050 and 3080. At this point, we decided the best path to take would be to deploy the application to a tradional web server in the form of an Azure virtual machine (VM). We decided to choose a lightweight Ubuntu 18.04-LTS image, size Standard B2s (2vcpus and 4 GiB memory), deployed to the UK South region.

To prepare the VM to host our application, we logged in via SSH, installed all of the required Docker packages and then built and ran the container on the VM. Initially, the application was accessed via HTTP over port 3000. We decided that we wanted to use the more secure HTTPS protocol. To achieve this, we could have installed a certificate onto the VM and configured the VMs network interface card to forward all traffic for port 443 to port 3000. However, we decided to use another Azure service, Application Gateway, to manage this externally to the VM.

![alt_text](https://docs.microsoft.com/en-us/azure/application-gateway/media/application-gateway-url-route-overview/figure1-720.png)

Application Gateway is a web traffic load balancer that allows you to have full control over the traffic going to your web applications. It allows you to route traffic coming in on certain ports to the load balancer to different ports within your server pool, which we used to route all traffic on port 443 to port 3000. Another feature of Application Gateway that we utilised was the use of end-to-end TLS encryption. With this feature enabled, it meant that we did not need to store any certificates on the VM at all, as all of the traffic SSL/TLS processing was done by the Application Gateway. For the management of the certificate, we used Azure Key Vault, Azure's solution for securely storing and managing keys, secrets and certificates. Application Gateway supports integration with Azure Key Vault, which made it ideal for our use case.

Finally, to make the application accessible, we added a public IP address to the Application Gateway and added a DNS record for our domain. The live server version of our MVP can be found at www.notsoboredgames.co.uk

___

## Navigate

- [Go To Next Section: UX Design](../Portfolio/UX_Design.md)
- [Go To Previous Section: Background](../Portfolio/Background.md)
- [Go Back To Readme](../README.md)
