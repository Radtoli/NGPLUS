import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../../users/infra/typeorm/User";
import { MediaContent } from "../../../media/infra/typeorm/MediaContent";

@Entity("ratings")
export class Rating {
  @PrimaryGeneratedColumn("uuid")
  rating_id!: string;

  @Column({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'uuid' })
  media_id!: string;

  @Column({ type: 'int' })
  stars!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => User, (user) => user.ratings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => MediaContent, (mediaContent) => mediaContent.ratings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'media_id' })
  mediaContent!: MediaContent;
}