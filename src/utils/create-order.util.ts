import { SortInterface } from './interfaces/sort.interface';

function stringToObject(field: string, orientation: string): object {
  const parts = field.split('.');
  const result = {};

  let current = result;
  for (let i = 0; i < parts.length - 1; i++) {
    current[parts[i]] = {};
    current = current[parts[i]];
  }

  current[parts[parts.length - 1]] = orientation ? orientation : 'ASC';
  return result;
}

export function createOrder(sort: SortInterface): object {
  return sort.field ? stringToObject(sort.field, sort.sort) : { id: 'ASC' };
}
