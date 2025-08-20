import { describe, expect, it } from 'vitest';
import { objectFormatKey } from './index';

describe('test objectFormatKey', () => {
  it('should format object keys', () => {
    const obj = {
      count: 3,
      time: ['2021', '2024'],
      c1: 1,
      c2: 2,
      option: { child: ['q', 'w'], name: 'n' },
      o: 4,
    };

    const formatKeys = [
      ['count', 'num'],
      ['time[0]', 'startTime'],
      ['time[1]', 'endTime'],
      ['time'],
      ['c1', 'cAry[0]'],
      ['c2', 'cAry[1]'],
      ['option.child[0]', 'option.a'],
      [['option', 'child', '1'], ['option', 'b']],
      ['option.child'],
    ];

    const result = {
      num: 3,
      startTime: '2021',
      endTime: '2024',
      cAry: [1, 2],
      option: { a: 'q', b: 'w', name: 'n' },
      o: 4,
    };

    expect(objectFormatKey(obj, formatKeys)).toStrictEqual(result);
  });
});
