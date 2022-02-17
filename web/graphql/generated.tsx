import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
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

/** Login Response */
export type LoginResponse = {
  __typename?: 'LoginResponse';
  /** The logged in user */
  user: User;
  /** Base64 encoded JSON Web Token (JWT) */
  accessToken: Scalars['String'];
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
  signInUser: LoginResponse;
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
  user: User;
  users: Array<User>;
};


export type QueryUserArgs = {
  id: Scalars['String'];
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


export type SignInUserMutation = { __typename?: 'Mutation', signInUser: { __typename?: 'LoginResponse', accessToken: string, user: { __typename?: 'User', email: string, fullName: string, displayName?: string | null } } };


export const CreateUserDocument = gql`
    mutation createUser($fullName: String!, $displayName: String, $email: String!, $password: String!, $imageUrl: String) {
  createUser(
    data: {fullName: $fullName, displayName: $displayName, email: $email, password: $password, imageUrl: $imageUrl}
  ) {
    fullName
    displayName
    email
    imageUrl
  }
}
    `;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      fullName: // value for 'fullName'
 *      displayName: // value for 'displayName'
 *      email: // value for 'email'
 *      password: // value for 'password'
 *      imageUrl: // value for 'imageUrl'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const SignInUserDocument = gql`
    mutation signInUser($email: String!, $password: String!) {
  signInUser(email: $email, password: $password) {
    accessToken
    user {
      email
      fullName
      displayName
    }
  }
}
    `;
export type SignInUserMutationFn = Apollo.MutationFunction<SignInUserMutation, SignInUserMutationVariables>;

/**
 * __useSignInUserMutation__
 *
 * To run a mutation, you first call `useSignInUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignInUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signInUserMutation, { data, loading, error }] = useSignInUserMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useSignInUserMutation(baseOptions?: Apollo.MutationHookOptions<SignInUserMutation, SignInUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignInUserMutation, SignInUserMutationVariables>(SignInUserDocument, options);
      }
export type SignInUserMutationHookResult = ReturnType<typeof useSignInUserMutation>;
export type SignInUserMutationResult = Apollo.MutationResult<SignInUserMutation>;
export type SignInUserMutationOptions = Apollo.BaseMutationOptions<SignInUserMutation, SignInUserMutationVariables>;