import EventValidator from '../middlewares/eventvalidate';


const Event = require('../models').Event;
const Centre = require('../models').Centre;
const User = require('../models').User;


export default class EventController {
  static addNew(request, response) {
    return Event
      .find({
        where: {
          date: request.body.date,
          venue: request.body.venue
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
      })
      .then((recipe) => {
        if (!recipe) {
          if (EventValidator.validateEvent(request, response)) {
            return Event
              .create({
                Theme: request.body.theme,
                userId: request.loggedInUser.id,
                caption: request.body.caption,
                date: request.body.date,
                venue: request.body.venue,
                time: request.body.time
              })
              .then(newEvent => response.status(201).send({
                message: 'New Event Added Successfully',
                data: newEvent,
              }))
              .catch(error => response.status(500).send(error.toString()));
          }
        }
        response.status(400).json({
          status: 'Exists!!',
          message: 'Sorry!! Venue fixed for that date.'
        });
      })
      .catch(error => response.status(500).send(error.toString()));
  }
  // get all events
  static getMyEvents(request, response) {
    const UserId = parseInt(request.params.userId);
    Event.findAll({
      where: {
        userId: UserId
      }
    })
      .then((result) => {
        if (result.length === 0) {
          response.status(200).send(json({
            status: 'Empty',
            message: 'You haven\'t added any event'
          }));
        }
        response.status(200).send(json({
          status: 'Successful',
          data: result
        }));
      })
      .catch(error => response.status(500).send(error.toString()));
  }

  static getOneEvent(request, response) {
    const requestId = parseInt(request.params.id);
    Event.findOne({
      where: { id: requestId },
    })
      .then((event) => {
        if (!event) {
          return response.status(404).json({
            status: 'Unsuccessful',
            message: 'You haven\'t added such event',
          });
        }
        response.status(200).json({
          status: 'Successful',
          data: event,
        });
      });
  }

  static updateEvent(request, response) {
    const eventId = parseInt(request.params.id);
    Event.findById(eventId)
      .then((event) => {
        if (event) {
          if (EventValidator.allowUpdate(request, response, event.userId)) {
            Event.find({
              where: {
                date: request.body.date,
                venue: request.body.venue
              }
            }).then((existingEvent) => {
              if (!existingEvent) {
                return event
                  .update({
                    Theme: request.body.theme || event.theme,
                    userId: request.loggedInUser.id,
                    caption: request.body.caption || event.caption,
                    date: request.body.date,
                    venue: request.body.venue,
                    time: request.body.time
                  })
                  .then((updatedEvent) => {
                    response.status(200).send({
                      status: 'Successful',
                      data: `${updatedEvent.theme} has been updated`,
                    });
                  }).catch((error => response.status(500).send(error.toString())));
              }
              response.status(400).json({
                status: 'Unsuccessful',
                message: 'Venue not available for that date',
              });
            }).catch((err => response.status(500).send(err.toString())));
          }
        }
        response.status(404).json({
          status: 'Unsuccessful',
          message: 'Event not found',
        });
      })
      .catch((err => response.status(404).send(err.toString())));
  }

  static deleteEvent(request, response) {
    const eventId = parseInt(request.params.id);
    Event.findById(eventId)
      .then((event) => {
        if (event) {
          if (EventValidator.allowDelete(request, response, event.userId)) {
            return event
              .destroy()
              .then(() => response.status(200).send({
                status: 'Successful',
                message: `${event.theme} has been deleted`
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
