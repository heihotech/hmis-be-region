const controller = require("../controllers/district.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/districts",
    [
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.findAllDistricts
  );

  app.get(
    "/api/districts/:districtId",
    [
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.findDistrict
  );

  app.post(
    "/api/districts",
    [
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.createDistrict
  );

  app.put(
    "/api/districts/:districtId",
    [
      //   joiValidate.validate(joiValidate.schemas.category.categoryUpdatePOST),
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.updateDistrict
  );

  app.delete(
    "/api/districts/:districtId",
    [
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.deleteDistrict
  );
};
