# Ophmisu
=========

Ophmisu Trivia - realtime &amp; web based (node.js, socket.io, mysql).
Live demo at http://trivia.play.ai/


## Changelog
2014.05.21:
* updated server app;
* added android app;
* added web-based app.

## Dependencies

```javascript
"dependencies": {
	"express": "2.5.5",
	"jade": "0.16.4",
	"stylus": "0.19.0",
	"nib": "0.2.0",
	"mysql": ">= 2.0.0-alpha5",
	"socket.io": "0.9.x",
}
```
.. work in progress.
## Todo
- [x] support ssl (so SPDY can do its job)
- [ ] socket multiplexing (allow both http/https) (check SockJS)
- [ ] redefine dependencies

## License
Ophmisu Trivia is available under the [MIT license](http://opensource.org/licenses/MIT).