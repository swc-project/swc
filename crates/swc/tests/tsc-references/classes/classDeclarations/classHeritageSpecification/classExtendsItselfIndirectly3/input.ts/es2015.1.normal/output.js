// @Filename: classExtendsItselfIndirectly_file1.ts
class C extends E {
} // error
// @Filename: classExtendsItselfIndirectly_file2.ts
class D extends C {
}
// @Filename: classExtendsItselfIndirectly_file3.ts
class E extends D {
}
// @Filename: classExtendsItselfIndirectly_file4.ts
class C2 extends E2 {
} // error
// @Filename: classExtendsItselfIndirectly_file5.ts
class D2 extends C2 {
}
// @Filename: classExtendsItselfIndirectly_file6.ts
class E2 extends D2 {
}
