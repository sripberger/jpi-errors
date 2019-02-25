import { NaniError } from 'nani';

/* eslint max-classes-per-file: off */
export class FooError extends NaniError {}
export class BarError extends FooError {}
