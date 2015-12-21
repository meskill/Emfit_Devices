module.exports = {
	CRYPT_METHOD: 'aes128',
	CRYPT_IV: new Buffer(16).fill(0),
	KeyA: new Buffer([0xF8, 0xFD, 0x6D, 0x3E, 0x6F, 0x66, 0x19, 0x12, 0x87, 0x70, 0x71, 0xCF, 0x20, 0x15, 0xE4, 0xFC]),
	EDC: new Buffer([0, 0]),

	WORKER_COUNT: 1,
	DEVICES_PER_WORKER: 1,
	DEVICE_DELAY: 2000,
	REQUEST_INTERVAL: 2000,
	HOST: '91.190.199.247',
	PORT: 35120
	//HOST: 'localhost',
	//PORT: 8000
};