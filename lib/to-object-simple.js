import { NaniError, is } from 'nani';
import { assign, pick } from 'lodash';
import { JpiError } from './jpi-error';
import { naniProperties } from './nani-properties';

// TODO: Omit name, if it is 'Error', and omit data entirely if empty.

export function toObjectSimple(err, includeStack = false) {
	// Create the object with message and name, which will always be present.
	const data = { name: err.name };
	const result = { message: err.message, data };

	// Decide how to handle the code property.
	if (is(JpiError, err)) {
		// err is a JpiError.
		// Add code to the top level if and only if it is an integer.
		if (Number.isInteger(err.code)) result.code = err.code;
	} else if ('code' in err) {
		// err is not a JpiError.
		// Add code to data, if any.
		data.code = err.code;
	}

	// Add NaniError properties to data, if err is a NaniError.
	if (is(NaniError, err)) assign(data, pick(err, naniProperties));

	// Add stack to data, if specified.
	if (includeStack) data.stack = err.stack;

	return result;
}
