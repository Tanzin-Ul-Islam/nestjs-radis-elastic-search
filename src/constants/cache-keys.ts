export const CACHE_KEYS = {
  CATEGORY: {
    ALL: 'category:allCategories',
    ONE: (id: string) => `category:${id}`,
  }
}
export const CACHE_EXPIRATION = {
  EXP_TIME: 3600, // 1 hour in seconds
}