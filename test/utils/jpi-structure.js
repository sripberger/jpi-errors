const { JpiError, ParseError, ServerError } = require('../../cjs');

// Here's a structure of JpiErrors for testing. These are NaniErrors, so there
// is no need to test everything again. We just want to make sure the numeric
// codes are supported.
export const err = new ServerError({
	shortMessage: 'foo',
	cause: new JpiError('bar', new ParseError('baz')),
});

// Here's the equivalent object that should be output by toObject.
export const obj = {
	message: 'foo : bar : baz',
	code: ServerError.code,
	data: {
		name: ServerError.name,
		fullName: ServerError.fullName,
		shortMessage: 'foo',
		info: null,
		cause: {
			message: 'bar : baz',
			data: {
				name: JpiError.name,
				fullName: JpiError.fullName,
				shortMessage: 'bar',
				info: null,
				cause: {
					message: 'baz',
					code: ParseError.code,
					data: {
						name: ParseError.name,
						fullName: ParseError.fullName,
						shortMessage: 'baz',
						info: null,
					},
				},
			},
		},
	},
};
