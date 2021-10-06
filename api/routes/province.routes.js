const controller = require("../controllers/province.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/provinces",
    [
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.findAllProvinces
  );

  app.get(
    "/api/provinces/:provinceId",
    [
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.findProvince
  );

  app.post(
    "/api/provinces",
    [
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.createProvince
  );

  app.put(
    "/api/provinces/:provinceId",
    [
      //   joiValidate.validate(joiValidate.schemas.category.categoryUpdatePOST),
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.updateProvince
  );

  app.delete(
    "/api/provinces/:provinceId",
    [
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.deleteProvince
  );
};
