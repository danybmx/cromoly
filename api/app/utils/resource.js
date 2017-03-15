const errors = require('../errors');

const findAll = (Model) => {
  return (req, res, next) => {
    Model.find()
      .then((data) => res.json(data))
      .catch(next);
  };
};

const findById = (Model) => {
  return (req, res, next) => {
    Model.findById(req.params.id)
      .then((data) => {
        if (!data) return next(errors.notFound);
        return res.json(data);
      })
      .catch(next);
  };
};

const search = (Model) => {
  return (req, res, next) => {
    Model.find(req.body)
      .then((data) => res.json(data))
      .catch(next);
  };
};

const create = (Model) => {
  return (req, res, next) => {
    const model = new Model(req.body);
    model.save()
      .then((data) => res.json({success: true, id: model._id}))
      .catch(next);
  };
};

const update = (Model) => {
  return (req, res, next) => {
    Model.findById(req.params.id).then((data) => {
      if (!data) return next(errors.notFound);
      const updated = Object.assign(data, req.body);
      updated.save()
        .then((data) => res.json({success: true}))
        .catch(next);
    }).catch(next);
  };
};

const remove = (Model) => {
  return (req, res, next) => {
    Model.findById(req.params.id).then((data) => {
      if (!data) return next(errors.notFound);
      data.remove()
        .then((data) => res.json({success: true}))
        .catch(next);
    }).catch(next);
  };
};

module.exports = (Model) => {
  return {
    findAll: findAll(Model),
    findById: findById(Model),
    search: search(Model),
    create: create(Model),
    update: update(Model),
    remove: remove(Model),
  };
};
