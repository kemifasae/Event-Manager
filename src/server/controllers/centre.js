import CentreValidator from '../middlewares/centrevalidate';


const Event = require('../models').Event;
const Centre = require('../models').Centre;


export default class CentreController {
  static addNew(request, response) {
    return Centre
      .find({
        where: {
          Name: request.body.name,
          buildingNo: request.body.buildingNo,
          city: request.body.city,
          state: request.body.state,
          country: request.body.country
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
      })
      .then((centre) => {
        if (!centre) {
          if (CentreValidator.validateCentre) {
            return Centre
              .create({
                Name: request.body.name,
                buildingNo: request.body.buildingNo,
                city: request.body.city,
                state: request.body.state,
                country: request.body.country,
                pixUrl: request.body.pixUrl,
                available: request.body.available
              })
              .then(newCentre => response.status(201).send({
                message: 'New Centre Added Successfully',
                data: newCentre,
              }))
              .catch(error => response.status(500).send(error.toString()));
          }
        }
        response.status(400).json({
          status: 'Exists!!',
          message: 'Sorry!! Centre already exists.'
        });
      })
      .catch(error => response.status(500).send(error.toString()));
  }
  // get all centres
  static getAllCentres(request, response) {
    Centre.findAll({
      include: [{
        model: Event
      }],
    })
      .then((result) => {
        if (result.length === 0) {
          response.status(200).send(json({
            status: 'Empty',
            message: 'There are no centres!!'
          }));
        }
        response.status(200).send(json({
          status: 'Successful',
          data: result
        }));
      })
      .catch(error => response.status(500).send(error.toString()));
  }

  static getOneCentre(request, response) {
    const centreId = parseInt(request.params.id);
    Event.findOne({
      where: { id: centreId },
    })
      .then((centre) => {
        if (!centre) {
          return response.status(404).json({
            status: 'Unsuccessful',
            message: 'No centre like this',
          });
        }
        response.status(200).json({
          status: 'Successful',
          data: centre,
        });
      });
  }

  static updateCentre(request, response) {
    const centreId = parseInt(request.params.id);
    Centre.findById(centreId)
      .then((centre) => {
        if (centre) {
          if (CentreValidator.isAdminCheck(request, response)) {
            Centre.find({
              where: {
                Name: request.body.name,
                buildingNo: request.body.buildingNo,
                city: request.body.city,
                state: request.body.state,
                country: request.body.country,
                pixUrl: request.body.pixUrl,

              }
            }).then((existingCentre) => {
              if (!existingCentre) {
                return centre
                  .update({
                    Name: request.body.name || centre.name,
                    buildingNo: request.body.buildingNo || centre.buildingNo,
                    city: request.body.city || centre.city,
                    state: request.body.state || centre.state,
                    country: request.body.country || centre.country,
                    pixUrl: request.body.pixUrl || centre.pixUrl,
                    available: request.body.available || centre.available
                  })
                  .then((updatedCentre) => {
                    response.status(200).send({
                      status: 'Successful',
                      data: `${updatedCentre.Name} has been updated`,
                    });
                  }).catch((error => response.status(500).send(error.toString())));
              }
              response.status(404).json({
                status: 'Unsuccessful',
                message: 'Centre not found',
              });
            }).catch((err => response.status(500).send(err.toString())));
          }
        }
      })
      .catch((err => response.status(404).send(err.toString())));
  }

  static deleteCentre(request, response) {
    const centreId = parseInt(request.params.id);
    Event.findById(centreId)
      .then((centre) => {
        if (centre) {
          if (CentreValidator.isAdminCheck(request, response)) {
            return centre
              .destroy()
              .then(() => response.status(200).send({
                status: 'Successful',
                message: `${centre.name} has been deleted`
              }))
              .catch(err => response.status(500).send(err.toString()));
          }
        }
        response.status(404).json({
          status: 'Unsuccessful',
          message: 'Event doesn\'t exist',
        });
      })
      .catch(error => response.status(500).send(error.toString()));
  }
}
