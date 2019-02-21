import { NaniError } from 'nani';

export class JpiError extends NaniError {
	get code() {
		return this.constructor.code;
	}
}
