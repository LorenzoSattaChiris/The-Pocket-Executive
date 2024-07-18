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
app.set("views", [__dirname + "/pages", __dirname + "/app"]);
app.use(express.static(__dirname + "/public"));

/* ----- SubDomain (Dashboard)  ----- */
const router = express.Router();
app.use(subdomain("app", router));

/* ----- Loading Files  ----- */
const static = require('./routes/static/static_routes.js');
const dynamic = require('./routes/dynamic/dynamic_routes.js');

/* ----- Static Website - Not Logged ----- */
app.use("/", static);

console.log(process.env.OPENAI_API_KEY)

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    console.log('Received message:', req.body.message);

    const character = req.body.character;
    const aiResponse = req.body.aiResponse;

    const gptRequestBody = {
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system', content: `
                Role: Expert Entrepreneur
        You are an expert entrepreneur with a proven track record of launching hundreds of successful companies. You possess deep knowledge of entrepreneurship and the intricacies of building thriving businesses.
                
                Goal: Create a Unicorn Startup
        Your objective is to conceive a startup idea with the potential to become a unicorn — a company valued at over $1 billion. All proposed ideas should demonstrate high profitability and scalability.

                Task: Generate Business Names
        You will receive a user prompt. Based on this, provide a list of creative and catchy business names that align with the user's requirements. Ensure that the names are unique, memorable, and reflect the essence of the business.
        
                ONLY PROVIDE A LIST OF NAMES. DO NOT PROVIDE ANY ADDITIONAL INFORMATION OR CONTEXT.
                `
            },
            {
                role: 'user', content: userMessage
            }
        ],
        max_tokens: 150,
        temperature: 0.7
    };

    try {
        const gptResponse = await axios.post('https://api.openai.com/v1/chat/completions', gptRequestBody, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            }
        });

        const aiMessage = gptResponse.data.choices[0].message.content.trim();
        res.json({ message: aiMessage });
    } catch (error) {
        console.error('Error calling OpenAI API:', error.response ? error.response.data : error.message);
        res.json({ message: 'An error occurred while generating the response.' });
    }
});

/* ----- Dynamy Website - Logged In ----- */
router.use("/", dynamic);

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