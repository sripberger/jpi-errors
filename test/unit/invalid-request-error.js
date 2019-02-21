import { INVALID_REQUEST } from '../../lib/error-codes';
import { InvalidRequestError } from '../../lib/invalid-request-error';
import { JpiError } from '../../lib/jpi-error';

describe('InvalidRequestError', function() {
	it('extends JpiError', function() {
		expect(new InvalidRequestError()).to.be.an.instanceof(JpiError);
	});

	it('has standard JSON-RPC code', function() {
		expect(InvalidRequestError.code).to.equal(INVALID_REQUEST);
	});

	describe('::getDefaultMessage', function() {
		it('returns an appropriate default message', function() {
			expect(InvalidRequestError.getDefaultMessage()).to.equal(
				'Sent JSON is not a valid Request object'
			);
		});
	});
});
