const ws281x = require('rpi-ws281x');
class Example {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.config = {
			// leds: 512,
			brightness: 128,
			type: 'grb',
			width: 32,
			height: 16,
			map: 'matrix',
		};
		ws281x.configure(this.config);
	}

	XYtoPixelNum(x, y) {
		// Takes x, y coordinates and converst them to the pixel number for the library
		// Returns pixel num (integer)
		if (x < 16) {
			// left board
			const row = 511 - y * 16;
			const add = y % 2 === 0 ? -x : -15 + x;
		} else {
			// right board
			const boardX = x - 16;
			const row = 15 + y * 16;
			const add = y % 2 === 0 ? -boardX : -15 + boardX;
		}
		return row + add;
	}

	loop() {
		var leds = this.config.width * this.config.height;
		var pixels = new Uint32Array(leds);

		// Set a specific pixel
		pixels[this.XYtoPixelNum(this.x, this.y)] = 0xff0000;

		// Render to strip
		ws281x.render(pixels);

		this.x++;
		if (this.x > 31) {
			this.x = 0;
			this.y++;
		}
		if (this.y > 15) {
			this.y = 0;
		}
	}

	run() {
		// Loop every 100 ms
		setInterval(this.loop.bind(this), 50);
	}
}

var example = new Example();
example.run();
