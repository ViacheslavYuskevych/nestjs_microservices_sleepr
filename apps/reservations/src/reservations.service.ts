import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { from, mergeMap } from 'rxjs';
import { PAYMENTS_SERVICE } from '@app/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly repository: ReservationsRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentService: ClientProxy,
  ) {}

  create(dto: CreateReservationDto) {
    return this.paymentService.send('create_charge', dto.charge).pipe(
      mergeMap(({ id: invoiceId }: { id: string }) => {
        const reservation = this.repository.create({
          ...dto,
          timestamp: new Date(),
          userId: '123',
          invoiceId,
        });

        return from(reservation);
      }),
    );
  }

  findAll() {
    return this.repository.find({});
  }

  findOne(_id: string) {
    return this.repository.findOne({ _id });
  }

  update(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.repository.findOneAndUpdate(
      { _id },
      { $set: updateReservationDto },
    );
  }

  remove(_id: string) {
    return this.repository.findOneAndDelete({ _id });
  }
}
