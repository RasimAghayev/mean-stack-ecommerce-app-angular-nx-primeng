const express = require('express')
const router = express.Router()
const { Product } = require('../models/product')
const { Category } = require('../models/category')

router.get(`/`, async (req, res) => {
    const productList = await Product.find()

    if (!productList) {
        res.status(500).json({ success: false })
    }
    res.status(200).send(productList)
})

router.get(`/onlyName`, async (req, res) => {
    const productList = await Product.find().select('name price -_id')

    if (!productList) {
        res.status(500).json({ success: false })
    }
    res.status(200).send(productList)
})



router.get(`/:id`, async (req, res) => {
    const productList = await Product.findById(req.params.id)

    if (!productList) {
        res.status(500).json({
            success: false,
            message: 'The product with the given ID was not found.',
        })
    }
    res.status(200).send(productList)
})

router.post(`/`, async (req, res) => {
    const category = await Category.findById(req.body.category)
    if (!category) return res.status(500).send('The category cannot be created!')

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    })
    product = await product.save()
    if (!product) return res.status(500).send('The product cannot be created!')

    res.send(product)
})

router.put(`/:id`, async (req, res) => {
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        },
        {
            new: true,
        }
    )

    if (!product) return res.status(404).send('The product cannot be created!')

    res.send(product)
})

router.delete(`/:id`, (req, res) => {
    Product.findByIdAndRemove(req.params.id)
        .then((product) => {
            if (product) {
                return res.status(200).json({
                    success: true,
                    message: 'The product is deleted!',
                })
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found!',
                })
            }
        })
        .catch((err) => {
            return res.status(400).json({
                success: false,
                error: err,
            })
        })
})
module.exports = router
