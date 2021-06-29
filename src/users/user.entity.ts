import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import Address from './address.entity';
import Post from 'src/posts/post.entity';
import PublicFile from 'src/files/publicFile.entity';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public email: string;

  @Column()
  public name: string;

  @Column()
  @Exclude()
  public password: string;

  @OneToOne(() => Address, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  public address: Address;

  @OneToMany(() => Post, (post: Post) => post.author)
  public posts?: Post[];

  @JoinColumn()
  @OneToOne(() => PublicFile, {
    eager: true,
    nullable: true,
    onDelete: 'CASCADE',
  })
  public avatar?: PublicFile;
}

export default User;
