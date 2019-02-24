import * as nani from 'nani';
import { assign, keyBy, mapValues } from 'lodash';
import { JpiError } from '../../lib/jpi-error';
import { naniProperties } from '../../lib/nani-properties';
import { toObjectSimple } from '../../lib/to-object-simple';

// Transform naniProperties into an object we can easily assign onto stuff.
const naniObj = mapValues(keyBy(naniProperties), (p) => `${p} value`);

describe('toObjectSimple', function() {
	const message = 'Error message';
	const name = 'TestError';
	let err;

	beforeEach(function() {
		err = new Error(message);
		err.name = name;

		sinon.stub(nani, 'is').returns(false);
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

	context('err is a NaniError', function() {
		beforeEach(function() {
			nani.is.withArgs(nani.NaniError, err).returns(true);
		});

		it('includes naniProperties in data', function() {
			assign(err, naniObj);

			expect(toObjectSimple(err)).to.deep.equal({
				message,
				data: assign({ name }, naniObj),
			});
		});
	});

	context('err is not a NaniError', function() {
		it('ignores naniProperties', function() {
			assign(err, naniObj);

			expect(toObjectSimple(err)).to.deep.equal({
				message,
				data: { name },
			});
		});
	});

	it('includes stack in data, if specified', function() {
		expect(toObjectSimple(err, true)).to.deep.equal({
			message,
			data: { name, stack: err.stack },
		});
	});
});
