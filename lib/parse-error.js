import { JpiError } from './jpi-error';
import { PARSE_ERROR } from './error-codes';

export class ParseError extends JpiError {
	static getDefaultMessage() {
		return 'Could not parse sent JSON';
	}
}

ParseError.code = PARSE_ERROR;
