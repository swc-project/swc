function test() {
  /* 1.1 L id */ new /* 1.2 T id */ . /* 1.3 L id */ target /* 1.4 T id */;

  /* 2.1 L meta */ (/* 2.2 L id */ new.target /* 2.3 T id */) /* 2.4 T meta */;
}
