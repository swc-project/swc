//// [correctlyMarkAliasAsReferences4.tsx]
//// [declaration.d.ts]
//// [0.tsx]
let buttonProps;
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import * as cx from 'classnames';
import * as React from "react";
_object_spread_props(_object_spread({}, buttonProps), {
    className: cx('class1', {
        class2: !0
    })
});
