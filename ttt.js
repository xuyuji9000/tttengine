// ttt engine


window.ttt = (function() {
	
	var ttt = {
		board : [0, 0, 0, 0, 0, 0, 0, 0, 0], // board state
		flag: 'computer', //who's turn, 'computer' first, then 'human'

		init: function() {
			ttt.logic();
		},

		// take input from players
		input: function(board) {
			ttt.check(board)
		},

		humanMove: function () {

		},

		computerMove: function () {

		},

		// check legitimacy
		check: function() {
		},

		getWinner: function() {

		},

		logic: function() {
			while(!getWinner()) {
				computerMove();
				humanMove();
			}
		},

		// appearance callback
		appearance: function() {

		},

		// make the random move
		random: function() {

		}
	}
	return ttt;
} ());

// use anonumous function to init
(function(ttt) {
	ttt.init();
}) (window.ttt);