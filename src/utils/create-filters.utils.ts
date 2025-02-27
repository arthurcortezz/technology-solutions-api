import { Equal, In, Raw } from 'typeorm';

export interface FilterObject {
  [key: string]: any;
}

export const filterEscapeCodes = (element: string): string =>
  (element || '').replace(/[\\%_]/g, '\\$&');

export const createFilters = (filters): FilterObject => {
  const where: FilterObject = {};
  for (const key in filters) {
    if (filters.hasOwnProperty(key) && filters[key]) {
      const element = filters[key];
      where[key] = generateWhereValue(key, element);
    }
  }

  return where;
};
function generateWhereValue(key, element) {
  const value = Array.isArray(element)
    ? In(element)
    : typeof element === 'object'
      ? generateObjectWhereValue(element)
      : isNaN(element) && key !== 'status'
        ? Raw(
            (alias) =>
              `LOWER(${alias}) LIKE '%${filterEscapeCodes(
                element.toString().toLowerCase(),
              )}%'`,
          )
        : Equal(element);
  return value;
}

function generateObjectWhereValue(element) {
  for (const key in element) {
    if (element.hasOwnProperty(key) && element[key]) {
      element[key] = generateWhereValue(key, element[key]);
    }
  }
  return element;
}
const isNaN = (param): boolean => !Number(param);
