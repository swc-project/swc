import { Nullable } from "nullable";
import { Component } from "react";
class Foo implements Component<Nullable> {}
new Foo();
