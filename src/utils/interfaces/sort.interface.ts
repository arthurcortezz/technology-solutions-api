enum Sort {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface SortInterface {
  field: string;
  sort: Sort;
}
