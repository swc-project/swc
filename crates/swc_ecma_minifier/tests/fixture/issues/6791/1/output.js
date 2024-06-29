var o;
import "test";
import { test as t } from "test";
!function(o) {
    o.Hello = "World!";
}(o || (o = {}));
t(o.Hello);
