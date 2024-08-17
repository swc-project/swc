import { Entity, Column } from "typeorm";
import { Field, ObjectType, registerEnumType } from "type-graphql";
import { Enum1, Enum2 } from "./enum.js";
export enum Enum3 {
    A = "A",
    B = "B",
    C = "C",
    D = "D"
}
registerEnumType(Enum3, {
    name: "Enum3"
});
export class User {
    firstName?: string;
    lastName?: string;
    get fullName(): string {
        if (!this.firstName && !this.lastName) {
            return "";
        }
        return `${this.firstName} ${this.lastName}`.trim();
    }
    enum1: Enum1;
    enum2: Enum2;
    enum3: Enum3;
}
_ts_decorate([
    Column({
        name: "first_name"
    }),
    Field({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], User.prototype, "firstName", void 0);
_ts_decorate([
    Column({
        name: "last_name"
    }),
    Field({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], User.prototype, "lastName", void 0);
_ts_decorate([
    Field(),
    _ts_metadata("design:type", String),
    _ts_metadata("design:paramtypes", [])
], User.prototype, "fullName", null);
_ts_decorate([
    Column(),
    Field(()=>Enum1),
    _ts_metadata("design:type", typeof Enum1 === "undefined" ? Object : Enum1)
], User.prototype, "enum1", void 0);
_ts_decorate([
    Column(),
    Field(()=>Enum2),
    _ts_metadata("design:type", typeof Enum2 === "undefined" ? Object : Enum2)
], User.prototype, "enum2", void 0);
_ts_decorate([
    Column(),
    Field(()=>Enum3),
    _ts_metadata("design:type", String)
], User.prototype, "enum3", void 0);
User = _ts_decorate([
    Entity("user", {
        schema: "public"
    }),
    ObjectType("User")
], User);
