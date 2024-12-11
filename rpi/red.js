var ws281x = require('rpi-ws281x');

class Example {
	constructor() {
		this.offset = 0;
		this.config = {
			leds: 512,
			brightness: 50,
			type: 'grb',
		};
		ws281x.configure(this.config);
	}

	run() {
		// Create a pixel array matching the number of leds.
		// This must be an instance of Uint32Array.
		var pixels = new Uint32Array(this.config.leds);

		// Create a fill color with red/green/blue.
		var green = 0,
			red = 255,
			blue = 0;
		var color = (green << 16) | (red << 8) | blue;

		for (var i = 0; i < this.config.leds; i++) pixels[i] = color;

		// Render to strip
		ws281x.render(pixels);
	}
}

var example = new Example();
example.run();
