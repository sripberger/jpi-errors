import { fromObjectSimple } from '../../lib/from-object-simple';
import { naniProperties } from '../../lib/nani-properties';

describe('fromObjectSimple', function() {
	const message = 'some error message';
	const name = 'SomeError';
	let data, obj;

	beforeEach(function() {
		data = { name };
		obj = { message, data };
	});

	it('converts a JSON-RPC error object into an Error instance', function() {
		const result = fromObjectSimple(obj);

		expect(result).to.be.an.instanceof(Error);
		expect(result.message).to.equal(message);
		expect(result.name).to.equal(name);
		// Make sure there aren't any extra properties.
		// Note that `message` is not enumerable.
		expect(result).to.have.keys([ 'name' ]);
	});

	it('includes code, if present at top level', function() {
		obj.code = 42;

		const result = fromObjectSimple(obj);

		expect(result.code).to.equal(obj.code);
	});

	it('supports undefined top-level code', function() {
		obj.code = undefined;

		const result = fromObjectSimple(obj);

		expect(result).to.have.property('code');
		expect(result.code).to.be.undefined;
	});

	it('includes code, if present in data', function() {
		data.code = 'error_code';

		const result = fromObjectSimple(obj);

		expect(result.code).to.equal(data.code);
	});

	it('supports undefined data-level code', function() {
		data.code = undefined;

		const result = fromObjectSimple(obj);

		expect(result).to.have.property('code');
		expect(result.code).to.be.undefined;
	});

	it('prioritizes top-level code', function() {
		obj.code = 42;
		data.code = 'error_code';

		const result = fromObjectSimple(obj);

		expect(result.code).to.equal(obj.code);
	});

	// Loop over naniProperties, creating tests for each.
	for (const prop of naniProperties) {
		it(`includes ${prop} if present in data`, function() {
			data[prop] = `${prop} value`;

			const result = fromObjectSimple(obj);

			expect(result[prop]).to.equal(data[prop]);
		});

		it(`supports undefined ${prop}`, function() {
			data[prop] = undefined;

			const result = fromObjectSimple(obj);

			expect(result).to.have.property(prop);
			expect(result[prop]).to.be.undefined;
		});
	}
});
