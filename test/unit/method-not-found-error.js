import { JpiError } from '../../lib/jpi-error';
import { METHOD_NOT_FOUND } from '../../lib/error-codes';
import { MethodNotFoundError } from '../../lib/method-not-found-error';

describe('MethodNotFoundError', function() {
	it('extends JpiError', function() {
		expect(new MethodNotFoundError()).to.be.an.instanceof(JpiError);
	});

	it('has standard JSON-RPC code', function() {
		expect(MethodNotFoundError.code).to.equal(METHOD_NOT_FOUND);
	});

	describe('::getDefaultMessage', function() {
		it('returns an appropriate default message', function() {
			expect(MethodNotFoundError.getDefaultMessage({})).to.equal(
				'Method not found'
			);
		});

		it('includes method if provided in info', function() {
			expect(MethodNotFoundError.getDefaultMessage({ method: 'foo' }))
				.to.equal('Method \'foo\' not found');
		});
	});
});
