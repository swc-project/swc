import * as swcHelpers from "@swc/helpers";
import { Entity, BaseEntity } from "typeorm";
export let Location = class Location extends BaseEntity {
};
Location = swcHelpers.__decorate([
    Entity()
], Location);
