switch /* 1.1 Not attached to switch */ (1) /* 1.2 Not attached to switch */ { /* 1.3 Not attached to switch */
    default:
        1;
/* 1.4 Not attached to switch */ }

/* 2.1 Leading on switch */ switch (1) {
    default:
        1;
}

switch (1) {
    default:
        1;
} /* 3.1 Trailing on switch */

/* 4.1 Leading on switch */ switch (1) {
    default:
        1;
} /* 4.2 Trailing on switch */

switch (1) {
    /* 5.1 L case */ case /* 5.2 L num */ 1 /* 5.3 T num */ : /* 5.4 T case */
      1;
    /* 5.5 L case */ default /* 5.6 T case */ : /* 5.7 T case */
      1;
}

{
    switch (1) { default: 1; } /* 6.1 T switch */
    /* 6.2 L switch */ switch (1) { default: 1; } /* 6.3 T switch */
}

switch (1) {
    /* 7.1 L case */ case 0: /* 7.2 T case */
    /* 7.3 L case */ case 1: /* 7.4 T case */
        /* 7.5 L break */ break; /* 7.6 T break */
    /* 7.7 L case */ default: /* 7.8 T case */
        /* 7.9 L break */ break; /* 7.10 T break */
}
