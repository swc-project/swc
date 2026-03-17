type Test1 = /* Nested leading 1 */ (/* Nested leading 2 */ any /* Nested trailing 1 */) /* Nested trailing 2 */;

type Test2 = /* Leading any */ (any) /* Trailing any */;

type Test3 = /* Leading mixed */ (mixed) /* Trailing mixed */;

type Test4 = /* Leading empty */ (empty) /* Trailing empty */;

type Test5 = /* Leading void */ (void) /* Trailing void */;

type Test6 = /* Leading null */ (null) /* Trailing null */;

type Test7 = /* Leading number */ (number) /* Trailing number */;

type Test8 = /* Leading bigint */ (bigint) /* Trailing bigint */;

type Test9 = /* Leading string */ (string) /* Trailing string */;

type Test10 = /* Leading boolean */ (boolean) /* Trailing boolean */;

type Test11 = /* Leading symbol */ (symbol) /* Trailing symbol */;

type Test12 = /* Leading exists */ (*) /* Trailing exists */;

type Test13 = /* Leading nullable */ (?any) /* Trailing nullable */;

type Test14 = /* Leading function */ (any => any) /* Trailing function */;

type Test15 = /* Leading object */ ({}) /* Trailing object */;

type Test16 = /* Leading interface */ (interface {}) /* Trailing interface */;

type Test17 = /* Leading array */ (any[]) /* Trailing array */;

type Test18 = /* Leading union */ (any | any) /* Trailing union */;

type Test19 = /* Leading intersection */ (any & any) /* Trailing intersection */;

type Test20 = /* Leading typeof */ (typeof x) /* Trailing typeof */;

type Test21 = /* Leading tuple */ ([any, any]) /* Trailing any */;

type Test22 = /* Leading string lit */ ("literal") /* Trailing string lit */;

type Test23 = /* Leading number lit */ (1) /* Trailing number lit */;

type Test24 = /* Leading bigint lit */ (1n) /* Trailing bigint lit */;

type Test25 = /* Leading boolean lit */ (true) /* Trailing boolean lit */;

type Test26 = /* Leading generic */ (Foo) /* Trailing generic */;
