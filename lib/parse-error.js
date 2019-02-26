import { JpiError } from './jpi-error';
import { PARSE_ERROR } from './error-codes';

/**
 * Class for standard JSON-RPC parse errors.
 */
export class ParseError extends JpiError {
	static getDefaultMessage() {
		return 'Could not parse sent JSON';
	}
}

/**
 * JSON-RPC standard error code for parse errors.
 * @type {number}
 */
ParseError.code = PARSE_ERROR;
