import { MenuEntity } from './entities/menu.entity';
import { ActionEntity } from './entities/action.entity';
import { PrivilegeEntity } from './entities/privilege.entity';
import { ActionMenuEntity } from './entities/action-menu.entity';
import { UserEntity } from '../modules/users/entities/user.entity';
import { RoleEntity } from '../modules/users/entities/role.entity';
import { InviteEntity } from '../modules/invites/entities/invites.entity';
import { ContactEntity } from '../modules/contacts/entities/contact.entity';
import { CarouselEntity } from '../modules/carousels/entities/carousel.entity';
import { ViewMenuByUserRolesEntity } from '../modules/authentication/entities/view-menu-by-user-roles.entity';

export const entities = [
  UserEntity,
  RoleEntity,
  MenuEntity,
  InviteEntity,
  ActionEntity,
  ContactEntity,
  CarouselEntity,
  PrivilegeEntity,
  ActionMenuEntity,
  ViewMenuByUserRolesEntity,
];
