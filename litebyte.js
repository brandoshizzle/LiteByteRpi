const ws281x = require('rpi-ws281x');
const firebase = require('firebase');
const { hex } = require('./colors');

const firebaseConfig = {
	apiKey: 'AIzaSyDcI54oa6J71Ik8_Tx6f_d7wplRkqpSuH0',
	authDomain: 'lite-byte.firebaseapp.com',
	databaseURL: 'https://lite-byte-default-rtdb.firebaseio.com',
	projectId: 'lite-byte',
	storageBucket: 'lite-byte.appspot.com',
	messagingSenderId: '254962244488',
	appId: '1:254962244488:web:db3620d98e4ef4ef30f83d',
};
const app = firebase.initializeApp(firebaseConfig);

class Example {
	constructor() {
		this.config = {
			brightness: 128,
			type: 'grb',
			width: 32,
			height: 16,
			map: 'matrix',
		};
		this.leds = this.config.width * this.config.height;
		this.pixels = new Uint32Array(this.leds).fill(0x000000);
		this.database = firebase.database();
		ws281x.configure(this.config);
	}

	XYtoPixelNum(x, y) {
		// Takes x, y coordinates and converst them to the pixel number for the library
		// Returns pixel num (integer)
		let row = 0;
		let add = 0;
		if (x < 16) {
			// left board
			row = 511 - y * 16;
			add = y % 2 === 0 ? -x : -15 + x;
		} else {
			// right board
			var boardX = x - 16;
			row = 15 + y * 16;
			add = y % 2 === 0 ? -boardX : -15 + boardX;
		}
		return row + add;
	}

	// rgbToHex(r, g, b) {
	// 	// Create a fill color with red/green/blue.
	// 	return (g << 16) | (r << 8) | b;
	// }

	updateFromServer(val, x, y) {
		console.log('Got a server update!');
		this.pixels[this.XYtoPixelNum(x, y)] = hex(val);
		ws281x.render(this.pixels);
	}

	run() {
		this.database
			.ref('grid')
			.once('value')
			.then((snapshot) => {
				console.log('loaded grid');
				const grid = snapshot.val();
				for (var i = 0; i < this.config.width; i++) {
					for (var j = 0; j < this.config.height; j++) {
						console.log(hex(grid[i][j]));
						this.pixels[i + j] = hex(grid[i][j]);
					}
				}
				console.log('render time');
				ws281x.render(this.pixels);
			});

		for (var i = 0; i < this.config.width; i++) {
			for (var j = 0; j < this.config.height; j++) {
				const col = i;
				const row = j;
				this.database.ref(`grid/${i}/${j}`).on('child_changed', (snapshot) => {
					console.log('registered listener');
					this.updateFromServer(snapshot.val(), col, row);
				});
			}
		}

		// Render to strip
		ws281x.render(this.pixels);
	}
}

var example = new Example();
example.run();
