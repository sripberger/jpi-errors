import { INTERNAL_ERROR } from './error-codes';
import { JpiError } from './jpi-error';

/**
 * Class for standard JSON-RPC internal errors.
 */
export class InternalError extends JpiError {
	static getDefaultMessage() {
		return 'Internal JSON-RPC error';
	}
}

/**
 * JSON-RPC standard error code for internal errors.
 * @type {number}
 */
InternalError.code = INTERNAL_ERROR;
