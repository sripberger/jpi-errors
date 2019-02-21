import { INTERNAL_ERROR } from '../../lib/error-codes';
import { InternalError } from '../../lib/internal-error';
import { JpiError } from '../../lib/jpi-error';

describe('InternalError', function() {
	it('extends JpiError', function() {
		expect(new InternalError()).to.be.an.instanceof(JpiError);
	});

	it('has standard JSON-RPC code', function() {
		expect(InternalError.code).to.equal(INTERNAL_ERROR);
	});

	describe('::getDefaultMessage', function() {
		it('returns an appropriate default message', function() {
			expect(InternalError.getDefaultMessage()).to.equal(
				'Internal JSON-RPC error'
			);
		});
	});
});
