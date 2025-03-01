export interface UserInterface {
  id?: number;
  name: string;
  email: string;
  password: string;
  cpf: string;
  phone: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
