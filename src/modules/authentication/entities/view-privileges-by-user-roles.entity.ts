import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  name: 'view_privileges_by_user_roles',
  expression: `
    SELECT CONCAT(UPPER(m.menu_key), '_', UPPER(a.name)) AS "key",
           p.role_id                                     AS "role_id",
           m.menu                                        AS "menu",
           m.route                                       AS "route",
           ac.action_id
    FROM privileges p
             JOIN actions_menus ac ON ac.id = p.action_menu_id
             JOIN actions a ON a.id = ac.action_id
             JOIN menus m ON m.id = ac.menu_id
    GROUP BY ac.id, p.role_id, m.menu_key, a.name, m.menu, m.route, ac.action_id
    ORDER BY m.menu_key;
  `,
})
export class ViewPrivilegesByUserRolesEntity {
  @ViewColumn()
  key: string;

  @ViewColumn({ name: 'role_id' })
  roleId: number;

  @ViewColumn({ name: 'action_id' })
  actionId: number;

  @ViewColumn()
  menu: string;

  @ViewColumn({ name: 'menu_key' })
  menuKey: string;

  @ViewColumn()
  route: string;
}