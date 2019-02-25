const jpiStructure = require('../utils/jpi-structure');
const naniStructure = require('../utils/nani-structure');
const { NaniError } = require('nani');
const { toObject } = require('../../cjs');

describe('toObject', function() {
	it('converts standard js errors into JSON-RPC error objects', function() {
		// Try a plain Error.
		expect(toObject(new Error('Omg bad error!'))).to.deep.equal({
			message: 'Omg bad error!',
		});

		// Try a TypeError.
		expect(toObject(new TypeError('Omg type was wrong!'))).to.deep.equal({
			message: 'Omg type was wrong!',
			data: { name: 'TypeError' },
		});
	});

	it('converts arbitrary NaniErrors into JSON-RPC error objects', function() {
		// Convert a NaniError structure and check the result.
		expect(toObject(naniStructure.err)).to.deep.equal(naniStructure.obj);
	});

	it('converts JpiErrors into JSON-RPC error objects', function() {
		// Covert a JpiError structure and check the result.
		expect(toObject(jpiStructure.err)).to.deep.equal(jpiStructure.obj);
	});

	it('supports includeStacks argument', function() {
		// Create a simple structure.
		const cause = new Error('Cause of error');
		const err = new NaniError('Omg bad error!', cause);

		// Convert the structure and make sure the stacks are there.
		expect(toObject(err, true)).to.deep.equal({
			message: 'Omg bad error! : Cause of error',
			data: {
				name: 'NaniError',
				fullName: 'Error.NaniError',
				shortMessage: 'Omg bad error!',
				info: null,
				cause: {
					message: 'Cause of error',
					data: { stack: cause.stack },
				},
				stack: err.stack,
			},
		});
	});
});
