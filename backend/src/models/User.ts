import bcrypt from 'bcrypt'
import jwt, { Secret, SignOptions } from 'jsonwebtoken'
import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ unique: true })
  email!: string

  @Column({ /* select: false */ })
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
      expire_date?: string
    } = { id, email, name }

    if (showToken) {
      const { access_token, expireDate } = this.generateJWT()
      responseObject.access_token = access_token
      responseObject.expire_date = expireDate
    }

    return responseObject
  }

  private generateJWT() {
    const access_token = jwt.sign(
      {
        id: this.id,
        email: this.email
      },
      process.env.JWT_SECRET as Secret,
      { expiresIn: process.env.JWT_EXPIRES_IN } as SignOptions
    )

    const decoded = jwt.decode(access_token) as { exp: number }
    const expireDate = new Date(decoded.exp * 1000).toLocaleString('tr-TR', {
      timeZone: 'Europe/Istanbul'
    })

    return { access_token, expireDate }
  }

  async comparePassword(attempt: string) {
    return await bcrypt.compare(attempt, this.password)
  }
}
