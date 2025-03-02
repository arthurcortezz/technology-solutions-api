import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import { RoleEntity } from '../../modules/users/entities/role.entity';

export class RolesSeed implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(RoleEntity);
    await repository.insert([
      { name: 'Administrador' },
      { name: 'Gerente e cultura' },
      { name: 'Usuário' },
    ]);
  }
}
