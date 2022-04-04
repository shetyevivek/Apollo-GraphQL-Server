import { ApolloServer, gql } from 'apollo-server'; 
import {car} from "./cardata.js";

// These are called properties
// Scalar types: Int, Float, String, Boolean
const typeDefs = gql`
  type Query {
    CarYear: [Info]
    cars(year: String!): Info
  }
  type Info {
    year: String
    CarMake: [Details]
    get_car_models(make: String!): Details
  }
  type Details {
    make: String
    CarModel: [ModelData]
  }
  type ModelData {
    model: String
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
