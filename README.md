# Ophmisu

Ophmisu Trivia - realtime &amp; web based.
Technologies:
  1. Server app: Node.JS, MySQL, Socket.IO;
  2. Client apps:
    1. Web client: AngularJS, jQuery, Bootstrap, Socket.IO, PHP;
    2. Android client: Android SDK (Java), Web sockets.

Live demo at http://ophmisu.com/

## Installation

### Client for web
```
cd ophmisu/client/web
bower install
```
### Server
```
cd ophmisu/server
mysql --default-character-set=utf8 --user=ophmisu --password= ophmisu < latest.sql
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