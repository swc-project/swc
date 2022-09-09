async () => {
    const a = await 1;
    expect(a).toBe(1);
    const b = ((x) => x + x)(await 2);
    expect(b).toBe(4);
};
