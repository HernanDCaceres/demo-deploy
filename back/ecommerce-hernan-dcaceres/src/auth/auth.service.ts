import { BadRequestException, Injectable } from '@nestjs/common';
import { Users } from 'src/entities/users.entity';
import { UsersRepository } from 'src/users/users.repository';
import * as bcrypt from 'bcrypt';
import { throwError } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersRespository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}
  getAuth() {
    return 'Autenticación...';
  }

  async signIn(email: string, password: string) {
    const user = await this.usersRespository.getuserByEmail(email);
    if (!user) throw new BadRequestException('Credenciales incorrectas');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      throw new BadRequestException('Credenciales incorrectas');

    //*Firmar token
    const payload = { id: user.id, email: user.email, isAdmin: user.isAdmin };
    const token = this.jwtService.sign(payload);

    return {
      messsage: 'Usuario logueado',
      token,
    };
  }

  async signUp(user: Partial<Users>) {
    const { email, password } = user;
    const foundUser = await this.usersRespository.getuserByEmail(email);
    if (foundUser) throw new BadRequestException('Email ya registrado');
    //* Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    //*Crear usuario en BBDD

    return await this.usersRespository.createUser({
      ...user,
      password: hashedPassword,
    });
  }
}
