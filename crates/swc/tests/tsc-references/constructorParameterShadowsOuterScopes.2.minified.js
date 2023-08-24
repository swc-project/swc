//// [constructorParameterShadowsOuterScopes.ts]
// Initializer expressions for instance member variables are evaluated in the scope of the class constructor 
// body but are not permitted to reference parameters or local variables of the constructor.
// This effectively means that entities from outer scopes by the same name as a constructor parameter or 
// local variable are inaccessible in initializer expressions for instance member variables
import "@swc/helpers/_/_class_call_check";
