import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Rating } from "../../../rating/infra/typeorm/Rating";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  user_id!: string;

  @Column({ type: 'varchar', unique: false })
  username!: string;

  @Column({ type: 'varchar', unique: true })
  email!: string;

  @Column({ type: 'varchar' })
  password_hash!: string;

  @Column({ nullable: true, type: 'int' })
  rating_count?: number;

  @Column({ nullable: true, type: 'timestamp' })
  last_login?: Date;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany(() => Rating, (rating) => rating.user)
  ratings!: Rating[];
}