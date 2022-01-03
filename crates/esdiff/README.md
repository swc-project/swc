# esdiff

## `esdiff reduce-min`

```
esdiff reduce-min --build '' --test 'npm test' --working-dir ~/src/ionic-framework/packages/react/ ~/src/ionic-framework/packages/react/src/index.ts
```

(TODO) e.g. next.js app

```sh
esdiff reduce-min --build 'rm -rf .next && npx next build' --test 'esdiff grab-console http://localhost:3000 --script test.js --start "npm start"'  ~/your/next/app/pages/index.js ~/your/next/app/pages/index.js
```
