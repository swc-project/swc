import { local } from "./local";
import { external } from "external_test";
import { test } from "test";

function use() {
    local(external(test));
}
