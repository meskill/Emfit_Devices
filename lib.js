/**
 * Created by meskill on 15.12.2015.
 */

var crypto = require('crypto');
var config = require('./config');

exports.read = function read(socket, n, cb) {
	var buf;

	function f() {
		if (n===0) console.log('fuck');
		if ((buf = socket.read(n)) !== null) {
			socket.removeListener('readable', f);
			cb(null, buf);
		}
	}

	if ((buf = socket.read(n)) !== null) return cb(null, buf);
	socket.on('readable', f);
};


exports.encrypt = function (data, method, key, iv) {
	method = method || config.CRYPT_METHOD;
	key = key || config.KeyA;
	iv = iv || config.CRYPT_IV;
	var cipher = crypto.createCipheriv(method, key, iv);
	cipher.setAutoPadding(false);
	var crypted = cipher.update(data);
	crypted = Buffer.concat([crypted, cipher.final()]);
	return crypted;
};

exports.decrypt = function (data, method, key, iv) {
	method = method || config.CRYPT_METHOD;
	key = key || config.KeyA;
	iv = iv || config.CRYPT_IV;
	var decipher = crypto.createDecipheriv(method, key, iv);
	decipher.setAutoPadding(false);
	var decrypted = decipher.update(data);
	decrypted = Buffer.concat([decrypted, decipher.final()]);
	return decrypted;
};

exports.message = function (header, type, data) {
	data = data || new Buffer(0);
	var length = new Buffer(2);
	length.writeUInt16LE(data.length);
	return Buffer.concat([new Buffer([header, type]), data, length, config.EDC]);
};

exports.data = function (header, type, sort_code, data) {
	data = data || new Buffer(0);
	var length = new Buffer(2);
	length.writeUInt16LE(data.length + 6, 0);
	var time = new Buffer(6);
	time.writeUInt32LE(Math.floor(Date.now() / 1000), 0);
	time.writeUInt16LE(sort_code, 4);
	return Buffer.concat([new Buffer([header, type]), length, time, data, config.EDC]);
};