import bcrypt from 'bcrypt'
import jwt, { Secret, SignOptions } from 'jsonwebtoken'
import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ unique: true })
  email!: string

  @Column()
  password!: string

  @Column()
  name?: string

  @CreateDateColumn()
  created_at!: Date

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10)
  }

  toResponseObject(showToken: boolean = true) {
    const { id, email, name } = this
    const responseObject: {
      id: number
      email: string
      name?: string
      access_token?: string
    } = { id, email, name }

    if (showToken) {
      responseObject.access_token = this.generateJWT()
    }

    return responseObject
  }

  private generateJWT() {
    return jwt.sign(
      {
        id: this.id,
        email: this.email
      },
      process.env.JWT_SECRET as Secret,
      { expiresIn: process.env.JWT_EXPIRES_IN } as SignOptions
    )
  }

  async comparePassword(attempt: string) {
    return await bcrypt.compare(attempt, this.password)
  }
}
