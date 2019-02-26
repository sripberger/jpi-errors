import { JpiError } from './jpi-error';
import { METHOD_NOT_FOUND } from './error-codes';

/**
 * Class for standard JSON-RPC method not found errors.
 */
export class MethodNotFoundError extends JpiError {
	static getDefaultMessage(info) {
		if (info.method) return `Method '${info.method}' not found`;
		return 'Method not found';
	}
}

/**
 * JSON-RPC standard error code for method not found errors.
 * @type {number}
 */
MethodNotFoundError.code = METHOD_NOT_FOUND;
