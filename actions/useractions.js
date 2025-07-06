import connectDB from "@/db/connectDB";
import Product from "@/model/Product";

export async function addProducttoDB(product) {
    await connectDB()
    const db = await Product.create({ picture: product.picture, price: product.price, product: product.product, brand: product.brand, quantity: product.quantity })

    return "Added to DB"
}

export async function fetchProducts() {
    await connectDB()
    const db = await Product.find({})

    return db
}

export async function deleteProducts(ids) {
    await connectDB()
    ids.forEach(async (id) => {
        const db = await Product.findByIdAndDelete(id)
    });
    console.log(ids)

    return true
}

export async function updateProduct(item, id) {
    await connectDB()
    for (const key in item) {
        const db = await Product.findOneAndUpdate({"_id": id}, {[key]: item[key]})
        console.log(db)
    }

    return true
}