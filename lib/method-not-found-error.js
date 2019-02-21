import { JpiError } from './jpi-error';
import { METHOD_NOT_FOUND } from './error-codes';

export class MethodNotFoundError extends JpiError {
	static getDefaultMessage(info) {
		if (info.method) return `Method '${info.method}' not found`;
		return 'Method not found';
	}
}

MethodNotFoundError.code = METHOD_NOT_FOUND;
