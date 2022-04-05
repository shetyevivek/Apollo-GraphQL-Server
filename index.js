import { ApolloServer, gql } from 'apollo-server';
import {car} from "./cardata.js";

// These are called properties
// Scalar types: Int, Float, String, Boolean
const typeDefs = gql`
directive @cacheControl(
  maxAge: Int,
  scope: CacheControlScope
) on OBJECT | FIELD | FIELD_DEFINITION

enum CacheControlScope {
  PUBLIC
  PRIVATE
}

  type Query {
    CarYear: [Info] @cacheControl(maxAge: 2592000)
    cars(year: String!): Info @cacheControl(maxAge: 2592000)
  }
  type Info @cacheControl(maxAge: 2592000) {
    year: String @cacheControl(maxAge: 2592000)
    CarMake: [Details] @cacheControl(maxAge: 2592000)
    get_car_models(make: String!): Details @cacheControl(maxAge: 2592000)
  }
  type Details @cacheControl(maxAge: 2592000) {
    make: String @cacheControl(maxAge: 2592000)
    CarModel: [ModelData] @cacheControl(maxAge: 2592000)
  }
  type ModelData @cacheControl(maxAge: 2592000) {
    model: String @cacheControl(maxAge: 2592000)
  }
`;

// These are Resolvers for the Queries
const resolvers = {
  Query: {
    CarYear: () => {
      return car;
    },
    cars: (obj, args, context) => {
      return car.find((cars) => cars.year === args.year);
    }
  },
  Info: {
    CarMake: (obj, args, context) => {
      return obj.car_make;
    },
    get_car_models: (obj, args, context) => {
      return obj.car_make.find((car_models) => car_models.make === args.make);
    }
  },
  Details: {
    CarModel: (obj, args, context) => {
      return obj.car_model;
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log("Server is ready at " + url);
});
