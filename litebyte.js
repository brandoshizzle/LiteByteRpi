const ws281x = require('rpi-ws281x');
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
		ws281x.configure(this.config);
		this.gallery = [];
		this.position = 0;
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
		ws281x.render(this.pixels);
	}

	loop() {
		console.log(this.gallery);
		// Each loop, we get the next image
		if (this.position === this.gallery.length) {
			this.position = 0;
		}
		const currentImage = this.gallery[this.position].art;
		// Turn it into a proper grid
		let ledCounter = 0;
		let imageArray = currentImage.match(/[a-zA-Z]+|[0-9]+/g);
		let num = 0;
		let color = '';
		for (var i = 0; i < imageArray.length; i++) {
			const val = imageArray[i];
			const lastVal = i > 0 ? imageArray[i - 1] : 'n';
			if (isNaN(val)) {
				// It's a letter, so the previous one is the num
				color = val;
				if (isNaN(lastVal)) {
					num = 1;
				} else {
					num = lastVal;
				}
				for (var j = 0; j < num; j++) {
					const y = ledCounter % 16;
					const x = Math.floor(ledCounter / 16);
					console.log(x, y, color, ledCounter);
					this.pixels[this.XYtoPixelNum(x, y)] = hex(color);
					ledCounter++;
				}
			}
		}
		ws281x.render(this.pixels);
		this.position = this.position + 1;
	}

	async run() {
		await isOnline();
		this.database.ref(`gallery`).once('value', (snapshot) => {
			if (snapshot.val() === null) {
				this.gallery = [];
			} else {
				this.gallery = Object.values(snapshot.val());
			}
		});
		this.database.ref('new').on('value', (snapshot) => {
			const newArt = snapshot.val()[Object.keys(snapshot.val())[0]];
			this.gallery.push(newArt);
		});
		console.log(this.gallery);
		setInterval(this.loop.bind(this), 1000);
		// for (var x = 0; x < this.config.width; x++) {
		// 	for (var y = 0; y < this.config.height; y++) {
		// 		const row = y.toString();
		// 		const col = x.toString();
		// 		this.database.ref(`grid/${col}/${row}`).on('value', (snapshot) => {
		// 			console.log(`New ${snapshot.val()} pixel incoming at ${row},${col}`);
		// 			this.updateFromServer(snapshot.val(), col, row);
		// 		});
		// 	}
		// }
	}
}

var example = new Example();
example.run();
