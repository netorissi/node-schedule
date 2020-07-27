import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import CreateApointmentService from './create';

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateApointmentService(
      fakeAppointmentsRepository,
    );

    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '123123',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123123');
  });

  it('should not be able to create a new appointment on same time', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateApointmentService(
      fakeAppointmentsRepository,
    );
    const today = new Date();

    try {
      await createAppointment.execute({
        date: today,
        provider_id: '11111',
      });

      await createAppointment.execute({
        date: today,
        provider_id: '22222',
      });
    } catch (e) {
      expect(e.statusCode).toEqual(400);
    }
  });
});
