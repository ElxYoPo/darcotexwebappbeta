const express = require('express')
const router =  express.Router()

const { isLoggedIn, isNotLoggedIn } = require('../lib/out')
const Cart = require('../lib/cart')
const { route } = require('./auth')

router.get('/cart', isLoggedIn, (req, res) => {
    if (!req.session.cart) {
        return res.render('cart/carrito', {
        products: null
        })
    }
    var cart = new Cart(req.session.cart)
    res.render('cart/carrito', {
        products: cart.getItems(),
        totalPrice: cart.totalPrice
    })    
})

router.get('/cart/add/:id', isLoggedIn, (req, res) => {
    var productId = req.params.id
    var cart = new Cart(req.session.cart)
    var producto = pool.query('SELECT * FROM productos WHERE id = ?', [productId])
    cart.add(producto[0], productId)
    req.session.cart = cart
    total = cart.total
})

router.get('/cart/remove/:id', isLoggedIn, (req, res) => {
    var productId = req.params.id
    var cart = new Cart(req.session.cart ? req.session.cart : {})
    cart.remove(productId)
    req.session.cart = cart
    res.redirect('/cart')
})

router.get('/shop', isLoggedIn, (req, res) => {
    res.render('shop/shop')
})

router.get('/shop/cat/:id', isLoggedIn, (req, res) => {
    var catid = req.params.id
    var productos = pool.query('SELECT * FROM productos WHERE catId = ?', [catid])
    res.render('shop/cat', {
        productos: productos,
        catNombre: catid        
    })
})

module.exports = router