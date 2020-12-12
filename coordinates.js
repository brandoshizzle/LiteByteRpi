function XYtoPixelNum(x, y) {
	// Takes x, y coordinates and converst them to the pixel number for the library
	// Returns pixel num (integer)
	let pixel = 0;

	if (x < 16) {
		// left board
		// starts bottom left, snakes to top right
		const row = 511 - 16 * y;
		const add = y % 2 === 0 ? -x : -15 + x;
		console.log(row, add);
		pixel = row + add; // Add x if even row, subtract if odd
	} else {
		// right board
		// starts top right, snakes to bottom left
		const boardX = x - 15;
		const row = 15 * (y + 1);
		const add = y % 2 === 0 ? -boardX : -15 + boardX;
		console.log(row, add);
		pixel = row + add;
	}
	console.log(`(${x},${y}) = ${pixel}`);
	return pixel;
}

module.exports = {
	XYtoPixelNum: XYtoPixelNum,
};
