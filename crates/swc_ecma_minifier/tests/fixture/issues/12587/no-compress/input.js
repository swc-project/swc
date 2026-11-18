// A string in parentheses is not a directive, so these functions stay sloppy.
(function () {
  ("use strict");
  function hideNested(childCollapses, bootstrap) {
    Array.from(childCollapses).forEach(function (childCollapse) {
      childCollapseInstance = bootstrap.Collapse.getInstance(childCollapse);
      childCollapseInstance.hide();
    });
  }
  hideNested(["a", "b"], {
    Collapse: { getInstance: (c) => ({ hide: () => console.log("hide", c) }) },
  });
})();

(function () {
  ('use strict');
  singleQuotes = 1;
  console.log(singleQuotes);
})();

(function () {
  (("use strict"));
  nested = 1;
  console.log(nested);
})();

(function () {
  "not a directive";
  ("use strict");
  secondInPrologue = 1;
  console.log(secondInPrologue);
})();

console.log(
  (function () {
    ("use strict");
    return this === globalThis;
  })(),
);

console.log(
  {
    method() {
      ("use strict");
      return (function () {
        return this === globalThis;
      })();
    },
  }.method(),
);

console.log(
  (() => {
    ("use strict");
    return (function () {
      return this === globalThis;
    })();
  })(),
);

// A real directive stays a directive.
(function () {
  "use strict";
  try {
    strictWrite = 1;
    console.log("no error");
  } catch (e) {
    console.log(e.name);
  }
})();

(function () {
  'use strict';
  try {
    strictWriteSingleQuotes = 1;
    console.log("no error");
  } catch (e) {
    console.log(e.name);
  }
})();

(function () {
  "not a directive";
  "use strict";
  try {
    strictWriteSecond = 1;
    console.log("no error");
  } catch (e) {
    console.log(e.name);
  }
})();
