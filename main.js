/**
 * @file Tic Tac Toe App
 */

require(['TicTacToe', 'utils/PubSub'], function (tictactoe, pubSub) {
	var resetBtn,
	msgEl;

	/**
	 * Function to update the message
	 * @param {string} msg - Message to be displayed
	 */
	function updateMsg (msg) {
		msgEl.innerHTML = msg;
	}

	// Grab the message element
	msgEl = document.getElementById('js-tic-tac-toe-msg');

	// Subscribe to the next player event
	pubSub.subscribe('ticTacToe.nextPlayer', updateMsg);

	// Subscribe the the gameover event
	pubSub.subscribe('ticTacToe.gameOver', updateMsg);

	// Initialize the tic tac toe game
	tictactoe.init({
		tableSelector : '#js-tic-tac-toe'
	});

	// Grab the reset button
	resetBtn = document.getElementById('js-reset');

	// Attach the tic tac toe reset method
	resetBtn.addEventListener('click', tictactoe.reset);

});
