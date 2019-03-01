import { JpiError } from './jpi-error';
import { REQUEST_FAILED } from './error-codes';

export class RequestFailedError extends JpiError {
	static getDefaultMessage() {
		return 'Failed to read the request body';
	}
}

RequestFailedError.code = REQUEST_FAILED;
