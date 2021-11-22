const db = require("../../database/models");
const {
  Address,
  Village,
  District,
  City,
  Province,
} = require("../../database/models");
const moment = require("moment");
const Op = db.Sequelize.Op;

const getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: items } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  // for (const key in items) {
  //   items[key].dataValues.createdAtFormatted = moment(
  //     items[key].createdAt
  //   ).format("Do MMMM YYYY HH:mm:ss");
  //   items[key].dataValues.updatedAtFormatted = moment(
  //     items[key].updatedAt
  //   ).format("Do MMMM YYYY HH:mm:ss");
  // }

  return { totalItems, items, totalPages, currentPage };
};

exports.findAllAddresses = async (req, res) => {
  const {
    page,
    size,
    zipCode,
    phoneNumber,
    villageId,
    order,
    orderField,
    isInactive,
  } = req.query;

  var condition = [];

  var zipCodeCondition = null;
  var villageCondition = null;
  var phoneNumberCondition = null;

  if (villageId) {
    villageCondition = {
      villageId: { [Op.eq]: villageId },
    };
    condition.push(villageCondition);
  }

  if (phoneNumber) {
    phoneNumberCondition = {
      phone: { [Op.eq]: phoneNumber },
    };
    condition.push(phoneNumberCondition);
  }

  if (zipCode) {
    zipCodeCondition = {
      [Op.or]: [
        { zipCode: { [Op.eq]: zipCode } },
        { zipCode: { [Op.iLike]: `%${zipCode}%` } },
      ],
    };
    condition.push(zipCodeCondition);
  }

  const { limit, offset } = getPagination(page, size);

  await Address.findAndCountAll({
    where: { [Op.and]: condition },
    include: [
      {
        model: Village,
        include: {
          model: District,
          include: {
            model: City,
            include: {
              model: Province,
            },
          },
        },
      },
    ],
    limit,
    offset,
    order: [[orderField ? orderField : "createdAt", order ? order : "DESC"]],
    paranoid: isInactive === "true" && isInactive != null ? false : true,
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving.",
      });
    });
};

exports.findAddress = async (req, res) => {
  await Address.findByPk(req.params.addressId, {
    include: [
      {
        model: Village,
        include: {
          model: District,
          include: {
            model: City,
            include: {
              model: Province,
            },
          },
        },
      },
    ],
  })
    .then((data) => {
      if (data != null) {
        res.send(data);
      } else {
        res.send({});
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating, transaction rolled back.",
      });
    });
};

exports.createAddress = async (req, res) => {
  const address = {
    fullAddress: req.body.fullAddress,
    rt: req.body.rt,
    rw: req.body.rw,
    zipCode: req.body.zipCode,
    phone: req.body.phone,
    villageId: req.body.villageId,
  };

  db.sequelize
    .transaction(async (t) => {
      const createdAddress = await Address.create(address, {
        transaction: t,
      });
      return createdAddress;
    })
    .then((data) => {
      res.send({
        data,
        status: 1,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating, transaction rolled back.",
      });
    });
};

exports.updateAddress = async (req, res) => {
  const id = req.params.addressId;
  const address = {};

  if (req.body.fullAddress) {
    address.fullAddress = req.body.fullAddress;
  }
  if (req.body.rt) {
    address.rt = req.body.rt;
  }
  if (req.body.rw) {
    address.rw = req.body.rw;
  }
  if (req.body.zipCode) {
    address.zipCode = req.body.zipCode;
  }
  if (req.body.phone) {
    address.phone = req.body.phone;
  }
  if (req.body.villageId) {
    address.villageId = req.body.villageId;
  }

  db.sequelize
    .transaction(async (t) => {
      const updatedAddress = await Address.update(address, {
        where: { id: id },
        transaction: t,
      });
      return updatedAddress;
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "updated successfully.",
          id,
          status: 1,
        });
      } else {
        res.send({
          message: `Cannot update!`,
          id,
          status: 0,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while updating, transaction rolled back.",
      });
    });
};

exports.deleteAddress = async (req, res) => {
  const id = req.params.addressId;
  db.sequelize
    .transaction(async (t) => {
      const deletedAddress = await Address.destroy({
        where: { id: id },
        transaction: t,
      });
      return deletedAddress;
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "deleted successfully!",
          id,
          status: 1,
        });
      } else {
        res.send({
          message: `Cannot delete!`,
          id,
          status: 0,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err,
      });
    });
};

exports.restoreAddress = async (req, res) => {
  const id = req.params.addressId;
  db.sequelize
    .transaction(async (t) => {
      const restoredAddress = await Address.restore({
        where: { id: id },
        transaction: t,
      });
      return restoredAddress;
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "restored successfully!",
          id,
          status: 1,
        });
      } else {
        res.send({
          message: `Cannot restore!`,
          id,
          status: 0,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err,
      });
    });
};
