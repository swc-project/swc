/* 1.1 L decorator */ @foo() /* 1.2 T args */
/* 1.3 L decorator */ @bar() /* 1.4 T args */
/* 1.5 L class */ class C {}

/* 2.1 L decorator */ @foo() /* 2.2 L decorator */ @bar() /* 2.3 L class */ class C {}

class C {
  /* 3.1 L decorator */ @foo() /* 3.2 T args */
  /* 3.3 L id */ method(){}
}

class C {
  /* 4.1 L decorator */ @foo() /* 4.2 L decorator */ @bar() /* 4.3 L id */ method(){}
}
