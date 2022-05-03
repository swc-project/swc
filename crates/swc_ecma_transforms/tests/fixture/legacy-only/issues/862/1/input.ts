@Entity()
export class Product extends TimestampedEntity {
    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    @Column()
    public price!: number;

    @Column({ enum: ProductType })
    public type!: ProductType;

    @Column()
    public productEntityId!: string;

    /* ANCHOR: Relations ------------------------------------------------------ */
    @OneToMany(() => Order, (order) => order.product)
    public orders!: Order[];

    @OneToMany(() => Discount, (discount) => discount.product)
    public discounts!: Discount[];
}