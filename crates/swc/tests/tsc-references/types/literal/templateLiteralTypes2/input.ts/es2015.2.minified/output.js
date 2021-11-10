takesLiteral("foo.bar.baz"), takesLiteral("foo.bar.baz"), takesLiteral(`foo.bar.${someString}`);
const id4 = `foo.bar.${someString}`;
takesLiteral(id4), takesLiteral(`foo.bar.${someUnion}`);
