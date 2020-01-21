import Validator from 'validatorjs';

const eventRules = {
  Theme: 'required|between:8,90',
  userId: 'required|integer',
  caption: 'between:8,140',
  date: DataTypes.DATE,
  venue: 'required|integer',
  time: DataTypes.TIME
};
const updateRules = {
  Theme: 'required|between:8,90',
  userId: 'integer',
  caption: 'between:8,140',
  date: DataTypes.DATE,
  venue: 'integer',
  time: DataTypes.TIME
};


export default class EventValidator {
  static validateEvent(request, response) {
    const validate = new Validator(request.body, eventRules);
    if (validate.passes()) {
      return true;
    }
    response.status(400).json({
      status: 'Unsuccessful',
      message: 'Invalid data input',
      errors: validate.errors.all(),
    });
    return false;
  }

  static validateUpdate(request, response) {
    const validate = new Validator(request.body, updateRules);
    if (validate.passes()) {
      return true;
    }
    response.status(400).json({
      status: 'Unsuccessful',
      message: 'Invalid data input',
      errors: validate.errors.all(),
    });
    return false;
  }

  static allowUpdate(request, response, userId) {
    if (request.loggedInUser.id !== parseInt(userId)) {
      response.status(403).send({
        message: 'You didn\'t add this event, you cannot edit',
      });
      return false;
    }
    return true;
  }
  static allowDelete(request, response, userId) {
    if (request.loggedInUser.id !== parseInt(userId)) {
      response.status(403).send({
        message: 'You cannot delete event that isn\'t yours',
      });
      return false;
    }
    return true;
  }
}
