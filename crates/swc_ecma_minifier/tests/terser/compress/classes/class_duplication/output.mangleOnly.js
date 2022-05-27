class a {
    foo() {
        leak(new a());
    }
}
export default a;
