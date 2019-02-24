import * as nani from 'nani';
import { JpiError } from '../../lib/jpi-error';
import { toObjectSimple } from '../../lib/to-object-simple';

describe('toObjectSimple', function() {
	const message = 'Error message';
	const name = 'TestError';
	let err;

	beforeEach(function() {
		err = new Error(message);
		err.name = name;

		sinon.stub(nani, 'is').returns(false);
		sinon.stub(nani, 'getFullName').returns(null);
	});

	it('converts an error into a JSON-RPC error object', function() {
		expect(toObjectSimple(err)).to.deep.equal({
			message,
			data: { name },
		});
	});

	context('err is a JpiError', function() {
		beforeEach(function() {
			nani.is.withArgs(JpiError, err).returns(true);
		});

		it('includes code at top level if it is an integer', function() {
			const code = err.code = 42;

			expect(toObjectSimple(err)).to.deep.equal({
				message,
				code,
				data: { name },
			});
		});

		it('ignores code if it is not an integer', function() {
			err.code = 3.14;

			expect(toObjectSimple(err)).to.deep.equal({
				message,
				data: { name },
			});
		});
	});

	context('err is not a JpiError', function() {
		it('includes code in data, if any', function() {
			const code = err.code = 'error_code';

			expect(toObjectSimple(err)).to.deep.equal({
				message,
				data: { name, code },
			});
		});

		it('supports undefined code', function() {
			err.code = undefined;

			expect(toObjectSimple(err)).to.deep.equal({
				message,
				data: { name, code: undefined },
			});
		});
	});

	it('includes fullName in data, if any', function() {
		const fullName = 'Full error name';
		nani.getFullName.withArgs(err).returns(fullName);

		expect(toObjectSimple(err)).to.deep.equal({
			message,
			data: { name, fullName },
		});
	});

	it('includes shortMessage in data, if any', function() {
		const shortMessage = err.shortMessage = 'Short error message';

		expect(toObjectSimple(err)).to.deep.equal({
			message,
			data: { name, shortMessage },
		});
	});

	it('supports undefined shortMessage', function() {
		err.shortMessage = undefined;

		expect(toObjectSimple(err)).to.deep.equal({
			message,
			data: { name, shortMessage: undefined },
		});
	});

	it('includes error info in data, if any', function() {
		const info = err.info = { foo: 'bar' };

		expect(toObjectSimple(err)).to.deep.equal({
			message,
			data: { name, info },
		});
	});

	it('supports undefined info', function() {
		err.info = undefined;

		expect(toObjectSimple(err)).to.deep.equal({
			message,
			data: { name, info: undefined },
		});
	});

	it('includes stack, if specified', function() {
		expect(toObjectSimple(err, true)).to.deep.equal({
			message,
			data: { name, stack: err.stack },
		});
	});
});
