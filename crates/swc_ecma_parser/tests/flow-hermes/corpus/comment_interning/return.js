function withExpression() {
  /* 1.1 Leading return */ return /* 1.2 Leading num */ 1 /* 1.3 Trailing num */; /* 1.4 Trailing return */
}

function withoutExpression() {
  /* 2.1 Leading return */ return /* 2.2 Trailing return */ ; /* 2.3 Trailing return */
}

function implicitSemicolonWithExpression() {
  /* 3.1 L return */ return 1 /* 3.2 T num */
  /* 3.3 L return */ return 1
  /* 3.4 T num */
}

function implicitSemicolonWithoutExpression() {
  /* 4.1 L return */ return /* 4.2 T return */
  /* 4.3 L return */ return
  /* 4.4 T return */
}
