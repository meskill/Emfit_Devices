/**
 * Created by meskill on 17.12.2015.
 */

// headers for handshake process
exports.HEADER1 = new Buffer([0xC2, 0xFB]);
exports.HEADER2 = new Buffer([0xC3, 0xFB]);
exports.HEADER3 = new Buffer([0xC2, 0xFC]);

// first byte of any package
exports.Headers = {
	// from server to device
	MESSAGE_TO_DEVICE: 0xC3,
	ACKNOWLEDGE_DEVICE_MESSAGE: 0x32,
	ACKNOWLEDGE_DEVICE_DATA: 0x36,
	NACKNOWLEDGE_DEVICE_MESSAGE: 0x72,
	NACKNOWLEDGE_DEVICE_DATA: 0x76,

	// from device to server

	MESSAGE_TO_SERVER: 0xC2,
	DATA_TO_SERVER: 0xC6,
	ACKNOWLEDGE_SERVER_MESSAGE: 0x33,
	NACKNOWLEDGE_SERVER_MESSAGE: 0x73
};

exports.MessageType = {
	PING: 0x01,
	TIME: 0x04,
	ADDRESS_CHANGE: 0x80,
	ALT_ADDRESS_CHANGE: 0x81,
	CONNECT_TO_ALT: 0x82,
	DEVICE_NOT_USE: 0x83,
	GO_OFFLINE: 0x84,
	SETTINGS_REQUEST: 0x90,
	SETTINGS_DATA: 0x91,
	HANDSHAKE_COMPLETE: 0xFE
};

exports.DataType = {
	EVENT: 0x01,
	CALC_DATA: 0x02,
	SIGNAL_DATA: 0x03,
	HRV_DATA: 0x04,
	CALC_DATA_M: 0x05
};