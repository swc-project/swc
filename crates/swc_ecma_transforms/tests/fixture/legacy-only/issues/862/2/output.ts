export let Product = class Product extends TimestampedEntity {
    id: string;
};
__decorate([
    PrimaryGeneratedColumn("uuid")
], Product.prototype, "id", void 0);
Product = __decorate([
    Entity()
], Product);
