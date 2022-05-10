function field(host: any, field: any, descr?: any): any {
    return { ...descr, get: () => {}, set: () => {} };
}

class TestMems {
    @field
    static some = 1;
}

expect(Object.keys(TestMems)).toEqual(["some"]);
expect(TestMems.some).toBeUndefined();
