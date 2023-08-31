//// [mixinAbstractClasses.2.ts]
var baseClass;
const MixedBase = (baseClass = class {
}, // error expected: A mixin class that extends from a type variable containing an abstract construct signature must also be declared 'abstract'.
class extends baseClass {
    mixinMethod() {}
});
// error expected: Cannot create an instance of an abstract class.
new MixedBase();
