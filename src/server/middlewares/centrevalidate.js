import Validator from 'validatorjs';

const centreRules = {
  centreId: 'required',
  Name: 'required|between:8,90',
  buildingNo: 'integer',
  city: 'required|between:3,10',
  State: 'required|between:3,10',
  country: 'required|between:3,10',
  pixUrl: 'required',
  available: 'required'
};
const updateRules = {
  centreId: 'integer',
  Name: 'between:8,90',
  buildingNo: 'integer',
  city: 'between:3,10',
  State: 'between:3,10',
  country: 'between:3,10',
  available: 'required'
};


export default class CentreValidator {
  static validateCentre(request, response) {
    const validate = new Validator(request.body, centreRules);
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

  static isAdminCheck(request, response) {
    if ((request.loggedInUser.isAdmin !== 1)) {
      response.status(403).send({
        message: 'Only admin can edit centre details',
      });
      return false;
    }
    return true;
  }
}
