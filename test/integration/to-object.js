/* eslint max-classes-per-file: off */
const { NaniError, MultiError } = require('nani');
const { toObject, JpiError, ParseError, ServerError } = require('../../cjs');

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

	it('converts JpiErrors into JSON-RPC error objects', function() {
		// Create a structure of JpiErrors. These are NaniErrors, so there is
		// no need to test everything again. We just want to make sure the
		// numeric codes supported.
		const err = new ServerError({
			shortMessage: 'foo',
			cause: new JpiError('bar', new ParseError('baz')),
		});

		// Convert the structure and check the result.
		expect(toObject(err)).to.deep.equal({
			message: 'foo : bar : baz',
			code: ServerError.code,
			data: {
				name: ServerError.name,
				fullName: ServerError.fullName,
				shortMessage: 'foo',
				cause: {
					message: 'bar : baz',
					data: {
						name: JpiError.name,
						fullName: JpiError.fullName,
						shortMessage: 'bar',
						cause: {
							message: 'baz',
							code: ParseError.code,
							data: {
								name: ParseError.name,
								fullName: ParseError.fullName,
								shortMessage: 'baz',
							},
						},
					},
				},
			},
		});
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
				cause: {
					message: 'Cause of error',
					data: {
						name: 'Error',
						fullName: 'Error',
						stack: cause.stack,
					},
				},
				stack: err.stack,
			},
		});
	});
});
