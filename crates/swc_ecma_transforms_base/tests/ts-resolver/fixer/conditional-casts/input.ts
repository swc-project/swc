(value as T) ? /a/ : other;
(value satisfies T) ? (/a/) : other;
(value as T) ? /a/.test(text) : other;
(value satisfies T) ? /a/ + value : other;
(value as T) ? +other : value;
(value as T) ? ~other : value;
(value satisfies T) ? -other : value;
(value satisfies T) ? delete object.key : other;
(value as T) ? ++object.key : other;
(value as T) ? --object.key : other;
(value satisfies T) ? class {} : other;
(value as T) ? (/a/.lastIndex = 1) : other;
(value satisfies T) ? /a/.lastIndex++ : other;
(value as T) ? /a/?.source : other;
(value as T) ? /a/`text` : other;
(value as T) ? (/a/, other) : value;
(value as T) ? (/a/ ? left : right) : other;
(value satisfies T) ? (/a/ as unknown) : other;
(value as T) ? true : false;
(value satisfies T) ? -1 : other;
(value as T) ? -1n : other;
(value as T) ? !other : value;
(value satisfies T) ? typeof other : value;
(value as T) ? void other : value;
(value as T) ? function() {} : other;
(value as T) ? new C() : other;
(value as T) ? (() => value)() : other;
class Derived extends Base {
    method() {
        return (this as T) ? super.key : other;
    }
    privateMethod(object) {
        (this as T) ? (#key in object)() : other;
        (this satisfies T) ? (#key in object).value : other;
        return (this satisfies T) ? #key in object : other;
    }
    #key;
}
