//// [1.tsx]
//! 
//!   x Unexpected eof
//!    ,----
//!  3 | </>;
//!    :     ^
//!    `----
//// [2.tsx]
//! 
//!   x Expected '>', got ':'
//!    ,----
//!  1 | <a: />;
//!    :   ^
//!    `----
//// [3.tsx]
//! 
//!   x Unexpected token `:`. Expected an identifier, void, yield, null, await, break, a string literal, a numeric literal, true, false, `, -, import, this, typeof, {, [, (
//!    ,----
//!  1 | <:a />;
//!    :  ^
//!    `----
//// [4.tsx]
//! 
//!   x Expected '>', got 'b'
//!    ,----
//!  1 | <a b=d />;
//!    :    ^
//!    `----
//// [5.tsx]
//! 
//!   x Unexpected token `;`. Expected this, import, async, function, [ for array literal, { for object literal, @ for decorator, function, class, null, true, false, number, bigint, string, regexp, `
//!   | for template literal, (, or an identifier
//!    ,----
//!  1 | <a>;
//!    :    ^
//!    `----
//// [6.tsx]
//! 
//!   x Unexpected eof
//!    ,----
//!  1 | <a></b>;
//!    :         ^
//!    `----
//// [7.tsx]
//! 
//!   x Expected '>', got 'foo'
//!    ,----
//!  1 | <a foo="bar;
//!    :    ^^^
//!    `----
//// [8.tsx]
//! 
//!   x Expected '>', got ':'
//!    ,----
//!  1 | <a:b></b>;
//!    :   ^
//!    `----
//// [9.tsx]
//! 
//!   x Expected '>', got ':'
//!    ,----
//!  1 | <a:b.c></a:b.c>;
//!    :   ^
//!    `----
//// [10.tsx]
//! 
//!   x Expected '>', got ':'
//!    ,----
//!  1 | <a.b:c></a.b:c>;
//!    :     ^
//!    `----
//// [11.tsx]
//! 
//!   x Unexpected eof
//!    ,----
//!  1 | <a.b.c></a>;
//!    :             ^
//!    `----
//// [12.tsx]
//! 
//!   x Unexpected token `.`. Expected an identifier, void, yield, null, await, break, a string literal, a numeric literal, true, false, `, -, import, this, typeof, {, [, (
//!    ,----
//!  1 | <.a></.a>;
//!    :  ^
//!    `----
//// [13.tsx]
//! 
//!   x Expected an identifier
//!    ,----
//!  1 | <a.></a.>;
//!    :    ^
//!    `----
//! 
//!   x Unexpected eof
//!    ,----
//!  1 | <a.></a.>;
//!    :           ^
//!    `----
//// [14.tsx]
//! 
//!   x Unexpected eof
//!    ,----
//!  1 | <a[foo]></a[foo]>;
//!    :                   ^
//!    `----
//// [15.tsx]
//! 
//!   x Unexpected eof
//!    ,----
//!  1 | <a['foo']></a['foo']>;
//!    :                       ^
//!    `----
//// [16.tsx]
//! 
//!   x Expression expected
//!    ,----
//!  1 | <a><a />;
//!    :       ^
//!    `----
//! 
//!   x Unexpected token `>`. Expected this, import, async, function, [ for array literal, { for object literal, @ for decorator, function, class, null, true, false, number, bigint, string, regexp, `
//!   | for template literal, (, or an identifier
//!    ,----
//!  1 | <a><a />;
//!    :        ^
//!    `----
//// [17.tsx]
//! 
//!   x Expected '>', got 'b'
//!    ,----
//!  1 | <a b={}>;
//!    :    ^
//!    `----
//// [18.tsx]
//! 
//!   x Unknown regular expression flags.
//!    ,----
//!  1 | var x = /* Leading trivia */ <div>one</div><div>two</div>;;
//!    :                                       ^^^^^^^^^^^^^^^^^^
//!    `----
//! 
//!   x Unexpected token `;`. Expected this, import, async, function, [ for array literal, { for object literal, @ for decorator, function, class, null, true, false, number, bigint, string, regexp, `
//!   | for template literal, (, or an identifier
//!    ,----
//!  1 | var x = /* Leading trivia */ <div>one</div><div>two</div>;;
//!    :                                                          ^
//!    `----
//// [19.tsx]
//! 
//!   x Expected a semicolon
//!    ,----
//!  1 | var x = <div>one</div> /* intervening comment */ <div>two</div>;;
//!    :                                       ^^^^^^^
//!    `----
//! 
//!   x Unknown regular expression flags.
//!    ,----
//!  1 | var x = <div>one</div> /* intervening comment */ <div>two</div>;;
//!    :                                                ^^^^^^^^^^^^^^^
//!    `----
//// [20.tsx]
//! 
//!   x Expected a semicolon
//!    ,----
//!  1 | <a>{"str";}</a>;
//!    :          ^
//!    `----
//! 
//!   x Expected ',', got ';'
//!    ,----
//!  1 | <a>{"str";}</a>;
//!    :          ^
//!    `----
//// [21.tsx]
//! 
//!   x Expected '>', got 'className'
//!    ,----
//!  1 | <span className="a", id="b" />;
//!    :       ^^^^^^^^^
//!    `----
//// [22.tsx]
//! 
//!   x Expected '>', got 'className'
//!    ,----
//!  1 | <div className"app">;
//!    :      ^^^^^^^^^
//!    `----
//// [23.tsx]
//! 
//!   x Expected '>', got '{'
//!    ,----
//!  1 | <div {props} />;
//!    :      ^
//!    `----
//// [24.tsx]
//! 
//!   x Unterminated regexp literal
//!    ,----
//!  1 | <div>stuff</div {...props}>;
//!    :            ^^^^^^^^^^^^^^^^^
//!    `----
//// [25.tsx]
//! 
//!   x Expected '>', got '{'
//!    ,----
//!  1 | <div {...props}>stuff</div {...props}>;
//!    :      ^
//!    `----
//// [26.tsx]
//! 
//!   x Expression expected
//!    ,----
//!  1 | <a>></a>;
//!    :    ^
//!    `----
//! 
//!   x Unterminated regexp literal
//!    ,----
//!  1 | <a>></a>;
//!    :      ^^^^
//!    `----
//// [27.tsx]
//! 
//!   x Expression expected
//!    ,----
//!  1 | <a> ></a>;
//!    :     ^
//!    `----
//! 
//!   x Unterminated regexp literal
//!    ,----
//!  1 | <a> ></a>;
//!    :       ^^^^
//!    `----
//// [28.tsx]
//! 
//!   x Expected '>', got 'b'
//!    ,----
//!  1 | <a b=}>;
//!    :    ^
//!    `----
//// [29.tsx]
//! 
//!   x Expected '>', got 'b'
//!    ,----
//!  1 | <a b=<}>;
//!    :    ^
//!    `----
//// [30.tsx]
//! 
//!   x Unexpected token `}`. Expected this, import, async, function, [ for array literal, { for object literal, @ for decorator, function, class, null, true, false, number, bigint, string, regexp, `
//!   | for template literal, (, or an identifier
//!    ,----
//!  1 | <a>}</a>;
//!    :    ^
//!    `----
//// [31.tsx]
//! 
//!   x Expected '>', got '...'
//!    ,----
//!  1 | <a .../*hai*/asdf/>;
//!    :    ^^^
//!    `----
