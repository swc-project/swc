function break_with_label() {
  foo: for (;;) {
    /* 1.1 leading on break */
    break /* 1.2 leading on label */ foo /* 1.3 trailing on label */;
    /* 1.4 trailing */
  }
}

function break_without_label() {
  for (;;) {
    /* 2.1 leading */
    break /* 2.2 internal */;
    /* 2.3 trailing */
  }
}

function implicit_semicolon() {
  label: for (;;) {
    {
      break /* 3.1 T break */
      /* 3.2 L break */ break /* 3.3 T break */
    }
    {
      break label /* 3.4 T id */
      /* 3.5 L break */ break label /* 3.6 T id */
    }
  }
}
