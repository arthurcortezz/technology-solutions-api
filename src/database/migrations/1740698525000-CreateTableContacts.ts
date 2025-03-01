import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableContacts1740698525000 implements MigrationInterface {
  private readonly table = new Table({
    name: 'contacts',
    columns: [
      {
        name: 'id',
        type: 'int',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment',
      },
      {
        name: 'name',
        type: 'varchar',
        length: '50',
      },
      {
        name: 'email',
        type: 'varchar',
        length: '150',
      },
      {
        name: 'phone',
        type: 'varchar',
        length: '50',
      },
      {
        name: 'message',
        type: 'varchar',
        length: '250',
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
