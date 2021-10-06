const controller = require("../controllers/village.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/villages",
    [
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.findAllVillages
  );

  app.get(
    "/api/villages/:villageId",
    [
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.findVillage
  );

  app.post(
    "/api/villages",
    [
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.createVillage
  );

  app.put(
    "/api/villages/:villageId",
    [
      //   joiValidate.validate(joiValidate.schemas.category.categoryUpdatePOST),
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.updateVillage
  );

  app.delete(
    "/api/villages/:villageId",
    [
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.deleteVillage
  );
};
