const db = require("../../database/models");
const { Province, City } = require("../../database/models");
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

exports.findAllProvinces = async (req, res) => {
  const { page, size, name, order, orderField, isInactive } = req.query;

  var condition = [];

  var nameCondition = null;

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

  await Province.findAndCountAll({
    where: { [Op.and]: condition },
    limit,
    offset,
    order: [[orderField ? orderField : "createdAt", order ? order : "DESC"]],
    attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
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

exports.findProvince = async (req, res) => {
  await Province.findByPk(req.params.provinceId, {
    include: {
      model: City,
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
    },
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

exports.createProvince = async (req, res) => {
  const province = {
    name: req.body.name,
  };

  db.sequelize
    .transaction(async (t) => {
      const createdProvince = await Province.create(province, {
        transaction: t,
      });
      return createdProvince;
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

exports.updateProvince = async (req, res) => {
  const id = req.params.provinceId;
  const province = {
    name: req.body.name,
  };

  db.sequelize
    .transaction(async (t) => {
      const updatedProvince = await Province.update(province, {
        where: { id: id },
        transaction: t,
      });
      return updatedProvince;
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

exports.deleteProvince = async (req, res) => {
  const id = req.params.provinceId;
  db.sequelize
    .transaction(async (t) => {
      const deletedProvince = await Province.destroy({
        where: { id: id },
        transaction: t,
      });
      return deletedProvince;
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
