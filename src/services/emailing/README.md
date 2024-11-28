# Emailing Service

# overview

This service is designed to handle the sending of emails to specified recipient addresses efficiently and reliably.

## how it works ?

the service listens to a message queue, processes incoming messages, and sends emails to the specified recipient addresses based on the message content

## message structure

to use the predefined emails the message should look like this

```json
{
  "mode": 0,
  "type": "change-email",
  "email": "email@gmail.com",
  "username": "username1"
}
```

here is the supported predefined emails so far :

- `change-email` -> notify the user that his email address has been changed to this email
- `change-password` -> notify the user that his password has been changed
- `sign-up` -> sends a welcome email to the user

when trying to send a custom email you can use this format

```json
{
  "mode": 1,
  "email": "email@gmail.com",
  "subject": "subjectExample",
  "body": "bodyExample"
}
```

## environment variables

please don't forget to configure theses environment variables

```
RMQURL=<rabbitmq connection srting>
EMAIL_ADDRESS=<sender email address>
EMAIL_PASSWORD=<sender email's password>
```
