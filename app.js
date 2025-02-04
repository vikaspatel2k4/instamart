const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require('./models/listing');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/WrapAsync.js");
const ExpressError = require("./utils/Expresserror.js");
const {listingSchema,reviewSchema} = require("./Schema.js");
const { validateHeaderName } = require("http");
const Review = require("./models/review.js");
const passport = require("passport");
const LocalStrategy  = require("passport-local");
const User = require("./models/user.js");

//this is for cookie
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");



const listingRouter = require("./routes/listing.js");
//jese ham yaha id bhejna chahrahe hai but we cant send id from this therefor we will use merge params to merge it with child node
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;




main()
    .then(() => {
        console.log("connected to database");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(dbUrl);
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true })); // listing me id params ko jodne ke liye
app.use(methodOverride("_method"));
app.engine('ejs' , ejsMate);
app.use(express.static(path.join(__dirname , "/public")));

//creating a mongodb store by connection
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error" , () =>{
    console.log("ERROR in MONOGO SESSION STORE" , err);
});


// this is for cookie
const sessionOptions = {
    store,
    secret : process.env.SECRET, 
    resave : false,
    saveUninitialized : true ,
    cookie : {
        expires : Date.now() + 7*24*60*60*1000, //hamko isko milli seconds me rakhna hai 
        maxAge : 7*24*60*60*1000,
        httpOnly :true,
    },
};


app.use(session(sessionOptions));
app.use(flash());

//authentication middlewaare 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
//also passport serialize and desseriallize karta hai user ko for this we two func
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser" , async(req,res) =>{
//     let fakeUser = new User({
//         email : "student@gmail.com",
//         username : "delta-student",
//     });
//     let registeredUser = await User.register(fakeUser , "helloworld");
// res.send(registeredUser);
// });

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/", userRouter);


// default accesss
app.get("/", (req, res) => {
    console.log("working");
    res.send("working hai mere bhai");
});
app.all("*" , (req,res,next)=>{
    next(new ExpressError(404,"page not found!"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"} = err;
    res.render("error.ejs",{err});
    // res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("listening to the port 8080");
});
