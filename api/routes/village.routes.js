const controller = require("../controllers/village.controllers");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/villages", [], controller.findAllVillages);

  app.get("/api/villages/:villageId", [], controller.findVillage);

  app.post("/api/villages", [], controller.createVillage);

  app.put("/api/villages/:villageId", [], controller.updateVillage);

  app.delete("/api/villages/:villageId", [], controller.deleteVillage);

  app.delete("/api/villages/:villageId/restore", [], controller.restoreVillage);
};
