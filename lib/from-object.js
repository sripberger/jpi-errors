import { fromObjectSimple } from './from-object-simple';

/**
 * Converts a JSON-RPC Error object to an Error instance. Errors will be created
 * with the standard Error constructor, but they will include all properties
 * supported by [Nani](https://www.npmjs.com/package/nani), as well as the
 * `code` property.
 *
 * There will be no stack frames on any Error created by this function, unless
 * they are provided in the object, because there is otherwise no way to tell
 * anything about where the error originally came from. If you plan on throwing
 * any of these errors, you should wrap them with new errors to so you can have
 * a useful stack trace.
 * @param {Object} obj - JSON-RPC error object.
 * @returns {Error} - Created Error instance.
 */
export function fromObject(obj) {
	// Convert the object, ignoring nested errors for now.
	const err = fromObjectSimple(obj);

	// Get the data from the object to handle nested errors.
	const { data = {} } = obj;

	// Handle errors property or single cause, if any.
	if (data.errors) {
		// Convert all errors in the array and assign them onto the error.
		err.errors = data.errors.map(fromObject);

		// Set the primary cause.
		// Should be ther first error, or null if there is none.
		[ err.cause = null ] = err.errors;
	} else if ('cause' in data) {
		// Convert a single cause. May be null, so check for that here.
		err.cause = data.cause && fromObject(data.cause);
	}

	return err;
}
