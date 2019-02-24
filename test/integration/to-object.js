/* eslint max-classes-per-file: off */
const { NaniError, MultiError } = require('nani');
const { toObject } = require('../../cjs');

describe('toObject', function() {
	it('converts standard js errors into JSON-RPC error objects', function() {
		// Try a plain Error.
		expect(toObject(new Error('Omg bad error!'))).to.deep.equal({
			message: 'Omg bad error!',
			data: { name: 'Error', fullName: 'Error' },
		});

		// Try a TypeError.
		expect(toObject(new TypeError('Omg type was wrong!'))).to.deep.equal({
			message: 'Omg type was wrong!',
			data: { name: 'TypeError', fullName: 'Error.TypeError' },
		});
	});

	it('converts arbitrary NaniErrors into JSON-RPC error objects', function() {
		// Create some subclasses.
		class FooError extends NaniError {}
		class BarError extends FooError {}

		// Create a big, crazy error structure to test all the things.
		const err = new FooError({
			shortMessage: 'foo',
			info: { omg: 'wow' },
			cause: new BarError('bar', new MultiError(
				new FooError('nested foo', new Error('whatever')),
				new BarError('nested bar', { info: { yay: 'huzzah' } })
			)),
		});

		// Convert the structure and check the result.
		expect(toObject(err)).to.deep.equal({
			message: 'foo : bar : First of 2 errors : nested foo : whatever',
			data: {
				name: FooError.name,
				fullName: FooError.fullName,
				shortMessage: 'foo',
				info: { omg: 'wow' },
				cause: {
					message: 'bar : First of 2 errors : nested foo : whatever',
					data: {
						shortMessage: 'bar',
						name: BarError.name,
						fullName: BarError.fullName,
						cause: {
							message: 'First of 2 errors : nested foo' +
								' : whatever',
							data: {
								name: MultiError.name,
								fullName: MultiError.fullName,
								shortMessage: 'First of 2 errors : nested foo',
								cause: {
									message: 'nested foo : whatever',
									data: {
										name: FooError.name,
										fullName: FooError.fullName,
										shortMessage: 'nested foo',
										cause: {
											message: 'whatever',
											data: {
												name: 'Error',
												fullName: 'Error',
											},
										},
									},
								},
								errors: [
									{
										message: 'nested foo : whatever',
										data: {
											name: FooError.name,
											fullName: FooError.fullName,
											shortMessage: 'nested foo',
											cause: {
												message: 'whatever',
												data: {
													name: 'Error',
													fullName: 'Error',
												},
											},
										},
									},
									{
										message: 'nested bar',
										data: {
											name: BarError.name,
											fullName: BarError.fullName,
											shortMessage: 'nested bar',
											info: { yay: 'huzzah' },
										},
									},
								],
							},
						},
					},
				},
			},
		});
	});
});
