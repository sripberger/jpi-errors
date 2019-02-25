const jpiStructure = require('../utils/jpi-structure');
const naniStructure = require('../utils/nani-structure');
const { fromObject, toObject } = require('../../cjs');

describe('fromObject', function() {
	it('converts standard js errors back from JSON-RPC', function() {
		// Try a plain Error.
		let err = fromObject({ message: 'Omg bad error!' });
		expect(err).to.be.an.instanceof(Error);
		expect(err.name).to.equal('Error');
		expect(err.message).to.equal('Omg bad error!');
		// Any actual stack frames would be useless, so they should be omitted.
		expect(err.stack).to.equal('Error: Omg bad error!');

		// Try a TypeError.
		err = fromObject({
			message: 'Omg type was wrong!',
			data: { name: 'TypeError' },
		});
		expect(err).to.be.an.instanceof(Error);
		expect(err.name).to.equal('TypeError');
		expect(err.message).to.equal('Omg type was wrong!');
		// Any actual stack frames would be useless, so they should be omitted.
		expect(err.stack).to.equal('TypeError: Omg type was wrong!');
	});

	it('converts arbitrary NaniError structures back from JSON-RPC', function() {
		// Convert object to an error.
		const err = fromObject(naniStructure.obj);

		// Convert it back to an object.
		const obj = toObject(err);

		// Compare to original.
		expect(obj).to.deep.equal(naniStructure.obj);
	});

	it('converts JpiErrors back from JSON-RPC', function() {
		// Convert object to an error.
		const err = fromObject(jpiStructure.obj);

		// Convert it back to an object.
		const obj = toObject(err);

		// Compare to original.
		expect(obj).to.deep.equal(jpiStructure.obj);
	});

	it('supports stacks, if provided', function() {
		// Get the NaniError object struture, but with the original stacks.
		const objWithStacks = toObject(naniStructure.err, true);

		// Convert it back into an error.
		const err = fromObject(objWithStacks);

		// Convert it back to an object again, including the stacks.
		const obj = toObject(err, true);

		// Compare to original.
		expect(obj).to.deep.equal(objWithStacks);
	});
});
