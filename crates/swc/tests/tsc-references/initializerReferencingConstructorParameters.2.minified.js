//// [initializerReferencingConstructorParameters.ts]
// Initializer expressions for instance member variables are evaluated in the scope of the class constructor body but are not permitted to reference parameters or local variables of the constructor. 
import "@swc/helpers/_/_class_call_check";
