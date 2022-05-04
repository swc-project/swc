import { memoize } from "./util";

// Import directly from `lodash` instead and the module code is
// included in the bundle
//import {memoize} from './lodash';

const name = memoize();
console.log(name);
