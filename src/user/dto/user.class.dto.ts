import { ApiProperty } from '@nestjs/swagger';

export default class UserDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty({ type: 'file', required: false })
  photo: string;

  @ApiProperty()
  password: string;

  constructor(name: string, email: string, username: string, photo: string) {
    this.name = name;
    this.email = email;
    this.username = username;
    this.photo = photo;
  }
}
