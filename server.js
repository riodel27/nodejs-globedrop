require("dotenv").config();

const bodyParser = require("body-parser");
const compression = require("compression");
const express = require("express");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");

const config = require("./config")[process.env.NODE_ENV || "development"];
const db = require("./db");
const swaggerSpec = require("./utils/swagger");

const { normalizePort } = require("./utils/helper");

// /*routes*/
// const organization = require("./routes/organization.route");
// const user = require("./routes/user.route");

const port = normalizePort(config.port || "3000");

db.connect(config.database.url)
  .then(() => {
    //logger
    console.log("connected to the database");
  })
  .catch((error) => {
    console.log(error.message);
  });

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(helmet());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(cors);

app.get("/", (_, res) => res.send("NGO Directory App"));

// /*routes*/
// app.use(organization);
// app.use(user);

// error
app.use((err, req, res, next) => {
  // Fallback to default node handler
  if (res.headersSent) {
    next(err);
    return;
  }

  console.log("error: ", err.message);

  if (err.code === "BAD_USER_INPUT") {
    const errors = JSON.parse(err.message);
    // res.status(err.status || 422).json(_isArray(errors) ? { errors } : errors);
    return;
  }

  if (err.code === "BAD_INPUT") {
    const errors = JSON.parse(err.message);
    res.status(err.status || 422).json({ errors });
    return;
  }

  res.status(err.status || 500);
  res.json({ error: err.message });
});

app.listen({ port }, () => console.log("Server running at: ", port));
