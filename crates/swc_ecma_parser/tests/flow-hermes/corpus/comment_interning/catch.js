function onlyLeading() {
  /* Not leading 1 */
  const z = 0;
  try {
    const x = 1;
    /* Not leading 2 */
  }
  // 1.1 Leading A
  /* 1.2 Leading B */
  catch (e1) {
    console.log(1);
  }
}

function onlyTrailing() {
  try {
    const y = 2;
  } catch /* 2.1 Trailing */ (e2) /* 2.2 Not trailing */ {
    /* 2.3 Not trailing */
    console.log(2);
  }
  /* 2.4 Not Trailing */
}

function leadingAndTrailing() {
  try {
    const y = 2;
  }
  // 3.1 Leading
  catch /* 3.2 Trailing */ (e3) /* 3.3 Not trailing */  {
    /* 3.4 Not trailing */
    console.log(3);
  }
  /* 3.5 Not Trailing */
}
