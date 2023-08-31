//// [correctlyMarkAliasAsReferences2.tsx]
//// [declaration.d.ts]
//// [0.tsx]
///<reference path="declaration.d.ts" />
import * as cx from 'classnames';
import * as React from "react";
cx('class1', {
    class2: !0
});
