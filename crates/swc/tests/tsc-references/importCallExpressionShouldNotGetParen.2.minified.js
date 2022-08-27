//// [importCallExpressionShouldNotGetParen.ts]
const localeName = "zh-CN";
import(`./locales/${localeName}.js`).then((bar)=>{}), import("./locales/" + localeName + ".js").then((bar)=>{});
