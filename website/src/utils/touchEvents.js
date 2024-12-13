let onTouchLeaveEvents = [];
let onTouchEnterEvents = [];
export const onTouchEnter = function (selector, fn) {
	onTouchEnterEvents.push([selector, fn]);
	return function () {
		onTouchEnterEvents.slice().map(function (e, i) {
			if (e[0] === selector && e[1] === fn) {
				onTouchEnterEvents.splice(1, i);
			}
		});
	};
};

export const onTouchLeave = function (selector, fn) {
	onTouchLeaveEvents.push([selector, fn]);
	return function () {
		onTouchLeaveEvents.slice().map(function (e, i) {
			if (e[0] === selector && e[1] === fn) {
				onTouchLeaveEvents.splice(1, i);
			}
		});
	};
};

let lastTouchLeave;
let lastTouchEnter;

document.addEventListener('touchmove', function (e) {
	var el = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
	if (!el) return;

	onTouchLeaveEvents.map((event) => {
		if (el != lastTouchEnter && lastTouchEnter && lastTouchEnter.matches(event[0])) {
			if (lastTouchEnter !== lastTouchLeave) {
				event[1](lastTouchEnter, e);
				lastTouchLeave = lastTouchEnter;
				lastTouchEnter = null;
			}
		}
	});

	onTouchEnterEvents.map((event) => {
		if (el.matches(event[0]) && el !== lastTouchEnter) {
			lastTouchEnter = el;
			lastTouchLeave = null;
			event[1](el, e);
		}
	});
});