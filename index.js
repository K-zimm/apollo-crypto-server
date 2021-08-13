const { ApolloServer, gql } = require('apollo-server');
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require('apollo-server-core');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const mongoose = require('mongoose');

mongoose.connect(
  'mongodb+srv://kzimms:elxitv5uTV2pdlJR@trades.v6bkf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const db = mongoose.connection;

const userSchema = new mongoose.Schema({
  name: String,
  userName: String,
  password: String,
  avatar: String,
  bio: String,
  subLevel: String,
});

const User = mongoose.model('User', userSchema);

const typeDefs = gql`
  scalar Date

  enum SubLevel {
    FREE
    BRONZE
    SILVER
    GOLD
  }

  type User {
    id: ID!
    name: String
    userName: String
    password: String
    avatar: String
    bio: String
    subLevel: SubLevel
  }

  type Trade {
    id: ID!
    user: User
    coin: Coin
    amount: Float
    time: Date
  }

  type Coin {
    id: ID!
    name: String
    symbol: String
    slug: String
    price: Float
    volume_24h: Float
  }

  type Query {
    users: [User]
    user(id: ID): User
    coins: [Coin]
    trades: [Trade]
  }

  input TradeInput {
    id: ID
    user: ID
    coin: ID
    amount: Float
  }

  input UserInput {
    id: ID
    name: String
    userName: String
    password: String
    avatar: String
    bio: String
    subLevel: SubLevel
  }

  type Mutation {
    addTrade(trade: TradeInput): [Trade]
    addUser(user: UserInput): [User]
  }
`;

const users = [
  {
    id: 1,
    name: 'Kyle Zimmer',
    userName: 'kzimms',
    passWord: 'gatsbydev',
    avatar:
      'https://scontent-ort2-1.xx.fbcdn.net/v/t1.6435-1/p200x200/122237101_10217929826332394_8775051635289547377_n.jpg?_nc_cat=105&ccb=1-3&_nc_sid=7206a8&_nc_ohc=Lf1_q9SM6DkAX_RPfg4&_nc_ht=scontent-ort2-1.xx&oh=8dcbcc17e7d3defbadb0914f9a02353e&oe=612C5038',
    bio: 'Creator of Crypto Book',
    subLevel: 'GOLD',
  },
  {
    id: 2,
    name: 'Justin',
    userName: 'justin',
    passWord: 'gatsbydev',
    avatar:
      'https://scontent-ort2-1.xx.fbcdn.net/v/t1.6435-1/c0.6.200.200a/p200x200/205777878_10159271891392808_7342546362158517459_n.jpg?_nc_cat=108&ccb=1-3&_nc_sid=7206a8&_nc_ohc=0Fpf50YWXJIAX892-my&tn=Y-ChWfDozZYdPXCv&_nc_ht=scontent-ort2-1.xx&oh=269f5ef5ae8519a1f8a65047d742d0d8&oe=612B960C',
    bio: 'Creator of Master Sales Funnels',
    subLevel: 'GOLD',
  },
];

const coins = [
  {
    id: 1,
    name: 'Bitcoin',
    symbol: 'BTC',
    slug: 'bitcoin',
    price: 41780.24208515556,
    volume_24h: 28688620020.972775,
  },
  {
    id: 2,
    name: 'Ethereum',
    symbol: 'ETH',
    slug: 'ethereum',
    price: 2600.26541,
    volume_24h: 10065810,
  },
];

const trades = [
  {
    id: 1,
    user: 1,
    coin: 2,
    amount: 1,
    time: new Date('7-31-2021'),
  },
];

const resolvers = {
  Query: {
    users: async () => {
      try {
        const allUsers = await User.find();
        return allUsers;
      } catch (error) {
        console.log('Error', error);
        return [];
      }
    },
    user: async (obj, args) => {
      try {
        const foundUser = await User.findById(args.id);
        return foundUser;
      } catch (error) {
        console.log('Error', error);
        return [];
      }
    },
    coins: () => {
      return coins;
    },
    trades: () => {
      return trades;
    },
  },

  Trade: {
    user: (obj, arg, context) => {
      const userId = obj.user;
      const filteredUser = users.find((user) => userId === user.id);
      return filteredUser;
    },
    coin: (obj, arg, context) => {
      const actorId = obj.coin;
      const filteredCoin = coins.find((coin) => actorId === coin.id);
      return filteredCoin;
    },
  },

  Mutation: {
    addUser: async (obj, { user }, { host }) => {
      try {
        if (host === 'localhost:4000') {
          const newUser = await User.create({
            ...user,
          });
          const allUsers = await User.find();
          return allUsers;
        }
      } catch (error) {
        console.log('Error', error);
        return [];
      }
    },
  },

  Date: new GraphQLScalarType({
    name: 'Date',
    description: "It's a date",
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return value.getTime();
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value);
      }
      return null;
    },
  }),
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  context: ({ req }) => {
    return { host: req.headers.host };
  },
});

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Database Connected');
  server
    .listen({
      port: process.env.PORT || 4000,
    })
    .then(({ url }) => {
      console.log(`Server started at ${url}`);
    });
});
