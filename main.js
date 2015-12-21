/**
 * Created by meskill on 14.12.2015.
 */

'use strict';

var tls = require('net');   // just for now only tcp, should be 'tls'
var crypto = require('crypto');
var async = require('async');
var cluster = require('cluster');
var config = require('./config');
var headers = require('./headers');
var lib = require('./lib');
var handler = require('./handler')();

var options = {
	rejectUnauthorized: false,
	requestCert: true,
	agent: false,
	host: config.HOST,
	port: config.PORT
	//,secureProtocol: 'SSLv3_method'
};

function device() {
	let socket = tls.connect(options, function () {
		var DEVICE_SERIAL = crypto.randomBytes(4);
		DEVICE_SERIAL = new Buffer([0x00, 0x0E, 0x00, 0x1E]);
		var DEVICE_FIRMWARE = crypto.randomBytes(4);
		var DEVICE_HARDWARE = crypto.randomBytes(2);

		async.waterfall([
				function (cb) {
					socket.rndA = crypto.randomBytes(4);
					socket.write(Buffer.concat([headers.HEADER1, socket.rndA]));
					lib.read(socket, 16, cb)
				}
				, function (data, cb) {
					var decrypted = lib.decrypt(data);
					if (Buffer.compare(decrypted.slice(0, 2), headers.HEADER2)) return cb('Wrong Header2');
					if (Buffer.compare(decrypted.slice(2, 6), socket.rndA)) return cb("rndA doesn't match");
					socket.rndB = decrypted.slice(6, 10);
					var crypted = lib.encrypt(Buffer.concat([headers.HEADER3, socket.rndB, DEVICE_SERIAL, DEVICE_FIRMWARE, DEVICE_HARDWARE]));
					socket.write(crypted);
					console.log('checked');
					function handle(err, data) {
						console.log(data);
						if (err) return cb(err);
						return handler.handle(socket, handle)
					}

					handle(null);

					setTimeout(function () {
						socket.job = setInterval(function () {
							console.log('write', cluster.worker.id);
							//socket.write(lib.message(headers.Headers.MESSAGE_TO_SERVER, headers.MessageType.TIME))
							socket.write(lib.data(headers.Headers.DATA_TO_SERVER, headers.DataType.CALC_DATA, handler.sort_code(), crypto.randomBytes(40)))
						}, config.REQUEST_INTERVAL)
					}, parseInt(Math.random() * config.REQUEST_INTERVAL));
				}
			],
			function (err) {
				socket.emit('error', err);
			})
	});
	socket.delay = config.DEVICE_DELAY;
	socket.on('error', function (err) {
		console.log('error', cluster.worker.id, err);
		clearInterval(socket.job);
		socket.destroy();
		setTimeout(device, socket.delay)
	})
}

if (cluster.isMaster) {
	for (var i = 0; i < config.WORKER_COUNT; i++) {
		cluster.fork()
	}
} else {
	for (var i = 0; i < config.DEVICES_PER_WORKER; i++) {
		device()
	}
}