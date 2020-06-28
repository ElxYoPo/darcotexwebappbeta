module.exports = {
    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        return res.redirect('/signin')
    },
    isNotLoggedIn(req,res,next){
        if (req.isAuthenticated()) {
            return res.redirect('/links')
        }else{
            return next()
        }
    },
    isBodega(req, res, next){
        if (req.session.user.grocer == 1){
            return next()
        }else{
            return res.redirect('/error', {error: 'No tiene los permisos para realizar este proceso.'})
        }
    },
    isEmploye(req, res, next){
        if(req.session.user.employe == 1){
            return next()
        }else{
            return res.redirect('/error', {error: 'No tienes los permisos para realizar este proceso.'})
        }
    }
}