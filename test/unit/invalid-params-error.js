import { INVALID_PARAMS } from '../../lib/error-codes';
import { InvalidParamsError } from '../../lib/invalid-params-error';
import { JpiError } from '../../lib/jpi-error';

describe('InvalidParamsError', function() {
	it('extends JpiError', function() {
		expect(new InvalidParamsError()).to.be.an.instanceof(JpiError);
	});

	it('has standard JSON-RPC code', function() {
		expect(InvalidParamsError.code).to.equal(INVALID_PARAMS);
	});

	describe('::getDefaultMessage', function() {
		it('returns an appropriate default message', function() {
			expect(InvalidParamsError.getDefaultMessage()).to.equal(
				'Invalid method parameters'
			);
		});
	});
});
