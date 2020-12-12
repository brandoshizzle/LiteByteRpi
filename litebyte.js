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

	updateFromServer(val, x) {
		for (var y = 0; y < this.config.height; y++) {
			this.pixels[this.XYtoPixelNum(x, y)] = hex(val[y]);
		}
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
						this.pixels[this.XYtoPixelNum(i, j)] = hex(grid[i][j]);
					}
				}
				ws281x.render(this.pixels);
			});

		console.log('almost there');
		for (var x = 0; x < this.config.width; x++) {
			for (var y = 0; y < this.config.height; y++) {
				console.log('registering listener');
				const row = y;
				const col = x;
				this.database.ref(`grid/${col}/${row}`).on('value', (snapshot) => {
					const now = Date.now();
					console.log('heard a change at', row + col, snapshot.val());
					this.updateFromServer(snapshot.val(), col);
				});
			}
		}

		// Render to strip
		ws281x.render(this.pixels);
	}
}

var example = new Example();
example.run();
