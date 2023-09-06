### A base TSConfig for working with Node 16.

Add the package to your `"devDependencies"`:

```sh
npm install --save-dev @tsconfig/node16
yarn add --dev @tsconfig/node16
```

Add to your `tsconfig.json`:

```json
"extends": "@tsconfig/node16/tsconfig.json"
```

---

The `tsconfig.json`: 

```jsonc
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "display": "Node 16",

  "compilerOptions": {
    "lib": ["es2021"],
    "module": "commonjs",
    "target": "es2021",

    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}

```

You can find the [code here](https://github.com/tsconfig/bases/blob/master/bases/node16.json).