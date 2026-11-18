/* L alias */ type T = any /* T any */

/* L alias */ type T = mixed /* T mixed */

/* L alias */ type T = empty /* T empty */

/* L alias */ type T = void /* T void */

/* L alias */ type T = null /* T null */

/* L alias */ type T = number /* T number */

/* L alias */ type T = bigint /* T bigint */

/* L alias */ type T = string /* T string */

/* L alias */ type T = boolean /* T boolean */

/* L alias */ type T = symbol /* T symbol */

/* L alias */ type T = * /* T exists */

/* L alias */ type T = (?any) /* T nullable */
/* L alias */ type T = ?any /* T any */

/* L alias */ type T = (() => void) /* T func */
/* L alias */ type T = () => void /* T void */

/* L alias */ type T = {} /* T obj */

/* L alias */ type T = (interface {}) /* T interface */
/* L alias */ type T = interface {} /* T obj */

/* L alias */ type T = any[] /* T array */

/* L alias */ type T = (Foo) /* T generic */
/* L alias */ type T = Foo /* T id */
/* L alias */ type T = Foo.Bar /* T id */
/* L alias */ type T = Foo<T> /* T targs */

/* L alias */ type T = (string | number) /* T union */
/* L alias */ type T = string | number /* T number */
/* L alias */ type T = string | number | boolean | mixed /* T mixed */

/* L alias */ type T = (string & number) /* T intersection */
/* L alias */ type T = string & number /* T number */
/* L alias */ type T = string & number & boolean & mixed /* T mixed */

/* L alias */ type T = (typeof Foo) /* T typeof */
/* L alias */ type T = typeof Foo /* T id */

/* L alias */ type T = [any] /* T tuple */

/* L alias */ type T = 'string' /* T str lit */

/* L alias */ type T = 1 /* T num lit */

/* L alias */ type T = 1n /* T bigint lit */

/* L alias */ type T = true /* T bool lit */
