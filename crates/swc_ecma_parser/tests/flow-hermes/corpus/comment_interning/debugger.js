function onlyLeading() {
  /* Not leading 1 */
  const z = 0;
  // 1.1 Leading A
  /* 1.2 Leading B */
  debugger;
}

function onlyTrailing() {
  debugger /* 2.1 trailing */ ; /* 2.2 Trailing */
  /* 2.3 Trailing */
}

function leadingAndTrailing() {
  // 3.1 Leading A
  /* 3.2 Leading B */
  debugger /* 3.3 trailing */ ;
  // 3.4 Trailing
}

function implicitSemicolon() {
  debugger /* 4.1 Trailing */
  /* 4.2 Leading */ debugger /* 4.3 Trailing */
}
