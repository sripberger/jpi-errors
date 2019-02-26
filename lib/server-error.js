import { JpiError } from './jpi-error';
import { SERVER_ERROR } from './error-codes';

/**
 * Class for JSON-RPC generic server errors. Will be used by jpi to wrap any
 * error thrown by a middleware that is not a JpiError with an integer code.
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
