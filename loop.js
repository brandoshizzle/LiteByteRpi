const ws281x = require('rpi-ws281x');
const c = require('./coordinates');
class Example {
	constructor() {
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

		for (let y = 0; y < this.config.height; y++) {
			for (let x = 0; x < this.config.width; x++) {
				var realx = x;
				if (y % 2 !== 0) {
					realx = 15 - x;
				}
				// Set a specific pixel
				pixels[c.XYtoPixelNum(x, y)] = 0xff0000;
			}
		}

		// Render to strip
		ws281x.render(pixels);
	}

	run() {
		// Loop every 100 ms
		setInterval(this.loop.bind(this), 50);
	}
}

var example = new Example();
example.run();
