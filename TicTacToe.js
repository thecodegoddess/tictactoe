/**
 * TicTacToe Game
 * @module TicTacToe
 * @requires module:utils/PolyFills
 * @requires module:utils/PubSub
 */

define(function (require) {
	var pollyFills = require('./utils/Polyfills'),
		pubSub = require('./utils/PubSub'),
		winningCombos = [
			[1, 2, 3], // horizontal
			[4, 5, 6],
			[7, 8, 9],
			[1, 4, 7], // verticals
			[2, 5, 8],
			[3, 6, 9],
			[1, 5, 9], // Diagonals
			[3, 5, 7]
		],
		turns,
		// Default config
		config = {
			tableSelector : '#js-tic-tac-toe'
		},
		// Players
		player = ['X', 'O'],
		currentPlayer,
		// the element
		ticTacToeElm,
		// the scores object
		scores = {};

	/**
	 * Method to update box with users move
	 * @param {DOMElement} targetEl - The box clicked
	 */
	function updateBox (targetEl) {
		var playerToken = document.createElement('span');

		playerToken.classList.add('TicTacToe-playerToken');

		// set the owner atribute
		targetEl.setAttribute('data-owner', currentPlayer);

		// Set the html to be the current player
		//targetEl.innerHTML = currentPlayer;

		playerToken.innerHTML = currentPlayer;

		targetEl.appendChild(playerToken);

		// Use set timeout to ensure a new paint to fire the CSS amination
		setTimeout(function addClassToBox () {

			// Update with taken state
			targetEl.classList.add('TicTacToe-isTaken');
		}, 500);
	}

	/**
	 * Method to handle player's move
	 * @param {DOMElement} targetEl - Clicked element
	 */
	function playerMove (targetEl) {

		// get the data-box attribute
		var box = targetEl.getAttribute('data-box'),
			isWinner = false;

		// see if user can click here (isn't occupied)
		if (targetEl.getAttribute('data-owner')) {
			alert('HEY! You cannot mark here!');
			return;
		}

		// reduce number of turns left
		turns--;

		// Call the update with the element
		updateBox(targetEl);

		// increase score, convert to number because data attribute is a string
		scores[currentPlayer].push(parseInt(box, 10));

		// check if they have won
		isWinner = didIWin();

		// if there is a winner or no moves are left
		if(isWinner || turns === 0) {

			// Call game over method
			gameOver(isWinner);

		} else { // the user didn't win and there are still turns left

			// Toggle player
			currentPlayer = currentPlayer == player[0] ? player[1] : player[0];

			// Publish next player event and pass current player
			pubSub.publish('ticTacToe.nextPlayer', currentPlayer + '\'s turn');

		}
	}

	/**
	 * The method to handle game over state
	 * @param {Boolean} gameWasWon - Was the game won?
	 */
	function gameOver (gameWasWon) {
		var msg;

		// Clean up the event listener
		ticTacToeElm.removeEventListener('click', handleClick);

		// If the game was won
		if (gameWasWon) {

			// Define winner in the message
			msg = currentPlayer + ' has won';
		} else {

			// Game is a tie
			msg = 'Game ends in a tie';
		}

		// add disabled class
		ticTacToeElm.classList.add('TicTacToe--disabled');

		// Publish game over event and pass the msg
		pubSub.publish('ticTacToe.gameOver', msg);
	}

	/**
	 * The method to determine if the current user has one
	 * @returns {boolean} - Did the current user win?
	 */
	function didIWin () {
		var i = 0,
			len = winningCombos.length,
			userScoreMatch;

		// For each of the possible winning combos
		for (; i < len; i++) {

			// Filter out only the ones found in the users score
			userScoreMatch = winningCombos[i].filter(function (cur, idx) {

				// If we found that score, return this
				return scores[currentPlayer].indexOf(cur) !== -1;

			});

			// If the length matches, then user has a winning combo
			if (userScoreMatch.length === winningCombos[i].length) {

				// Hey they won!
				return true;
			}
		}

		// Sorry, not a winner
		return false;
	}

	/**
	 * The method to resset the game
	 * @memberOf module:TicTacToe
	 */
	function reset () {
		// get all the boxes
		var boxes = ticTacToeElm.querySelectorAll('[data-box]');

		// Barrow the Array forEach method and apply it to our node list
		Array.prototype.forEach.call(boxes, function (item, idx) {

			// Reset the html
			item.innerHTML = '';

			// remove the ownership attribute
			item.removeAttribute('data-owner');

		});

		// remove disabled class
		ticTacToeElm.classList.remove('TicTacToe--disabled');


		// Call setup
		setUp();
	}

	/**
	 * The method to setup a new game
	 */
	function setUp () {
		// total number of possible turns
		turns = 9;
		// Set up the score arrays for both players
		scores.X = [];
		scores.O = [];

		// set current to first player
		currentPlayer = player[0];

		// Publish first player
		pubSub.publish('ticTacToe.nextPlayer', currentPlayer + ' goes first');

		// Handle clicking on the board
		ticTacToeElm.addEventListener('click', handleClick);


	}

	/**
	 * The board click handler
	 * @param {event} ev - Click event
	 */
	function handleClick (ev) {

		var targetEl = ev.target;

		/*
		data set is not support in ie 10 and there are performance hits as well
		https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_data_attributes#Issues
		- ALM 10/7/15
		*/
		// If the target element has the box data attribute
		if (targetEl.getAttribute('data-box')) {

			// they click on the box so call player move method
			playerMove(targetEl);
		}
	}

	/**
	 * This method will initialize the Tic Tac Toe Game
	 * @memberOf module:TicTacToe
	 * @param {object} userConfig - User configuration
	 * @param {string} [userConfig.tableSelector='#js-tic-tac-toe'] - The ticTacToe table element selector
	 */
	function init (userConfig) {

		// if a config was passed
		if (userConfig) {

			// Extend the config with user passed config
			pollyFills.obj.assign(config, userConfig);

		}

		// Select the tic tace toe container
		ticTacToeElm = document.querySelector(config.tableSelector);

		// if the element was not found
		if (ticTacToeElm === null) {

			// Throw an error
			throw new Error('Element ' + config.tableSelector + ' could not be found');
		}

		// Call the setup method
		setUp();


	}

	return {
		init : init,
		reset : reset
	};

});