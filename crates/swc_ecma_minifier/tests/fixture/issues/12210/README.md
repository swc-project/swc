The base configuration matches issue #12210 with only argument replacement enabled.
The `expected.repeat-stdout` fixtures check the original source and two successive
minifications, including generated syntax and successful Node execution.

The additional default-compression update fixture uses a class method, whose
strict mode does not depend on a directive. Default compression of the original
strict function still encounters the separate directive-preservation bug in
#9238: removing `"use strict"` changes the argument mapping even when the indexed
update is preserved. Directive preservation is outside this regression's scope.
