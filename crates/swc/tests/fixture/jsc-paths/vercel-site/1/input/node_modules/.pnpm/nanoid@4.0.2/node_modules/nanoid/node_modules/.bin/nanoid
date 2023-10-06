#!/bin/sh
basedir=$(dirname "$(echo "$0" | sed -e 's,\\,/,g')")

case `uname` in
    *CYGWIN*) basedir=`cygpath -w "$basedir"`;;
esac

if [ -z "$NODE_PATH" ]; then
  export NODE_PATH="/Users/kdy1/projects/s/issues/crates/swc/tests/fixture/jsc-paths/vercel-site/1/input/node_modules/.pnpm/nanoid@4.0.2/node_modules/nanoid/bin/node_modules:/Users/kdy1/projects/s/issues/crates/swc/tests/fixture/jsc-paths/vercel-site/1/input/node_modules/.pnpm/nanoid@4.0.2/node_modules/nanoid/node_modules:/Users/kdy1/projects/s/issues/crates/swc/tests/fixture/jsc-paths/vercel-site/1/input/node_modules/.pnpm/nanoid@4.0.2/node_modules:/Users/kdy1/projects/s/issues/crates/swc/tests/fixture/jsc-paths/vercel-site/1/input/node_modules/.pnpm/node_modules"
else
  export NODE_PATH="/Users/kdy1/projects/s/issues/crates/swc/tests/fixture/jsc-paths/vercel-site/1/input/node_modules/.pnpm/nanoid@4.0.2/node_modules/nanoid/bin/node_modules:/Users/kdy1/projects/s/issues/crates/swc/tests/fixture/jsc-paths/vercel-site/1/input/node_modules/.pnpm/nanoid@4.0.2/node_modules/nanoid/node_modules:/Users/kdy1/projects/s/issues/crates/swc/tests/fixture/jsc-paths/vercel-site/1/input/node_modules/.pnpm/nanoid@4.0.2/node_modules:/Users/kdy1/projects/s/issues/crates/swc/tests/fixture/jsc-paths/vercel-site/1/input/node_modules/.pnpm/node_modules:$NODE_PATH"
fi
if [ -x "$basedir/node" ]; then
  exec "$basedir/node"  "$basedir/../../bin/nanoid.js" "$@"
else
  exec node  "$basedir/../../bin/nanoid.js" "$@"
fi
