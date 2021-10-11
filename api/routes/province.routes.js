const controller = require("../controllers/province.controllers");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/provinces", [], controller.findAllProvinces);

  app.get("/api/provinces/:provinceId", [], controller.findProvince);

  app.post("/api/provinces", [], controller.createProvince);

  app.put("/api/provinces/:provinceId", [], controller.updateProvince);

  app.delete("/api/provinces/:provinceId", [], controller.deleteProvince);

  app.delete(
    "/api/provinces/:provinceId/restore",
    [],
    controller.restoreProvince
  );
};
