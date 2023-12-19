export class Product extends TimestampedEntity {
    public id!: string;
    public price!: number;
    public type!: ProductType;
    public productEntityId!: string;
    /* ANCHOR: Relations ------------------------------------------------------ */ public orders!: Order[];
    public discounts!: Discount[];
}
_ts_decorate([
    PrimaryGeneratedColumn("uuid")
], Product.prototype, "id", void 0);
_ts_decorate([
    Column()
], Product.prototype, "price", void 0);
_ts_decorate([
    Column({
        enum: ProductType
    })
], Product.prototype, "type", void 0);
_ts_decorate([
    Column()
], Product.prototype, "productEntityId", void 0);
_ts_decorate([
    OneToMany(()=>Order, (order)=>order.product)
], Product.prototype, "orders", void 0);
_ts_decorate([
    OneToMany(()=>Discount, (discount)=>discount.product)
], Product.prototype, "discounts", void 0);
Product = _ts_decorate([
    Entity()
], Product);
