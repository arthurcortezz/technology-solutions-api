import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  name: 'view_menu_by_user_roles',
  expression: `
    SELECT m.id           AS "id",
           m.name         AS "menu",
           m.route        AS "route",
           m.menu_key     AS "menu_key",
           m.icon         AS "icon",
           p.role_id      AS "role_id"
    FROM privileges p
             INNER JOIN actions_menus am ON am.id = p.action_menu_id AND am.action_id = 5
             INNER JOIN menus m ON m.id = am.menu_id
    GROUP BY m.id, p.role_id, m.name, m.route, m.icon, m.menu_key
    ORDER BY m.name ASC;
  `,
})
export class ViewMenuByUserRolesEntity {
  @ViewColumn()
  menu: string;

  @ViewColumn()
  route: string;

  @ViewColumn()
  icon: string;

  @ViewColumn({ name: 'role_id' })
  roleId: number;

  @ViewColumn({ name: 'menu_key' })
  menuKey: string;
}
