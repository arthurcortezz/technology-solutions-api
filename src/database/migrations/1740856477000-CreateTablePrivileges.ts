import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateTablePrivileges1679220841770 implements MigrationInterface {
  private readonly table = new Table({
    name: 'privileges',
    columns: [
      {
        name: 'id',
        type: 'int',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment',
      },
      {
        name: 'action_menu_id',
        type: 'int',
      },
      {
        name: 'role_id',
        type: 'int',
      },
      {
        name: 'created_at',
        type: 'timestamp',
        default: 'now()',
      },
      {
        name: 'updated_at',
        type: 'timestamp',
        default: 'now()',
      },
      {
        name: 'deleted_at',
        type: 'timestamp',
        isNullable: true,
      },
    ],
  });

  private readonly actionMenuForeignKey = new TableForeignKey({
    columnNames: ['action_menu_id'],
    referencedColumnNames: ['id'],
    referencedTableName: 'actions_menus',
    onDelete: 'CASCADE',
  });

  private readonly roleForeignKey = new TableForeignKey({
    columnNames: ['role_id'],
    referencedColumnNames: ['id'],
    referencedTableName: 'roles',
    onDelete: 'CASCADE',
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.table);
    await queryRunner.createForeignKeys(this.table, [
      this.actionMenuForeignKey,
      this.roleForeignKey,
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKeys(this.table, [
      this.actionMenuForeignKey,
      this.roleForeignKey,
    ]);
    await queryRunner.dropTable(this.table);
  }
}
