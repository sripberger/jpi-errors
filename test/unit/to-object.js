import * as converterModule from '../../lib/converter';
import { toObject } from '../../lib/to-object';

describe('toObject', function() {
	it('converts error to an object using a new Converter instance', function() {
		const err = new Error('Omg bad error!');
		const obj = { foo: 'bar' };
		const converter = sinon.createStubInstance(converterModule.Converter);
		converter.convert.returns(obj);
		sinon.stub(converterModule, 'Converter').returns(converter);

		const result = toObject(err);

		expect(converterModule.Converter).to.be.calledOnce;
		expect(converterModule.Converter).to.be.calledWithNew;
		expect(converter.convert).to.be.calledOnce;
		expect(converter.convert).to.be.calledWith(err);
		expect(result).to.equal(obj);
	});
});
