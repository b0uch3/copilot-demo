//require('./scripts');

describe('Username Validation', () => {
  const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

  test('valid username with capital letter, special character, number, and at least 8 characters', () => {
    const validUsername = 'Test@123';
    expect(regex.test(validUsername)).toBe(true);
  });

  test('invalid username without capital letter', () => {
    const invalidUsername = 'test@123';
    expect(regex.test(invalidUsername)).toBe(false);
  });

  test('invalid username without special character', () => {
    const invalidUsername = 'Test1234';
    expect(regex.test(invalidUsername)).toBe(false);
  });

  test('invalid username without number', () => {
    const invalidUsername = 'Test@abc';
    expect(regex.test(invalidUsername)).toBe(false);
  });

  test('invalid username with less than 8 characters', () => {
    const invalidUsername = 'T@1a';
    expect(regex.test(invalidUsername)).toBe(false);
  });
});