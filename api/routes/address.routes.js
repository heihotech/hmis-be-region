const controller = require("../controllers/address.controllers");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/addresses", [], controller.findAllAddresses);

  app.get("/api/addresses/:addressId", [], controller.findAddress);

  app.post("/api/addresses", [], controller.createAddress);

  app.put("/api/addresses/:addressId", [], controller.updateAddress);

  app.delete("/api/addresses/:addressId", [], controller.deleteAddress);
};
