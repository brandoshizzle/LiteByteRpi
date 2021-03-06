const ws281x = require('rpi-ws281x-native');
const firebase = require('firebase');
const { hex } = require('./colors');
const isOnline = require('is-online');

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
			brightness: 80,
			type: 'grb',
			width: 32,
			height: 16,
			map: 'matrix',
		};
		this.leds = this.config.width * this.config.height;
		this.pixels = new Uint32Array(this.leds).fill(0x000000);
		this.database = firebase.database();
		// ws281x.configure(this.config);
		this.updateTimer = null;
		ws281x.setBrightness(80);
	}

	XYtoPixelNum(x, y) {
		// Takes x, y coordinates and converst them to the pixel number for the library
		// Returns pixel num (integer)
		x = parseInt(x);
		y = parseInt(y);
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

	updateFromServer(val, x, y) {
		this.pixels[this.XYtoPixelNum(x, y)] = hex(val['c']);
		if (!this.updateTimer) {
			this.updateTimer = setTimeout(function () {
				//the function ran, clear this timeId
				this.updateTimer = null;
				ws281x.render(this.pixels);
			}, 250);
		}
	}

	async run() {
		await isOnline();
		for (var x = 0; x < this.config.width; x++) {
			for (var y = 0; y < this.config.height; y++) {
				const row = y.toString();
				const col = x.toString();
				this.database.ref(`grid/${col}/${row}`).on('value', (snapshot) => {
					console.log(`New ${snapshot.val()} pixel incoming at ${row},${col}`);
					this.updateFromServer(snapshot.val(), col, row);
				});
			}
		}
	}
}

var example = new Example();
example.run();
