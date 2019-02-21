import { INVALID_PARAMS } from './error-codes';
import { JpiError } from './jpi-error';

export class InvalidParamsError extends JpiError {
	static getDefaultMessage() {
		return 'Invalid method parameters';
	}
}

InvalidParamsError.code = INVALID_PARAMS;
