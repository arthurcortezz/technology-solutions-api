export interface UserInterface {
  id?: number;
  name: string;
  email: string;
  password: string;
  cpf: string;
  phone: string;
  roleId: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
