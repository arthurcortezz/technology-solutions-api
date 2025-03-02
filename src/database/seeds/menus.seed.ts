import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import { MenuEntity } from '../entities/menu.entity';

export class MenusSeed implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(MenuEntity);
    await repository.insert([
      {
        name: 'Dashboard',
        route: 'dashboard',
        icon: 'dashboard',
        key: 'dashboard',
      },
      {
        name: 'Usuários',
        route: 'usuarios',
        icon: 'users',
        key: 'users',
      },
      {
        name: 'Convites',
        route: 'convites',
        icon: 'invites',
        key: 'invites',
      },
    ]);
  }
}
