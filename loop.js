var ws281x = require('rpi-ws281x');

class Example {
	constructor() {
		this.offset = 0;
		this.config = {
			leds: 512,
			brightness: 50,
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
		pixels[this.offset] = 0xff0000;

		// Move on to next
		this.offset = (this.offset + 1) % leds;

		// Render to strip
		ws281x.render(pixels);
	}

	run() {
		// Loop every 100 ms
		setInterval(this.loop.bind(this), 200);
	}
}

var example = new Example();
example.run();
