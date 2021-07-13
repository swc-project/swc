import { setGlobalOptions } from '@typegoose/typegoose';
import * as typegoose from '@typegoose/typegoose';
import { schemas } from './schemas';
// typegoose.mongoose.set('debug', true);
setGlobalOptions({
    options: {
        allowMixed: typegoose.Severity.ALLOW
    },
    schemaOptions: {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
});
console.log(schemas);
