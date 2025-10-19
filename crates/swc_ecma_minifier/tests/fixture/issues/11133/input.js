// Test case 1: Basic duplicate named imports
import { add } from 'math';
import { subtract } from 'math';
import { multiply } from 'math';

// Test case 2: Same export imported with different local names (should preserve both)
import { add as a } from 'calculator';
import { add as b } from 'calculator';

// Test case 3: Mix of default and named imports
import defaultExport from 'module1';
import { namedExport } from 'module1';

// Test case 4: Namespace import with named imports (CANNOT be merged - incompatible)
import * as utils from 'utils';
import { helper } from 'utils';

// Test case 4b: Default with namespace (CAN be merged)
import defUtils from 'utils2';
import * as utils2 from 'utils2';

// Test case 5: Side-effect import (should not be merged)
import 'polyfill';
import 'polyfill';

// Test case 6: Different sources (should not be merged)
import { foo } from 'lib1';
import { foo } from 'lib2';

// Test case 7: Duplicate named imports (exact same specifier)
import { duplicate } from 'dups';
import { duplicate } from 'dups';
import { duplicate } from 'dups';

// Test case 8: Mix of named imports with and without aliases
import { thing } from 'things';
import { thing as renamedThing } from 'things';
import { otherThing } from 'things';

// Use all imports to avoid dead code elimination
console.log(add, subtract, multiply);
console.log(a, b);
console.log(defaultExport, namedExport);
console.log(utils, helper);
console.log(defUtils, utils2);
console.log(foo);
console.log(duplicate);
console.log(thing, renamedThing, otherThing);
