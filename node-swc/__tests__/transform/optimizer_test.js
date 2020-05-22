const swc = require('../../../');

it('should perform dce', () => {
    const out = swc.transformSync(`if (__DEBUG__) {
        console.log('Foo')
    }`, {
        jsc: {
            transform: {
                optimizer: {
                    globals: {
                        vars: {
                            __DEBUG__: 'true'
                        },
                    }
                }
            }
        }
    }
    );
    expect(out.map).toBeFalsy();

    expect(out.code.trim()).toBe(`console.log('Foo');`);
});