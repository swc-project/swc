#![cfg(feature = "concurrent")]

use rayon::{prelude::*, ThreadPoolBuilder};
use swc_common::{sync::Lrc, FileName, FilePathMapping, SourceMap};

#[test]
fn stress() {
    let _ = ThreadPoolBuilder::new().num_threads(100).build_global();
    let fm = SourceMap::new(FilePathMapping::empty());

    (0..10000).into_par_iter().for_each(|_| {
        fm.new_source_file(
            Lrc::new(FileName::Anon),
            "@Entity()
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
}"
            .into(),
        );
    })
}
