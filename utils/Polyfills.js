/**
 * Polyfills
 * @module utils/PolyFills
 */

define(function () {

	return /** @alias module:utils/PolyFills */ {
		/**
		 * Object polyfills
		 * @namespace
		 */
		obj :  {
			/**
			 * Object Assign Polyfill
			 * @param {Object} target - The target object
			 * @param {...Object} - Objects whose properties will be copied
			 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill}
			 * @returns {*}
			 */
			assign : function(target) {
				'use strict';
				var to,
					nextSource,
					keysArray,
					nextIndex,
					nextKey,
					desc,
					len,
					i;

				// If Object. assign isn't supported
				if (!Object.assign) {

					// make sure that target is not null or undefined
					if (target === undefined || target === null) {
						throw new TypeError('Cannot convert first argument to object');
					}

					// create a new object based on target
					to = Object(target);

					// go through list of arguments, starting with the 2nd one (first one was the target)
					for (i = 1; i < arguments.length; i++) {

						// assign the object from the arguments
						nextSource = arguments[i];

						// If it's null or undefined, skip it
						if (nextSource === undefined || nextSource === null) {
							continue;
						}

						// Create a new object with next source
						nextSource = Object(nextSource);

						// get the array of keys
						keysArray = Object.keys(nextSource);

						// for all the keys in the object
						for (nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {

							// get the key value
							nextKey = keysArray[nextIndex];

							/*
							Not sure this is necessary, keys should have returned the enumerable
							properties of the obj, maybe certain scenarios this is needed -  ALM 10/7/15
							*/
							// if it's an own prop, will return it's descriptor, else undefined
							desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);

							// If the descriptor is not undefined and is an enumerable prop
							if (desc !== undefined && desc.enumerable) {

								// add or update property with the value of the next source
								to[nextKey] = nextSource[nextKey];
							}
						}
					}

					// Return the new object
					return to;

				} else {
					// just return the native assign and call it with target and args
					return Object.assign.call(target, arguments);
				}

			}
		}
	};

});
