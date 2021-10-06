const controller = require("../controllers/address.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/addresses",
    [
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.findAllAddresses
  );

  app.get(
    "/api/addresses/:addressId",
    [
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.findAddress
  );

  app.post(
    "/api/addresses",
    [
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.createAddress
  );

  app.put(
    "/api/addresses/:addressId",
    [
      //   joiValidate.validate(joiValidate.schemas.category.categoryUpdatePOST),
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.updateAddress
  );

  app.delete(
    "/api/addresses/:addressId",
    [
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.deleteAddress
  );
};
