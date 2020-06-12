const swc = require('../../../');

it('should perform dce', () => {
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
    expect(out.code.trim()).toBe(`console.log('Foo');`);
});