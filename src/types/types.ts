export type Product = {
    id: number;
    title: string;
    category: string;
    sku: string;
    brand: string;
    thumbnail: string;
    rating: number;
    price: number;
};

export type ProductsQueryResult = {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
};