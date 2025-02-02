// utils/validation.test.ts

import { regExPatterns, testPassword } from '@/utils/RegExPatterns';

describe('regExPatterns', () => {
  it('should validate email addresses correctly', () => {
    expect(regExPatterns.email.test('test@example.com')).toBe(true);
    expect(regExPatterns.email.test('invalid-email')).toBe(false);
  });

  it('should validate names correctly', () => {
    expect(regExPatterns.name.test('John Doe')).toBe(true);
    expect(regExPatterns.name.test('JD')).toBe(false);
    expect(
      regExPatterns.name.test('This name is way too long for the regex pattern')
    ).toBe(false);
  });

  it('should validate addresses correctly', () => {
    expect(regExPatterns.address.test('123 Main St, Anytown, USA')).toBe(true);
    expect(regExPatterns.address.test('A')).toBe(false);
  });

  it('should validate phone numbers correctly', () => {
    expect(regExPatterns.phone.test('0781234567')).toBe(true);
    expect(regExPatterns.phone.test('0791234567')).toBe(true);
    expect(regExPatterns.phone.test('0721234567')).toBe(true);
    expect(regExPatterns.phone.test('0731234567')).toBe(true);
    expect(regExPatterns.phone.test('1234567890')).toBe(false);
  });

  it('should validate passwords correctly', () => {
    expect(regExPatterns.password.test('Password1!')).toBe(true);
    expect(regExPatterns.password.test('pass')).toBe(false);
  });
});

describe('testPassword', () => {
  it('should return an error message if the password does not meet the criteria', () => {
    const password = 'short1!';
    expect(testPassword(password)).toBe(null);
  });

  it('should return null if the password meets all criteria', () => {
    const password = 'Password1!';
    expect(testPassword(password)).toBeNull();
  });

  it('should return an appropriate error message for multiple criteria', () => {
    const password = 'short';
    const expectedError =
      'Please provide a password with, At least one number, At least one special character (@#$%^&+=!), Minimum length of 8!';
    expect(testPassword(password)).toBe(expectedError);
  });
});
