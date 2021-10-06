const controller = require("../controllers/city.controllers");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/cities", [], controller.findAllCity);

  app.get("/api/cities/:cityId", [], controller.findCity);

  app.post("/api/cities", [], controller.createCity);

  app.put("/api/cities/:cityId", [], controller.updateCity);

  app.delete("/api/cities/:cityId", [], controller.deleteCity);
};
