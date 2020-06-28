const express = require('express')
const router = express.Router()
const fs = require('fs')

const passport = require('passport')
const { isLoggedIn, isBodega } = require('../lib/out')
const pool = require('../database')
const { fstat } = require('fs')
const multer = require('multer')

app.get('/', isLoggedIn, isBodega, async (req, res) => {
    const bodega = req.session.user.pk_user
    const cellar = await pool.query('SELECT cellar_id FROM grocer WHERE pk_grocer = ?', [bodega])
    const inventario = await pool.query('SELECT * FROM inventory WHERE cellar_id = ?', [cellar])
    res.render('bodega/start', {inventario: inventario})
})

app.get('/edit/:id', isLoggedIn, isBodega, async (req, res) => {
    const id = req.params.id
    const item = await pool.query('SELECT * FROM product WHERE product_id = ?', [id])
    res.render('bodega/edit', {item: item[0]})
})

app.post('/edit/:id', isLoggedIn, isBodega, async (req, res) => {
    const id = req.params.id
    const { itemName, category_id, unitaryPrice, quantity } = req.body
    const producto = {
        itemName,
        category_id,
        unitaryPrice
    }
    await pool.query('UPDATE product SET ? WHERE product_id = ?', [producto, id])
    await pool.query('UPDATE inventory SET ? WHERE product_id = ?', [quantity, id])
    req.flash('success', 'El artículo se ha actualizado correctamente.')
    res.redirect('/bodega')
})

app.get('/add', isLoggedIn, isBodega, (req, res) => {
    res.render('/bodega/add')    
})

app.post('/bodega/add', isLoggedIn, isBodega, async (req, res) => {
    const { itemName, category_id, unitaryPrice, quantity, composite, image } = req.body
    const grocer = req.session.user.pk_user
    const producto = {
        itemName,
        category_id,
        unitaryPrice,
        composite
    }
    
    const upload = multer({
		storage: storage,
		fileFilter: function(req, file, callback) {
			var ext = path.extname(file.originalname)
			if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
				return callback(res.end('Only images are allowed'), null)
			}
			callback(null, true)
		}
	}).single('imagen');
    upload(req, res, function(err){
        if(err){
            throw err;
        }
    });

    const cellar = await pool.query('SELECT cellar_id FROM grocer WHERE pk_grocer = ?', [grocer])
    await pool.query('INSERT INTO product SET ?', [producto])
    const product_id = await pool.query('SELECT product_id FROM product WHERE itemName = ?', [itemName])
    const itemInv = {
        product_id,
        quantity
    }
    await pool.query('INSERT INTO inventory SET ?', [itemInv])
    req.flash('success', 'Objeto añadido correctamente')
    res.redirect('/bodega')
})

app.get('/bodega/delete/:id', isLoggedIn, isBodega, async (req, res) => {
    const { id } = req.params
    await pool.query('DELETE FROM product WHERE product_id = ?', [id])
    await pool.query('DELETE FROM inventory WHERE product_id = ?', [id])
    fs.unlink('../public/img/items/'+id, function(err){
        if(err){
            throw err
        }
    })
    req.flash('success', 'Artículo removido exitosamente.')
    res.redirect('/bodega')
})

module.exports = router