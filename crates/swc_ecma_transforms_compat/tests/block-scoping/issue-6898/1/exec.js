(async () => {
    const arr = [
        'value1',
        'value2',
        'value3',
    ];

    // for (const value of arr) {
    for (let i = 0; i < arr.length; i++) {
        const value = arr[i];
        setTimeout(() => {
            console.log('value', value);
        }, 0);
    }
})();