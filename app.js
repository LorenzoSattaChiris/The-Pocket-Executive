/* ----- Loading Packages  ----- */
const compression = require("compression");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const subdomain = require("express-subdomain");
const helmet = require("helmet");
const dotenv = require("dotenv");
const axios = require("axios");

/* ----- Initial Configuration  ----- */
const app = express();

/* ----- Packages  ----- */
app.use(logger("dev"));
app.disable('x-powered-by')
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(compression());
app.use(helmet({ contentSecurityPolicy: false }));
dotenv.config();

/* ----- Loading Routes  ----- */
app.set("view engine", "ejs");
app.engine('ejs', require('ejs').__express);
app.set("views", [__dirname + "/pages", __dirname + "/app",__dirname + "/start",__dirname + "/invest" ]);
app.use(express.static(__dirname + "/public"));

/* ----- SubDomain (Dashboard)  ----- */
const investor_router = express.Router();
app.use(subdomain("investor", investor_router));
const startup_router = express.Router();
app.use(subdomain("startup", startup_router));

/* ----- Loading Files  ----- */
const static = require('./routes/static/static_routes.js');
const investor_routes = require('./routes/dynamic/investor_routes.js');
const startup_routes = require('./routes/dynamic/startup_routes.js');

/* ----- Static Website - Not Logged ----- */
app.use("/", static);

app.get('/api/dictionary/:word', async (req, res) => {
    const word = req.params.word;
    try {
        const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = response.data[0];

        res.json({
            data: data
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data from dictionary API' });
    }
});

/* ----- Dynamy Website - Logged In ----- */
investor_router.use("/", investor_routes);
startup_router.use("/", startup_routes);

const chatgptRouter = require('./routes/utils/chatgpt.js');
app.use('/api', chatgptRouter);

/* ----- Server ----- */
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "production" ? err : {};

    if (req.app.get("env") === "development") {
        // Show detailed error information for developers
        res.status(err.status || 500);
        res.json({
            error: {
                code: err.status || 500,
                name: err.name,
                message: err.message,
                stack: err.stack,
            }
        });
    } else {
        res.status(err.status || 500);
        res.render("error");
    }
});

app.get("*", function (req, res, next) {
    var err = new Error();
    err.status = 404;
    next(err);
});

app.use(function (req, res, next) {
    if (req.secure) {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }
    next();
})

app.use(function (err, req, res, next) {
    if (err.status === 404) {
        res.status(404).render("error");
    } else {
        return next();
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server is listening on: ", port);
});