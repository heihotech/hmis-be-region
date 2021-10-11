const db = require("../../database/models");
const { Village, District, City, Province } = require("../../database/models");
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

exports.findAllVillages = async (req, res) => {
  const { page, size, name, districtId, order, orderField, isInactive } =
    req.query;

  var condition = [];

  var nameCondition = null;
  var districtCondition = null;

  if (districtId) {
    districtCondition = {
      districtId: { [Op.eq]: districtId },
    };
    condition.push(districtCondition);
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

  await Village.findAndCountAll({
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

exports.findVillage = async (req, res) => {
  await Village.findByPk(req.params.villageId, {
    include: [
      {
        model: District,
        include: {
          model: City,
          include: {
            model: Province,
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

exports.createVillage = async (req, res) => {
  const village = {
    name: req.body.name,
    districtId: req.body.districtId,
  };

  db.sequelize
    .transaction(async (t) => {
      const createdVillage = await Village.create(village, {
        transaction: t,
      });
      return createdVillage;
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

exports.updateVillage = async (req, res) => {
  const id = req.params.villageId;
  const village = {
    name: req.body.name,
  };

  db.sequelize
    .transaction(async (t) => {
      const updatedVillage = await Village.update(village, {
        where: { id: id },
        transaction: t,
      });
      return updatedVillage;
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

exports.deleteVillage = async (req, res) => {
  const id = req.params.villageId;
  db.sequelize
    .transaction(async (t) => {
      const deletedVillage = await Village.destroy({
        where: { id: id },
        transaction: t,
      });
      return deletedVillage;
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

exports.restoreVillage = async (req, res) => {
  const id = req.params.villageId;
  db.sequelize
    .transaction(async (t) => {
      const restoredVillage = await Village.restore({
        where: { id: id },
        transaction: t,
      });
      return restoredVillage;
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
