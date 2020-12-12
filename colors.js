function hex(name) {
	// Numbers changed from rgb to grb
	const colors = {
		0: '0x000000',
		b: '0xFF00FF',
		w: '0xFFFFFF',
		p: '0x2B8AE2',
		g: '0xCD3232',
		o: '0xA5FF00',
		y: '0xFFFF00',
		r: '0x00FF00',
	};
	return colors[name];
}

module.exports = {
	hex: hex,
};
