//// [neverType.ts]
import "@swc/helpers/_/_class_call_check";
throw !function() {
    throw Error("Something failed");
}(), Error();
