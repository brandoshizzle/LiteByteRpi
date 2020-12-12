const ws281x = require('rpi-ws281x');
const c = require('./coordinates');
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

	loop() {
		var leds = this.config.width * this.config.height;
		var pixels = new Uint32Array(leds);

		// Set a specific pixel
		pixels[c.XYtoPixelNum(x, y)] = 0xff0000;

		// Render to strip
		ws281x.render(pixels);

		this.x++;
		if (this.x > 32) {
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
