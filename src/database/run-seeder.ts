import { DataSource } from 'typeorm';
import { runSeeders } from 'typeorm-extension';

import { ormOptions } from './data-source';
import { UsersSeed } from './seeds/users.seed';
import { MenusSeed } from './seeds/menus.seed';
import { RolesSeed } from './seeds/roles.seed';
import { ActionsSeed } from './seeds/actions.seed';
import { PrivilegesSeed } from './seeds/privileges.seed';
import { ActionsMenusSeed } from './seeds/actions-menus.seed';

(async () => {
  const dataSource = new DataSource(ormOptions);
  await dataSource.initialize();

  await runSeeders(dataSource, {
    seeds: [
      UsersSeed,
      MenusSeed,
      RolesSeed,
      ActionsSeed,
      ActionsMenusSeed,
      PrivilegesSeed,
    ],
  });
})();
