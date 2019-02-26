import { JpiError } from './jpi-error';
import { SERVER_ERROR } from './error-codes';

/**
 * Class for generic [Jpi](https://www.npmjs.com/package/jpi) server errors.
 * Will be used by Jpi to wrap any error thrown by a middleware that is not a
 * `JpiError` with an integer code.
 *
 * To define your own server errors for your application, do not inherit from
 * this class. Inherit from the base `JpiError` class instead.
 */
export class ServerError extends JpiError {
	static getDefaultMessage() {
		return 'Server error';
	}
}

/**
 * Implementation-defined error code for generic server errors.
 * @type {number}
 */
ServerError.code = SERVER_ERROR;
