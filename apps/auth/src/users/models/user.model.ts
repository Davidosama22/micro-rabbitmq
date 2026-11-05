import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Directive('@key(fields: "_id")')
export class User {
  @Field(() => ID)
  _id!: string;

  @Field()
  email!: string;
}
