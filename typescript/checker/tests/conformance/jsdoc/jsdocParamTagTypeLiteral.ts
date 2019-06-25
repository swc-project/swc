// @allowJS: true
// @checkJs: true
// @noEmit: true
// @strict: true
// @suppressOutputPathCheck: true

// @Filename: 0.js
/**
 * @param {Object} notSpecial
 * @param {string} unrelated - not actually related because it's not notSpecial.unrelated
 */
function normal(notSpecial) {
    notSpecial; // should just be 'any'
}
normal(12);

/**
 * @param {Object} opts1 doc1
 * @param {string} opts1.x doc2
 * @param {string=} opts1.y doc3
 * @param {string} [opts1.z] doc4
 * @param {string} [opts1.w="hi"] doc5
 */
function foo1(opts1) {
    opts1.x;
}

foo1({x: 'abc'});

/**
 * @param {Object[]} opts2
 * @param {string} opts2[].anotherX
 * @param {string=} opts2[].anotherY
 */
function foo2(/** @param opts2 bad idea theatre! */opts2) {
    opts2[0].anotherX;
}

foo2([{anotherX: "world"}]);

/**
 * @param {object} opts3
 * @param {string} opts3.x
 */
function foo3(opts3) {
    opts3.x;
}
foo3({x: 'abc'});

/**
 * @param {object[]} opts4
 * @param {string} opts4[].x
 * @param {string=} opts4[].y
 * @param {string} [opts4[].z]
 * @param {string} [opts4[].w="hi"]
 */
function foo4(opts4) {
    opts4[0].x;
}

foo4([{ x: 'hi' }]);

/**
 * @param {object[]} opts5 - Let's test out some multiple nesting levels
 * @param {string} opts5[].help - (This one is just normal)
 * @param {object} opts5[].what - Look at us go! Here's the first nest!
 * @param {string} opts5[].what.a - (Another normal one)
 * @param {Object[]} opts5[].what.bad - Now we're nesting inside a nested type
 * @param {string} opts5[].what.bad[].idea - I don't think you can get back out of this level...
 * @param {boolean} opts5[].what.bad[].oh - Oh ... that's how you do it.
 * @param {number} opts5[].unnest - Here we are almost all the way back at the beginning.
 */
function foo5(opts5) {
    opts5[0].what.bad[0].idea;
    opts5[0].unnest;
}

foo5([{ help: "help", what: { a: 'a', bad: [{ idea: 'idea', oh: false }] }, unnest: 1 }]);
