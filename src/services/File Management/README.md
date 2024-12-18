# File Management Service

## Overview

the purpose of this service is to manage files that is being uploaded and need to be stored or retrieved.

## API endpoints

| #   | Path                         | Method |
| :-- | :--------------------------- | :----: |
| 1   | `/api/file/upload`           |  POST  |
| 2   | `/api/file/download/:fileId` |  GET   |

### `/upload`

through this endpoint you can upload a file to be stored in the file system.
maximum size of a file to be uploaded is **200MB**

the response will be in this format in case there are no errors or failures:

```json
{
  "status": "Ok",
  "id": "<id of the uploaded file for later retrieval>"
}
```

In case of an error the response will be like this:

```json
{
  "status": "Error",
  "message": "Error Message"
}
```

In case of failure :

```json
{
  "status": "Fail",
  "messsage": "Description"
}
```

### `/download/:fileId`

through this endpoint you can retrieve a file by passing its ID

In case of an error the response will be like this:

```json
{
  "status": "Error",
  "message": "Error Message"
}
```

In case of failure :

```json
{
  "status": "Fail",
  "messsage": "Description"
}
```

in case of no errors or failures:

- if the file is still in queue this will be the response:

```json
{
  "status": "Ok",
  "message": "File is still in queue."
}
```

- if the file is under processing this will be the response:

```json
{
  "status": "Ok",
  "message": "File is under processing"
}
```

- if the system failed to process the file this will be the response:

```json
{
  "status": "Ok",
  "message": "File failed to be processed"
}
```

- otherwise the file will be sent.

## Enviroment variables
please make sure to configure these enviorment variables 

```
DATABASE_URL=<database connection string>
PORT
RMQURL=<rabbit mq server URL>
```
