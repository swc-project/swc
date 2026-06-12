const mount = (fn)=>fn instanceof App ? fn.attach : fn;
class App extends Router {
    route() {
        const app = new App();
        this.use(mount(app));
    }
    use(fn) {
        return fn;
    }
}
var App1 = App;
var App2 = App1;
new App2();
