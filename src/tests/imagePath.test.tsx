// utils/imagePath.test.ts

import { imagePath } from '@/utils/Functions';

describe('imagePath', () => {
  it('should replace the base URL with an empty string', () => {
    const input =
      'https://res.cloudinary.com/dn8vyfgnl/image/upload/v1627301234/sample.jpg';
    const expectedOutput = '/v1627301234/sample.jpg';
    expect(imagePath(input)).toBe(expectedOutput);
  });

  it('should return the original string if the base URL is not present', () => {
    const input = 'https://example.com/v1627301234/sample.jpg';
    const expectedOutput = 'https://example.com/v1627301234/sample.jpg';
    expect(imagePath(input)).toBe(expectedOutput);
  });
});
