@Entity()
export class Product extends TimestampedEntity {
    @PrimaryGeneratedColumn('uuid')
    public id!: string;
}