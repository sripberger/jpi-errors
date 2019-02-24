import { NaniError, is } from 'nani';
import { assign, isEmpty, pick } from 'lodash';
import { JpiError } from './jpi-error';
import { naniProperties } from './nani-properties';

// TODO: Omit name, if it is 'Error', and omit data entirely if empty.

export function toObjectSimple(err, includeStack = false) {
	// Create the object with message, which will always be present.
	const result = { message: err.message };

	// Create an empty data object which will be included if it is not empty.
	const data = {};

	// Add the name to data, if it is not 'Error'.
	if (err.name !== 'Error') data.name = err.name;

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

	// Add data if it is not empty.
	if (!isEmpty(data)) result.data = data;

	return result;
}
