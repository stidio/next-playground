import { Suite, Event } from 'benchmark';
import _ from 'lodash';

const list = (a: number, b: number, c: number) => [a, b, c];
const o0 = list.bind(null, 0);
const b0 = _.bind(list, null, 0);
const b1 = _.bind(list, null, _, 0);
const b2 = _.bind(list, null, _, _, 0);
const p0 = _.partial(list, 0);
const p1 = _.partial(list, _, 0);
const p2 = _.partial(list, _, _, 0);
const pr0 = _.partialRight(list, 0);
const pr1 = _.partialRight(list, 0, _);
const pr2 = _.partialRight(list, 0, _, _);
const curried = _.curry(list);

const suite = new Suite();
suite
  .add('Original', () => list(0, 1, 2))
  .add('Function.bind(0)', () => o0(1, 2))
  .add('_.bind(0)', () => b0(1, 2))
  .add('_.bind(_, 0)', () => b1(1, 2))
  .add('_.bind(_, _, 0)', () => b2(1, 2))
  .add('_.partial(0)', () => p0(1, 2))
  .add('_.partial(_, 0, _)', () => p1(1, 2))
  .add('_.partial(_, _, 0)', () => p2(1, 2))
  .add('_.partialRight(0)', () => pr0(1, 2))
  .add('_.partialRight(_, 0, _)', () => pr1(1, 2))
  .add('_.partialRight(_, _, 0)', () => pr2(1, 2))
  .add('_.curry(1, 2, 3)', () => curried(1, 2, 3))
  .add('_.curry(1)(2)(3)', () => curried(1)(2)(3))
  .add('_.curry(1, 2)(3)', () => curried(1, 2)(3))
  .add('_.curry(1)(2, 3)', () => curried(1)(2, 3))
  .add('_.curry(1)(_, 3)(2)', () => curried(1)(_, 3)(2))
  .add('_.curry(_, _, 3)(_, 2)(1)', () => curried(_, _, 3)(_, 2)(1))
  .on('cycle', (event: Event) => console.log(event.target.toString()))
  .on('complete', () => console.log('Fastest is ' + suite.filter('fastest').map('name')))
  .run({ async: true });
