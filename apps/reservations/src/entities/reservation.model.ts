import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Directive('@key(fields: "_id")')
export class Reservation {
  @Field(() => ID)
  _id!: string;

  @Field()
  timestamp!: Date;

  @Field()
  startDate!: Date;

  @Field()
  endDate!: Date;

  @Field()
  userId!: string;
}
