# Dot imports and there global reducing

```js
import dot from '.';
import twoDots from '..';
```

In

```js
if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.sparkle, global.worldLevel, global.stormJs, global.phenomenaLevels, global.indexJs, global[""]);
```

```js
global[""]
```
is wrong.

Babel convert it to

```js
global._
```

This PR about `issue-6697`does fix it. As it was part of the work. 
