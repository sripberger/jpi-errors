import { fromObjectSimple } from './from-object-simple';

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
