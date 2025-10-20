import { expect, test } from 'vitest';
import { snakeToCamel, camelToSnake } from '../src/utils/index';

test('snake to camel', () => {
    expect(snakeToCamel('foo_bar')).toBe('fooBar');
    expect(snakeToCamel('fooBar')).toBe('fooBar');
});

test('camel to snake', () => {
    expect(camelToSnake('fooBar')).toBe('foo_bar');
    expect(camelToSnake('foo_bar')).toBe('foo_bar');
});
