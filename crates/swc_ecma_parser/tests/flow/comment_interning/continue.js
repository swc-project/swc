function continue_with_label() {
  foo: for (;;) {
    /* 1.1 leading on continue */
    continue /* 1.2 leading on label */ foo /* 1.3 trailing */;
    /* 1.4 trailing */
  }
}

function continue_without_label() {
  for (;;) {
    /* 2.1 leading */
    continue /* 2.2 internal */;
    /* 2.3 trailing */
  }
}

function implicit_semicolon() {
  label: for (;;) {
    {
      continue /* 3.1 T continue */
      /* 3.2 L continue */ continue /* 3.3 T continue */
    }
    {
      continue label /* 3.4 T id */
      /* 3.5 L continue */ continue label /* 3.6 T id */
    }
  }
}
