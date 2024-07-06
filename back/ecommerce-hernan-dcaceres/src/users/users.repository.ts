import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

  //* Obtener todos los usuarios

  async getUsers(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const users = await this.usersRepository.find({
      take: limit,
      skip: skip,
    });
    return users.map(({ password, ...userNoPassword }) => userNoPassword);
  }

  //* Obtener usuario por ID

  async getUserById(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: {
        orders: true,
      },
    });
    if (!user) return `No se encontró el usuario con ID: ${id}`;
    const { password, ...userNoPassword } = user;
    return userNoPassword;
  }

  //* Crear usuario

  async createUser(user: Partial<Users>) {
    const newUser = await this.usersRepository.save(user);

    const dbUser = await this.usersRepository.findOneBy({ id: newUser.id });

    const { password, ...userNoPassword } = dbUser;
    return userNoPassword;
  }

  //* Modificar información de usuario

  async updateUser(id: string, user: Users) {
    await this.usersRepository.update(id, user);
    const updatedUser = await this.usersRepository.findOneBy({ id });
    const { password, ...userNoPassword } = updatedUser;
    return userNoPassword;
  }

  //* Eliminar usuario

  async deleteUser(id: string) {
    const user = await this.usersRepository.findOneBy({ id });
    this.usersRepository.remove(user);
    const { password, ...userNoPassword } = user;
    return userNoPassword;
  }

  //* Encontrar usuario por email

  async getuserByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email });
  }
}
