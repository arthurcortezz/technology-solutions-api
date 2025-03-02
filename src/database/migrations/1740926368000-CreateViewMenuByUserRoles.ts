import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateViewMenuByUserRoles1740926368000
  implements MigrationInterface
{
  private viewName = 'view_menu_by_user_roles';
  private query = `
    SELECT m.id           AS "id",
           m.name         AS "menu",
           m.route        AS "route",
           m.key          AS "key",
           m.icon         AS "icon",
           p.role_id      AS "role_id"
    FROM privileges p
             INNER JOIN actions_menus am ON am.id = p.action_menu_id AND am.action_id = 5
             INNER JOIN menus m ON m.id = am.menu_id
    GROUP BY m.id, p.role_id, m.name, m.route, m.icon, m.key
    ORDER BY m.name ASC;
  `;

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE VIEW ${this.viewName} AS ${this.query}`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW ${this.viewName} AS ${this.query}`);
  }
}
