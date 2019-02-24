import { assign, pick } from 'lodash';
import { naniProperties } from './nani-properties';

// TODO: Support stacks.

export function fromObjectSimple(obj) {
	const { message, data } = obj;

	// Create error with message and name, which will always be present.
	const err = new Error(message);
	err.name = data.name;

	// Handle the code property.
	if ('code' in obj) {
		// Include code at top level, if any.
		err.code = obj.code;
	} else if ('code' in data) {
		// Otherwuse, include code in data, if any.
		err.code = data.code;
	}

	// Assign any naniProperties present in data onto the error.
	assign(err, pick(data, naniProperties));

	return err;
}
