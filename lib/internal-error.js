import { INTERNAL_ERROR } from './error-codes';
import { JpiError } from './jpi-error';

export class InternalError extends JpiError {
	static getDefaultMessage() {
		return 'Internal JSON-RPC error';
	}
}

InternalError.code = INTERNAL_ERROR;
