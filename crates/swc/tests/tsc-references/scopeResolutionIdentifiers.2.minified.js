//// [scopeResolutionIdentifiers.ts]
// EveryType used in a nested scope of a different EveryType with the same name, type of the identifier is the one defined in the inner scope
var M1, M2, M3, M4;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(M1 || (M1 = {})).s, M2 || (M2 = {}), M3 || (M3 = {}), M4 || (M4 = {});
