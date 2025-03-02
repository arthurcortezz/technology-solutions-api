import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import { PrivilegeEntity } from '../entities/privilege.entity';

export class PrivilegesSeed implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(PrivilegeEntity);
    await repository.insert([
      //DASHBOARD
      { actionMenuId: 1, roleId: 1 },
      { actionMenuId: 2, roleId: 1 },
      { actionMenuId: 3, roleId: 1 },
      { actionMenuId: 4, roleId: 1 },
      { actionMenuId: 5, roleId: 1 },
      { actionMenuId: 1, roleId: 2 },
      { actionMenuId: 2, roleId: 2 },
      { actionMenuId: 3, roleId: 2 },
      { actionMenuId: 4, roleId: 2 },
      { actionMenuId: 5, roleId: 2 },
      { actionMenuId: 1, roleId: 3 },
      { actionMenuId: 2, roleId: 3 },
      { actionMenuId: 3, roleId: 3 },
      { actionMenuId: 4, roleId: 3 },
      { actionMenuId: 5, roleId: 3 },

      //USUÁRIOS
      { actionMenuId: 6, roleId: 1 },
      { actionMenuId: 7, roleId: 1 },
      { actionMenuId: 8, roleId: 1 },
      { actionMenuId: 9, roleId: 1 },
      { actionMenuId: 10, roleId: 1 },

      //CONVITES
      { actionMenuId: 11, roleId: 1 },
      { actionMenuId: 12, roleId: 1 },
      { actionMenuId: 13, roleId: 1 },
      { actionMenuId: 14, roleId: 1 },
      { actionMenuId: 15, roleId: 1 },
      { actionMenuId: 11, roleId: 2 },
      { actionMenuId: 12, roleId: 2 },
      { actionMenuId: 13, roleId: 2 },
      { actionMenuId: 14, roleId: 2 },
      { actionMenuId: 15, roleId: 2 },
    ]);
  }
}
