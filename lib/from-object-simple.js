import { assign, pick } from 'lodash';
import { naniProperties } from './nani-properties';

// TODO: Support stacks.

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

	return err;
}
