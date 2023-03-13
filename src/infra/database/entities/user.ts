/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ nullable: true})
  name?: string

  @Column()
  email!: string

  @Column({ nullable: true })
  facebookId?: string

  @Column({ nullable: true })
  pictureUrl?: string

  @Column({ nullable: true })
  initials?: string
}
