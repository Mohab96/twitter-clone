# Auth Service

## overview

the goal of this service to handle requests related to the authentication and check if this user is authorized to access a specifc route or not

## API endpoints

| #   | Path                    | Method | Description                                                                                                                                                  |
| :-- | :---------------------- | :----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | `/auth/login`           | `POST` | handle user login request                                                                                                                                    |
| 2   | `/auth/sign-up`         | `POST` | handle user sign-up request                                                                                                                                  |
| 3   | `/auth/change-password` | `POST` | changes the user password                                                                                                                                    |
| 4   | `/auth/change-email`    | `POST` | changes the user email address                                                                                                                               |
| 5   | `/auth/check-route`     | `GET`  | Check whether a route is protected or not. If the route is protected, verify the JWT token and extract the payload, returning it upon successful validation. |

### 1. `POST /auth/login`

this endpoint expects these information in the request body

- `username`
- `password`

example

```json
{
  "username": "username1",
  "password": "password"
}
```

in case of sucess

```json
{
  "status": "Ok",
  "data": {
    "accessToken": "<accessToken>"
  }
}
```

### 2. `POST /auth/sign-up`

this endpoint expects these information in the request body

- `username`
- `email`
- `password`
- `first_name`
- `last_name`
- `age`
- `bio` _optional_
- `date_of_birth` _optional_
- `phone_number` _optional_

  in case of sucess

```json
{
  "status": "Ok",
  "message": "User created"
}
```

### 3. `POST /auth/change-password`

this endpoint expects these information in the request body

- `password`

and there must be a JWT token in `headers.authorization`

in case of sucess

```json
{
  "status": "Ok"
}
```

### 4. `POST /auth/change-email`

this endpoint expects these information in the request body

- `email`
- `password`

and there must be a JWT token in `headers.authorization`

in case of sucess

```json
{
  "status": "Ok"
}
```

### 5. `GET /auth/check-route`

this endpoint expects these information in the request body

- `path`
- `method`
- `token` --> Bearer Token

in case of sucess

- in case of proteced route

```json
{
  "data": { "protected": true, "payload": "payload" },
  "status": "Ok"
}
```

- in case of unproteced route

```json
{
  "status": "Ok",
  "data": { "protected": false }
}
```

## configuration

### environment variables

- please configure these environment variables

```
PORT
ACCESS_TOKEN_SECRET
DATABASE_URL
```

### setup database

please make sure to run these commands before you start the server

```shell
$ npx prisma db pull
$ npx prisma generate
```
