import { CityInterface } from '../../cities/interfaces/city.interface';

export interface UserAddressInterface {
  id?: number;
  street: string;
  number: string;
  complement?: string | null;
  neighborhood: string;
  cep: string;
  cityId: number;
  city?: CityInterface;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
