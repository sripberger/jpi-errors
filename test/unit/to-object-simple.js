import * as nani from 'nani';
import { assign, keyBy, mapValues } from 'lodash';
import { JpiError } from '../../lib/jpi-error';
import { naniProperties } from '../../lib/nani-properties';
import { toObjectSimple } from '../../lib/to-object-simple';

// Transform naniProperties into an object we can easily assign onto stuff.
const naniObj = mapValues(keyBy(naniProperties), (p) => `${p} value`);

describe('toObjectSimple', function() {
	const message = 'Error message';
	let err;

	beforeEach(function() {
		err = new Error(message);

		sinon.stub(nani, 'is').returns(false);
	});

	it('converts an error into a JSON-RPC error object', function() {
		expect(toObjectSimple(err)).to.deep.equal({ message });
	});

	it('includes name in data, if it is not \'Error\'', function() {
		const name = err.name = 'TestError';

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

			expect(toObjectSimple(err)).to.deep.equal({ message, code });
		});

		it('ignores code if it is not an integer', function() {
			err.code = 3.14;

			expect(toObjectSimple(err)).to.deep.equal({ message });
		});
	});

	context('err is not a JpiError', function() {
		it('includes code in data, if any', function() {
			const code = err.code = 'error_code';

			expect(toObjectSimple(err)).to.deep.equal({
				message,
				data: { code },
			});
		});

		it('supports undefined code', function() {
			err.code = undefined;

			expect(toObjectSimple(err)).to.deep.equal({
				message,
				data: { code: undefined },
			});
		});
	});

	it('includes naniProperties in data if err is a NaniError', function() {
		nani.is.withArgs(nani.NaniError, err).returns(true);
		assign(err, naniObj);

		expect(toObjectSimple(err)).to.deep.equal({
			message,
			data: naniObj,
		});
	});

	it('ignores naniProperties if err is not a NaniError', function() {
		assign(err, naniObj);

		expect(toObjectSimple(err)).to.deep.equal({ message });
	});

	it('includes stack in data, if specified', function() {
		expect(toObjectSimple(err, true)).to.deep.equal({
			message,
			data: { stack: err.stack },
		});
	});
});
