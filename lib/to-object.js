import { Converter } from './converter';

export function toObject(err) {
	return new Converter().convert(err);
}
