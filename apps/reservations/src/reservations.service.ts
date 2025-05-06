import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';

@Injectable()
export class ReservationsService {
  constructor(private readonly repository: ReservationsRepository) {}

  create(createReservationDto: CreateReservationDto) {
    return this.repository.create({
      ...createReservationDto,
      timestamp: new Date(),
      userId: '123',
    });
  }

  findAll() {
    return this.repository.find({});
  }

  findOne(_id: number) {
    return this.repository.findOne({ _id });
  }

  update(_id: number, updateReservationDto: UpdateReservationDto) {
    return this.repository.findOneAndUpdate(
      { _id },
      { $set: updateReservationDto },
    );
  }

  remove(_id: number) {
    return this.repository.findOneAndDelete({ _id });
  }
}
