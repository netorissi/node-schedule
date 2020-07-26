import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import AppError from '../../../shared/errors/AppError';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import Appointment from '../entities/Appointment';

interface Request {
  date: Date;
  provider_id: string;
}

class Create {
  public async execute({ date, provider_id }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate)
      throw new AppError('Appointment already exist.');

    const appointment = appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default Create;
