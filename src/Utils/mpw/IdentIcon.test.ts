import generate from './IdentIcon';

test('IdentIcon', () => {
  expect(generate('Peter', 'test')).toEqual(['GREEN', '═▓═⚑']);
  expect(generate('patrickwozniak', 'testisteinsicherespasswort')).toEqual(['MAGENTA', '═░═☆']);
});
