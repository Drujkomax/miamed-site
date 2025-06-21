const fs = require('fs');
const path = require('path');

describe('Site files', () => {
  test('index.html contains a title element', () => {
    const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
    expect(html).toMatch(/<title>.*<\/title>/i);
  });

  test('main.js loads without syntax errors', () => {
    const code = fs.readFileSync(path.join(__dirname, '..', 'main.js'), 'utf8');
    expect(() => new Function(code)).not.toThrow();
  });

  test('add() returns numeric sum', () => {
    const { add } = require('../main.js');
    expect(add(2, 3)).toBe(5);
  });
});
