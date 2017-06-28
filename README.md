# chat-app

## Usage

To run locally, install dependencies in root and /client directories

`npm i && cd client && npm i && cd ..`

## Overview

User is prompted to create a new chat room with an optional room name on the home page. 
If no room name is provided, a random hash is generated for the room name. When the user is redirected
to the room, they see the chat client and a list of users (empty for newly created rooms).
The user can share the public link to invite users to join. 

Message data persists as long as someone is present in the room. When the last user leaves the room,
the room and its message data are deleted.

Rooms must be created on the main page before users are permitted to enter. If a room does not exist,
a user will be shown an error message that redirects to the home page.

## Stack

Node/React/SocketIO

## Note

Data persists only in memory on the backend. A more reliable datastore should be integrated
for a more robust application. Also, that style could really use some work...
