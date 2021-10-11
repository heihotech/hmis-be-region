const controller = require("../controllers/district.controllers");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/districts", [], controller.findAllDistricts);

  app.get("/api/districts/:districtId", [], controller.findDistrict);

  app.post("/api/districts", [], controller.createDistrict);

  app.put("/api/districts/:districtId", [], controller.updateDistrict);

  app.delete("/api/districts/:districtId", [], controller.deleteDistrict);

  app.delete(
    "/api/districts/:districtId/restore",
    [],
    controller.restoreDistrict
  );
};
