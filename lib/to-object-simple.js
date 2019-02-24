import { getFullName, is } from 'nani';
import { JpiError } from './jpi-error';

export function toObjectSimple(err, includeStack = false) {
	// Create the object with message and name, which will always be present.
	const result = {
		message: err.message,
		data: { name: err.name },
	};

	// Decide how to handle the code property.
	if (is(JpiError, err)) {
		// err is a JpiError.
		// Add code to the top level if and only if it is an integer.
		if (Number.isInteger(err.code)) result.code = err.code;
	} else if ('code' in err) {
		// err is not a JpiError.
		// Add code to data, if any.
		result.data.code = err.code;
	}

	// Add the fullName to data, if any.
	const fullName = getFullName(err);
	if (fullName) result.data.fullName = fullName;

	// Add the shortMessage to data, if any.
	if ('shortMessage' in err) result.data.shortMessage = err.shortMessage;

	// Add error info to data, if any.
	if ('info' in err) result.data.info = err.info;

	// Add stack if specified.
	if (includeStack) result.data.stack = err.stack;

	return result;
}
