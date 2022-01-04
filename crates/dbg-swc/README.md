# dbg-swc

## `dbg-swc reduce-min`

```
dbg-swc reduce-min --build '' --test 'npm test.spec' --working-dir ~/src/ionic-framework/packages/react/ ~/src/ionic-framework/packages/react/src/index.ts
```

(TODO) e.g. next.js app

```sh
dbg-swc reduce-min --build 'rm -rf .next && npx next build' --test 'dbg-swc grab-console http://localhost:3000 --script test.js --start "npm start"'  ~/your/next/app/pages/index.js ~/your/next/app/pages/index.js
```
