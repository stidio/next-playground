import _ from 'lodash';
import { waitUntilSymbol } from 'next/dist/server/web/spec-compliant/fetch-event';
import util from 'util';

jest.useFakeTimers();

describe('lodash', () => {
  describe('数组', () => {
    test('concat: 连接 [Array.concat]', () => {
      expect(_.concat([1], 2, [3, 4])).toEqual([1, 2, 3, 4]); // 等同于 Array.concat, Array.concat也不会修改原数组
      expect([1].concat(2, [3, 4])).toEqual([1, 2, 3, 4]);
    });
    test('fill(变更): 填充 [Array.fill]', () => {
      {
        const a: Array<number | string> = [1, 2, 3, 4];
        expect(_.fill(a, '*')).toEqual(['*', '*', '*', '*']);
        expect(a).toEqual(['*', '*', '*', '*']);
      }
      {
        const a: Array<number | string> = [1, 2, 3, 4];
        expect(_.fill(a, '*', 1, 3)).toEqual([1, '*', '*', 4]);
        expect(a).toEqual([1, '*', '*', 4]);
      }
      {
        const a: Array<number | string> = [1, 2, 3, 4];
        expect(a.fill('*', 1, 3)).toEqual([1, '*', '*', 4]);
        expect(a).toEqual([1, '*', '*', 4]);
      }
    });
    test('join: 将数组转换为字符串 [Array.join]', () => {
      expect(_.join(['a', 'b', 'c'], '~')).toEqual('a~b~c');
      expect([1, 'b', 1].join('~')).toEqual('1~b~1');
    });
    test('reverse(变更): 反转数组 [Array.reverse]', () => {
      const array = [1, 2, 3];
      expect(_.reverse(array)).toEqual([3, 2, 1]);
      expect(array).toEqual([3, 2, 1]);
      expect(array.reverse()).toEqual([1, 2, 3]);
      expect(array).toEqual([1, 2, 3]);
    });
    describe('取值', () => {
      test('first & head: 获取第一个元素[(Array|String)[0]]', () => {
        [
          { data: [1, 2, 3], result: 1 },
          { data: [] as number[], result: undefined },
          { data: 'abc', result: 'a' },
          { data: '', result: undefined },
        ].forEach(({ data, result }) => {
          expect(_.first(data as any)).toEqual(result);
          expect(_.head(data as any)).toEqual(result);
          expect(data[0]).toEqual(result);
        });
      });
      test('last: 获取最后一个元素 [Array.slice(-1)[0]]', () => {
        expect(_.last([1, 2, 3])).toEqual(3);
        expect(_.last([1])).toEqual(1);
        expect(_.last([])).toEqual(undefined);

        expect([1, 2, 3].slice(-1)[0]).toEqual(3);
        expect([1].slice(-1)[0]).toEqual(1);
        expect([].slice(-1)[0]).toEqual(undefined);
      });
      test('nth: 获取第n个元素(支持负数) [Array[n]]', () => {
        expect(_.nth([1, 2, 3], 1)).toEqual(2);
        expect(_.nth([1, 2, 3], -1)).toEqual(3);
        expect(_.nth([1, 2, 3], 3)).toEqual(undefined);

        expect([1, 2, 3][1]).toEqual(2);
        expect([1, 2, 3][2]).toEqual(3);
        expect([1, 2, 3][3]).toEqual(undefined);
      });
      test('slice: 切片 [Array.slice]', () => {
        expect(_.slice([1, 2, 3], 1, 2)).toEqual([2]);
        expect([1, 2, 3].slice(-1)).toEqual([3]); // 支持负数
      });
      test('initial: 去尾 [Array.slice(0, -1)]', () => {
        expect(_.initial([1, 2, 3])).toEqual([1, 2]);
        expect(_.initial([1])).toEqual([]);
        expect(_.initial([])).toEqual([]);

        expect([1, 2, 3].slice(0, -1)).toEqual([1, 2]);
        expect([1].slice(0, -1)).toEqual([]);
        expect([].slice(0, -1)).toEqual([]);
      });
      test('tail: 去头 [Array.slice(1)]', () => {
        expect(_.tail([1, 2, 3])).toEqual([2, 3]);
        expect(_.tail([1])).toEqual([]);
        expect(_.tail([])).toEqual([]);

        expect([1, 2, 3].slice(1)).toEqual([2, 3]);
        expect([1].slice(1)).toEqual([]);
        expect([].slice(1)).toEqual([]);
      });
      test('drop: 删除前|后n(默认:1)个元素 [Array.slice]', () => {
        const a = [1, 2, 3];
        expect(_.drop(a)).toEqual([2, 3]);
        expect(_.drop([1, 2, 3])).toEqual([2, 3]); // 默认删除第一个元素
        expect(_.drop([1, 2, 3], 2)).toEqual([3]);
        expect(_.drop([1, 2, 3], 5)).toEqual([]);
        expect(_.drop([1, 2, 3], 0)).toEqual([1, 2, 3]); // 可以传0

        expect(_.dropRight([1, 2, 3])).toEqual([1, 2]);
        expect(_.dropRight([1, 2, 3], 2)).toEqual([1]);
        expect(_.dropRight([1, 2, 3], 5)).toEqual([]);
        expect(_.dropRight([1, 2, 3], 0)).toEqual([1, 2, 3]);

        const users = [
          { user: 'barney', active: true },
          { user: 'fred', active: false },
          { user: 'pebbles', active: false },
        ];
        expect(_.dropRightWhile(users, (o) => !o.active).map((o) => o.user)).toEqual(['barney']);
        expect(_.dropRightWhile(users, { active: false }).map((o) => o.user)).toEqual(['barney']);
        expect(_.dropRightWhile(users, ['active', false]).map((o) => o.user)).toEqual(['barney']);
        expect(_.dropRightWhile(users, ['active', true]).map((o) => o.user)).toEqual(['barney', 'fred', 'pebbles']);
        expect(_.dropRightWhile(users, 'active').map((o) => o.user)).toEqual(['barney', 'fred', 'pebbles']);

        expect(_.dropWhile(users, (o) => !o.active).map((o) => o.user)).toEqual(['barney', 'fred', 'pebbles']);
        expect(_.dropWhile(users, { active: true }).map((o) => o.user)).toEqual(['fred', 'pebbles']);
        expect(_.dropWhile(users, ['active', false]).map((o) => o.user)).toEqual(['barney', 'fred', 'pebbles']);
        expect(_.dropWhile(users, 'active').map((o) => o.user)).toEqual(['fred', 'pebbles']);
      });
      test('take: 获取数组前n(1)个元素 [Array.slice(0, n)]', () => {
        expect(_.take([1, 2, 3])).toEqual([1]); // 默认取一个
        expect(_.take([1, 2, 3], 2)).toEqual([1, 2]);
        expect(_.take([1, 2, 3], 5)).toEqual([1, 2, 3]);
        expect(_.take([1, 2, 3], 0)).toEqual([]);

        expect([1, 2, 3].slice(0, 1)).toEqual([1]);

        expect(_.takeWhile([1, 2, 3], (n) => n < 3)).toEqual([1, 2]);
      });
      test('takeRight: 获取数组后n(1)个元素 [Array.slice(-n)]', () => {
        expect(_.takeRight([1, 2, 3])).toEqual([3]); // 默认取一个
        expect(_.takeRight([1, 2, 3], 2)).toEqual([2, 3]);
        expect(_.takeRight([1, 2, 3], 5)).toEqual([1, 2, 3]);
        expect(_.takeRight([1, 2, 3], 0)).toEqual([]);

        expect([1, 2, 3].slice(-1)).toEqual([3]);
        expect([1, 2, 3].slice(-2)).toEqual([2, 3]);

        expect(_.takeRightWhile([1, 2, 3], (n) => n > 1)).toEqual([2, 3]);
      });
    });
    describe('查找(位置)', () => {
      test('findIndex & findLastIndex: 查找索引 [Array.findIndex]', () => {
        const users = [
          { user: 'barney', active: false },
          { user: 'fred', active: false },
          { user: 'pebbles', active: true },
        ];
        expect(_.findIndex(users, (o) => o.user === 'barney')).toEqual(0);
        expect(_.findIndex(users, { user: 'fred', active: false })).toEqual(1);
        expect(_.findIndex(users, ['active', false])).toEqual(0);
        expect(_.findIndex(users, 'active')).toEqual(2);
        expect(_.findIndex(users, 'x')).toEqual(-1);

        expect(_.findLastIndex(users, ['active', false])).toEqual(1);
      });
      test('indexOf & lastIndexOf: 使用浅等得到索引(===) [Array.indexOf & Array.lastIndexOf]', () => {
        expect([1, 2, 1, 2].indexOf(2)).toEqual(1);
        expect([1, 2, 1, 2].indexOf(2, 2)).toEqual(3);

        expect([1, 2, 1, 2].lastIndexOf(2)).toEqual(3);
        expect([1, 2, 1, 2].lastIndexOf(2, 2)).toEqual(1);

        const users = [
          { user: 'fred', active: false },
          { user: 'barney', active: false },
          { user: 'pebbles', active: true },
        ];
        expect(_.indexOf(users, { user: 'barney', active: false })).toEqual(-1); // 对象指针不同
        expect(_.indexOf(users, users[1])).toEqual(1);
      });
      test('sortedIndex: 二分查找', () => {
        // LowerBound
        expect(_.sortedIndex([30, 50], 40)).toEqual(1);
        {
          const objs = [{ x: 30 }, { x: 50 }];
          expect(_.sortedIndexBy(objs, { x: 40 }, (o) => o.x)).toEqual(1);
          expect(_.sortedIndexBy(objs, { x: 40 }, 'x')).toEqual(1);
        }
        // UpperBound
        {
          expect(_.sortedLastIndex([4, 5, 5, 5, 6], 5)).toEqual(4);
        }
        {
          const objs = [{ x: 4 }, { x: 5 }, { x: 5 }, { x: 5 }, { x: 6 }];
          expect(_.sortedLastIndexBy(objs, { x: 5 }, (o) => o.x)).toEqual(4);
        }
        // Equal
        {
          expect(_.sortedIndexOf([30, 40, 50], 41)).toEqual(-1);
          expect(_.sortedIndexOf([30, 40, 40, 50], 40)).toEqual(1);
        }
        {
          expect(_.sortedLastIndexOf([30, 40, 40, 50], 40)).toEqual(2);
        }
      });
    });
    describe('剔除', () => {
      test('compact: 压缩(删除所有"假"元素)', () => expect(_.compact([0, 1, false, 2, '', 3])).toEqual([1, 2, 3]));
      test('without: 移除数组中的元素', () => {
        const array = [1, 2, 1, 0, 3, 1, 4];
        expect(_.without(array, 0, 1)).toEqual([2, 3, 4]);
        expect(array).toEqual([1, 2, 1, 0, 3, 1, 4]); // 不同于pull，不会改变原数组
      });
      test('pull(变更): 删除数组中指定的元素, 相当于多次调用Array.splice', () => {
        {
          const array = [1, 2, 3, 1, 2, 3];
          expect(_.pull(array, 2, 3)).toEqual([1, 1]);
          expect(array).toEqual([1, 1]);
        }
        {
          const array = [1, 2, 3, 1, 2, 3];
          expect(_.pullAll(array, [2, 3])).toEqual([1, 1]);
          expect(array).toEqual([1, 1]);
        }
        {
          const array = [{ x: 1 }, { x: 2 }, { x: 3 }, { x: 1 }];
          expect(_.pullAllBy(array, [{ x: 1 }], 'x')).toEqual([{ x: 2 }, { x: 3 }]);
          expect(array).toEqual([{ x: 2 }, { x: 3 }]);
        }
        {
          const array = [
            { x: 1, y: 2 },
            { x: 3, y: 4 },
            { x: 3, y: 6 },
          ];
          expect(_.pullAllWith(array, [{ x: 3, y: 4 }], (a, b) => a.x === b.x)).toEqual([{ x: 1, y: 2 }]);
          expect(array).toEqual([{ x: 1, y: 2 }]);
        }
        {
          //! 注意只有 pullAt 返回值为移除的元素，其他方法都是返回修改后的数组
          const array = [5, 10, 15, 20];
          expect(_.pullAt(array, 1, 3)).toEqual([10, 20]);
          expect(array).toEqual([5, 15]);
        }
      });
      test('remove(变更): 移除指定元素, 类似Array.filter但为变更, 完全可以使用remove代替pull系列', () => {
        {
          const array = [1, 2, 3, 1, 2, 3];
          expect(_.remove(array, (n) => n % 2)).toEqual([1, 3, 1, 3]);
          expect(array).toEqual([2, 2]);
        }
        {
          const array = [{ x: 1 }, { x: 2 }, { x: 3 }, { x: 0 }];
          expect(_.remove(array, 'x')).toEqual([{ x: 1 }, { x: 2 }, { x: 3 }]);
          expect(array).toEqual([{ x: 0 }]);
        }
      });
      test('uniq: 去重', () => {
        expect(_.uniq([1, 1, 2, 3, 3, 3, 4, 4])).toEqual([1, 2, 3, 4]);
        expect(_.uniq([1, 1, 2, 3, 3, 1, 3, 4, 4])).toEqual([1, 2, 3, 4]);
        expect(_.uniqBy([1.2, 1.1, 1.0, 2.3, 2.4], Math.floor)).toEqual([1.2, 2.3]);
        expect(_.uniqWith([1, 2, 3, 1], (a, b) => a === b)).toEqual([1, 2, 3]);
      });
      test('sortedUniq: 对已排序数组去重', () => {
        const arr = [1, 1, 2, 3, 3, 3, 4, 4];
        expect(_.sortedUniq(arr)).toEqual([1, 2, 3, 4]);
        expect(arr).toEqual([1, 1, 2, 3, 3, 3, 4, 4]);

        expect(_.sortedUniq([1, 1, 2, 3, 3, 1, 3, 4, 4])).toEqual([1, 2, 3, 1, 3, 4]); // !错误用例

        expect(_.sortedUniqBy([1.2, 1.1, 1.0, 2.3, 2.4], Math.floor)).toEqual([1.2, 2.3]); // 迭代后的数组是一个排序数组即可
      });
    });
    describe('集合', () => {
      test('difference: 差集', () => {
        expect(_.difference([1, 2, 3], [4, 2])).toEqual([1, 3]); // 以第一个为顺序
        expect(_.difference([1, 2, 3], [4, 2], [1, 3, 5])).toEqual([]); // 支持多个数组
        expect(_.differenceBy([1, 2, 3], [4, 2])).toEqual([1, 3]); // differenceBy默认迭代器为_.identity
        expect(_.differenceBy([{ x: 1, y: 2 }, { x: 2 }], [{ x: 2 }], 'x')).toEqual([{ x: 1, y: 2 }]); // 属性
        expect(_.differenceBy([{ x: 1, y: 2 }, { x: 2 }], [{ x: 2 }], (v) => v.x)).toEqual([{ x: 1, y: 2 }]); // 函数
        expect(_.differenceWith([{ x: 1, y: 2 }, { x: 2 }], [{ x: 2 }], (a, b) => a.x === b.x)).toEqual([
          { x: 1, y: 2 },
        ]);
      });
      test('intersection: 交集', () => {
        expect(_.intersection([2, 1], [2, 3], [4, 2])).toEqual([2]);
        expect(_.intersection([2, 1], [2, 3], [4, 1])).toEqual([]);

        expect(_.intersectionBy([2.1, 1.2], [2.3, 3.4], Math.floor)).toEqual([2.1]); // 取第一个
        expect(_.intersectionBy([{ x: 1 }], [{ x: 2 }, { x: 1 }], 'x')).toEqual([{ x: 1 }]);

        expect(
          _.intersectionWith(
            [
              { x: 1, y: 2 },
              { x: 2, y: 1 },
            ],
            [
              { x: 1, y: 1 },
              { y: 2, x: 1 },
            ],
            _.isEqual
          )
        ).toEqual([{ x: 1, y: 2 }]);
      });
      test('union: 并集', () => {
        expect(_.union([1, 2, 3], [4, 3, 2], [2, 1], [6, 5, 4])).toEqual(expect.arrayContaining([1, 2, 3, 4, 5, 6]));
        expect(_.unionBy([1.1, 1.2, 1.3], [2.1, 2.2, 2.3], Math.floor)).toEqual([1.1, 2.1]);
        expect(_.unionBy([{ x: 1, y: 1 }, { x: 3 }], [{ x: 1 }, { x: 2 }], 'x')).toEqual(
          expect.arrayContaining([{ x: 1, y: 1 }, { x: 2 }, { x: 3 }])
        );
        expect(_.unionWith([{ x: 1, y: 1 }, { x: 2 }], [{ x: 1 }, { x: 2, y: 2 }], (a, b) => a.x == b.x)).toEqual([
          { x: 1, y: 1 },
          { x: 2 },
        ]);
      });
      test('xor: 异或集', () => {
        expect(_.xor([1, 2, 3], [4, 3, 2])).toEqual([1, 4]);
        expect(_.xor([1, 2, 3], [4, 3, 2])).toEqual(
          _.pullAll(_.union([1, 2, 3], [4, 3, 2]), _.intersection([1, 2, 3], [4, 3, 2])) // 并集 - 交集
        );
        expect(_.xorBy([1.1, 1.2, 1.3], [2.1, 2.2, 2.3], Math.floor)).toEqual([1.1, 2.1]);
        expect(_.xorWith([{ x: 1, y: 1 }, { x: 2 }], [{ x: 1 }, { x: 2 }], (a, b) => a.x === b.x)).toEqual([]);
      });
    });
    describe('重组', () => {
      test('chunk: 分组', () => expect(_.chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]));
      test('flattenDepth & flatten(1) & flattenDeep(INF): 展开 [Array.flat]', () => {
        expect(_.flattenDepth([1, [2, [3, [4]], 5]], 2)).toEqual([1, 2, 3, [4], 5]); // 按需展开
        expect(_.flattenDepth([1, [2, [3, [4]], 5]], 100)).toEqual([1, 2, 3, 4, 5]); // 超过层数相当于完全展开

        expect(_.flatten([1, [2, [3, [4]], 5]])).toEqual([1, 2, [3, [4]], 5]); // 展开一层
        expect(_.flattenDeep([1, [2, [3, [4]], 5]])).toEqual([1, 2, 3, 4, 5]); // 完全展开

        expect([1, [2, [3, [4]], 5]].flat()).toEqual([1, 2, [3, [4]], 5]); // 默认展开一层
        expect([1, [2, [3, [4]], 5]].flat(2)).toEqual([1, 2, 3, [4], 5]); // 展开两层
        expect([1, [2, [3, [4]], 5]].flat(100)).toEqual([1, 2, 3, 4, 5]); // 超过层数相当于完全展开
      });
      test('fromPairs: 从键值对构建对象 [Object.fromEntries]', () => {
        expect(
          _.fromPairs([
            ['a', 1],
            ['b', 2],
          ])
        ).toEqual({ a: 1, b: 2 });
        expect(
          Object.fromEntries([
            ['a', 1],
            ['b', 2],
          ])
        ).toEqual({ a: 1, b: 2 });
      });
      test('zip: NxM -> [MxN]', () => {
        expect(_.zip([1, 2], [3, 4], [1, 2, 3], [1])).toEqual([
          [1, 3, 1, 1],
          [2, 4, 2, undefined],
          [undefined, undefined, 3, undefined],
        ]);
        expect(_.zip(..._.zip(['fred', 'barney'], [30, 40], [true, false]))).toEqual([
          ['fred', 'barney'],
          [30, 40],
          [true, false],
        ]);
        expect(_.zipWith([1, 2], [3, 4], [1, 2, 3], [1], (a, b, c, d) => [a, b, c, d])).toEqual([
          [1, 3, 1, 1],
          [2, 4, 2, undefined],
          [undefined, undefined, 3, undefined],
        ]);
        expect(_.zipWith([1, 2], [3, 4], [5, 6], [7, 8], (a, b, c, d) => a + b + c + d)).toEqual([16, 20]);

        expect(_.zipObject(['a', 'b'], [1, 2])).toEqual({ a: 1, b: 2 });
        expect(
          Object.fromEntries([
            ['a', 1],
            ['b', 2],
          ])
        ).toEqual({ a: 1, b: 2 });
        expect(_.zipObjectDeep(['a[0].b', 'a[1].c'], [1, 2])).toEqual({ a: [{ b: 1 }, { c: 2 }] });
      });
      test('unzip: [MxN] -> [NxM]', () => {
        expect(
          _.unzip(
            _.unzip([
              ['fred', 30, true],
              ['barney', 40, false],
            ])
          )
        ).toEqual([
          ['fred', 30, true],
          ['barney', 40, false],
        ]);
        expect(
          _.unzipWith(
            [
              [1, 2],
              [3, 4],
              [5, 6],
            ],
            (a, b, c) => a + b + c
          )
        ).toEqual([9, 12]);
      });
    });
  });
  describe('集合', () => {
    test('find & findLast: 查找 [Array.find]', () => {
      expect(_.find([1, 2, 3, 4], (n) => n % 2 == 0)).toBe(2);
      expect(_.find({ z: 3, x: 1, y: 2 }, (v) => v % 2 != 0)).toBe(3);
      expect(Object.values({ z: 3, x: 1, y: 2 }).find((v) => v % 2 != 0)).toBe(3);

      const users = [
        { user: 'barney', age: 36, active: true },
        { user: 'fred', age: 40, active: false },
        { user: 'pebbles', age: 1, active: true },
      ];

      expect(_.find(users, { age: 1 })?.user).toBe('pebbles');
      expect(_.find(users, ['active', false])?.user).toBe('fred');
      expect(_.find(users, 'active', 1)?.user).toBe('pebbles');
      expect(_.find(users, ['active', false], 2)?.user).toBe(undefined);

      expect(_.findLast(users, 'active')?.user).toBe('pebbles');
    });
    test('sortBy & orderBy: 排序 [Array.sort]', () => {
      const users = [
        { user: 'fred', age: 48 },
        { user: 'barney', age: 34 },
        { user: 'fred', age: 40 },
        { user: 'barney', age: 36 },
      ];

      // sortBy横为升序
      expect(_.sortBy(users, ['user', 'age'])).toEqual([
        { user: 'barney', age: 34 },
        { user: 'barney', age: 36 },
        { user: 'fred', age: 40 },
        { user: 'fred', age: 48 },
      ]);

      // orderBy默认和sortBy一样
      expect(_.orderBy(users, ['user', 'age'])).toEqual([
        { user: 'barney', age: 34 },
        { user: 'barney', age: 36 },
        { user: 'fred', age: 40 },
        { user: 'fred', age: 48 },
      ]);

      // 指定排序方式
      expect(_.orderBy(users, ['user', 'age'], ['asc', 'desc'])).toEqual([
        { user: 'barney', age: 36 },
        { user: 'barney', age: 34 },
        { user: 'fred', age: 48 },
        { user: 'fred', age: 40 },
      ]);
      expect(_.orderBy(users, ['age', 'user'], ['asc', 'desc'])).toEqual([
        { user: 'barney', age: 34 },
        { user: 'barney', age: 36 },
        { user: 'fred', age: 40 },
        { user: 'fred', age: 48 },
      ]);
    });
    test('size: 长度', () => {
      expect(_.size([1, 2, 3])).toBe(3);
      expect(_.size({ a: 1, b: 2 })).toBe(2);
      expect(_.size('hello')).toBe(5);
    });
    describe('分组', () => {
      test('countBy: 对每个Key对应的值计数', () => {
        expect(_.countBy([6.1, 4.2, 6.3], Math.floor)).toEqual({ '4': 1, '6': 2 });
        expect(_.countBy(['one', 'two', 'three'], 'length')).toEqual({ '3': 2, '5': 1 });
        expect(_.countBy({ x: 1, y: 2, z: 3 }, (v) => v % 2)).toEqual({ '0': 1, '1': 2 });
        expect(_.countBy({ x: 1, y: 2, z: 3 }, (v) => (v % 2 ? 'Even' : 'Odd'))).toEqual({ Odd: 1, Even: 2 });
      });
      test('groupBy: 对每个Key对应的值分组', () => {
        expect(_.groupBy([6.1, 4.2, 6.3], Math.floor)).toEqual({ '4': [4.2], '6': [6.1, 6.3] });
        expect(_.groupBy(['one', 'two', 'three'], 'length')).toEqual({ '3': ['one', 'two'], '5': ['three'] });
        expect(_.groupBy({ x: 1, y: 2, z: 3 }, (v) => v % 2)).toEqual({ '0': [2], '1': [1, 3] });
        expect(_.groupBy({ x: 1, y: 2, z: 3 }, (v) => (v % 2 ? 'Even' : 'Odd'))).toEqual({ Odd: [2], Even: [1, 3] });
      });
      test('partition: 分割', () => {
        expect(_.partition([1, 2, 3, 4], (n) => n % 2)).toEqual([
          [1, 3],
          [2, 4],
        ]);
        expect(_.partition({ a: 1, b: 2, c: 3, d: 4 }, (n) => n % 2)).toEqual([
          [1, 3],
          [2, 4],
        ]);
      });
    });
    describe('遍历', () => {
      test('forEach: 遍历 [Array.forEach]', () => {
        const entries: Array<[string, number]> = [];
        _.forEach({ a: 1, b: 2 }, (v, k) => entries.push([k, v]));
        expect(entries).toEqual(Object.entries({ a: 1, b: 2 }));
      });
      test('forEachRight: 反向遍历', () => {
        const entries: Array<[string, number]> = [];
        _.forEachRight({ a: 1, b: 2 }, (v, k) => entries.push([k, v]));
        expect(entries).toEqual(Object.entries({ a: 1, b: 2 }).reverse());
      });
    });
    describe('判断', () => {
      test('every: 判断是否每个元素都满足条件 [Array.every]', () => {
        expect(_.every([true, false, 1, null, 'yes'], Boolean)).toBe(false);
        expect(_.every([true, false, 1, null, 'yes'], (x) => x !== undefined)).toBe(true);
        expect(_.every({ x: 1, y: 2, z: false }, (v) => v === false || v > 0)).toBe(true);
      });
      test('some: 判断是否有一个元素满足条件 [Array.some]', () => {
        expect(_.some([true, false, 1, null, 'yes'], Boolean)).toBe(true);
        expect(_.some({ x: 1, y: 2, z: false }, (v) => v === false)).toBe(true);
      });
      test('includes: 是否包含 [Array.includes]', () => {
        expect(_.includes([1, 2, 3], 1)).toBe(true);
        expect(_.includes([1, 2, 3], 1, 2)).toBe(false);
        expect(_.includes({ x: 1, y: 2, z: 3 }, 1)).toBe(true);
        expect(_.includes({ x: 1, y: 2, z: 3 }, 1, 2)).toBe(false);
        expect(_.includes('abcd', 'bc')).toBe(true);
      });
    });
    describe('变换', () => {
      test('flatMapDepth & flatMap(1) & flatDeep(INF): 扁平化 [Array.flatMap]', () => {
        expect(_.flatMap([1, 2, 3])).toEqual([1, 2, 3]);
        expect(_.flatMap([1, 2, 3], (v, k) => [k + 1, v * 3])).toEqual([1, 3, 2, 6, 3, 9]);
        expect(_.flatMap({ a: 1, b: 2 })).toEqual([1, 2]);
        expect(_.flatMap({ a: 1, b: 2 }, (v, k) => [k, v])).toEqual(['a', 1, 'b', 2]);
      });
      test('invokeMap: 使用指定函数生成映射', () => {
        expect(
          _.invokeMap(
            [
              [5, 1, 7],
              [3, 2, 1],
            ],
            'sort'
          )
        ).toEqual([
          [1, 5, 7],
          [1, 2, 3],
        ]);
        expect(_.invokeMap([123, 456], String.prototype.split, '')).toEqual([
          ['1', '2', '3'],
          ['4', '5', '6'],
        ]);
        expect(_.invokeMap({ x: 1, y: 2 }, 'toString')).toEqual(['1', '2']);
      });
      test('keyBy: 根据值生成Key构建到值的对象', () => {
        expect(_.keyBy([6.1, 4.2, 6.3], Math.floor)).toEqual({ '4': 4.2, '6': 6.3 });
        expect(_.keyBy(['one', 'two', 'three'], 'length')).toEqual({ '3': 'two', '5': 'three' });
        expect(_.keyBy({ x: 1, y: 2, z: 3 }, (v) => v % 2)).toEqual({ '0': 2, '1': 3 });
        expect(
          _.keyBy(
            [
              { dir: 'left', code: 97 },
              { dir: 'right', code: 100 },
            ],
            'dir'
          )
        ).toEqual({ left: { dir: 'left', code: 97 }, right: { dir: 'right', code: 100 } });
      });
      test('map: 映射 [Array.map]', () => {
        expect(_.map([1, 2, 3], (n) => n * 3)).toEqual([3, 6, 9]);
        expect(_.map({ x: 1, y: 2, z: 3 }, (v, k) => k + v)).toEqual(['x1', 'y2', 'z3']);
      });
      test('reduce: 合并 [Array.reduce]', () => {
        expect(_.reduce([1, 2], (sum, n) => sum + n, 0)).toBe(3);
        expect(_.reduce({ x: 1, y: 2 }, (sum, n) => sum + n, 0)).toBe(3);
        expect(_.reduce({ x: 1, y: 2 }, (res, v, k) => ({ ...res, [v]: k }), {})).toEqual({ 1: 'x', 2: 'y' });

        expect(
          [
            [0, 1],
            [2, 3],
            [4, 5],
          ].reduce((res, v) => res.concat(v), [])
        ).toEqual([0, 1, 2, 3, 4, 5]);
      });
      test('reduceRight: 反向合并 [Array.reduceRight]', () => {
        expect(
          _.reduceRight(
            [
              [0, 1],
              [2, 3],
              [4, 5],
            ],
            (res, v) => res.concat(v),
            [] as number[]
          )
        ).toEqual([4, 5, 2, 3, 0, 1]);

        expect(
          [
            [0, 1],
            [2, 3],
            [4, 5],
          ].reduceRight((res, v) => res.concat(v), [])
        ).toEqual([4, 5, 2, 3, 0, 1]);
      });
    });
    describe('过滤', () => {
      test('filter: 过滤 [Array.filter]', () => {
        expect(_.filter([1, 2, 3, 4, 5, 6], (n) => n % 2 == 0)).toEqual([2, 4, 6]);
        expect(_.filter({ x: 1, y: 2, z: 3 }, (v) => v % 2 == 0)).toEqual([2]);
        expect(Object.values({ x: 1, y: 2, z: 3 }).filter((v) => v % 2 == 0)).toEqual([2]);
      });
      test('reject: 排除', () => {
        expect(_.reject([1, 2, 3, 4, 5, 6], (n) => n % 2 == 0)).toEqual([1, 3, 5]);
        expect(_.reject({ x: 1, y: 2, z: 3 }, (v) => v % 2 == 0)).toEqual([1, 3]);
      });
    });
    describe('随机', () => {
      test('sample & sampleSize: 随机取样', () => {
        expect([1, 2, 3, 4]).toEqual(expect.arrayContaining([_.sample([1, 2, 3, 4])]));
        [1, 2, 3, 4, 5].forEach((i) =>
          expect([1, 2, 3, 4]).toEqual(expect.arrayContaining(_.sampleSize([1, 2, 3, 4], i)))
        );
      });
      test('shuffle: 洗牌', () => {
        expect(_.shuffle([1, 2, 3, 4, 5])).toEqual(expect.arrayContaining([1, 2, 3, 4, 5]));
        expect(_.shuffle({ a: 1, b: 2, c: 3, d: 4, e: 5 })).toEqual(expect.arrayContaining([1, 2, 3, 4, 5]));
      });
    });
  });
  describe('函数', () => {
    describe('修饰', () => {
      test('before: 在指定次数前执行(会缓存最后一次运行的值,之后调用返回缓存值)', () => {
        let counter = 0;
        const add = _.before(3, () => ++counter);
        for (let i = 0; i < 4; ++i) expect(add()).toBe(i < 2 ? i + 1 : 2);
      });
      test('after: 在指定次数后执行', () => {
        let counter = 0;
        const add = _.after(3, () => {
          counter += 1;
        });
        for (let i = 0; i < 4; ++i) expect((add(), counter)).toBe(i < 2 ? 0 : i - 1);
      });
      test('once: 只执行一次(before(2))', () => {
        const func = jest.fn((a, b) => a + b);
        const once = _.once(func);
        const r1 = once(3, 4);
        const r2 = once(5, 6);
        expect(func).toHaveBeenCalledTimes(1);
        expect(r1).toBe(7);
        expect(r2).toBe(7); // 直接返回结果
      });
      test('debounce: 防抖', () => {
        {
          const func = jest.fn();
          const debounced = _.debounce(func, 10);
          const timer = setInterval(debounced, 10); // 每次都取消了前面一次，永远不会被执行
          jest.advanceTimersByTime(100);
          expect(func).toHaveBeenCalledTimes(0);
          clearInterval(timer);
        }
        {
          const func = jest.fn();
          const debounced = _.debounce(func, 10);
          const timer = setInterval(debounced, 11);
          jest.advanceTimersByTime(20); // ...11...10, 需要21ms, 因此一次都不会执行
          expect(func).toHaveBeenCalledTimes(0);
          jest.advanceTimersByTime(1);
          expect(func).toHaveBeenCalledTimes(1);
          jest.advanceTimersByTime(5 * 11 + 10 - 21); // 运行N次需要: n * 11 + 10
          expect(func).toHaveBeenCalledTimes(5);
          clearInterval(timer);
        }
        {
          // 运行N次需要: max(maxWait, wait) * N + timeout
          const funcs = [jest.fn(), jest.fn()];
          const debounceds = funcs.map((func, i) => _.debounce(func, 10, { maxWait: i == 0 ? 20 : 5 }));
          const timer = setInterval(() => debounceds.forEach((debounced) => debounced()), 5); // timeout < wait，不使用maxWait不会被执行
          jest.advanceTimersByTime(20 * 5 + 5);
          funcs.forEach((func, i) => expect(func).toHaveBeenCalledTimes((i + 1) * 5));
          clearInterval(timer);
        }
      });
      test('throttle: 节流(debounce(..., {maxWait:wait, leading: true}))', () => {
        // 运行N次需要: max(maxWait, wait) * (N-1) + timeout, 相比于debounce多了leading这次
        const funcs = [jest.fn(), jest.fn()];
        const debounceds = [_.debounce(funcs[0], 10, { maxWait: 10, leading: true }), _.throttle(funcs[1], 10)];
        const timer = setInterval(() => debounceds.forEach((debounced) => debounced()), 5);
        jest.advanceTimersByTime(10 * 4 + 5);
        funcs.forEach((func, i) => expect(func).toHaveBeenCalledTimes(5));
        clearInterval(timer);
      });
      test('defer: 延迟执行 [setTimeout(..., 1)]', () => {
        const func = jest.fn();
        _.defer(func);
        expect(func).toHaveBeenCalledTimes(0);
        jest.runAllTimers();
        expect(func).toHaveBeenCalledTimes(1);
      });
      test('delay: 延迟执行 [setTimeout]', () => {
        const func = jest.fn();
        _.delay(func, 0);
        expect(func).toHaveBeenCalledTimes(0);
        jest.advanceTimersByTime(0);
        expect(func).toHaveBeenCalledTimes(1);

        _.delay(func, 10);
        jest.advanceTimersByTime(9);
        expect(func).toHaveBeenCalledTimes(1);
        jest.advanceTimersByTime(1);
        expect(func).toHaveBeenCalledTimes(2);
      });
      test('memoize: 缓存(每个缓存后的函数都有自己的Cache)', () => {
        const obj = { a: 1, b: 2 };
        const values = _.memoize(_.values);
        expect(values(obj)).toEqual([1, 2]);
        obj.a = 2;
        expect(values(obj)).toEqual([1, 2]);
        expect(values.cache.get(obj)).toEqual([1, 2]);
        values.cache.delete(obj);
        expect(values(obj)).toEqual([2, 2]);
      });
      test('negate: 取反', () => {
        expect([1, 2, 3, 4, 5, 6].filter(_.negate((n) => Boolean(n % 2)))).toEqual([2, 4, 6]);
      });
    });
    describe('玩参', () => {
      test('ary & unary: 将函数转换为接受n(1)个参数的函数', () => {
        // parseInt可以接受2个参数，map映射时传入(v, i):
        // parseInt('6', 0) => 6
        // parseInt('8', 1) => NaN
        // parseInt('10', 2) => 2
        expect(['6', '8', '10'].map(parseInt)).toEqual([6, NaN, 2]);
        expect(['6', '8', '10'].map(_.ary(parseInt, 1))).toEqual([6, 8, 10]);

        // unary -> ary(..., 1)
        expect(['6', '8', '10'].map(_.unary(parseInt))).toEqual([6, 8, 10]);
      });
      test('flip: 反转传参', () => {
        const fliped = _.flip((...args: any[]) => _.toArray(args));
        expect(fliped(1, 2, 3)).toEqual([3, 2, 1]);
      });
      test('overArgs: 将函数的参数先转换', () => {
        const func = _.overArgs((a, b, c) => [a, b, c], [(v) => v * 2, null as any, (v) => v * v]);
        expect(func(2, 3, 4)).toEqual([4, 3, 16]);
      });
      test('rearg: 参数重排', () => {
        [
          [
            // 2->0, 0->1, 1->2
            [2, 0, 1],
            [2, 0, 1],
          ],
          [
            // 1->0, 1->1, 1->2
            [1, 1, 1],
            [1, 1, 1],
          ],
          [
            // 0->1, 1->1, 2->2
            [0, 1, 2],
            [0, 1, 2],
          ],
          [
            // 2->0, 1->1, 0->2
            [2, 1, 0],
            [2, 1, 0],
          ],
        ].forEach(([indexs, result]) => {
          expect(_.rearg((a, b, c) => [a, b, c], indexs)(0, 1, 2)).toEqual(result);
        });
      });
      test('rest: 超过绑定函数之外参数个数-1的部分打包成一个数组放到最后一个参数上', () => {
        expect(_.rest((a, b, c) => [a, b, c])(0, 1, 2, 3, 4, 5)).toEqual([0, 1, [2, 3, 4, 5]]);
      });
      test('spread: 将数组打散成参数 [Function.apply]', () => {
        const abc = (a: number, b: number, c: number) => [a, b, c];
        const spread = _.spread(abc);
        expect(spread([0, 1, 2])).toEqual([0, 1, 2]);
        expect(abc.apply(null, [0, 1, 2])).toEqual([0, 1, 2]);
      });
    });
    describe('封装', () => {
      test('bind: 绑定函数 [Function.bind]', () => {
        // https://blog.mattbierner.com/binding-with-placeholders-in-javascript/
        // 速度测试：
        // Original x 766,797,535 ops/sec ±0.50% (92 runs sampled)
        // Function.bind(0) x 753,801,919 ops/sec ±2.29% (92 runs sampled)
        // _.bind(0) x 54,137,030 ops/sec ±0.55% (92 runs sampled)
        // _.bind(_, 0) x 17,115,012 ops/sec ±1.93% (89 runs sampled)
        // _.bind(_, _, 0) x 17,034,417 ops/sec ±0.57% (93 runs sampled)
        // _.partial(0) x 53,609,088 ops/sec ±0.92% (87 runs sampled)
        // _.partial(_, 0, _) x 17,208,651 ops/sec ±0.59% (92 runs sampled)
        // _.partial(_, _, 0) x 16,514,714 ops/sec ±0.86% (90 runs sampled)
        // _.partialRight(0) x 15,944,245 ops/sec ±0.63% (92 runs sampled)
        // _.partialRight(_, 0, _) x 13,916,748 ops/sec ±1.58% (90 runs sampled)
        // _.partialRight(_, _, 0) x 13,461,045 ops/sec ±0.64% (88 runs sampled)
        // _.curry(1, 2, 3) x 11,196,697 ops/sec ±0.95% (89 runs sampled)
        // _.curry(1)(2)(3) x 306,743 ops/sec ±0.47% (93 runs sampled)
        // _.curry(1, 2)(3) x 467,581 ops/sec ±0.97% (86 runs sampled)
        // _.curry(1)(2, 3) x 459,228 ops/sec ±0.82% (90 runs sampled)
        // _.curry(1)(_, 3)(2) x 310,972 ops/sec ±0.48% (92 runs sampled)
        // _.curry(_, _, 3)(_, 2)(1) x 298,664 ops/sec ±1.64% (91 runs sampled)
        // Fastest is Original,Function.bind(0)
        const list = (...val: any[]) => [...val];
        [0, 1, 2].forEach((i) => {
          const pl = _.bind(list, null, ...new Array(i).fill(_), undefined);
          const res: Array<string | undefined> = ['a', 'b', 'c'];
          expect(pl(...res)).toEqual((res.splice(i, 0, undefined), res));
        });

        const pl = list.bind(null, undefined); // Function.bind只支持填充前置参数
        expect(pl('a', 'b', 'c')).toEqual([undefined, 'a', 'b', 'c']);
      });
      test('bindKey: 绑定指定对象上的成员函数', () => {
        const object = {
          user: 'fred',
          greet: function (greeting: string, punctuation: string) {
            return greeting + ' ' + this.user + punctuation;
          },
        };
        const bound = _.bindKey(object, 'greet', 'hi');
        expect(bound('!')).toEqual('hi fred!');

        object.greet = function (greeting: string, punctuation: string) {
          return greeting + 'ya ' + this.user + punctuation;
        };
        expect(bound('!')).toEqual('hiya fred!'); // 原函数变化后，绑定的函数自动关联到新的函数(间接寻址)
      });
      test('curry & curryRight: 柯里化', () => {
        const abc = (a: number, b: number, c: number) => [a, b, c];
        const curried = _.curry(abc);
        const curriedRight = _.curryRight(abc);

        expect(curried(1)(2)(3)).toEqual([1, 2, 3]);
        expect(curried(1, 2)(3)).toEqual([1, 2, 3]);
        expect(curried(1, 2, 3)).toEqual([1, 2, 3]);
        expect(curried(_, _, 3)(_, 2)(1)).toEqual([1, 2, 3]);

        expect(curriedRight(1, 2, 3)).toEqual([1, 2, 3]);
        expect(curriedRight(3)(2)(1)).toEqual([1, 2, 3]);
        expect(curriedRight(2, 3)(1)).toEqual([1, 2, 3]);
        expect(curriedRight(3)(1, _)(2)).toEqual([1, 2, 3]);
      });
      test('partial & partialRight: 偏函数(无this)', () => {
        const abc = (a: number, b: number, c: number) => [a, b, c];
        expect(_.partial(abc, 1)(2, 3)).toEqual([1, 2, 3]);
        expect(_.partial(abc, _, 1)(2, 3)).toEqual([2, 1, 3]);
        expect(_.partial(abc, _, _, 1)(2, 3)).toEqual([2, 3, 1]);

        expect(_.partialRight(abc)(1, 2, 3)).toEqual([1, 2, 3]);
        expect(_.partialRight(abc, 1)(2, 3)).toEqual([2, 3, 1]);
        expect(_.partialRight(abc, 1, _)(2, 3)).toEqual([2, 1, 3]);
        expect(_.partialRight(abc, 1, _, _)(2, 3)).toEqual([1, 2, 3]);
      });
      test('wrap: 包裹函数', () => {
        const multiply9 = _.wrap(9, (a, ...args: number[]) => a * args.reduce((a, b) => a + b, 0));
        expect(multiply9(5, 2, 7)).toBe(9 * (5 + 2 + 7));

        const tagWrap = (tag: string) => _.wrap(tag, (a, ...args: string[]) => `<${a}>${args.join('')}</${a}>`);
        expect(tagWrap('div')('hello', 'world')).toBe('<div>helloworld</div>');
        expect(tagWrap('p')('hi')).toBe('<p>hi</p>');
      });
    });
  });
  describe('语言', () => {
    test('clone & cloneDeep: 克隆', () => {
      const objects = [{ a: 1 }, { b: 2 }, 3];
      const clones = [_.clone(objects), _.cloneDeep(objects)]; // 0: 浅拷贝, 1: 深拷贝
      clones.forEach((clone, i) => {
        expect(clone).toEqual(objects);
        clone.forEach((obj, j) => {
          if (i == 0 || !_.isObject(obj)) {
            expect(obj).toBe(objects[j]);
          } else {
            expect(obj).not.toBe(objects[j]);
          }
        });
      });
    });
    test('conformsTo: 检查对象是否符合指定的接口', () => {
      const obj = { a: 1, b: 2 };
      expect(_.conformsTo({ a: 1, b: 2 }, {} as any)).toBeTruthy(); // 没给出的默认为true
      expect(_.conformsTo({ a: 1, b: 2 }, { b: (v: number) => v > 1 } as any)).toBeTruthy();
      expect(_.conformsTo({ a: 1, b: 2 }, { b: (v: number) => v > 2 } as any)).toBeFalsy();
      expect(_.conformsTo({ a: 1, b: 2 }, { d: () => true } as any)).toBeFalsy(); // 对没有的属性检查返回false

      expect(_.conforms({})(obj)).toBeTruthy();
      expect(_.conforms({ b: () => true })(obj)).toBeTruthy();
    });
    test('eq, gt, gte, lt, lte: 比较', () => {
      expect(_.eq(NaN, NaN)).toBeTruthy();
      expect(NaN == NaN).toBeFalsy();
    });
    test('isEqual & isEqualWith: 深度比较', () => {
      expect(_.isEqual({ a: 1 }, { a: 1 })).toBeTruthy();
      expect(
        _.isEqualWith({ a: 1 }, { a: 2 }, (v: any, o: any) => (_.isObject(v) ? undefined : Math.abs(v - o) <= 1))
      ).toBeTruthy();
    });
    test('isMatch & isMatchWith: 深度包含', () => {
      expect(_.isMatch({ a: 1, b: 2 }, { a: 1 })).toBeTruthy();
      expect(_.isMatch({ a: 1, b: 2 }, { c: 1 })).toBeFalsy();
      expect(_.isMatch({ a: 1, b: 2 }, { a: 2 })).toBeFalsy();
    });
    describe('类型', () => {
      test('isArguments: 是否是参数对象', () => {
        expect(
          _.isArguments(
            (function (...args: any[]) {
              return arguments;
            })(1, 2, 3)
          )
        ).toBeTruthy();
        expect(_.isArguments([1, 2, 3])).toBeFalsy();
      });
      test('isNative: 是否是原生函数', () => {
        expect(_.isNative(Map.prototype.set)).toBe(true);
      });
      test('isArrayBuffer & isTypedArray & isBuffer', () => {
        // ArrayBuffer为内存中的一块连续的内存， 它是一个字节数组，可以存储任意数据类型的数据。
        // 其通过TypedArray视图访问
        // Buffer 只存在Nodejs中，可以看成是Uint8Array的一个子类
        // https://blog.y2nk4.com/read/translated-difference-between-buffer-and-arraybuffer.html

        [new ArrayBuffer(1), Buffer.alloc(1), new Uint8Array(1)].forEach((v, i) => {
          expect(_.isArrayBuffer(v)).toBe(i == 0);
          expect(_.isBuffer(v)).toBe(i == 1);
          expect(_.isTypedArray(v)).toBe(i > 0); // Buffer也是TypedArray

          // lodash会根据环境转化到以下函数上
          expect(util.types.isArrayBuffer(v)).toBe(i == 0);
          expect(Buffer.isBuffer(v)).toBe(i == 1);
          expect(util.types.isTypedArray(v)).toBe(i > 0);
        });
      });
      test('isDate: 是否是日期', () => {
        expect(_.isDate(new Date())).toBe(true);
        expect(util.types.isDate(new Date())).toBe(true);
        expect(Object.prototype.toString.call(new Date()) === '[object Date]').toBe(true);
      });
      test('isElement: 是否是元素', () => {
        expect(_.isElement(document.body)).toBe(true);
        expect(_.isElement(document.createElement('div'))).toBe(true);
        expect(_.isElement('<div></div>')).toBe(false);

        class Element {
          constructor(private nodeType = 1) {}
        }
        // nodeType == 1的非PlainObject都成立
        expect(_.isElement(new Element())).toBe(true);
        expect(_.isElement(new Element(0))).toBe(false);
        expect(_.isElement({ nodeType: 1 })).toBe(false);
      });
      test('isError: 是否是错误对象', () => {
        expect(_.isError(new Error())).toBe(true);
      });
      test('isRegExp: 是否是正则表达式', () => {});
      test('isMap & isWeakMap & isSet & isWeakSet', () => {});
      test('isSymbol: 是否是Symbol', () => {});
      test('isFunction: 是否是函数', () => {
        [async () => {}, () => {}, function () {}, function* gen() {}].forEach((v) => {
          expect(_.isFunction(v)).toBe(true);
          expect(typeof v === 'function').toBe(true);
          expect(Object.prototype.toString.call(v).includes('Function')).toBe(true);
        });
      });
      test('isBoolean: 是否是布尔值', () => {
        [true, false, new Boolean(true), new Boolean(false)].forEach((v) => {
          expect(_.isBoolean(v)).toBe(true);
          expect(typeof v === 'boolean' || v instanceof Boolean).toBe(true);
          expect(Object.prototype.toString.call(v) === '[object Boolean]').toBe(true);
        });
      });
      test('isString: 是否是字符串', () => {});
      test('isLength & isSafeInteger & isInteger isFinite & isNaN & isNumber: 数字判断[Number.(isSafeInteger|isInteger|isFinite|isNaN)]', () => {
        [0, 1, -1, Number.MAX_VALUE, 0.1, -0.1, Number.MIN_VALUE, Infinity, -Infinity, NaN, undefined].forEach(
          (v, i) => {
            expect(_.isLength(v)).toBe(i < 2); // >= 0的整数

            expect(_.isSafeInteger(v)).toBe(i < 3);
            expect(Number.isSafeInteger(v)).toBe(i < 3);

            expect(_.isInteger(v)).toBe(i < 4);
            expect(Number.isInteger(v)).toBe(i < 4);

            expect(_.isFinite(v)).toBe(i < 7);
            expect(Number.isFinite(v)).toBe(i < 7);
            expect(isFinite(v as number)).toBe(i < 7);

            expect(_.isNaN(v)).toBe(i == 9);
            expect(Number.isNaN(v)).toBe(i == 9);
            expect(isNaN(v as number)).toBe(i >= 9); // 注意全局NaN会认为undefined也是一个NaN

            expect(_.isNumber(v)).toBe(i < 10);
          }
        );
      });
      test('isEmpty & isNil & isNull & isUndefined', () => {
        [null, undefined, NaN, 0, false, '', [], {}, new Set(), new Map()].forEach((v, i) => {
          expect(_.isEmpty(v)).toBe(true); // 空对象
          expect(_.isNil(v)).toBe(i < 2); // null, undefined
          expect(_.isNull(v)).toBe(i == 0);
          expect(_.isUndefined(v)).toBe(i == 1);
        });
      });
      test('isArray & isArrayLike & isArrayLikeObject: 是否是数组 [Array.isArray]', () => {
        [[1, 2, 3], { 0: 1, 1: 2, 2: 3, length: 3 }, new String('abc'), 'abc'].forEach((v, i) => {
          expect(Array.isArray(v)).toBe(i == 0);
          expect(_.isArray(v)).toBe(i == 0); // 必须是严格意义上的数组(0)
          expect(_.isArrayLikeObject(v)).toBe(i != 3); // 排除字符串(0, 1, 2), 注意不能排除字符串对象
          expect(_.isArrayLike(v)).toBe(true); // 有Length可遍历的对象和字符串都可以(0, 1, 2, 3)
        });
      });
      test('isObject & isObjectLike & isPlainObject: 是否是对象 [typeof v === "object"]', () => {
        [{}, [], new Map(), _.noop, null].forEach((v, i) => {
          // typeof null === 'object', isObject, isObjectLike, isPlainObject都排除了null
          // isObjectLike 排除了function
          // isPlainObject 不能有原型链
          expect(_.isObject(v)).toBe(i < 4);
          expect(_.isObjectLike(v)).toBe(i < 3);
          expect(_.isPlainObject(v)).toBe(i == 0);
          expect(typeof v === 'object').toBe(i != 3);
        });
      });
    });
    describe('转换', () => {
      test('castArray: 转换为数组', () => {
        expect(_.castArray(1)).toEqual([1]);
        expect(_.castArray('abc')).toEqual(['abc']);
        expect(_.castArray([1, 2, 3])).toEqual([1, 2, 3]);
      });
      test('toArray: 将对象或字符串转换为数组', () => {
        expect(_.toArray({ a: 1, b: 2 })).toEqual([1, 2]);
        expect(_.toArray('123')).toEqual(['1', '2', '3']);
        expect(_.toArray([1, 2, 3])).toEqual([1, 2, 3]);
        expect(_.toArray(new Set([1, 2, 3]))).toEqual([1, 2, 3]);
      });
      test('toFinite & toInteger & toLength & toNumber & toSafeInteger: 转换为数字', () => {
        const data = [3.2, Number.MIN_VALUE, Infinity, '3.2'];
        const results = [
          [3.2, 5e-324, 1.7976931348623157e308, 3.2], // toFinite
          [3, 0, 1.7976931348623157e308, 3], // toInteger
          [3, 0, 4294967295, 3], // toLength
          [3.2, 5e-324, Infinity, 3.2], // toNumber
          [3, 0, Number.MAX_SAFE_INTEGER, 3], // toSafeInteger
        ];
        expect(Number.MAX_SAFE_INTEGER).toBe(9007199254740991);
        data.forEach((v, i) => {
          expect(_.toFinite(v)).toBe(results[0][i]);
          expect(_.toInteger(v)).toBe(results[1][i]);
          expect(_.toLength(v)).toBe(results[2][i]);
          expect(_.toNumber(v)).toBe(results[3][i]);
          expect(_.toSafeInteger(v)).toBe(results[4][i]);
        });
      });
      test('toPlainObject: 将对象转换为纯对象', () => {
        class Foo {
          constructor(public a: number) {}
        }
        (Foo.prototype as any).b = 2;

        expect(new Foo(1)).toEqual({ a: 1 });
        expect(_.toPlainObject(new Foo(1))).toEqual({ a: 1, b: 2 });
      });
      test('toString: 将对象转换为字符串', () => {});
    });
  });
  describe('对象', () => {
    function Foo(this: { a: number; e: { f: number; g: number[] } }) {
      this.a = 1;
      this.e = { f: 5, g: [1, 2, 3] };
    }
    function Bar(this: { c: number }) {
      this.c = 3;
    }
    Foo.prototype.b = 2;
    Bar.prototype.d = 4;

    const foo = new (Foo as any)();
    const bar = new (Bar as any)();

    test('create: 使用prototype创建对象 [Object.create]', () => {
      const Animal = {
        name: 'Animal',
        say: function () {
          return `I'm ${this.name}`;
        },
      };
      [
        _.create(Animal, { name: 'Cat' }),
        Object.create(Animal, {
          name: {
            value: 'Dog',
            writable: false,
            enumerable: true,
            configurable: true,
          },
        }),
      ].forEach((v, i) => {
        expect(v.say()).toBe(i == 0 ? "I'm Cat" : "I'm Dog");
        expect(_.assign({}, v)).toEqual({ name: i == 0 ? 'Cat' : 'Dog' });
        expect(v.__proto__).toBe(Animal);
      });
    });
    test('forIn & forInRight & forOwn & forOwnRight: 遍历', () => {
      // 对于Array 和 Object来说, forOwn和forEach行为一致
      // 对于ArrayObject, forEach当数组处理，forOwn当对象处理
      // 如: {x: 100, y: 100, length: 2}
      //  forEach: [0, undefined], [1, undefined]
      //  forOwn: [x, 100], [y, 100], [length, 2]
    });
    test('findKey & findLastKey: 查找对象的键', () => expect(_.findKey(foo, (v) => v == 1)).toBe('a'));
    test('invert & invertBy: 反转对象', () => {
      const obj = { a: 1, b: 2, c: 1 };
      expect(_.invert(obj)).toEqual({ 1: 'c', 2: 'b' }); // 后面的覆盖覆盖前面的值
      expect(_.invertBy(obj)).toEqual({ 1: ['a', 'c'], 2: ['b'] }); // 集合化
      expect(_.invertBy(obj, (v) => (v == 1 ? 'O' : 'T'))).toEqual({ O: ['a', 'c'], T: ['b'] });
    });
    test('transform & transformWith: 类同reduce', () => {});
    test('pick & pickBy & omit & omitBy: 摘取', () => {
      const obj = { a: 1, b: '2', c: 3 };

      expect(_.pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 });
      expect(_.pickBy(obj, _.isNumber)).toEqual({ a: 1, c: 3 });

      expect(_.omit(obj, ['b'])).toEqual({ a: 1, c: 3 });
      expect(_.omitBy(obj, _.negate(_.isNumber))).toEqual({ a: 1, c: 3 });
    });

    describe('合并', () => {
      test('assign & assignWith: 合并可枚举对象 [Object.assign]', () => {
        expect(_.assign({}, foo, bar)).toEqual({ a: 1, c: 3, e: { f: 5, g: [1, 2, 3] } });
        expect(Object.assign({}, foo, bar)).toEqual({ a: 1, c: 3, e: { f: 5, g: [1, 2, 3] } });

        expect(
          _.chain({ a: '1' })
            .assignWith(foo, bar, (objVal, srcVal) => (_.isUndefined(objVal) ? srcVal : objVal))
            .value()
        ).toEqual({ a: '1', c: 3, e: { f: 5, g: [1, 2, 3] } });
      });
      test('assignIn(extend) & assignInWith(extendWith): 遍历继承链合并', () => {
        expect(_.assignIn({}, foo, bar)).toEqual({ a: 1, b: 2, c: 3, d: 4, e: { f: 5, g: [1, 2, 3] } });
        expect(_.assign({}, _.toPlainObject(foo), _.toPlainObject(bar))).toEqual({
          a: 1,
          b: 2,
          c: 3,
          d: 4,
          e: { f: 5, g: [1, 2, 3] },
        });

        expect(
          _({ d: 'd' })
            .assignInWith(foo, bar, (objVal, srcVal) =>
              _.isUndefined(objVal) ? (_.isNumber(srcVal) ? srcVal * 2 : srcVal) : objVal
            )
            .value()
        ).toEqual({
          a: 2,
          b: 4,
          c: 6,
          d: 'd',
          e: { f: 5, g: [1, 2, 3] },
        });
      });
      test('defaults & defaultsDeep: 前优先(会遍历继承链)', () => {
        expect(_.defaults({ e: 1 }, foo, bar)).toEqual({ a: 1, b: 2, c: 3, d: 4, e: 1 });
        expect(_.defaultsDeep({ e: { g: 1 } }, foo, bar)).toEqual({ a: 1, b: 2, c: 3, d: 4, e: { f: 5, g: 1 } });
      });
      test('merge & mergeWith: 合并(键值相同时合并而非覆盖)', () => {
        const a1 = {
          a: [{ b: 2 }, { d: 4 }, { f: 6 }],
        };
        const a2 = {
          a: [{ c: 3 }, { e: 5 }],
        };
        expect(_.merge({}, a1, a2)).toEqual({ a: [{ b: 2, c: 3 }, { d: 4, e: 5 }, { f: 6 }] });
        expect(_.assign({}, a1, a2)).toEqual(a2);
        expect(_.defaults({}, a1, a2)).toEqual(a1);
        expect(a1).toEqual({ a: [{ b: 2 }, { d: 4 }, { f: 6 }] });
        expect(a2).toEqual({ a: [{ c: 3 }, { e: 5 }] });
      });
    });
    describe('映射', () => {
      test('entires(toPairs) & entiresIn(toPairsIn): 生成对象的[K, V] [Object.entries]', () => {
        expect(_.entries(foo)).toEqual([
          ['a', 1],
          ['e', { f: 5, g: [1, 2, 3] }],
        ]);
        expect(_.entriesIn(foo)).toEqual([
          ['a', 1],
          ['e', { f: 5, g: [1, 2, 3] }],
          ['b', 2],
        ]);

        expect(Object.entries(foo)).toEqual([
          ['a', 1],
          ['e', { f: 5, g: [1, 2, 3] }],
        ]);
      });
      {
        const newBar = _.create(_.assign({}, { c: _.constant('c') }, Bar.prototype), { a: 1, b: _.constant('b') });
        test('functions & functionsIn: 获取函数键数组', () => {
          expect(_.functions(newBar)).toEqual(['b']);
          expect(_.functionsIn(newBar)).toEqual(['b', 'c']);
        });
        test('keys & keysIn: 获取键数组', () => {
          expect(_.keys(newBar)).toEqual(['a', 'b']);
          expect(_.keysIn(newBar)).toEqual(['a', 'b', 'c', 'd']);
        });
        test('values & valuesIn: 获取值数组', () => {
          expect(_.values(newBar).map((v) => (_.isFunction(v) ? v() : v))).toEqual([1, 'b']);
          expect(_.valuesIn(newBar).map((v) => (_.isFunction(v) ? v() : v))).toEqual([1, 'b', 'c', 4]);
        });
      }
      test('mapKeys & mapValues: 映射键值', () => {
        expect(_.mapKeys(foo, (v, k) => k + 1)).toEqual({ a1: 1, e1: { f: 5, g: [1, 2, 3] } });
        expect(
          _(foo)
            .map((v, k) => [k + 1, v])
            .fromPairs()
            .value()
        ).toEqual({ a1: 1, e1: { f: 5, g: [1, 2, 3] } });
        expect(Object.fromEntries(Object.entries(foo).map(([k, v]) => [k + 1, v]))).toEqual({
          a1: 1,
          e1: { f: 5, g: [1, 2, 3] },
        });

        expect(_.mapValues(foo, (v) => (_.isNumber(v) ? v * 2 : v))).toEqual({ a: 2, e: { f: 5, g: [1, 2, 3] } });
        expect(
          _(foo)
            .map((v, k) => [k, _.isNumber(v) ? v * 2 : v])
            .fromPairs()
            .value()
        ).toEqual({
          a: 2,
          e: { f: 5, g: [1, 2, 3] },
        });
      });
    });
    describe('路径', () => {
      test('at: 根据路径创建数组', () => {
        expect(_.at(foo, 'b')).toEqual([2]);
        expect(_.at(foo, ['b'])).toEqual([2]);
        expect(_.at(foo, ['b', 'e.g[2]'])).toEqual([2, 3]);
      });
      test('result: 根据路径获取值(如果是函数就执行得到结果)', () => {
        const object = { a: [{ b: { c1: 3, c2: _.constant(4) } }] };

        expect(_.get(object, 'a[0].b.c2')()).toEqual(4);
        expect(_.result(object, 'a[0].b.c2')).toEqual(4);
      });
      test('get: 根据路径获取值', () => {
        expect(_.get(foo, 'e.g[1]')).toBe(2);
        expect(_.get(foo, 'e.g[3]')).toBeUndefined();
        expect(_.get(foo, 'e.g[3]', { x: 1 })).toEqual({ x: 1 });
        expect(_.get(foo, 'b')).toBe(2); // 得到原型链上的b正确
      });
      test('has & hasIn: 是否存在路径(直接属性) [Object.hasOwn & in]', () => {
        expect(_.has(foo, 'e.g[1]')).toBe(true);
        expect(_.has(foo, 'e.g[3]')).toBe(false);

        expect(_.has(foo, 'b')).toBe(false); // 只能拿到直接属性，原型链上的b不能拿到
        expect(_.hasIn(foo, 'b')).toBe(true);

        expect(Object.hasOwn(foo, 'b')).toBe(false);
        expect('b' in foo).toBe(true);
      });
      test('set & setWith: 根据路径设置值', () => {
        expect(_.set(_.cloneDeep(foo), 'e.g[1]', 'x')).toEqual({ a: 1, e: { f: 5, g: [1, 'x', 3] } }); // 改变
        expect(_.set({}, '[0][1]', 'x')).toEqual({ 0: [undefined, 'x'] }); // 新增
        expect(_.setWith({}, '[0][1]', 'x', Object)).toEqual({ 0: { 1: 'x' } });
      });
      test('update & updateWith: 根据路径使用生成函数设置值', () => {
        const updater = (v: number | undefined) => (v ? v * v : 0);
        expect(_.update({ a: [{ b: { c: 3 } }] }, 'a[0].b.c', updater)).toEqual({ a: [{ b: { c: 9 } }] });
        expect(_.update({ a: [{ b: { c: 3 } }] }, 'a[0].b.d', updater)).toEqual({ a: [{ b: { c: 3, d: 0 } }] });
      });
      test('unset: 根据路径删除值', () => {
        const object = { a: [{ b: { c: 7, d: 8 } }] };
        Object.defineProperty(object.a[0].b, 'e', { writable: false, value: 9 }); // 不可枚举
        expect(_.unset(object, 'a[0].b.e')).toBe(false);
        expect(_.unset(object, 'a[0].b.f')).toBe(true); // 不存在的值可以删掉
        expect(object).toEqual({ a: [{ b: { c: 7, d: 8 } }] });

        expect(_.unset(object, 'a[0].b.c')).toBe(true);
        expect(object).toEqual({ a: [{ b: { d: 8 } }] });

        delete (object.a[0].b as any).d;
        expect(object).toEqual({ a: [{ b: {} }] });
      });
      test('invoke: 根据路径调用函数', () => {
        const obj = { a: [{ b: { c: [1, 2, 3, 4] } }] };
        expect(_.invoke(obj, 'a[0].b.c.splice', 0, 2)).toEqual([1, 2]);
        expect(obj).toEqual({ a: [{ b: { c: [3, 4] } }] });
      });
    });
  });
  describe.only('工具', () => {
    test('attempt: 尝试执行函数，如果出错则返回错误', () => {
      function attempt(func: (...args: any[]) => any, ...args: any[]) {
        try {
          return func(...args);
        } catch (e: any) {
          return e instanceof Error ? e : new Error(e);
        }
      }
      function throwErr(err: any) {
        throw err;
      }
      expect(attempt(throwErr, 1)).toBeInstanceOf(Error);
      expect(_.attempt(throwErr, new Error('x'))).toBeInstanceOf(Error);
    });
    test('cond: 根据条件返回值', () => {
      function cond(pairs: [any, any][]): any {
        return function (...args: any[]) {
          const pair = pairs.find(([pred]) => pred(...args));
          return pair ? (pair[1] instanceof Function ? pair[1](...args) : pair[1]) : undefined;
        };
      }

      [cond, _.cond].forEach((c) => {
        expect(
          c([
            [_.isString, _.toUpper],
            [_.isNumber, _.toString],
          ])('a')
        ).toBe('A');
        expect(
          c([
            [_.isString, _.toUpper],
            [_.isNumber, _.toString],
          ])(1)
        ).toBe('1');
      });
    });
    test('defaultTo: 如果值为undefined或null，则返回默认值[??]', () => {
      expect(_.defaultTo(undefined, 1)).toBe(1);
      expect(_.defaultTo(null, 1)).toBe(1);
      expect(_.defaultTo(undefined, undefined)).toBeUndefined();
      expect(_.defaultTo(null, null)).toBeNull();
      expect(_.defaultTo(false, 1)).toBe(false);
    });
    test('flow & flowRight: 函数流', () => {});
    test('identity: 返回传入的值', () => {
      function identity(value: any) {
        return value;
      }
      const obj = { a: 1 };
      expect(_.identity(obj)).toBe(obj);
      expect(identity(obj)).toBe(obj);
    });
    test('iteratee: 根据给定参数创建布尔函数', () => { });
    test('uniqueId: 生成唯一id', () => {
      expect(_.uniqueId('foo')).toBe('foo1');
      expect(_.uniqueId('foo')).toBe('foo2');
      expect(_.uniqueId('foo')).toBe('foo3');
    });
  });
});
