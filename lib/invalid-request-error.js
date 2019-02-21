import { INVALID_REQUEST } from './error-codes';
import { JpiError } from './jpi-error';

export class InvalidRequestError extends JpiError {
	static getDefaultMessage() {
		return 'Sent JSON is not a valid Request object';
	}
}

InvalidRequestError.code = INVALID_REQUEST;
