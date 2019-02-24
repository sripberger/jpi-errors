import { iterateFull } from 'nani';
import { toObjectSimple } from './to-object-simple';

export class Converter {
	constructor(includeStacks = false) {
		this.includeStacks = includeStacks;
		this.objectsByError = new Map();
	}

	add({ err, parent, inArray }) {
		// Get the parent object from the map, if any.
		const parentObj = parent ? this.objectsByError.get(parent) : null;

		// Get the parent data property, if any.
		const parentData = parentObj ? parentObj.data : null;

		// If parent was specified, but no data exists for it, we can't handle
		// this error properly, so ignore it.
		if (parent && !parentData) return;

		// If a cause already exists on the parent data, but this is supposed
		// to be a single-cause relationship, we can't handle this error
		// properly, so ignore it.
		if (parentData && parentData.cause && !inArray) return;

		// Convert the error to a JSON-RPC Error object with no causes.
		const obj = toObjectSimple(err, this.includeStacks);

		// Add the new cause to the parent data, if any.
		if (parentData) {
			// Add the primary cause, if there wasn't one already.
			if (!parentData.cause) parentData.cause = obj;

			// Deal with the `errors` array, if there's supposed to be one.
			if (inArray) {
				// Ensure the array exists.
				if (!parentData.errors) parentData.errors = [];

				// Add the new cause to the array.
				parentData.errors.push(obj);
			}
		}

		// Finally, add the new error and its object to
		// the map so it can be referenced later.
		this.objectsByError.set(err, obj);
	}

	convert(err) {
		// Add all items in the error structure to the converter.
		for (const item of iterateFull(err)) this.add(item);

		// Return the object for the topmost error.
		return this.objectsByError.get(err);
	}
}
