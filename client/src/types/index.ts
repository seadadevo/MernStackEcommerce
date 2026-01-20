export interface Product {
    _id: string;
    productName: string;
    productDesc: string;
    productPrice: number;
    brand: string;
    productImag: { url: string }[];
    [key: string]: any;
}
