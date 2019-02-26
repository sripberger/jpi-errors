import { iterateFull } from 'nani';
import { toObjectSimple } from './to-object-simple';

/**
 * Internal class used by the external `toObject` function. Responsible for
 * translating the results of `nani.iterateFull` into a standard-compliant
 * JSON-RPC Error object.
 * @private
 * @param {Boolean} [includeStacks=false] - Set to true to include error stack
 *   properties in the results. These are otherwise omitted.
 */
export class Converter {
	constructor(includeStacks = false) {
		/**
		 * Whether or not to include error stack properties in the results.
		 * @type {Boolean}
		 */
		this.includeStacks = includeStacks;

		/**
		 * Objects created so far, keyed by the error used to create them.
		 * @type {Map}
		 */
		this.objectsByError = new Map();
	}

	// eslint-disable-next-line jsdoc/require-returns
	/**
	 * Process an item as it comes out of `nani.iterateFull`. Will create an
	 * object for the error, and set it to the appropriate properties of its
	 * parent.
	 * @param {Object} item - Item from `nani.iterateFull`.
	 *   @param {Error} item.err - Encountered Error instance.
	 *   @param {Error|null} item.parent - Parent of `item.err`, if any.
	 *   @param {boolean} item.inArray - Whether or not `item.err` appears in
	 *      an `errors` array on `item.parent`.
	 */
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

		// Convert the error, ignoring nested errors for now..
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

	/**
	 * Consumes an error structure with `nani.iterateFull`, converting it to
	 * a JSON-RPC Error object.
	 * @param {Error} err - Error instance to convert.
	 * @returns {Object} - JSON-RPC equivalent of `err`.
	 */
	convert(err) {
		// Add all items in the error structure to the converter.
		for (const item of iterateFull(err)) this.add(item);

		// Return the object for the topmost error.
		return this.objectsByError.get(err);
	}
}
