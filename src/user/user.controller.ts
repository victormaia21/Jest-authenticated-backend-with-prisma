import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserDTO, UserDTOLogin } from './interfaces/user.interface';
import UserDtoInterface from './dto/user.class.dto';
import { multerOptions } from '../multer-options/upload-file';
import { ResponseLogin } from './interfaces/user.response.interface';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private service: UserService) {}

  @Post('/register')
  @UseInterceptors(FileInterceptor('photo', { storage: multerOptions.storage }))
  @HttpCode(201)
  @ApiOperation({ summary: 'End-Point para registrar um novo usuario' })
  @ApiBody({ type: UserDtoInterface })
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiResponse({ status: 500, description: 'Erro interno de sistema' })
  @ApiResponse({
    status: 409,
    description: 'Já existe um usuario com mesmo nome ou nome de usuario',
  })
  @ApiResponse({
    status: 400,
    description: 'Falta alguma requisição no corpo do jsos',
  })
  @ApiResponse({ status: 201, description: 'Usuario criado com sucesso' })
  async register(
    @Body() user: UserDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.register(user, file);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'End-Point para fazer login' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
      required: ['email', 'password'],
    },
  })
  @ApiConsumes('application/json')
  @ApiResponse({ status: 409, description: 'Email inexistente' })
  @ApiResponse({ status: 401, description: 'Senha invalida' })
  @ApiResponse({
    status: 400,
    description: 'Falta alguma requisição no corpo do json',
  })
  @ApiResponse({
    status: 200,
    description: 'Login feito com sucesso',
    schema: {
      example: {
        token: 'valor do token',
        message: 'Autenticação feita com sucesso',
        id: 1,
      },
    },
  })
  async login(@Body() user: UserDTOLogin): Promise<ResponseLogin> {
    return this.service.login(user);
  }

  @Get('myUser')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @ApiOperation({
    summary: 'End-Point para pegar usuario com token de autorização',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 401, description: 'Token invalido' })
  @ApiResponse({
    status: 200,
    description: 'Usuario achado com sucesso',
    schema: {
      example: {
        id: 1,
        name: 'victor',
        email: 'victor@gmail.com',
        username: 'victor.',
        password: '12345678',
        photo: 'photo.png',
        createdAt: String(new Date()),
        updatedAt: String(new Date()),
      },
    },
  })
  async myUser(@Req() req) {
    return this.service.myUser(req);
  }

  @Put()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('photo', { storage: multerOptions.storage }))
  @HttpCode(200)
  @ApiOperation({
    summary: 'End-Point para atualizar um usuario com autorização de token',
  })
  @ApiBearerAuth()
  @ApiConsumes('application/json')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UserDtoInterface })
  @ApiResponse({
    status: 200,
    description: 'Usuario achado com sucesso',
    schema: {
      example: {
        id: 1,
        name: 'victor',
        email: 'victor@gmail.com',
        username: 'victor.',
        password: '12345678',
        photo: 'photo.png',
        createdAt: String(new Date()),
        updatedAt: String(new Date()),
      },
    },
  })
  async updateUser(
    @Body() user: UserDTO,
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.updateUser(user, req, file);
  }

  @Delete()
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @ApiOperation({ summary: 'End-Point responsavel pela deleção do usuario' })
  @ApiBearerAuth()
  @ApiResponse({ status: 401, description: 'Token invalido' })
  @ApiResponse({ status: 200, description: 'Usuario deletado com sucesso' })
  async deleteUser(@Req() req): Promise<{ message: string }> {
    return this.service.deleteUser(req);
  }
}
