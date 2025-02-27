export const createPaginator = (data: {
  perPage: number;
  pageNumber: number;
}): {
  skip: number;
  take: number;
} =>
  Object.keys(data).length !== 0
    ? {
        take: data.perPage,
        skip: data.perPage * (data.pageNumber - 1),
      }
    : {
        take: 5,
        skip: 0,
      };
