# spdy web compiler

[![Build Status](https://travis-ci.org/swc-project/swc.svg?branch=master)](https://travis-ci.org/swc-project/swc)
[![codecov](https://codecov.io/gh/swc-project/swc/branch/master/graph/badge.svg)](https://codecov.io/gh/swc-project/swc)

-----

Make the web (development) faster.


# Installation

Requires nightly version of [rust][].

```sh
cargo install --git git@github.com:swc-project/swc.git
```

# Usage

`test.js`:
```js
8 + 8;
use(8 + 8, 8 ** 8);
```

## Example

```sh
swc jsc test.js
```

### Output

```
8 + 8;
use(8 + 8, Math.pow(8, 8));
```

## Example

```sh
swc jsc --optimize test.js
```

### Output

```
use(8 + 8, Math.pow(8, 8));
```





[rust]:https://www.rust-lang.org
