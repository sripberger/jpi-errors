import { Converter } from './converter';

export function toObject(err, includeStacks = false) {
	return new Converter(includeStacks).convert(err);
}
