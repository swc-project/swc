var x = undefined;
var sets = 0;
var obj = {
  get x() {
    return x;
  },

  set x(value) {
    sets++;
    x = value;
  },
};

expect(obj.x ??= 1).toBe(1);
expect(sets).toBe(1);
expect(obj.x ??= 2).toBe(1);
expect(sets).toBe(1);

var gets = 0;
var deep = {
  get obj() {
    gets++;
    return obj;
  },
};

obj.x = undefined;
expect(deep.obj.x ??= 1).toBe(1);
expect(gets).toBe(1);
expect(deep.obj.x ??= 2).toBe(1);
expect(gets).toBe(2);

var key = 0;
obj.x = undefined;
expect(obj[++key] ??= 1).toBe(1);
expect(key).toBe(1);
key = 0;
expect(obj[++key] ??= 2).toBe(1);
expect(key).toBe(1);

obj.x = undefined;
key = 0;
expect(deep.obj[++key] ??= 1).toBe(1);
expect(gets).toBe(3);
expect(key).toBe(1);
key = 0;
expect(deep.obj[++key] ??= 2).toBe(1);
expect(gets).toBe(4);
expect(key).toBe(1);
