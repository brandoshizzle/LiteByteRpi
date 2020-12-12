function XYtoPixelNum(x, y) {
	// Takes x, y coordinates and converst them to the pixel number for the library
	// Returns pixel num (integer)
	let pixel = 0;

	if (x < 16) {
		// left board
		// starts bottom left, snakes to top right
		const row = 496 - 16 * y;
		pixel = row + (y % 2 === 0 ? x : -x); // Add x if even row, subtract if odd
	} else {
		// right board
		// starts top right, snakes to bottom left
		pixel = 16 * y + (y % 2 === 0 ? -x : x);
	}
	return pixel;
}

module.exports = {
	XYtoPixelNum: XYtoPixelNum,
};
