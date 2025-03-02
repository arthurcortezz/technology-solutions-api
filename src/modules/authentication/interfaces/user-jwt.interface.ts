import { ViewMenuByUserRolesEntity } from '../entities/view-menu-by-user-roles.entity';

export interface UserJwtInterface {
  id: number;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  roleId: number;
  menus: ViewMenuByUserRolesEntity[];
  createdAt: Date;
}
