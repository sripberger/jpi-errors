const { toObject } = require('../../cjs');

describe.skip('toObject', function() {
	const message = 'Error message';
	const name = 'TestError';
	let err;

	beforeEach(function() {
		err = new Error(message);
		err.name = name;
	});

	it('converts an error into a JSON-RPC error object', function() {
		expect(toObject(err)).to.deep.equal({
			message,
			data: { name },
		});
	});

	it('includes code at top level, if it is an integer', function() {
		const code = err.code = 0;

		expect(toObject(err)).to.deep.equal({
			message,
			code,
			data: { name },
		});
	});

	it('includes code in data, if it is not an integer', function() {
		const code = err.code = 3.14;

		expect(toObject(err)).to.deep.equal({
			message,
			data: { name, code },
		});
	});

	it('supports cause as converted object in data, if any', function() {
		err.cause = new Error('Cause of error');
		err.cause.name = 'CauseError';
		err.cause.cause = new Error('Cause of cause of error');
		err.cause.cause.name = 'CauseCauseError';

		expect(toObject(err)).to.deep.equal({
			message,
			data: {
				name,
				cause: {
					message: err.cause.message,
					data: {
						name: err.cause.name,
						cause: {
							message: err.cause.cause.message,
							data: { name: err.cause.cause.name },
						},
					},
				},
			},
		});
	});

	it('includes converted errors array instead of cause, if any', function() {
		const fooErr = new Error('Foo error');
		fooErr.name = 'FooError';
		fooErr.cause = new Error('Cause of foo error');
		const barErr = new Error('Bar error');
		barErr.name = 'BarError';
		err.errors = [ fooErr, barErr ];
		err.cause = new Error('Should be ignored');

		expect(toObject(err)).to.deep.equal({
			message,
			data: {
				name,
				errors: [
					{
						message: fooErr.message,
						data: {
							name: fooErr.name,
							cause: {
								message: fooErr.cause.message,
								data: { name: fooErr.cause.name },
							},
						},
					},
					{
						message: barErr.message,
						data: { name: barErr.name },
					},
				],
			},
		});
	});

	it('handles circular references in the cause chain', function() {
		err.cause = new Error('Cause of error');
		err.cause.name = 'CauseError';
		err.cause.cause = err;

		expect(toObject(err)).to.deep.equal({
			message: err.message,
			data: {
				name: err.name,
				cause: {
					message: err.cause.message,
					data: { name: err.cause.name },
				},
			},
		});
	});

	it('handles circular references in the errors array', function() {
		const fooErr = new Error('Foo error');
		fooErr.name = 'FooError';
		const barErr = new Error('Bar error');
		barErr.name = 'BarError';
		barErr.cause = fooErr;
		err.errors = [ fooErr, barErr, err ];

		expect(toObject(err)).to.deep.equal({
			message: err.message,
			data: {
				name: err.name,
				errors: [
					{
						message: fooErr.message,
						data: { name: fooErr.name },
					},
					{
						message: barErr.message,
						data: {
							name: barErr.name,
							cause: {
								message: fooErr.message,
								data: { name: fooErr.name },
							},
						},
					},
				],
			},
		});
	});
});
