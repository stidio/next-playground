import { Suite, Event } from 'benchmark';
import _ from 'lodash';

const obj = { a: 1, b: 2, c: 3 };
const fxx = _.flow(Object.entries, Object.fromEntries);
const suite = new Suite();
suite
  .add('Object.entries', () => Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, value])))
  .add('Object.entries[nomap]', () => Object.fromEntries(Object.entries(obj)))
  .add('Object.entries[nomap, flow]', () => fxx(obj))
  .add('_.toPairs', () => _.fromPairs(_.toPairs(obj).map(([key, value]) => [key, value])))
  .add('_.toPairs[nomap]', () => _.fromPairs(_.toPairs(obj)))
  .add('_.map', () => _.fromPairs(_.map(obj, (value, key) => [key, value])))
  .add('map[flow]', () =>
    _.flow(
      _.partialRight(_.map, (value: number, key: string) => [key, value]),
      _.fromPairs
    )(obj)
  )
  .add('_.chain.map', () =>
    _.chain(obj)
      .map((value, key) => [key, value])
      .fromPairs()
      .value()
  )
  .add('_.mapKeys', () => _.mapKeys(obj, (value, key) => key))
  .add('_.chain.mapKeys', () =>
    _.chain(obj)
      .mapKeys((value, key) => key)
      .value()
  )
  .add('_.mapValues', () => _.mapValues(obj, (value) => value))
  .add('_.chain.mapValues', () =>
    _.chain(obj)
      .mapValues((value) => value)
      .value()
  )
  .add('for...in', () => {
    const result: any = {};
    for (const key in obj) result[key] = obj[key as keyof typeof obj];
    return result;
  })
  .on('cycle', (event: Event) => console.log(event.target.toString()))
  .on('complete', () => console.log('Fastest is ' + suite.filter('fastest').map('name')))
  .run({ async: true });
