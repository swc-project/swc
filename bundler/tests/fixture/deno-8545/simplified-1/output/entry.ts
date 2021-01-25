class Application {
}
const Application1 = Application;
const Application2 = Application1;
class Router {
}
const Router1 = Router;
const Router2 = Router1;
const app = new Application2();
const router = new Router2();
router.get("/", (ctx)=>{
    ctx.response.body = "Index Page";
});
router.get("/users", (ctx)=>{
    ctx.response.body = "Users Page";
});
app.use(router.routes());
app.use(router.allowedMethods());
console.log(`Now listening on http://0.0.0.0:3000`);
await app.listen("0.0.0.0:3000");
