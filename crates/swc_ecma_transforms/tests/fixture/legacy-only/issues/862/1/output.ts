export let Product = class Product extends TimestampedEntity {
    id: string;
    price: number;
    type: ProductType;
    productEntityId: string;
    /* ANCHOR: Relations ------------------------------------------------------ */ orders: Order[];
    discounts: Discount[];
};
__decorate([
    PrimaryGeneratedColumn("uuid")
], Product.prototype, "id", void 0);
__decorate([
    Column()
], Product.prototype, "price", void 0);
__decorate([
    Column({
        enum: ProductType
    })
], Product.prototype, "type", void 0);
__decorate([
    Column()
], Product.prototype, "productEntityId", void 0);
__decorate([
    OneToMany(()=>Order
    , (order)=>order.product
    )
], Product.prototype, "orders", void 0);
__decorate([
    OneToMany(()=>Discount
    , (discount)=>discount.product
    )
], Product.prototype, "discounts", void 0);
Product = __decorate([
    Entity()
], Product);
