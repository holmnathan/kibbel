import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as integer. Type represents date and time as number of milliseconds from start of UNIX epoch. */
  Timestamp: any;
};

/** Privacy respecting list of all users */
export type AllUsersResponse = {
  __typename?: 'AllUsersResponse';
  /** End-User’s preferred e-mail address. Its value MUST conform to the RFC 5322 [RFC5322] addr-spec syntax. The RP MUST NOT rely upon this value being unique. */
  email: Scalars['String'];
  /** Casual name of the End-User that may or may not be the same as the given_name. For instance, a nickname value of Mike might be returned alongside a given_name value of Michael. */
  nickname: Scalars['String'];
};

/** Authenticated User Response */
export type AuthenticationResponse = {
  __typename?: 'AuthenticationResponse';
  id_token: Scalars['String'];
  /** Sets a browser cookie named "kibbel" with a Base64 encoded JSON Web Token (JWT) Refresh Token */
  refresh_token: Scalars['Boolean'];
  /** Base64 encoded JSON Web Token (JWT) Access Token */
  token: Scalars['String'];
};

/** Dietary Restrictions Schema */
export type DietRestriction = {
  __typename?: 'DietRestriction';
  createdAt: Scalars['Timestamp'];
  foods: Array<Food>;
  id: Scalars['ID'];
  name: Scalars['String'];
  pets: Array<Pet>;
  updatedAt: Scalars['Timestamp'];
};

/** Food Schema */
export type Food = {
  __typename?: 'Food';
  /** The calories per kilogram of pet food */
  caloriesPerKg: Scalars['Float'];
  createdAt: Scalars['Timestamp'];
  dietRestrictions: Array<DietRestriction>;
  /** The pet food flavor or recipe (ex. “Turkey and Duck”) */
  flavor?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** The pet food manufacturer */
  manufacturer?: Maybe<Scalars['String']>;
  /** The pet food brand name or product line */
  name: Scalars['String'];
  updatedAt: Scalars['Timestamp'];
  /** The pet food product or manufacturer URL */
  url?: Maybe<Scalars['String']>;
  users: Array<User>;
};

/** Authenticated User Information */
export type IdTokenResponse = {
  __typename?: 'IDTokenResponse';
  /** Base64 encoded JSON Web Token (JWT) User ID Token */
  id_token: Scalars['String'];
  user?: Maybe<User>;
};

/** Meal Schema */
export type Meal = {
  __typename?: 'Meal';
  createdAt: Scalars['Timestamp'];
  id: Scalars['ID'];
  mealPlan: MealPlan;
  name?: Maybe<Scalars['String']>;
  servings: Array<Serving>;
  /** User defined sort order within a meal plan */
  sortOrder: Scalars['Float'];
  updatedAt: Scalars['Timestamp'];
};

/** Meal Plan Schema */
export type MealPlan = {
  __typename?: 'MealPlan';
  createdAt: Scalars['Timestamp'];
  id: Scalars['ID'];
  meals: Array<Meal>;
  name: Scalars['String'];
  pets: Array<Pet>;
  updatedAt: Scalars['Timestamp'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Authorizes an end user, and sets OIDC tokens */
  authorize: AuthenticationResponse;
  changePassword: User;
  createUser: User;
  deleteUser: Scalars['Boolean'];
  revoke: Scalars['Boolean'];
  updateUser: User;
};


export type MutationAuthorizeArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  password: Scalars['String'];
};


export type MutationCreateUserArgs = {
  data: UserInput;
};


export type MutationUpdateUserArgs = {
  email?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  nickname?: InputMaybe<Scalars['String']>;
  picture?: InputMaybe<Scalars['String']>;
};

/** Pet Schema */
export type Pet = {
  __typename?: 'Pet';
  /** The pet’s date of birth */
  birthdate: Scalars['Timestamp'];
  createdAt: Scalars['Timestamp'];
  dietRestrictions: Array<DietRestriction>;
  /** The pet’s gender */
  gender?: Maybe<PetGender>;
  id: Scalars['ID'];
  /** The pet’s reproductive status */
  isIntact: Scalars['Boolean'];
  mealPlan: MealPlan;
  /** The pet’s name */
  name: Scalars['String'];
  /** URL of pet’s uploaded profile image */
  picture?: Maybe<Scalars['String']>;
  /** The pet’s species */
  species: PetSpecies;
  updatedAt: Scalars['Timestamp'];
  weightHistory: Array<Weight>;
};

/** Pet’s gender types */
export enum PetGender {
  Female = 'female',
  Male = 'male'
}

/** Pet’s specie types */
export enum PetSpecies {
  Cat = 'cat',
  Dog = 'dog'
}

export type Query = {
  __typename?: 'Query';
  userInfo: IdTokenResponse;
  users: Array<AllUsersResponse>;
};

/** Serving Schema */
export type Serving = {
  __typename?: 'Serving';
  createdAt: Scalars['Timestamp'];
  food: Food;
  id: Scalars['ID'];
  meal: Meal;
  /** Serving size in grams */
  size: Scalars['Float'];
  /** User defined sort order within a meal */
  sortOrder: Scalars['Float'];
  updatedAt: Scalars['Timestamp'];
};

export type Token = {
  __typename?: 'Token';
  access?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
};

/** User Schema */
export type User = {
  __typename?: 'User';
  /** End-User's birthday, represented as an ISO 8601:2004 [ISO8601‑2004] YYYY-MM-DD format. The year MAY be 0000, indicating that it is omitted. To represent only the year, YYYY format is allowed. Note that depending on the underlying platform's date related function, providing just year can result in varying month and day, so the implementers need to take this factor into account to correctly process the dates. */
  birthdate: Scalars['Timestamp'];
  createdAt: Scalars['Timestamp'];
  /** End-User’s preferred e-mail address. Its value MUST conform to the RFC 5322 [RFC5322] addr-spec syntax. The RP MUST NOT rely upon this value being unique. */
  email: Scalars['String'];
  /** True if the End-User’s e-mail address has been verified; otherwise false. When this Claim Value is true, this means that the OP took affirmative steps to ensure that this e-mail address was controlled by the End-User at the time the verification was performed. The means by which an e-mail address is verified is context-specific, and dependent upon the trust framework or contractual agreements within which the parties are operating. */
  email_verified: Scalars['Boolean'];
  /** End user’s favorited or self-created pet foods */
  favorite_foods: Array<Food>;
  id: Scalars['ID'];
  /** End-User’s locale, represented as a BCP47 [RFC5646] language tag. This is typically an ISO 639-1 Alpha-2 [ISO639‑1] language code in lowercase and an ISO 3166-1 Alpha-2 [ISO3166‑1] country code in uppercase, separated by a dash. For example, en-US or fr-CA. */
  locale?: Maybe<Scalars['String']>;
  /** End-User’s full name in displayable form including all name parts, possibly including titles and suffixes, ordered according to the End-User’s locale and preferences. */
  name: Scalars['String'];
  /** Casual name of the End-User that may or may not be the same as the given_name. For instance, a nickname value of Mike might be returned alongside a given_name value of Michael. */
  nickname: Scalars['String'];
  /** End user’s saved pets */
  pets: Array<Pet>;
  /** URL of the End-User’s profile picture. This URL MUST refer to an image file (for example, a PNG, JPEG, or GIF image file), rather than to a Web page containing an image. Note that this URL SHOULD specifically reference a profile photo of the End-User suitable for displaying when describing the End-User, rather than an arbitrary photo taken by the End-User. */
  picture?: Maybe<Scalars['String']>;
  updatedAt: Scalars['Timestamp'];
};

/** Register a new user */
export type UserInput = {
  email: Scalars['String'];
  name: Scalars['String'];
  nickname?: InputMaybe<Scalars['String']>;
  password: Scalars['String'];
  picture?: InputMaybe<Scalars['String']>;
};

/** Weight Schema */
export type Weight = {
  __typename?: 'Weight';
  createdAt: Scalars['Timestamp'];
  id: Scalars['ID'];
  pet: Pet;
  updatedAt: Scalars['Timestamp'];
  /** The date pet was weighed */
  weighedAt: Scalars['Timestamp'];
  /** Weight of pet in grams */
  weight: Scalars['Float'];
};

export type CreateUserMutationVariables = Exact<{
  name: Scalars['String'];
  nickname?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  password: Scalars['String'];
  picture?: InputMaybe<Scalars['String']>;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'User', name: string, nickname: string, email: string, picture?: string | null } };

export type AuthorizeMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type AuthorizeMutation = { __typename?: 'Mutation', authorize: { __typename?: 'AuthenticationResponse', token: string, id_token: string, refresh_token: boolean } };

export type SignOutMutationVariables = Exact<{ [key: string]: never; }>;


export type SignOutMutation = { __typename?: 'Mutation', revoke: boolean };

export type UserInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type UserInfoQuery = { __typename?: 'Query', userInfo: { __typename?: 'IDTokenResponse', id_token: string } };


export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nickname"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"picture"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"nickname"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nickname"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"picture"},"value":{"kind":"Variable","name":{"kind":"Name","value":"picture"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nickname"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"picture"}}]}}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const AuthorizeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"authorize"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authorize"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"id_token"}},{"kind":"Field","name":{"kind":"Name","value":"refresh_token"}}]}}]}}]} as unknown as DocumentNode<AuthorizeMutation, AuthorizeMutationVariables>;
export const SignOutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"signOut"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"revoke"}}]}}]} as unknown as DocumentNode<SignOutMutation, SignOutMutationVariables>;
export const UserInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"userInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id_token"}}]}}]}}]} as unknown as DocumentNode<UserInfoQuery, UserInfoQueryVariables>;