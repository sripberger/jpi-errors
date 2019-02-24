import * as nani from 'nani';
import { toObjectSimple } from '../../lib/to-object-simple';

describe('toObjectSimple', function() {
	const message = 'Error message';
	const name = 'TestError';
	let err;

	beforeEach(function() {
		err = new Error(message);
		err.name = name;

		sinon.stub(nani, 'getFullName').returns(null);
	});

	it('converts an error into a JSON-RPC error object', function() {
		expect(toObjectSimple(err)).to.deep.equal({
			message,
			data: { name },
		});
	});

	it('includes code at top level, if it is an integer', function() {
		const code = err.code = 0;

		expect(toObjectSimple(err)).to.deep.equal({
			message,
			code,
			data: { name },
		});
	});

	it('includes code in data, if it is not an integer', function() {
		const code = err.code = 3.14;

		expect(toObjectSimple(err)).to.deep.equal({
			message,
			data: { name, code },
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

	it('includes error info in data, if any', function() {
		const info = err.info = { foo: 'bar' };

		expect(toObjectSimple(err)).to.deep.equal({
			message,
			data: { name, info },
		});
	});

	it('includes stack, if includeStack argument is true', function() {
		expect(toObjectSimple(err, true)).to.deep.equal({
			message,
			data: { name, stack: err.stack },
		});
	});
});
