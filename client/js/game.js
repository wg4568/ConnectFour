$(function() {

	var board = $('#board');
	var children = board.children();
	console.log(children);

	children.each(function(idx, child) {
		$(child).attr('index', idx);
	});

	children.click(function(event) {
		console.log(event.target);
	});

	function getSquare(x, y) {
		return children[(y * 7) + x];
	}

	function getCoord(element) {
		var y = 0;
		var index = $(element).attr('index');
		var count = index;
		while (count > 7) {
			count -= 7;
			y++;
		}
		return {x: index - (y * 7), y: y};
	}

	function placeDisk(element, color) {
		turnOff(element);

		var circle = $('<div></div>')[0];
		circle.style['width'] = '100px';
		circle.style['height'] = '100px';
		circle.style['border-radius'] = '50%';
		circle.style['background'] = color;
		$(element).append(circle);
	}

	function turnOff(element) {
		$(element).empty();
	}

	el = getSquare(2, 4);
	el2 = getSquare(1, 3);


	placeDisk(el, 'red');
	placeDisk(el2, 'blue');

	
})
