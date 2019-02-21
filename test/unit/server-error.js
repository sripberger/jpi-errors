import { JpiError } from '../../lib/jpi-error';
import { SERVER_ERROR } from '../../lib/error-codes';
import { ServerError } from '../../lib/server-error';

describe('ServerError', function() {
	it('extends JpiError', function() {
		expect(new ServerError()).to.be.an.instanceof(JpiError);
	});

	it('has standard JSON-RPC code', function() {
		expect(ServerError.code).to.equal(SERVER_ERROR);
	});

	describe('::getDefaultMessage', function() {
		it('returns an appropriate default message', function() {
			expect(ServerError.getDefaultMessage()).to.equal('Server error');
		});
	});
});
