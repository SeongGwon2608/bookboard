//로그인 판단
exports.login = (req, res, next) => {
    if(req.isAuthenticated()){ 
        next();
    }
    else res.status(403).send('로그인이 필요합니다.');
};

exports.notLogin = (req, res, next) => {
    if(!req.isAuthenticated()) next();
    else{
        const message = encodeURIComponent('로그인한 상태입니다.');
        res.redirect(`/?error=${message}`);
    }
};