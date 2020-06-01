const express = require('express')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
const mySQLStore = require('express-mysql-session')
const { database } = require('./keys')
const passport = require('passport')

//inicializaciones
const app = express()
require('./lib/passport')

//settings
app.set('port', process.env.PORT || 4000)
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs')

//Middlewares (Morgan comenta lo que se envía entre web y bdd a través de consola)
app.use(session({
    secret: 'sesiondarcotex',
    resave: false,
    saveUninitialized: false,
    store: new mySQLStore(database)
}))
app.use(flash())
app.use(morgan('dev'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())



//Variables globales
app.use((req, res, next) => {
    app.locals.success = req.flash('success')
    app.locals.message = req.flash('message')
    app.locals.user = req.user
    next()
})

//Rutas
app.use(require('./routes'))
app.use(require('./routes/auth'))
app.use('/links', require('./routes/links'))


//Public (acceso navegador)
app.use(express.static(path.join(__dirname, 'public')))

//Inicio del server
app.listen(app.get('port'), () => {
    console.log('Servidor escuchando en puerto', app.get('port'))
})