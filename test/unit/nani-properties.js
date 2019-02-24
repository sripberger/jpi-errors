import { naniProperties } from '../../lib/nani-properties';

describe('naniProperties', function() {
	it('is an array of Nani standard error properties', function() {
		expect(naniProperties).to.deep.equal([
			'fullName',
			'shortMessage',
			'info',
		]);
	});
});
