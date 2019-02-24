import * as fromObjectSimpleModule from '../../lib/from-object-simple';
import { fromObject } from '../../lib/from-object';

describe('fromObject', function() {
	let data, obj, err, fromObjectSimple;

	beforeEach(function() {
		data = {};
		obj = { message: 'Omg bad error!', data };
		err = new Error('omg bad error!');

		fromObjectSimple = sinon.stub(
			fromObjectSimpleModule,
			'fromObjectSimple'
		);

		fromObjectSimple.withArgs(obj).returns(err);
	});

	it('converts obj to err using fromObjectSimple', function() {
		const result = fromObject(obj);

		expect(fromObjectSimple).to.be.calledOnce;
		expect(fromObjectSimple).to.be.calledWith(obj);
		expect(result).to.equal(err);
	});

	it('supports cause chains', function() {
		const fooObj = { message: 'foo' };
		const fooErr = new Error('foo');
		const barObj = { message: 'bar' };
		const barErr = new Error('bar');
		data.cause = fooObj;
		fooObj.data = { cause: barObj };
		fromObjectSimple
			.withArgs(fooObj).returns(fooErr)
			.withArgs(barObj).returns(barErr);

		const result = fromObject(obj);

		expect(result.cause).to.equal(fooErr);
		expect(result.cause.cause).to.equal(barErr);
	});

	it('supports null as a cause', function() {
		data.cause = null;

		const result = fromObject(obj);

		expect(result.cause).to.be.null;
	});

	it('supports undefined as a cause', function() {
		data.cause = undefined;

		const result = fromObject(obj);

		expect(result).to.have.property('cause');
		expect(result.cause).to.be.undefined;
	});

	it('supports errors array', function() {
		const fooObj = { message: 'foo' };
		const fooErr = new Error('foo');
		const barObj = { message: 'bar' };
		const barErr = new Error('bar');
		const bazObj = { message: 'baz' };
		const bazErr = new Error('baz');
		data.errors = [ fooObj, barObj ];
		data.cause = bazObj; // This is here to make sure it is ignored.
		fromObjectSimple
			.withArgs(fooObj).returns(fooErr)
			.withArgs(barObj).returns(barErr)
			.withArgs(bazObj).returns(bazErr);

		const result = fromObject(obj);

		expect(result.errors).to.deep.equal([ fooErr, barErr ]);
		expect(result.cause).to.equal(fooErr); // Ensure primary cause was set.
	});

	it('supports cause chains in errors array', function() {
		const fooObj = { message: 'foo' };
		const fooErr = new Error('foo');
		const barObj = { message: 'bar' };
		const barErr = new Error('bar');
		const bazObj = { message: 'baz' };
		const bazErr = new Error('baz');
		data.errors = [ fooObj, barObj ];
		data.cause = bazObj;
		barObj.data = { cause: bazObj };
		fromObjectSimple
			.withArgs(fooObj).returns(fooErr)
			.withArgs(barObj).returns(barErr)
			.withArgs(bazObj).returns(bazErr);

		const result = fromObject(obj);

		expect(result.errors).to.deep.equal([ fooErr, barErr ]);
		expect(result.cause).to.equal(fooErr);
		expect(result.errors[1].cause).to.equal(bazErr);
	});

	it('sets primary cause to null for empty errors array', function() {
		data.errors = [];

		const result = fromObject(obj);

		expect(result.errors).to.deep.equal([]);
		expect(result.cause).to.be.null;
	});
});
