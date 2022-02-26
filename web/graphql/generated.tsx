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
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

/** Register a new user */
export type CreateUserInput = {
  fullName: Scalars['String'];
  displayName?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  password: Scalars['String'];
  imageUrl?: InputMaybe<Scalars['String']>;
};

/** Dietary Restrictions Schema */
export type DietRestriction = {
  __typename?: 'DietRestriction';
  name: Scalars['String'];
  foods: Array<Food>;
  pets: Array<Pet>;
};

/** Food Schema */
export type Food = {
  __typename?: 'Food';
  /** The pet food brand name or product line */
  name: Scalars['String'];
  /** The pet food manufacturer */
  manufacturer?: Maybe<Scalars['String']>;
  /** The pet food flavor or recipe (ex. “Turkey and Duck”) */
  flavor?: Maybe<Scalars['String']>;
  /** The pet food product or manufacturer URL */
  url?: Maybe<Scalars['String']>;
  /** The calories per kilogram of pet food */
  kilogramCalories: Scalars['Float'];
  users: Array<User>;
  dietRestrictions: Array<DietRestriction>;
};

/** Meal Schema */
export type Meal = {
  __typename?: 'Meal';
  /** User defined sort order within a meal plan */
  sortOrder: Scalars['Float'];
  name?: Maybe<Scalars['String']>;
  servings: Array<Serving>;
  mealPlan: MealPlan;
};

/** Meal Plan Schema */
export type MealPlan = {
  __typename?: 'MealPlan';
  name: Scalars['String'];
  pets: Array<Pet>;
  meals: Array<Meal>;
};

export type Mutation = {
  __typename?: 'Mutation';
  signInUser: SigninResponse;
  createUser: User;
  updateUser: User;
  deleteUser: Scalars['Boolean'];
};


export type MutationSignInUserArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationCreateUserArgs = {
  data: CreateUserInput;
};


export type MutationUpdateUserArgs = {
  data: UpdateUserInput;
  id: Scalars['String'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['String'];
};

/** Pet Schema */
export type Pet = {
  __typename?: 'Pet';
  /** The pet’s name */
  name: Scalars['String'];
  /** The pet’s date of birth */
  birthDate: Scalars['DateTime'];
  /** URL of pet’s uploaded profile image */
  imageUrl?: Maybe<Scalars['String']>;
  /** The pet’s reproductive status */
  isIntact: Scalars['Boolean'];
  /** The pet’s species */
  species: PetSpecies;
  /** The pet’s gender */
  gender?: Maybe<PetGender>;
  mealPlan: MealPlan;
  weightHistory: Array<Weight>;
  dietRestrictions: Array<DietRestriction>;
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
  currentUser: User;
  users: Array<User>;
};

/** Serving Schema */
export type Serving = {
  __typename?: 'Serving';
  /** User defined sort order within a meal */
  sortOrder: Scalars['Float'];
  /** Serving size in grams */
  size: Scalars['Float'];
  food: Food;
  meal: Meal;
};

/** Login Response */
export type SigninResponse = {
  __typename?: 'SigninResponse';
  /** The logged in user */
  user: User;
  /** Base64 encoded JSON Web Token (JWT) */
  token: Scalars['String'];
};

/** Update an existing user profile */
export type UpdateUserInput = {
  fullName?: InputMaybe<Scalars['String']>;
  displayName?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  imageUrl?: InputMaybe<Scalars['String']>;
};

/** User Schema */
export type User = {
  __typename?: 'User';
  /** The user’s full or legal name(s) */
  fullName: Scalars['String'];
  /** The user’s preferred way to be addressed */
  displayName?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  /** URL of user’s uploaded profile image */
  imageUrl?: Maybe<Scalars['String']>;
  favoriteFoods: Array<Food>;
};

/** Weight Schema */
export type Weight = {
  __typename?: 'Weight';
  /** The date pet was weighed */
  weighDate: Scalars['DateTime'];
  /** Weight of pet in grams */
  weight: Scalars['Float'];
  pet: Pet;
};

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser: { __typename?: 'User', email: string, fullName: string } };

export type CreateUserMutationVariables = Exact<{
  fullName: Scalars['String'];
  displayName?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  password: Scalars['String'];
  imageUrl?: InputMaybe<Scalars['String']>;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'User', fullName: string, displayName?: string | null, email: string, imageUrl?: string | null } };

export type SignInUserMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type SignInUserMutation = { __typename?: 'Mutation', signInUser: { __typename?: 'SigninResponse', token: string, user: { __typename?: 'User', email: string, fullName: string, displayName?: string | null } } };


export const CurrentUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]} as unknown as DocumentNode<CurrentUserQuery, CurrentUserQueryVariables>;
export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fullName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"displayName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"imageUrl"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"fullName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fullName"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"displayName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"displayName"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"imageUrl"},"value":{"kind":"Variable","name":{"kind":"Name","value":"imageUrl"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}}]}}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const SignInUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"signInUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signInUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}}]}}]} as unknown as DocumentNode<SignInUserMutation, SignInUserMutationVariables>;