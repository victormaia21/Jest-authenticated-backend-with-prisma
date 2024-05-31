export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  username: string;
  photo: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDTO {
  name: string;
  email: string;
  username: string;
  photo: string;
  password: string;
}

export interface UserDTOLogin {
  email: string;
  password: string;
}

export interface Pagination {
  per_pg: number;
  pg: number;
  filter: 'MAIS_ANTIGO' | 'MAIS_RECENTE' | 'ORDEM_ALFABETICA';
}
