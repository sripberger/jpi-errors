import * as nani from 'nani';
import * as toObjectSimpleModule from '../../lib/to-object-simple';
import { Converter } from '../../lib/converter';

describe('Converter', function() {
	it('supports includeStacks argument', function() {
		expect(new Converter(true).includeStacks).to.be.true;
	});

	it('defaults to includeStacks false', function() {
		expect(new Converter().includeStacks).to.be.false;
	});

	it('creates an empty map on objectsByError', function() {
		const converter = new Converter();

		expect(converter.objectsByError).to.be.an.instanceof(Map);
		expect(converter.objectsByError).to.be.empty;
	});

	describe('#add', function() {
		let converter, err, obj, toObjectSimple;

		beforeEach(function() {
			converter = new Converter();
			err = new Error('Omg bad error!');
			obj = { message: err.message, data: {} };

			toObjectSimple = sinon.stub(toObjectSimpleModule, 'toObjectSimple')
				.withArgs(err).returns(obj);
		});

		it('converts err to obj using toObjectSimple and includeStacks setting', function() {
			converter.includeStacks = 'includeStacks value';

			converter.add({ err, parent: null, inArray: false });

			expect(toObjectSimple).to.be.calledOnce;
			expect(toObjectSimple).to.be.calledWith(
				err,
				converter.includeStacks
			);
		});

		it('stores obj in objectsByError', function() {
			converter.add({ err, parent: null, inArray: false });

			expect(converter.objectsByError).to.have.keys([ err ]);
			expect(converter.objectsByError.get(err)).to.equal(obj);
		});

		it('handles a single cause relationship', function() {
			const parent = new Error('Parent error');
			const parentObj = { data: {} };
			converter.objectsByError.set(parent, parentObj);

			converter.add({ err, parent, inArray: false });

			expect(parentObj.data.cause).to.equal(obj);
			expect(parentObj.data).to.not.have.property('errors');
		});

		it('handles the first cause in a multi-cause relationship', function() {
			const parent = new Error('Parent error');
			const parentObj = { data: {} };
			converter.objectsByError.set(parent, parentObj);

			converter.add({ err, parent, inArray: true });

			expect(parentObj.data.cause).to.equal(obj);
			expect(parentObj.data.errors).to.deep.equal([ obj ]);
		});

		it('handles subsequent causes in a multi-cause relationship', function() {
			const cause = { foo: 'bar' };
			const parent = new Error('Parent error');
			const parentObj = { data: { cause, errors: [ cause ] } };
			converter.objectsByError.set(parent, parentObj);

			converter.add({ err, parent, inArray: true });

			expect(parentObj.data.cause).to.equal(cause);
			expect(parentObj.data.errors).to.deep.equal([ cause, obj ]);
		});

		it('does nothing if parent is not in objectsByError', function() {
			const parent = new Error('Parent error');

			converter.add({ err, parent, inArray: false });

			expect(toObjectSimple).to.not.be.called;
			expect(converter.objectsByError).to.be.empty;
		});

		it('does nothing if cause alread set and inArray is false', function() {
			const cause = { foo: 'bar' };
			const parent = new Error('Parent error');
			const parentObj = { data: { cause } };
			converter.objectsByError.set(parent, parentObj);

			converter.add({ err, parent, inArray: false });

			expect(toObjectSimple).to.not.be.called;
			expect(parentObj.data.cause).to.equal(cause);
			expect(converter.objectsByError).to.have.keys([ parent ]);
		});
	});

	describe('#convert', function() {
		let converter, err, items;

		beforeEach(function() {
			converter = new Converter();
			err = new Error('Omg bad error!');
			items = [ { foo: 'bar' }, { baz: 'qux' } ];

			sinon.stub(nani, 'iterateFull').returns(items[Symbol.iterator]());
			sinon.stub(converter, 'add');
		});

		it('adds all items from nani.iterateFull', function() {
			converter.convert(err);

			expect(nani.iterateFull).to.be.calledOnce;
			expect(nani.iterateFull).to.be.calledWith(err);
			expect(converter.add).to.be.calledTwice;
			expect(converter.add.args).to.deep.equal(items.map((i) => [ i ]));
		});

		it('returns obj for err from objectsByError', function() {
			const obj = { message: err.message, data: { name: err.name } };
			converter.add.onSecondCall().callsFake(() => {
				// Put the error in the map *after* iteration is done,
				// to make sure we're not getting it too early.
				converter.objectsByError.set(err, obj);
			});

			expect(converter.convert(err)).to.equal(obj);
		});
	});
});
