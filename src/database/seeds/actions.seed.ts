import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import { ActionEntity } from '../entities/action.entity';

export class ActionsSeed implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(ActionEntity);
    await repository.insert([
      { name: 'Listar' },
      { name: 'Criar' },
      { name: 'Modificar' },
      { name: 'Remover' },
      { name: 'Menu' },
    ]);
  }
}
