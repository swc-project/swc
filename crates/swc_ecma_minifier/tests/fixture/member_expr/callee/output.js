try {
    ({}).bar.baz?.();
} catch (e) {
    console.log('PASS');
}
