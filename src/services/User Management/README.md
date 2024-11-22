# User management service

## overview

the purpose of this service is to handle the requests that are related to the user

## API endpoints

| #   | Path                        | Method | Description                  |
| :-- | :-------------------------- | :----: | ---------------------------- |
| 1   | `/api/user/bio`             |  POST  | Change bio of a user         |
| 2   | `/api/user/profile`         |  GET   | get profile info of a user   |
| 3   | `/api/user/profile-pic`     |  POST  | change profile-pic           |
| 4   | `/api/user/cover-pic`       |  POST  | change cover-pic             |
| 5   | `/api/user/username`        |  POST  | change username              |
| 6   | `/api/user/follow`          |  POST  | follow a user                |
| 7   | `/api/user/follow`          | DELETE | unfollow a user              |
| 8   | `/api/user/followers/:id`   |  GET   | get all followers of a user  |
| 9   | `/api/user/followings/:id`  |  GET   | get all followings of a user |
| 10  | `/api/user/profile-pic/:id` |  GET   | get profile-pic of a user    |
| 11  | `/api/user/cover-pic/:id`   |  GET   | get cover-pic of a user      |

### 1. `/api/user/bio`

##### `the auth service must include the userid in the request header since this is a protected route`

- this endpoints is used when trying to change the bio of a user
- the request body should contain the new value for the bio

##### example

```json
{
  "bio": "hello, it's me."
}
```

if the bio is empty, the request body must look like this:

```json
{
  "bio": ""
}
```

##### responses

##### Failures :

`status code: 400`

```json
{
  "status": "Fail",
  "message": "No bio was provided."
}
```

in case that the auth service didn't provide the user id

```json
{
  "status": "Fail",
  "message": "No id was provided."
}
```

```json
{
  "status": "Fail",
  "message": "User not found"
}
```

##### Errors :

`status code: 500`

```json
{
  "status": "Error",
  "error": "information about the error"
}
```

##### success

`status code: 200`

```json
{
  "status": "Ok",
  "data": {
    "bio": "hello, it's me."
  }
}
```

### 2. `/api/user/profile`

- this endpoint is used when trying to get the profile info of a user
- the request body should include one/all of the following : email, id, username

##### example

```json
{
  "username": "jhondoe2"
}
```

```json
{
  "email": "johndoe@example.com"
}
```

```json
{
  "id": 2
}
```

##### responses

##### Failures :

`status code : 400`

```json
{
  "status": "Fail",
  "message": "Please provide an email, username, or id."
}
```

```json
{
  "status": "Fail",
  "message": "User not found"
}
```

##### Errors :

`status code : 500`

```json
{
  "status": "Error",
  "error": "information about the error"
}
```

##### Success :

`status code : 200`

```json
{
  "status": "Ok",
  "data": {
    "first_name": "John",
    "last_name": "Doe",
    "email": "johndoe@example.com",
    "followers_cnt": 1,
    "following_cnt": 1,
    "bio": "Hi iam new here",
    "user_name": "jhondoe2",
    "date_of_birth": "1999-05-15T00:00:00.000Z",
    "created_at": "2024-11-11T15:09:28.033Z"
  }
}
```

### 3. `/api/user/username`

##### `The auth service must include the userid in the request header since this is a protected route`

- This endpoint is used to change a user's username
- The request body should contain the new username value
- The username must be unique across all users

##### Example Request

```json
{
  "username": "newUsername123"
}
```

#### Responses

##### Failures :

`status code: 400`
When no username is provided:

```json
{
  "status": "Fail",
  "message": "No username was provided"
}
```

When the requested username is already taken:

```json
{
  "status": "Fail",
  "message": "Username already in use"
}
```

##### Errors:

`status code: 500`

```json
{
  "status": "Error",
  "error": "information about the error"
}
```

##### Success:

`status code: 200`

```json
{
  "status": "Ok",
  "data": {
    "username": "newUsername123"
  }
}
```

### 4. `POST /api/user/follow`

##### `The auth service must include the userid in the request header since this is a protected route`

- This endpoint is used to follow another user
- The request is processed asynchronously through a queue system
- A user cannot follow themselves

##### Example Request

```json
{
  "id": 123
}
```

#### Responses

##### Failures :

`status code: 400`
When no target user id is provided:

```json
{
  "status": "Fail",
  "message": "please provide the user id you want to follow"
}
```

When the auth service doesn't provide the follower's id:

```json
{
  "status": "Fail",
  "message": "please provide the follower id"
}
```

##### Errors:

`status code: 500`

```json
{
  "status": "Error",
  "error": "information about the error"
}
```

##### Success:

`status code: 200`

```json
{
  "status": "Ok",
  "message": "Server received the request"
}
```

###### Note: The follow request is processed asynchronously. A successful response indicates that the request has been queued for processing, not that the follow action has been completed.

### 5. `DELETE /api/user/follow`

##### `The auth service must include the userid in the request header since this is a protected route`

- This endpoint is used to unfollow a user
- The request is processed asynchronously through a queue system
- A user cannot unfollow themselves

##### Example Request

```json
{
  "id": 123
}
```

#### Responses

##### Failures :

`status code: 400`
When no target user id is provided:

```json
{
  "status": "Fail",
  "message": "please provide the user id you want to unfollow"
}
```

When the auth service doesn't provide the follower's id:

```json
{
  "status": "Fail",
  "message": "please provide the follower id"
}
```

##### Errors:

`status code: 500`

```json
{
  "status": "Error",
  "error": "information about the error"
}
```

##### Success:

`status code: 200`

```json
{
  "status": "Ok",
  "message": "Server received the request"
}
```

###### Note: The unfollow request is processed asynchronously. A successful response indicates that the request has been queued for processing, not that the unfollow action has been completed.

### 6. `/api/user/followers/:id`

- This endpoint retrieves a paginated list of users that are following this user
- The list can be paginated using query parameters
- Returns basic profile information for each followed user

##### Parameters

- Path Parameters:
  `id` (required): The ID of the user whose following list you want to retrieve
  Query Parameters:
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of results per page (default: 10)

##### Example Request

```
GET /api/user/followers/123?page=1&limit=10
```

#### Responses

#### Success:

`status code: 200`

```json
{
  "status": "Ok",
  "data": [
    {
      "first_name": "John",
      "last_name": "Doe",
      "user_name": "johndoe",
      "bio": "Software developer"
    },
    {
      "first_name": "Jane",
      "last_name": "Smith",
      "user_name": "janesmith",
      "bio": "Product designer"
    }
    // ... more users up to the specified limit
  ]
}
```

The success response includes the following information for each user:

- `first_name`: User's first name
- `last_name`: User's last name
- `user_name`: Username
- `bio`: User's biography

##### Errors:

`status code: 500`

```json
{
  "status": "Error",
  "error": "information about the error"
}
```

Note: The response is paginated. To get more results, increment the page parameter. The number of results per page can be adjusted using the limit parameter, with a default of 10 items per page.

### 7. `/api/user/following/:id`

- This endpoint retrieves a paginated list of users that a specific user is following
- The list can be paginated using query parameters
- Returns basic profile information for each user

##### Parameters

- Path Parameters:
  `id` (required): The ID of the user whose following list you want to retrieve
  Query Parameters:
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of results per page (default: 10)

##### Example Request

```
GET /api/user/following/123?page=1&limit=10
```

#### Responses

#### Success:

`status code: 200`

```json
{
  "status": "Ok",
  "data": [
    {
      "first_name": "John",
      "last_name": "Doe",
      "user_name": "johndoe",
      "bio": "Software developer"
    },
    {
      "first_name": "Jane",
      "last_name": "Smith",
      "user_name": "janesmith",
      "bio": "Product designer"
    }
    // ... more users up to the specified limit
  ]
}
```

The success response includes the following information for each user:

- `first_name`: User's first name
- `last_name`: User's last name
- `user_name`: Username
- `bio`: User's biography

##### Errors:

`status code: 500`

```json
{
  "status": "Error",
  "error": "information about the error"
}
```

Note: The response is paginated. To get more results, increment the page parameter. The number of results per page can be adjusted using the limit parameter, with a default of 10 items per page.

### 8. `GET /api/user/profile-pic/:id`

- This endpoint retrieves the profile image of a user
- Returns the user profile image

##### Parameters

- Path Parameters:
  `id` (required): The ID of the user

##### Example Request

```
GET /api/user/profile-pic/2
```

### 9. `GET /api/user/cover-pic/:id`

- This endpoint retrieves the cover image of a user
- Returns the user cover image

##### Parameters

- Path Parameters:
  `id` (required): The ID of the user

##### Example Request

```
GET /api/user/cover-pic/2
```

### 10. `POST /api/user/profile-pic`

- This endpoint updates the profile image of a user

##### Parameters

- the auth service must provide the user id in the request headers
- the request must include the image

##### Example Request

```
GET /api/user/prolfie-pic
```

##### Responses

in case of success

```json
{
  "status": "Ok",
  "message": "Profile image updated"
}
```

### 11. `POST /api/user/cover-pic`

- This endpoint updates the cover image of a user

##### Parameters

- the auth service must provide the user id in the request headers
- the request must include the image

##### Example Request

```
GET /api/user/cover-pic
```

##### Responses

in case of success

```json
{
  "status": "Ok",
  "message": "Cover image updated"
}
```

### environment variables

please make sure to configure these environment variables

```
DATABASE_URL = <database connection string>
PORT
FILE_SERVICE = <file_service_url/api/file>
RMQURL = <rabbitmq server connection string>
```
