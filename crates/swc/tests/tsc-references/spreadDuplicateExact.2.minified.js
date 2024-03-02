//// [spreadDuplicateExact.ts]
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
_object_spread({
    a: 123
}, a), _object_spread({
    a: 123
}, b), _object_spread({
    a: 123
}, c), _object_spread({
    a: 123
}, d), _object_spread({
    a: 123
}, t ? a : {}), _object_spread({
    a: 123
}, t ? b : {}), _object_spread({
    a: 123
}, t ? c : {}), _object_spread({
    a: 123
}, t ? d : {});
