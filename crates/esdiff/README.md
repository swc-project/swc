# esdiff

## `esdiff reduce-min`

```sh
esdiff reduce-min --build 'rm -rf .next && npx next build' --test 'esdiff grab-console http://localhost:3000 --script test.js --start "npm start"'  ~/your/next/app/pages/index.js ~/your/next/app/pages/index.js
```
