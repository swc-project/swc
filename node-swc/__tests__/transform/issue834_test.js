const swc = require('../../../');

it('should work without parser.sytax', () => {
    const out = swc.transformSync(`const someValue = "test" ?? "default value";`, {
            jsc: {
                parser: {
                    nullishCoalescing: true,
                    numericSeparator: true
                },
            }
        }
    );
    expect(out.map).toBeFalsy();
});


it('should work with parser.syntax', () => {
    const out = swc.transformSync(`const someValue = "test" ?? "default value";`, {
            jsc: {
                parser: {
                    syntax: 'ecmascript',
                    nullishCoalescing: true,
                    numericSeparator: true
                },
            }
        }
    );
    expect(out.map).toBeFalsy();
});