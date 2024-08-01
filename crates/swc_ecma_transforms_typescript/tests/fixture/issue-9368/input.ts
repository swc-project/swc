import { Schemas } from './types.d';
import AddressResource = Schemas.AddressResource;

// type usage
const x: AddressResource = {};


import { foo, bar } from "mod";

// value usage
import y = foo.y;

// type usage
import z = bar.z;

console.log(y as z);
