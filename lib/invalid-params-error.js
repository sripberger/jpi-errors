import { INVALID_PARAMS } from './error-codes';
import { JpiError } from './jpi-error';

/**
 * Class for standard JSON-RPC invalid params errors.
 */
export class InvalidParamsError extends JpiError {
	static getDefaultMessage() {
		return 'Invalid method parameters';
	}
}

/**
 * JSON-RPC standard error code for invalid params errors.
 * @type {number}
 */
InvalidParamsError.code = INVALID_PARAMS;
