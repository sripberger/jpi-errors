import { JpiError } from '../../lib/jpi-error';
import { REQUEST_FAILED } from '../../lib/error-codes';
import { RequestFailedError } from '../../lib/request-failed-error';

describe('RequestFailedError', function() {
	it('extends JpiError', function() {
		expect(new RequestFailedError()).to.be.an.instanceof(JpiError);
	});

	it('has implementation-defined error code', function() {
		expect(RequestFailedError.code).to.equal(REQUEST_FAILED);
	});

	describe('::getDefaultMessage', function() {
		it('returns an appropriate default message', function() {
			expect(RequestFailedError.getDefaultMessage()).to.equal(
				'Failed to read the request body'
			);
		});
	});
});
