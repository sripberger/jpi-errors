import { NaniError, is } from 'nani';
import { assign, isEmpty, pick } from 'lodash';
import { JpiError } from './jpi-error';
import { naniProperties } from './nani-properties';

/**
 * Internal function used by `toObject`. Responsible for creating JSON-RPC
 * error objects for error instances in a structure, minus the `cause` and
 * `errors` properties.
 * @private
 * @param {Error} err - Error instance to convert.
 * @param {boolean} [includeStack=false] - Whether or not to include the stack
 *   trace from `err` in the result.
 * @returns {Object} - Created JSON-RPC error object.
 */
export function toObjectSimple(err, includeStack = false) {
	// Create the result object and its data object.
	const result = { message: err.message };
	const data = {};

	// Copy the name property, if it is not the default.
	if (err.name !== 'Error') data.name = err.name;

	// Handle the code property.
	if (is(JpiError, err)) {
		// Copy integer code to the top level.
		if (Number.isInteger(err.code)) result.code = err.code;
	} else if ('code' in err) {
		// Copy any code to data.
		data.code = err.code;
	}

	// Copy naniProperties data, if err is a NaniError.
	if (is(NaniError, err)) assign(data, pick(err, naniProperties));

	// Copy stack to data, if specified.
	if (includeStack) data.stack = err.stack;

	// Add data if it is not empty.
	if (!isEmpty(data)) result.data = data;

	return result;
}
