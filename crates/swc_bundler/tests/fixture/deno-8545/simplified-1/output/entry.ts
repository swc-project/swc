class Application {
}
class Router {
}
const app = new Application();
const router = new Router();
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
