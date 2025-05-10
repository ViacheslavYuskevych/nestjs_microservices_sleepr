import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { from, mergeMap } from 'rxjs';
import { CreateChargeDataDto, PAYMENTS_SERVICE, UserDto } from '@app/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly repository: ReservationsRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentService: ClientProxy,
  ) {}

  create(dto: CreateReservationDto, { _id: userId, email }: UserDto) {
    const chargeDataDto: CreateChargeDataDto = { charge: dto.charge, email };
    return this.paymentService.send('create_charge', chargeDataDto).pipe(
      mergeMap(({ id: invoiceId }: { id: string }) => {
        const reservation = this.repository.create({
          ...dto,
          timestamp: new Date(),
          userId,
          invoiceId,
        });

        return from(reservation);
      }),
    );
  }

  findAll(userId: string) {
    return this.repository.find({ userId });
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
