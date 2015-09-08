# Ophmisu

Ophmisu Trivia - realtime &amp; web based.
Technologies:
  1. Server app: Node.js, MySQL, Socket.IO;
  2. Client apps:
    1. Web client: AngularJS, jQuery, Bootstrap, Socket.IO, PHP;
    2. Android client: Android SDK (Java), Web sockets.

A live demo is available at <a href="https://ophmisu.com/" target="_blank">https://ophmisu.com/</a>.

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
```

## Todo
- [ ] add support for multiple server nodes
- [ ] add support for multiple rooms / channels
- [x] support ssl (so SPDY can do its job)
- [ ] socket multiplexing (allow both http/https) (check SockJS)
- [x] redefine dependencies
- [x] finish basic user registration
- [ ] create simple administration interface to manage questions (CRUD, import) (Alexandru Canavoiu)
- [ ] add user groups and define permissions for in-game commands (Alexandru Canavoiu)
- [x] add "Top players" view (Alexandru Canavoiu)
- [ ] add "Player profile" view (Alexandru Canavoiu)


## License
Ophmisu Trivia is available under the [MIT license](http://opensource.org/licenses/MIT).