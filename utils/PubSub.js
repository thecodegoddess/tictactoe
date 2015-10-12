define(function () {
	var cache = {},
		/**
		 * Publish Subscribe Module
		 * @exports utils/PubSub
		 */
		pubSub = {};

	/**
	 * Publish method
	 * @param {string} eventName - Event to publish
	 * @param {*} eventArgs - Will be passed to the callback
	 * @returns {boolean} - Was a Listener Found?
	 */
	pubSub.publish = function publish (eventName, eventArgs) {

		// check if the event exists
		if (!cache[eventName]) {

			// event not found so return false
			return false;
		}

		// for each callback for this event
		cache[eventName].forEach(function callbacks (item, idx) {

			// call the CB with passed argument
			item.call(null, eventArgs);
		});

		// Event was found, so return true
		return true;
	};

	/**
	 * Subscribe Method
	 * @param {string} eventName - Event to subscribe to
	 * @param {function} callbackFunction - Function to be called on publish
	 */
	pubSub.subscribe = function subscribe (eventName, callbackFunction) {

		// if there is not already a cache
		if (!cache[eventName]) {

			// create a new array to hold all the subscribers
			cache[eventName] = [];
		}

		// check the the callback was passed and is a function
		if (!callbackFunction || typeof callbackFunction !== 'function') {

			// throw an error
			throw new Error('Could not subscribe to event, callback was undefined or not a function');
		}

		// push this callback into the array of subscribers
		cache[eventName].push(callbackFunction);
	};

	/**
	 * Unsubscribe Method
	 * @param {string} eventName - Event to stop listening to
	 * @param {function} [callbackFunction] - The callback function. If not specified, all listerns for the
	 * event are removed
	 * @returns {boolean} - Was a listener for the event found
	 */
	pubSub.unsubscribe = function unsubscribe (eventName, callbackFunction) {
		var cbLen = 0;

		// If the event isn't in the cache
		if (!cache[eventName]) {
			return false;
		}

		// If a callback was not passed, assume remove all of them
		if (!callbackFunction) {

			// delete the entire entry
			delete cache[eventName];

			// all deleted so return
			return true;

		} else {

			// Get the length of the call backs associated with the event
			cbLen = cache[eventName].length;

			// Loop through the to find the one that matches the passed callback
			while (cbLen--) {

				if (cache[eventName][cbLen] === callbackFunction) {

					// If you find it, remove it from the list
					cache[eventName].splice(cbLen, 1);

					// found it, so return
					return true;
				}
			}

		}

	};

	// Return the public methods
	return pubSub;
});

