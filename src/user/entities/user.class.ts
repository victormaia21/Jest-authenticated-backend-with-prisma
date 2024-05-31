import { ApiProperty } from '@nestjs/swagger';

export default class User {
  @ApiProperty()
  private id: string;

  @ApiProperty()
  private name: string;

  @ApiProperty()
  private email: string;

  @ApiProperty()
  private username: string;

  @ApiProperty()
  private photo: string;

  @ApiProperty()
  private createdAt: Date;

  @ApiProperty()
  private updatedAt: Date;

  constructor(
    id: string,
    name: string,
    email: string,
    username: string,
    photo: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.username = username;
    this.photo = photo;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  getId(): string {
    return this.id;
  }

  setId(id: string): void {
    this.id = id;
  }

  getName(): string {
    return this.name;
  }

  setName(name: string): void {
    this.name = name;
  }

  getEmail(): string {
    return this.email;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  getUsername(): string {
    return this.username;
  }

  setUsername(username: string): void {
    this.username = username;
  }

  getPhoto(): string {
    return this.photo;
  }

  setPhoto(photo: string): void {
    this.photo = photo;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  setCreatedAt(createdAt: Date): void {
    this.createdAt = createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  setUpdatedAt(updatedAt: Date): void {
    this.updatedAt = updatedAt;
  }
}
