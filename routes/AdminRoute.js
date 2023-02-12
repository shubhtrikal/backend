const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const Product = require('../models/ProductModel');

router.post('/getAllCollectors', async (req, res) => {
    const data = req.body
    const user = await User.findOne({ email: data.email })
    if (user && user.role === 'admin') {
        const collectors = await User.find({ role: 'collector' })
        return res.status(200).json(collectors)
    }
    else {
        return res.status(400).json({ error: 'User does not exist or is not an admin' })
    }
})

router.post('/verifyCollector', async (req, res) => {
    const data = req.body
    const user = await User.findOne({ email: data.email })
    const col = await User.findOne({ role: 'collector' })
    // console.log(user)
    if (user && user.role === 'admin') {
        const collector = await User.findOne({ _id: data.collectorId })
        if (collector) {
            collector.status = 'verified'
            await collector.save()
                .then((collector) => {
                    for (let i = 0; i < col.length; i++) {
                        if (col[i].status === 'unverified') {
                            col[i].status = 'verified'
                        }
                    }
                    return col;
                })
                .then((col) => {
                    return res.status(200).json(col)
                })
                .catch((err) => {
                    console.log(err)
                    return res.status(500).json(err)
                })
        }
        else {
            return res.status(400).json({ error: 'Collector does not exist' })
        }
    }
    else {
        return res.status(400).json({ error: 'User does not exist or is not an admin' })
    }
})
router.post('/rejectCollector', async (req, res) => {
    const data = req.body
    const user = await User.findOne({ email: data.email })
    const col = await User.findOne({ role: 'collector' })
    // console.log(user)
    if (user && user.role === 'admin') {
        const collector = await User.findOne({ _id: data.collectorId })
        if (collector) {
            collector.status = 'rejected'
            await collector.save()
                .then((collector) => {
                    for (let i = 0; i < col.length; i++) {
                        if (col[i].status === 'rejected') {
                            col[i].status = 'rejected'
                        }
                    }
                    return col;
                })
                .then((col) => {
                    return res.status(200).json(col)
                })
                .catch((err) => {
                    console.log(err)
                    return res.status(500).json(err)
                })
        }
        else {
            return res.status(400).json({ error: 'Collector does not exist' })
        }
    }
    else {
        return res.status(400).json({ error: 'User does not exist or is not an admin' })
    }
})

router.post('/addCredit', async (req, res) => {
    const data = req.body

    const user = await User.findOne({ email: data.email })
    if (user && user.role === 'admin') {
        const product = new Product({
            name: data.name,
            price: data.price,
            quantity: data.quantity,
            description: data.description,
            imgurl: data.imgurl
        })
        await product.save()
            .then((product) => {
                return res.status(200).json(product)
            })
            .catch((err) => {
                console.log(err)
                return res.status(500).json(err)
            })
    }
    else {
        return res.status(400).json({ error: 'User does not exist or is not an admin' })
    }
})


router.get('/getAllProducts', async (req, res) => {
    const products = await Product.find()
    return res.status(200).json(products)
})


module.exports = router;