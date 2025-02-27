import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableCarousels1740621708000 implements MigrationInterface {
  private readonly table = new Table({
    name: 'carousels',
    columns: [
      {
        name: 'id',
        type: 'int',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment',
      },
      {
        name: 'title',
        type: 'varchar',
        length: '50',
      },
      {
        name: 'description',
        type: 'varchar',
        length: '250',
      },
      {
        name: 'icon',
        type: 'varchar',
        length: '100',
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

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.table);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.table);
  }
}
