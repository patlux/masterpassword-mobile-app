import generate, { COLORS } from './IdentIcon';

test('IdentIcon', () => {
  expect(generate('test', 'test')).toBe(['', '']);
});
