import { JpiError } from '../../lib/jpi-error';
import { PARSE_ERROR } from '../../lib/error-codes';
import { ParseError } from '../../lib/parse-error';

describe('ParseError', function() {
	it('extends JpiError', function() {
		expect(new ParseError()).to.be.an.instanceof(JpiError);
	});

	it('has standard JSON-RPC code', function() {
		expect(ParseError.code).to.equal(PARSE_ERROR);
	});

	describe('::getDefaultMessage', function() {
		it('returns an appropriate default message', function() {
			expect(ParseError.getDefaultMessage()).to.equal(
				'Could not parse sent JSON'
			);
		});
	});
});
