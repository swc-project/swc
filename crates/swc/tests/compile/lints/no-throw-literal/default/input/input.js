throw 'error';
throw 0;
throw false;
throw null;
throw {};
throw undefined;
throw 'a' + 'b';
var b = new Error(); throw 'a' + b;
throw foo = 'error';
throw foo += new Error();
throw foo &= new Error();
throw foo &&= 'literal'
throw new Error(), 1, 2, 3;
throw 'literal' && 'not an Error';
throw foo && 'literal'
throw foo ? 'not an Error' : 'literal';
throw `${err}`;

// valid
throw new Error();
throw new Error('error');
throw Error('error');
var e = new Error(); throw e;
try { throw new Error(); } catch (e) { throw e; };
throw a;
throw foo();
throw new foo();
throw foo.bar;
throw foo[bar];
class C { #field; foo() { throw foo.#field; } }
throw foo = new Error();
throw foo.bar ||= 'literal'
throw foo[bar] ??= 'literal'
throw 1, 2, new Error();
throw 'literal' && new Error();
throw new Error() || 'literal';
throw foo ? new Error() : 'literal';
throw foo ? 'literal' : new Error();
throw tag`${foo}`;
function* foo() { var index = 0; throw yield index++; }
async function foo() { throw await bar; }
throw obj?.foo;
throw obj?.foo();
