export interface ResponseLogin {
  message: string | 'Usuario autenticado com sucesso';
  token: string;
  id: string;
}
