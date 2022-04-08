import { BaseEntityUuid, Food, Pet } from '@kibbel/entities';
import type { ObjectDescription, OidcClaims } from '@kibbel/shared';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

// Entities and Type Definitions ----------------------------------------------
// TypeOrm decorators:     @Entity, @[*]Column, @[*]To[*]
// TypeGraphQL decorators: @ObjectType, @Field

// Field names and descriptions conform to Standard OpenID Connect claims
// https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims

// Shared TypeGraphQL descriptions and TypeORM comments
const description: ObjectDescription<
  OidcClaims.Standard,
  | 'name'
  | 'nickname'
  | 'picture'
  | 'email'
  | 'email_verified'
  | 'birthdate'
  | 'locale'
> = {
  name: 'End-User’s full name in displayable form including all name parts, possibly including titles and suffixes, ordered according to the End-User’s locale and preferences.',
  nickname:
    'Casual name of the End-User that may or may not be the same as the given_name. For instance, a nickname value of Mike might be returned alongside a given_name value of Michael.',
  picture:
    'URL of the End-User’s profile picture. This URL MUST refer to an image file (for example, a PNG, JPEG, or GIF image file), rather than to a Web page containing an image. Note that this URL SHOULD specifically reference a profile photo of the End-User suitable for displaying when describing the End-User, rather than an arbitrary photo taken by the End-User.',
  email:
    'End-User’s preferred e-mail address. Its value MUST conform to the RFC 5322 [RFC5322] addr-spec syntax. The RP MUST NOT rely upon this value being unique.',
  email_verified:
    'True if the End-User’s e-mail address has been verified; otherwise false. When this Claim Value is true, this means that the OP took affirmative steps to ensure that this e-mail address was controlled by the End-User at the time the verification was performed. The means by which an e-mail address is verified is context-specific, and dependent upon the trust framework or contractual agreements within which the parties are operating.',
  birthdate:
    "End-User's birthday, represented as an ISO 8601:2004 [ISO8601‑2004] YYYY-MM-DD format. The year MAY be 0000, indicating that it is omitted. To represent only the year, YYYY format is allowed. Note that depending on the underlying platform's date related function, providing just year can result in varying month and day, so the implementers need to take this factor into account to correctly process the dates.",
  locale:
    'End-User’s locale, represented as a BCP47 [RFC5646] language tag. This is typically an ISO 639-1 Alpha-2 [ISO639‑1] language code in lowercase and an ISO 3166-1 Alpha-2 [ISO3166‑1] country code in uppercase, separated by a dash. For example, en-US or fr-CA.',
};

@Entity()
@ObjectType({ description: 'User Schema' })
class User extends BaseEntityUuid implements OidcClaims.Standard {
  @Field({
    description: description.name,
  })
  @Column({ comment: description.name })
  name!: string;

  @Field({
    description: description.nickname,
  })
  @Column({ comment: description.nickname })
  nickname!: string;

  @Field({
    nullable: true,
    description: description.picture,
  })
  @Column({ nullable: true, comment: description.picture })
  picture?: string;

  @Field({
    description: description.email,
  })
  @Column({ unique: true, comment: description.email })
  email!: string;

  @Field({
    description: description.email_verified,
  })
  @Column({ comment: description.email_verified, default: false })
  email_verified!: boolean;

  @Field({
    description: description.birthdate,
  })
  @Column({ comment: description.birthdate, default: new Date('2000-01-01') })
  birthdate!: Date;

  @Field({ nullable: true, description: description.locale })
  @Column({ nullable: true, comment: description.locale })
  locale?: string;

  @Column()
  password!: string;

  // Relational fields

  // User can have many pets
  @Field(() => [Pet], {
    description: 'End user’s saved pets',
  })
  @OneToMany(() => Pet, (pet) => pet.user)
  pets!: Pet[];

  // Many users can favorite many foods
  @Field(() => [Food], {
    description: 'End user’s favorited or self-created pet foods',
  })
  @ManyToMany(() => Food)
  @JoinTable({
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'food_id' },
  })
  favorite_foods!: Food[];
}

@ObjectType({ description: 'Authenticated User Response' })
class AuthenticationResponse {
  @Field(() => User, { description: 'The User', nullable: true })
  user?: User;
  @Field({ description: 'Base64 encoded JSON Web Token (JWT) Access Token' })
  token!: string;
  @Field({
    description: 'Base64 encoded JSON Web Token (JWT) Refresh Token',
    nullable: true,
  })
  refresh_token?: string;
}

export default User;
export { User, AuthenticationResponse };
