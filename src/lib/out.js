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
    }
}