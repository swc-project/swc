function leadingOnly() {
  /* 1.1 Leading */ (1: number)
}

function trailingOnly() {
  (1: number) /* 2.1 trailing */
}

function leadingAndTrailing() {
    /* 3.1 Leading */ (1: number) /* 3.2 Trailing */
}

function innerComments() {
    /* 4.1 L cast */ (/* 4.2 L num */ 1 /* 4.3 T num */ : /* 4.4 L type */ number /* 4.5 T type */) /* 4.6 T cast */
}
