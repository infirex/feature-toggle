import { Repository } from 'typeorm'
import { AppDataSource } from '../helpers/dbHelpers'
import { AppError } from '../utils/AppError'
import { User } from '../models'

class UserService {
  private readonly userRepo: Repository<User>

  constructor() {
    this.userRepo = AppDataSource.getRepository(User)
  }

  async findByEmail(email: string) {
    return await this.userRepo.findOne({ where: { email } })
  }

  async createUser(email: string, password: string, name: string) {
    const existing = await this.findByEmail(email)
    if (existing) {
      throw new AppError('User already exists', 400)
    }

    const user = this.userRepo.create({ email, password, name })
    return await this.userRepo.save(user)
  }

  async validateLogin(email: string, password: string) {
    const user = await this.findByEmail(email)
    if (!user) {
      throw new AppError('Invalid credentials', 400)
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      throw new AppError('Invalid credentials', 400)
    }

    return user
  }
}

export const userService = new UserService()
