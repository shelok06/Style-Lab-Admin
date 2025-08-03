import connectDB from "@/db/connectDB";
import clientPromise from "@/db/connectOrderDB";
import Product from "@/model/Product";
import PDFDocument, { lineGap } from 'pdfkit'
import fs from 'fs'

export async function addProducttoDB(product) {
    await connectDB()
    try {
        const db = await Product.create({ picture: product.picture, price: product.price, product: product.product, brand: product.brand, quantity: product.quantity })
        if (!db) throw new Error("Server error")
        return { success: true, message: "Added to DB" }
    } catch (error) {
        return { success: false, message: error }
    }

}

export async function fetchProducts() {
    await connectDB()
    try {
        const db = await Product.find({})
        if (!db) throw new Error("Server Error")
        return { success: true, message: db }
    } catch (error) {
        return { success: false, message: error }
    }
}

export async function deleteProducts(ids) {
    await connectDB()
    try {
        for (const id of ids) {
            const db = await Product.findByIdAndDelete(id);
            if (!db) throw new Error("Product not found");
        }

        return { success: true, message: "Items deleted" }
    } catch (error) {
        return { success: false, message: error }
    }

}

export async function updateProduct(item, id) {
    await connectDB()
    try {
        for (const key in item) {
            if (key === "price") {
                const db = await Product.findOneAndUpdate({ "_id": id }, { [key]: parseInt(item[key]) })
                if (!db) throw new Error("Product not found")
            }
            else {
                const db = await Product.findOneAndUpdate({ "_id": id }, { [key]: item[key] })
                if (!db) throw new Error("Product not found")
            }
        }
        return { success: true, message: "Product updated" }
    } catch (error) {
        return { success: false, message: error }
    }

}

export async function getOrders(date) {
    try {
        const client = await clientPromise

        const db = client.db('stylelab')
        if (!db) throw new Error("Server Error")

        const data = await db.collection("orders").find({ $and: [{ updatedAt: { $regex: date } }, { payment: true }] }).toArray()
        return { success: true, message: data }
    } catch (error) {
        return { success: false, message: error }
    }
}

export async function changedelivery(id) {
    try {
        const client = await clientPromise

        const db = client.db('stylelab')
        if (!db) throw new Error("Server Error")

        const data = await db.collection("orders").findOneAndUpdate({ orderID: id }, { $set: { delivery: true } })
        return { success: true, message: "Status Changed" }
    } catch (error) {
        return { success: false, message: error }
    }
}

export async function pdfCreator(orders) {
    const date = new Date
    const d = date.toLocaleString("en-PK", { timeZone: "Asia/Karachi" }).split(",")[0]
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument()

        let chunks = []
        doc.on('data', chunk => { chunks.push(chunk) })

        doc.on('end', () => {
            const pdfBuffer = Buffer.concat(chunks)
            resolve(pdfBuffer)
        })

        doc.fontSize(18).text("Todays Orders", {
            width: 410,
            align: 'center'
        })

        doc.fontSize(8).fillColor('#333').text(`Date: ${d}`, {
            width: 410,
            align: 'right'
        })
        doc.moveDown(2);

        orders.forEach((element) => {
            doc.fontSize(10)
                .fillColor('#333')
                .text(`Order ID: `, { continued: true })
                .font('Helvetica-Bold')
                .text(`${element.orderID}`);

            doc.font('Helvetica').text(`Customer Name: ${element.name}`)
            doc.text(`Customer Email: ${element.email}`)
            doc.text(`Customer Phone: ${element.phone}`)
            doc.text(`Customer Address: ${element.address}`)

            doc.moveDown(0.5)
            doc.font('Helvetica-Bold').text('Items: ', { continued: true })
            doc.font('Helvetica');
            element.items.forEach((item) => {
                doc.text(`${item.product}-${item.brand}, `, { continued: true })
            })
            doc.text(`\nOrder Date: ${element.updatedAt}`)
            doc.text(`Delivery Deadline: ${element.deliveryDate}`)
            doc.text(`Delivery Status: ${element.delivery ? "Deliverd" : "Pending"}`)
            doc.font('Helvetica-Bold').text(`Total: ${element.total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`)

            doc.moveDown(1.5);
            doc.moveTo(doc.x, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).stroke('#ccc');
            doc.moveDown(2.5);
        })

        doc.end()
    })
}

export async function dataCalcultion() {
    try {
        const client = await clientPromise

        const db = client.db('stylelab')
        if (!db) throw new Error("Server Error")

        const data = await db.collection("orders").find({ payment: true }).toArray()
        const data2 = await db.collection("orders").find({ delivery: true }).toArray()
        const data3 = await db.collection("orders").find({}).toArray()

        let chartData = { total: data3.length, delivery: data2.length, payment: data.length }
        let earning = 0

        data.forEach((element) => {
            earning += element.total
        })

        let items = []

        data.forEach((element) => {
            element.items.forEach((item) => {
                for (let i = 0; i < item.quantity; i++) {
                    items.push(`${item.product} — ${item.brand}`)
                }
            })
        })


        let list = {}

        items.forEach((element) => {
            if (list[element]) {
                list[element] += 1
            } else {
                list[element] = 1
            }
        })

        let val = Object.values(list).sort(function (a, b) { return b - a })
        let top = []
        for (const key in list) {
            if (list[key] === val[0]) {
                top.push({ [key]: list[key] })
            }
        }

        return { success: true, message: { earning: earning, top: top, chart: chartData } }
    } catch (error) {
        return { success: false, message: error }
    }
}