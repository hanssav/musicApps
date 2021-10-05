const http = require("http")
const express = require("express")
const path = require("path")
const session = require("express-session")


const app = express()
const hbs = require("hbs")

const dbConnection = require("./connection/db");

// handle route 
const authRoute = require("./routes/auth")
const musicRoute = require("./routes/music")

// method for handle
app.use("/static", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.urlencoded({ extended: false }));

// set views location to app
app.set("views", path.join(__dirname, "views"));

// set tamplate/view enggine
app.set("view engine", "hbs")


// register view partials
hbs.registerPartials(path.join(__dirname, "views/partials"))

app.use(
    session({
        cookie: {
            maxAge: 4 * 60 * 60 * 1000,
            secure: false,
            httpOnly: true,
        },
        store: new session.MemoryStore(),
        saveUninitialized: true,
        resave: false,
        secret: "secretValue",
    })
    );
    
    // app.use(flash());
    
    app.use((req, res, next) => {
        res.locals.message = req.session.message;
        delete req.session.message;
        next();
    });
    
    // render home page
    app.get("/", function (req, res) {
        res.render("index", { title: "Music", isLogin: req.session.isLogin })
    });


    app.use("/", authRoute)
    app.use("/", musicRoute)
    
    const server = http.createServer(app)
    const port = 4000
    server.listen(port, () => 
    console.log('Server running on port : ',port)
)