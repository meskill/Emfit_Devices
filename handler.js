/**
 * Created by meskill on 16.12.2015.
 */

var lib = require('./lib');
var headers = require('./headers');

module.exports = function () {
	var handler = {};
	var _sort_code = 0;

	handler.sort_code = function sort_code() {
		if (_sort_code > 65000) _sort_code = 0;
		return _sort_code++;
	};

	handler.handle = function (socket, cb) {
		lib.read(socket, 4, function (err, message) {
			if (err) return cb(err);
			lib.read(socket, message.readUInt16LE(2) + 2, function (err, data) {
				if (err) return cb(err);
				switch (message[0]) {
					case headers.Headers.MESSAGE_TO_DEVICE:
						switch (message[1]) {
							case headers.MessageType.PING:
							case headers.MessageType.TIME:
							case headers.MessageType.ADDRESS_CHANGE:
							case headers.MessageType.ALT_ADDRESS_CHANGE:
							case headers.MessageType.CONNECT_TO_ALT:
							case headers.MessageType.DEVICE_NOT_USE:
							case headers.MessageType.GO_OFFLINE:
							case headers.MessageType.SETTINGS_DATA:
							case headers.MessageType.HANDSHAKE_COMPLETE:
								break;
						}
						break;
					case headers.Headers.ACKNOWLEDGE_DEVICE_MESSAGE:
					case headers.Headers.ACKNOWLEDGE_DEVICE_DATA:
					case headers.Headers.NACKNOWLEDGE_DEVICE_MESSAGE:
					case headers.Headers.NACKNOWLEDGE_DEVICE_DATA:
						return cb(null, message);
						break;
					default:
						cb('Wrong Header')
				}
				return cb(null, message)
			})
		})
	};
	return handler
};
