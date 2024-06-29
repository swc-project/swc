function onlyLeading() {
  /* Not leading */
  const z = 0;
  // 1.1 Leading A
  /* 1.2 Leading B */ try {
    const x = 1;
  } catch (e1) {
    console.log(1);
  }
}

function onlyTrailing() {
  try /* 2.1 Leading block */ {
    /* 2.2 Not trailing */
    const y = 2;
  } catch (e2) {
    console.log(2);
  }
  /* 2.3 Trailing block */
}

function leadingAndTrailing() {
  // 3.1 Leading
  try /* 3.2 Leading block */ {
    /* 3.3 Not trailing */
    const y = 2;
  } finally {
    console.log(3);
  }
  /* 3.4 Trailing block */
}

function trailingWithCatch() {
  try {} catch {} /* 4.1 T block */
  /* 4.2 L try */ try {} catch {} /* 4.3 T block */
}

function trailingWithFinally() {
  try {} finally {} /* 5.1 T block */
  /* 5.2 L try */ try {} finally {} /* 5.3 T block */
}
