import {
    setGlobalOptions,
    plugin,
    buildSchema,
    addModelToTypegoose,
    deleteModel,
} from "@typegoose/typegoose";
import * as typegoose from "@typegoose/typegoose";
// typegoose.mongoose.set('debug', true);
setGlobalOptions({
    options: {
        allowMixed: typegoose.Severity.ALLOW,
    },
    schemaOptions: {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    },
});
import { schemas } from "./schemas";

console.log(schemas);
