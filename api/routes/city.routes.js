const controller = require("../controllers/city.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/cities",
    [
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.findAllCity
  );

  app.get(
    "/api/cities/:cityId",
    [
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.findCity
  );

  app.post(
    "/api/cities",
    [
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.createCity
  );

  app.put(
    "/api/cities/:cityId",
    [
      //   joiValidate.validate(joiValidate.schemas.category.categoryUpdatePOST),
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.updateCity
  );

  app.delete(
    "/api/cities/:cityId",
    [
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.deleteCity
  );
};
