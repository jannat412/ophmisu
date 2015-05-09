# Ophmisu

Ophmisu Trivia - realtime &amp; web based (node.js, socket.io, mysql).
Live demo at http://ophmisu.com/

## Installation

### Client for web
```
npm install -g bower
cd ophmisu/client/web
bower install
```
### Server
```
cd ophmisu/server
npm install
mysql --default-character-set=utf8 --user=ophmisu --password= ophmisu < latest.sql
node app.js
...todo
```

## Changelog
2014.05.21:
* updated server app;
* added android app;
* added web-based app.

## Dependencies

```javascript
"dependencies": {
    "cors": "2.4.x",
    "debug": "1.x",
    "express": "4.6.x",
    "socket.io": "1.x",
    "socket.io-client": "1.x",
    "jade": "0.16.4",
    "stylus": "0.19.0",
    "nib": "0.2.0",
    "fluidity": "0.1.x",
    "mysql": ">= 2.0.0-alpha5",
    "winston": "0.6.x"
}
```

## Todo
- [x] support ssl (so SPDY can do its job)
- [ ] socket multiplexing (allow both http/https) (check SockJS)
- [x] redefine dependencies
- [x] finish basic user registration
- [ ] create simple administration interface to manage questions (CRUD, import) (Alexandru Canavoiu)
- [ ] add user groups and define permissions for in-game commands (Alexandru Canavoiu)
- [ ] add "Top players" view (Alexandru Canavoiu)
- [ ] add "Player profile" view (Alexandru Canavoiu)


## License
Ophmisu Trivia is available under the [MIT license](http://opensource.org/licenses/MIT).