import { bar } from 'bar';
import foo = require('foo');
foo, bar;

// Expected output should look something like this:
//
//     import {createRequire as _createRequire} from 'module';
//     const require = createRequire(import.meta.url);
//     import {bar} from 'bar';
//     const foo = require('foo');
//     foo, bar;