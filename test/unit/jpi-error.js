import { JpiError } from '../../lib/jpi-error';
import { NaniError } from 'nani';

describe('JpiError', function() {
	it('extends NaniError', function() {
		expect(new JpiError()).to.be.an.instanceof(NaniError);
	});

	describe('@code', function() {
		it('returns code from constructor ', function() {
			// Simple subclass to test inherited behavior.
			class FooError extends JpiError {}
			FooError.code = 42;

			expect(new FooError().code).to.equal(FooError.code);
		});
	});
});
