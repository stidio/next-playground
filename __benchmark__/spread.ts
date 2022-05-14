import { Suite, Event } from 'benchmark';
import _ from 'lodash';

const obj = { a: [{ b: { c: 3 } }, 4] };

const suite = new Suite();
suite
  .add('Spread', () => {
    const {
      a: [
        {
          b: { c },
        },
        d,
      ],
    } = obj as any;
    return [c, d];
  })
  .add('at', () => [(obj.a[0] as any).b.c, obj.a[1]])
  .add('_.at', () => _.at(obj, ['a[0].b.c', 'a[1]']))
  .add('_.chain.at', () =>
    _.chain(obj)
      .at(['a[0].b.c', 'a[1]'] as any)
      .value()
  )
  .on('cycle', (event: Event) => console.log(event.target.toString()))
  .on('complete', () => console.log('Fastest is ' + suite.filter('fastest').map('name')))
  .run({ async: true });
