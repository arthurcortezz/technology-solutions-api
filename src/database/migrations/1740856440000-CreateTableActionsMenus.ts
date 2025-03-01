import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateTableActionsMenus1679220835211
  implements MigrationInterface
{
  private readonly table = new Table({
    name: 'actions_menus',
    columns: [
      {
        name: 'id',
        type: 'int',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment',
      },
      {
        name: 'action_id',
        type: 'int',
      },
      {
        name: 'menu_id',
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

  private readonly actionForeignKey = new TableForeignKey({
    columnNames: ['action_id'],
    referencedColumnNames: ['id'],
    referencedTableName: 'actions',
    onDelete: 'CASCADE',
  });

  private readonly menuForeignKey = new TableForeignKey({
    columnNames: ['menu_id'],
    referencedColumnNames: ['id'],
    referencedTableName: 'menus',
    onDelete: 'CASCADE',
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.table);
    await queryRunner.createForeignKeys(this.table, [
      this.actionForeignKey,
      this.menuForeignKey,
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKeys(this.table, [
      this.actionForeignKey,
      this.menuForeignKey,
    ]);
    await queryRunner.dropTable(this.table);
  }
}
