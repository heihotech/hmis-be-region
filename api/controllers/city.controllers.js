const db = require("../../database/models");
const { City, Province, District } = require("../../database/models");
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

exports.findAllCity = async (req, res) => {
  const { page, size, name, provinceId, order, orderField, isInactive } =
    req.query;

  var condition = [];

  var nameCondition = null;
  var provinceCondition = null;

  if (provinceId) {
    provinceCondition = {
      provinceId: { [Op.eq]: provinceId },
    };
    condition.push(provinceCondition);
  }

  if (name) {
    nameCondition = {
      [Op.or]: [
        { name: { [Op.eq]: name } },
        { name: { [Op.iLike]: `%${name}%` } },
      ],
    };
    condition.push(nameCondition);
  }

  const { limit, offset } = getPagination(page, size);

  await City.findAndCountAll({
    where: { [Op.and]: condition },
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

exports.findCity = async (req, res) => {
  await City.findByPk(req.params.cityId, {
    include: [
      {
        model: Province,
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

exports.createCity = async (req, res) => {
  const city = {
    name: req.body.name,
    provinceId: req.body.provinceId,
  };

  db.sequelize
    .transaction(async (t) => {
      const createdCity = await City.create(city, {
        transaction: t,
      });
      return createdCity;
    })
    .then((data) => {
      res.send({ data, status: 1 });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating, transaction rolled back.",
      });
    });
};

exports.updateCity = async (req, res) => {
  const id = req.params.cityId;
  const city = {
    name: req.body.name,
  };

  db.sequelize
    .transaction(async (t) => {
      const updatedCity = await City.update(city, {
        where: { id: id },
        transaction: t,
      });
      return updatedCity;
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

exports.deleteCity = async (req, res) => {
  const id = req.params.cityId;
  db.sequelize
    .transaction(async (t) => {
      const deletedCity = await City.destroy({
        where: { id: id },
        transaction: t,
      });
      return deletedCity;
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

exports.restoreCity = async (req, res) => {
  const id = req.params.cityId;
  db.sequelize
    .transaction(async (t) => {
      const restoredCity = await City.restore({
        where: { id: id },
        transaction: t,
      });
      return restoredCity;
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
