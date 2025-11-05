import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Rating } from "../../../rating/infra/typeorm/Rating";
import { MediaCategory } from "../../enums/MediaCategory";

@Entity("media_contents")
export class MediaContent {
  @PrimaryGeneratedColumn("uuid")
  media_id!: string;

  @Column({ type: 'varchar' })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({
    type: 'enum',
    enum: MediaCategory
  })
  category!: MediaCategory;

  @Column({ type: 'varchar' })
  thumbnail_url!: string;

  @Column({ type: 'varchar' })
  content_url!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany(() => Rating, (rating) => rating.mediaContent)
  ratings!: Rating[];
}