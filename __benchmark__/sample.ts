import { Suite, Event } from 'benchmark';

const suite = new Suite()
  .add('RegExp.test', () => /o/.test('Hello World!'))
  .add('String.indexOf', () => 'Hello World!'.indexOf('o') > -1)
  .on('cycle', (event: Event) => console.log(event.target.toString()))
  .on('complete', () => console.log('Fastest is ' + suite.filter('fastest').map('name')))
  .run({ async: true });
