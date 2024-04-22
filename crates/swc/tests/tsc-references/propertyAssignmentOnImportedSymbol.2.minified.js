//// [mod1.js]
export var hurk = {};
//// [bug24658.js]
import { hurk } from './mod1';
hurk.expando = 4;
