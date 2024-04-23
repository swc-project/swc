//// [declarationEmitWorkWithInlineComments.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export var Foo = function Foo(/** @internal */ isInternal1, /** @internal */ isInternal2, /** @internal */ isInternal3, // @internal
isInternal4, // nothing
/** @internal */ isInternal5, /* @internal */ isInternal6/* trailing */ , /* @internal */ isInternal7, /** @internal */ // not work
notInternal1, // @internal
/* not work */ notInternal2, /* not work */ // @internal
/* not work */ notInternal3) {
    "use strict";
    _class_call_check(this, Foo);
    this.isInternal1 = isInternal1;
    this.isInternal2 = isInternal2;
    this.isInternal3 = isInternal3;
    this.isInternal4 = isInternal4;
    this.isInternal5 = isInternal5;
    this.isInternal6 = isInternal6;
    this.isInternal7 = isInternal7;
    this.notInternal1 = notInternal1;
    this.notInternal2 = notInternal2;
    this.notInternal3 = notInternal3;
};
export var Bar = function Bar(/* @internal */ isInternal1) {
    "use strict";
    _class_call_check(this, Bar);
    this.isInternal1 = isInternal1;
};
export var Baz = function Baz(/* @internal */ isInternal) {
    "use strict";
    _class_call_check(this, Baz);
    this.isInternal = isInternal;
};
