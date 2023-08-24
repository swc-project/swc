//// [assignmentCompatWithObjectMembers.ts]
// members N and M of types S and T have the same name, same accessibility, same optionality, and N is assignable M
// no errors expected
var SimpleTypes, ObjectTypes, a2, b2;
import "@swc/helpers/_/_class_call_check";
SimpleTypes || (SimpleTypes = {}), ObjectTypes || (ObjectTypes = {}), a2 = {
    foo: a2
}, b2 = a2 = b2 = {
    foo: b2
};
