import {existsSync, promises, writeFileSync} from "fs";
const path = 'ProductsFile.json';

class ProductManager {
    constructor(filePath) {
        this.path = filePath || 'ProductsFile.json';
        this.products = [];
        this.loadProductsFromFile({ limit: 0 });
    }

    async loadProductsFromFile(queryObj) {
        const {limit} = queryObj;
        try {
            if (existsSync(path)) {
                const productsFile = await promises.readFile (path, 'utf-8');
                const productsData = JSON.parse(productsFile);
                return limit ? productsData.slice(0, +limit) : productsData;
            }else {
                console.log("Empty");
                return [];
            }
        } catch (error) {
            console.error('Error al cargar productos desde el archivo:', error);
        }
    }

    async saveProductsToFile() {
        try {
            writeFileSync(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.error('Error al guardar productos en el archivo:', error);
        }
    }

    async getProductById(id) {
        try{
            const products = await this.loadProductsFromFile(id);
            const product = products.find(product => product.id === id);
            if (!product) {
                console.error('Producto no encontrado');
            } else{
                return product;
            }
        } catch (error) {
            return error;
        }
    }

    async getProducts() {
        return this.products;
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !thumbnail || !code || stock === undefined) {
            console.error('Todos los campos son requeridos');
            return;
        }
        if (this.products.some(product => product.code === code)) {
            console.error('El producto con el mismo código ya existe');
            return;
        }
        const newProduct = {
            id: this.products.length === 0 ? 1 : this.products[this.products.length - 1].id + 1,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };
        this.products.push(newProduct);
        this.saveProductsToFile();
        console.log('Producto añadido satisfactoriamente:', newProduct, "\n");
    }

    async updateProduct(id, updatedProduct) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex === -1) {
            console.error('Producto no encontrado');
            return;
        }
        this.products[productIndex] = { ...updatedProduct, id };
        this.saveProductsToFile();
        console.log('Producto actualizado satisfactoriamente:', this.products[productIndex]);
    }

    async deleteProduct(id) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex === -1) {
            console.error('Producto no encontrado');
            return;
        }
        this.products.splice(productIndex, 1);
        this.saveProductsToFile();
        console.log('Producto eliminado satisfactoriamente');
    }
}

export const manager = new ProductManager();
