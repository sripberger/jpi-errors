import { getFullName } from 'nani';

export function toObjectSimple(err, includeStack = false) {
	const { message, name, code, info } = err;

	// Create the object with message and name, which will always be present.
	const result = { message, data: { name } };

	// Add the code, if any.
	if (Number.isInteger(code)) {
		// Add integer code to top level, as per the JSON-RPC standard.
		result.code = code;
	} else if (code) {
		// Add all other codes to data.
		result.data.code = code;
	}

	// Add the fullName to data, if any.
	const fullName = getFullName(err);
	if (fullName) result.data.fullName = fullName;

	// Add error info to data, if any.
	if (info) result.data.info = info;

	// Add stack if specified.
	if (includeStack) result.data.stack = err.stack;

	return result;
}
