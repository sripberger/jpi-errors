import * as converterModule from '../../lib/converter';
import { toObject } from '../../lib/to-object';

describe('toObject', function() {
	let err, obj, converter;

	beforeEach(function() {
		err = new Error('Omg bad error!');
		obj = { foo: 'bar' };
		converter = sinon.createStubInstance(converterModule.Converter);

		converter.convert.returns(obj);
		sinon.stub(converterModule, 'Converter').returns(converter);
	});

	it('creates a new Converter instance', function() {
		toObject(err);

		expect(converterModule.Converter).to.be.calledOnce;
		expect(converterModule.Converter).to.be.calledWithNew;
	});

	it('converts the error using the Converter instance', function() {
		toObject(err);

		expect(converter.convert).to.be.calledOnce;
		expect(converter.convert).to.be.calledWith(err);
	});

	it('returns the result of the conversion', function() {
		expect(toObject(err)).to.equal(obj);
	});

	it('supports includeStacks argument', function() {
		toObject(err, true);

		expect(converterModule.Converter).to.be.calledWith(true);
	});

	it('defaults to includeStacks false', function() {
		toObject(err);

		expect(converterModule.Converter).to.be.calledWith(false);
	});
});
