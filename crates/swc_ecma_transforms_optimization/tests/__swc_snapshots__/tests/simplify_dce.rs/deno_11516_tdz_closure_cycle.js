const mount = (fn)=>fn instanceof App ? fn.attach : fn;
class App {
    use(fn) {
        return mount(fn);
    }
}
