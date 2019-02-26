import { Converter } from './converter';

/**
 * Converts an Error instance-- along with its entire cause chain-- into a
 * JSON-RPC-compliant error object. Objects will include `message` properties,
 * as well as a data object that will include any and all properties supported
 * by [Nani](https://www.npmjs.com/package/nani). They will also include `code`
 * properties, though they will be placed either in the data or at the top level
 * based on a number of factors:
 *
 * A `code` will appear in the top level of its object if and only if:
 *   - The error is a `JpiError` (see the `is` function in Nani docs)
 *   - The code is an integer.
 *
 * In all other cases, `code`s will be included in the data object instead.
 * @param {Error} err - Error instance to convert.
 * @param {boolean} [includeStacks=false] - Set to true to include stack traces
 *   in the results. Due to the performance penalty of accessing the stack
 *   property in V8, this should generally not be used in production
 *   environments.
 * @returns {Object} - Created JSON-RPC error object.
 */
export function toObject(err, includeStacks = false) {
	return new Converter(includeStacks).convert(err);
}
