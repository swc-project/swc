try {
    const foo = {};
    foo?.bar.baz?.();
} catch (e) {
    console.log('PASS');
}
