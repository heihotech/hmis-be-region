const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/api/test-conn", (req, res) => {
  res.json({ message: "Server Up!" });
});

const db = require("./database/models");
db.sequelize.sync();

require("./api/routes/province.routes")(app);
require("./api/routes/city.routes")(app);
require("./api/routes/district.routes")(app);
require("./api/routes/village.routes")(app);
require("./api/routes/address.routes")(app);

const PORT = process.env.APP_PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
