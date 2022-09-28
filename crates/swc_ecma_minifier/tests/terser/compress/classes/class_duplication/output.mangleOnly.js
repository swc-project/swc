class e {
    foo() {
        leak(new e());
    }
}
export default e;
