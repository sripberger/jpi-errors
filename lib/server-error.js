import { JpiError } from './jpi-error';
import { SERVER_ERROR } from './error-codes';

export class ServerError extends JpiError {
	static getDefaultMessage() {
		return 'Server error';
	}
}

ServerError.code = SERVER_ERROR;
