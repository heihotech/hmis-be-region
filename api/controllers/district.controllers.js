const db = require("../../database/models");
const { District, City, Village, Province } = require("../../database/models");
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

exports.findAllDistricts = async (req, res) => {
  const { page, size, name, cityId, order, orderField, isInactive } = req.query;

  var condition = [];

  var nameCondition = null;
  var cityCondition = null;

  if (cityId) {
    cityCondition = {
      cityId: { [Op.eq]: cityId },
    };
    condition.push(cityCondition);
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

  await District.findAndCountAll({
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

exports.findDistrict = async (req, res) => {
  await District.findByPk(req.params.districtId, {
    include: [
      {
        model: City,
        include: {
          model: Province,
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

exports.createDistrict = async (req, res) => {
  const district = {
    name: req.body.name,
    cityId: req.body.cityId,
  };

  db.sequelize
    .transaction(async (t) => {
      const createdDistrict = await District.create(district, {
        transaction: t,
      });
      return createdDistrict;
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

exports.updateDistrict = async (req, res) => {
  const id = req.params.districtId;
  const district = {
    name: req.body.name,
  };

  db.sequelize
    .transaction(async (t) => {
      const updatedDistrict = await District.update(district, {
        where: { id: id },
        transaction: t,
      });
      return updatedDistrict;
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

exports.deleteDistrict = async (req, res) => {
  const id = req.params.districtId;
  db.sequelize
    .transaction(async (t) => {
      const deletedDistrict = await District.destroy({
        where: { id: id },
        transaction: t,
      });
      return deletedDistrict;
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

exports.restoreDistrict = async (req, res) => {
  const id = req.params.districtId;
  db.sequelize
    .transaction(async (t) => {
      const restoredDistrict = await District.restore({
        where: { id: id },
        transaction: t,
      });
      return restoredDistrict;
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
