import { INVALID_REQUEST } from './error-codes';
import { JpiError } from './jpi-error';

/**
 * Class for standard JSON-RPC invalid request errors.
 */
export class InvalidRequestError extends JpiError {
	static getDefaultMessage() {
		return 'Sent JSON is not a valid Request object';
	}
}

/**
 * JSON-RPC standard error code for invalid request errors.
 * @type {number}
 */
InvalidRequestError.code = INVALID_REQUEST;
