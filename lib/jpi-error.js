import { NaniError } from 'nani';

/**
 * Base class for all errors defined by jpi, as well as any application-defined
 * errors. This class does not have its own code, but does have a getter for the
 * code on instances, so codes only need to be defined on subclass constructors.
 *
 * To create your own application-defined JSON-RPC error, inherit from this
 * class and assign an integer code to the subclass's constructor. The code must
 * be greater than -32099, as specified by the JSON-RPC standard.
 *
 * This class, and therefore all other errors in ths project, inherit from
 * [NaniError](https://sripberger.github.io/nani/#nanierror). For more
 * information, see [Nani](https://www.npmjs.com/package/nani).
 */
export class JpiError extends NaniError {
	get code() {
		return this.constructor.code;
	}
}
