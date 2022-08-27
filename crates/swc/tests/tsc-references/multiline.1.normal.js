//// [a.ts]
export var texts = [];
/**
 @ts-ignore */ texts.push(100);
/**
 @ts-expect-error */ texts.push(100);
/**
 @ts-expect-error */ texts.push("100");
//// [b.tsx]
//! 
//!   x Expression expected
//!    ,----
//!  4 | return <div />;
//!    :             ^
//!    `----
//! 
//!   x Unexpected token `>`. Expected this, import, async, function, [ for array literal, { for object literal, @ for decorator, function, class, null, true, false, number, bigint, string, regexp, `
//!   | for template literal, (, or an identifier
//!    ,----
//!  4 | return <div />;
//!    :              ^
//!    `----
