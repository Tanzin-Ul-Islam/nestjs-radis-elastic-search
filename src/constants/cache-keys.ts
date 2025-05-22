export const CACHE_KEYS = {
  CATEGORY: {
    ALL: 'category:allCategories',
    ONE: (id: string) => `category:${id}`,
  },
  BRAND: {
    ALL: 'brand:allBrands',
    ONE: (id: string) => `brand:${id}`,
  },
  COLOR: {
    ALL: 'color:allColors',
    ONE: (id: string) => `color:${id}`,
  },
  PRODUCT: {
    ALL: 'product:allProducts',
    ONE: (id: string) => `product:${id}`,
  },
};
export const CACHE_EXPIRATION = {
  EXP_TIME: 3600, // 1 hour in seconds
};
