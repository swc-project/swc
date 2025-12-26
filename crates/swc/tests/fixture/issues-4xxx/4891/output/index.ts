import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _channelName = new WeakMap(), _listeners = new WeakMap();
export class LocalStorageChannel {
    constructor(channelName){
        _class_private_field_init(this, _channelName, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, _listeners, {
            writable: true,
            value: void 0
        });
        _class_private_field_set(this, _channelName, channelName);
        _class_private_field_set(this, _listeners, []);
        window.addEventListener("storage", (event)=>this.onStorageEvent(event));
    }
}
