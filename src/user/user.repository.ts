import { Injectable } from '@nestjs/common';
import { PrismaClient } from 'prisma/prisma-client'; // Importe seu serviço Prisma
import { User, Pagination, UserDTO } from './interfaces/user.interface';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  async createUser(data: UserDTO): Promise<User> {
    return await this.prisma.users.create({ data });
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.prisma.users.findUnique({ where: { id } });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.prisma.users.findUnique({
      where: { email },
    });
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return await this.prisma.users.findUnique({
      where: { username },
    });
  }

  async getAllUsers({ per_pg, pg, filter }: Pagination): Promise<User[]> {
    const last = per_pg * pg;
    const first = last - per_pg;

    if (filter === 'MAIS_ANTIGO' || filter === 'MAIS_RECENTE') {
      return await this.prisma.users.findMany({
        skip: first,
        take: per_pg,
        orderBy: {
          createdAt: filter === 'MAIS_ANTIGO' ? 'desc' : 'asc',
        },
      });
    } else {
      return await this.prisma.users.findMany({
        skip: first,
        take: per_pg,
        orderBy: {
          name: 'asc',
        },
      });
    }
  }

  async updateUser(id: string, data: UserDTO): Promise<User | null> {
    return await this.prisma.users.update({ where: { id }, data });
  }

  async deleteUser(id: string): Promise<User | null> {
    return await this.prisma.users.delete({ where: { id } });
  }
}
