import { Router } from 'express';

import authenticator from '@modules/users/infra/http/middlewares/authenticator';
import AppointmentsController from '@modules/appointments/infra/http/controllers/AppointmentsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();

appointmentsRouter.use(authenticator);

appointmentsRouter.post('/', appointmentsController.create);

export default appointmentsRouter;
