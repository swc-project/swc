//// [ts-expect-error.ts]
// @ts-expect-error additional commenting
var invalidCommentedFancySingle = 'nope';
/*
 @ts-expect-error additional commenting */ var invalidCommentedFancyMulti = 'nope';
// @ts-expect-error additional commenting
var validCommentedFancySingle = 'nope';
/* @ts-expect-error additional commenting */ var validCommentedFancyMulti = 'nope';
// @ts-expect-error
var invalidCommentedPlainSingle = 'nope';
/*
 @ts-expect-error */ var invalidCommentedPlainMulti = 'nope';
// @ts-expect-error
var validCommentedPlainSingle = 'nope';
/* @ts-expect-error */ var validCommentedPlainMulti1 = 'nope';
/*
@ts-expect-error */ var validCommentedPlainMulti2 = 'nope';
var invalidPlain = 'nope';
var validPlain = 'nope';
// @ts-expect-error
({
    a: true
}).a === false; // <-- compiles (as expected via comment)
({
    a: true
}).a === false; // Should error
({
    a: true
}).a === false; // error
({
    a: true
}).a === false; // error
// @ts-expect-error: additional commenting with no whitespace
var invalidCommentedFancySingle = 'nope';
/*
 @ts-expect-error: additional commenting with no whitespace */ var invalidCommentedFancyMulti = 'nope';
