import { BarError, FooError } from './test-classes';
import { MultiError } from 'nani';

// Here's a big, crazy error structure for testing all the things.
export const err = new FooError({
	shortMessage: 'foo',
	info: { omg: 'wow' },
	cause: new BarError('bar', new MultiError(
		new FooError('nested foo', new Error('whatever')),
		new BarError('nested bar', { info: { yay: 'huzzah' } })
	)),
});

// Here's the equivalent object that should be output by toObject.
export const obj = {
	message: 'foo : bar : First of 2 errors : nested foo : whatever',
	data: {
		name: FooError.name,
		fullName: FooError.fullName,
		shortMessage: 'foo',
		info: { omg: 'wow' },
		cause: {
			message: 'bar : First of 2 errors : nested foo : whatever',
			data: {
				name: BarError.name,
				fullName: BarError.fullName,
				shortMessage: 'bar',
				info: null,
				cause: {
					message: 'First of 2 errors : nested foo : whatever',
					data: {
						name: MultiError.name,
						fullName: MultiError.fullName,
						shortMessage: 'First of 2 errors : nested foo',
						info: null,
						cause: {
							message: 'nested foo : whatever',
							data: {
								name: FooError.name,
								fullName: FooError.fullName,
								shortMessage: 'nested foo',
								info: null,
								cause: { message: 'whatever' },
							},
						},
						errors: [
							{
								message: 'nested foo : whatever',
								data: {
									name: FooError.name,
									fullName: FooError.fullName,
									shortMessage: 'nested foo',
									info: null,
									cause: { message: 'whatever' },
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
};
