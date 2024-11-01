# Service Discovery Service

## Overview

This service is responsible for discovering services in the network and providing the IPs and ports of the services to the clients after verifying the client's identity.

## Service Discovery Service API

### Get Instance

`GET /getinstance/:servicepath`

This endpoint is used to get the IP and port of a service.
The client must provide the service path and the service will search for the available up and running instances for this service and will random one of them and return its ip address and port number to the client.
