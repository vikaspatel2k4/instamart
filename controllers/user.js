const User = require("../models/user");

module.exports.renderSignupForm = (req,res)=>{
    res.render("signup.ejs");
};

module.exports.signup = async(req,res) =>{
    //ab agar yaha ham sirf wrap async use karenge to sirf error show hoga 
    //but hamko esa chiye ki error flash ho na ki sirf dikhe so we use tryu and catch 
    try {
        let {username , email , password} = req.body ;
    const newUser = new User({email,username});
    const registeredUser = await User.register(newUser , password);
    console.log(registeredUser);
    //if we signup automatically logedin thats the functionality we need
    req.login(registeredUser,(err)=>{
        if(err) {
            return next(err);
        }
        req.flash("success" , "Welcome to Wanderlust");
        res.redirect("/listings");
    })

    } catch (e) {
        req.flash("error" , e.message);
        res.redirect("/signup");
    }
};
module.exports.renderLoginForm = (req,res)=>{
    res.render("login.ejs");
};
module.exports.login =  async(req,res)=>{
    req.flash("success" , "Welcome to Wanderlust you are logged in");
    let redirectUrl = res.locals.redirectUrl||"/listings";
    res.redirect(redirectUrl);
};
module.exports.logout = (req,res,next)=>{
    req.logout((err) =>{
        if(err) {
           return next(err);
        }
        req.flash("success" ,"you are logged out!");
        res.redirect("/listings")
    })
};