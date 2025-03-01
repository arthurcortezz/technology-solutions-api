import { CompanyInterface } from '../../companies/interfaces/company.interface';
import { RoleInterface } from '../../roles/interfaces/role.interface';

import { ViewMenuByUserRolesEntity } from '../entities/view-menu-by-user-roles.entity';
import { ViewPrivilegesByUserRolesEntity } from '../entities/view-privileges-by-user-roles.entity';

export interface UserJwtInterface {
  id: number;
  name: string;
  email: string;
  personType: string;
  identificationNumber: string;
  phone: string;
  role?: RoleInterface;
  company?: CompanyInterface;
  menus: ViewMenuByUserRolesEntity[];
  privileges: ViewPrivilegesByUserRolesEntity[];
  acceptedAt: Date;
  createdAt: Date;
}
