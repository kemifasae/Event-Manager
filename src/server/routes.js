import UserController from './controllers/user';
import EventController from './controllers/event';
import CentreController from './controllers/centre';

const Route = (app) => {
  // Endpoints for users
  app.post('/api/v1/users/login', UserController.login);
  app.post('/api/v1/users/signUp', UserController.create);

  // Endpoints for Events
  app.post('/api/v1/events', Middleware.authorize, EventController.addNew);
  app.get('/api/v1/userId/events', EventController.getMyEvents);

  // Get one event
  app.get('/api/v1/events/:id', EventController.getOneEvent);

  // update event
  app.put(
    '/api/v1/events/:id', Middleware.authorize,
    EventController.updateEvent
  );
  // delete event
  app.delete(
    '/api/v1/events/:id', Middleware.authorize,
    EventController.deleteEvent
  );


  // Endpoints for centers
  app.post('/api/v1/centres', Middleware.authorize, CentreController.addNew);
  app.get('/api/v1/centres', CentreController.getAllCentres);

  // Get one centre
  app.get('/api/v1/centres/:id', CentreController.getOneCentre);

  // update centre
  app.put(
    '/api/v1/events/:id', Middleware.authorize,
    CentreController.updateCentre
  );
  // delete centre
  app.delete(
    '/api/v1/centres/:id', Middleware.authorize,
    CentreController.deleteCentre
  );
};
export default Route;
