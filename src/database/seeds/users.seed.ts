import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import { UserEntity } from '../../modules/users/entities/user.entity';

export class UsersSeed implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const password =
      '$2b$10$fA/6FHBH.6RxAUX49n8Cy.XFYbZzonsHq3qzvwf96TQWo0DUXbZ0q';

    const repository = dataSource.getRepository(UserEntity);

    const users = [
      {
        name: 'Administrador',
        email: 'adm@gmail.com',
        password,
        cpf: '12345678909',
        phone: '82999999999',
        roleId: 1,
        cep: '57000000',
        neighborhood: 'Centro',
        city: 'Maceió',
        uf: 'AL',
        street: 'Avenida brasil',
      },
    ];

    await repository.insert(users);
  }
}
