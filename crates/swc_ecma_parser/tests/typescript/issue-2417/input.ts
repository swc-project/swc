import mongoose from 'mongoose';
import { modelOptions, Severity, prop } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class ITest extends Base<mongoose.Types.ObjectId> {
    @prop({})
    _userId?: mongoose.Types.ObjectId;

    @prop({ default: Date.now })
    creationDate?: Date;
}