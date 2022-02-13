import { Application, Router } from "https://raw.githubusercontent.com/kdy1/oak-bundle-issue/master/deps.ts";

const app = new Application();
const router = new Router();

router.get("/", (ctx) => {
    ctx.response.body = "Index Page";
});

router.get("/users", (ctx) => {
    ctx.response.body = "Users Page";
});

app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Now listening on http://0.0.0.0:3000`);
setTimeout(() => {
    Deno.exit(0);
}, 1000)
await app.listen("0.0.0.0:58545");