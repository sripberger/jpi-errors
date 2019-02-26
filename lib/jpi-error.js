import { NaniError } from 'nani';

/**
 * Base class for all errors defined by
 * [Jpi](https://www.npmjs.com/package/jpi), as well as any application-defined
 * errors. This class does not have its own `code` property, but does provide a
 * getter for the code on instances, so codes only need to be defined on
 * subclass constructors.
 *
 * To create your own application-defined JSON-RPC error, inherit from this
 * class and assign an integer code to the subclass's constructor. The code must
 * be an integer greater than -32099, as specified by the JSON-RPC standard.
 *
 * This class, as well as all other error classes in ths project, inherit from
 * [NaniError](https://sripberger.github.io/nani/#nanierror) and may use any
 * of the constructor arguments of that class. For more information, see
 * [Nani](https://www.npmjs.com/package/nani).
 */
export class JpiError extends NaniError {
	// eslint-disable-next-line jsdoc/require-returns
	/**
	 * Will return the `code` property of the constructor. This is not set by
	 * default, so you should set it yourself when creating subclasses.
	 * @type {number|undefined}
	 */
	get code() {
		return this.constructor.code;
	}
}
