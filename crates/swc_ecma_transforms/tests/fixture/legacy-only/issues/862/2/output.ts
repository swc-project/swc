export class Product extends TimestampedEntity {
    public id!: string;
}
_ts_decorate([
    PrimaryGeneratedColumn("uuid")
], Product.prototype, "id", void 0);
Product = _ts_decorate([
    Entity()
], Product);
