import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User, UserDTO, UserDTOLogin } from './interfaces/user.interface';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ResponseLogin } from './interfaces/user.response.interface';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user?: User;
}

@Injectable()
export class UserService {
  constructor(
    private readonly repository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async register(userDto: UserDTO, file: Express.Multer.File): Promise<User> {
    if (!userDto.email) {
      throw new BadRequestException('Email obrigatorio');
    }

    if (!userDto.name) {
      throw new BadRequestException('Nome obrigatorio');
    }

    if (!userDto.username) {
      throw new BadRequestException('Nome de usuario obrigatorio');
    }

    if (!userDto.password) {
      throw new BadRequestException('Senha obrigatoria');
    }

    const emailExist = await this.repository.getUserByEmail(userDto.email);
    if (emailExist) {
      throw new ConflictException('E-mail já está em uso');
    }

    const userNameExist = await this.repository.getUserByUsername(
      userDto.username,
    );
    if (userNameExist) {
      throw new ConflictException('Nome de usuario já existente');
    }

    const photo = file ? file.filename : 'unnamed.png';

    const salt = genSaltSync(10);
    const passwordHash = hashSync(userDto.password, salt);

    const user: UserDTO = {
      name: userDto.name,
      email: userDto.email,
      username: userDto.username,
      photo,
      password: passwordHash,
    };

    return await this.repository.createUser(user);
  }

  async login(user: UserDTOLogin): Promise<ResponseLogin> {
    if (!user.email) {
      throw new BadRequestException('Email obrigatorio');
    }
    const emailExist = await this.repository.getUserByEmail(user.email);

    if (!emailExist) {
      throw new ConflictException('Email não existente');
    }

    if (!user.password) {
      throw new BadRequestException('Senha obrigatoria');
    }

    const passwordIsValid = compareSync(user.password, emailExist.password);

    if (!passwordIsValid) {
      throw new UnauthorizedException('Senha invalida');
    }

    const token = await this.jwtService.sign({ id: emailExist.id });
    const message = 'Usuario autenticado com sucesso';
    const id = emailExist.id;

    return {
      id,
      message,
      token,
    };
  }

  async myUser(req: AuthenticatedRequest): Promise<User> {
    const { user } = req;
    return user;
  }

  async updateUser(
    userDto: UserDTO,
    req: AuthenticatedRequest,
    file: Express.Multer.File,
  ) {
    const { user } = req;
    const emailExist = await this.repository.getUserByEmail(userDto.email);
    if (emailExist && userDto.email !== user.email) {
      throw new ConflictException('Email já existente');
    }

    const userNameExist = await this.repository.getUserByUsername(
      userDto.username,
    );

    if (userNameExist) {
      throw new ConflictException('Nome de usuario já existente');
    }

    const salt = genSaltSync(10);
    const passwordHash = hashSync(userDto.password, salt);
    userDto.password = passwordHash;

    if (file) {
      userDto.photo = file.filename;
    }

    return await this.repository.updateUser(user.id, userDto);
  }

  async deleteUser(req: AuthenticatedRequest): Promise<{ message: string }> {
    const { user } = req;

    await this.repository.deleteUser(user.id);
    return { message: 'Usuario deletado com sucesso' };
  }
}
