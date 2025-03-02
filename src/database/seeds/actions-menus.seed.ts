import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import { ActionMenuEntity } from '../entities/action-menu.entity';

export class ActionsMenusSeed implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(ActionMenuEntity);
    await repository.insert([
      //DASHBOARD
      { actionId: 1, menuId: 1 },
      { actionId: 2, menuId: 1 },
      { actionId: 3, menuId: 1 },
      { actionId: 4, menuId: 1 },
      { actionId: 5, menuId: 1 },

      //USUÁRIOS
      { actionId: 1, menuId: 2 },
      { actionId: 2, menuId: 2 },
      { actionId: 3, menuId: 2 },
      { actionId: 4, menuId: 2 },
      { actionId: 5, menuId: 2 },

      //CONVITES
      { actionId: 1, menuId: 3 },
      { actionId: 2, menuId: 3 },
      { actionId: 3, menuId: 3 },
      { actionId: 4, menuId: 3 },
      { actionId: 5, menuId: 3 },
    ]);
  }
}
