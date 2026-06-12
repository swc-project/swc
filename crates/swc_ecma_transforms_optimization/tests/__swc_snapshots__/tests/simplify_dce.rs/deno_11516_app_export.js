const mount = (fn)=>fn instanceof App ? fn.attach : fn;
export class App extends Router {
    route() {
        const app = new App();
        this.use(mount(app));
    }
    use(fn) {
        return fn;
    }
}
new App();
