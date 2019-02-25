import { assign, pick } from 'lodash';
import { naniProperties } from './nani-properties';

export function fromObjectSimple(obj) {
	const { message, data = {} } = obj;

	// Create error with message.
	const err = new Error(message);

	// Copy name to error, if any.
	if ('name' in data) err.name = data.name;

	// Handle the code property.
	if ('code' in obj) {
		// Use top-level code.
		err.code = obj.code;
	} else if ('code' in data) {
		// Use data-level code.
		err.code = data.code;
	}

	// Copy any naniProperties present in data onto the error.
	assign(err, pick(data, naniProperties));

	if ('stack' in data) {
		// Overwrite the stack getter with the already-computed stack from data.
		err.stack = data.stack;
	} else {
		// Overwrite the stack getter with a frameless substitute.
		err.stack = `${err.name}: ${message}`;
	}

	return err;
}
