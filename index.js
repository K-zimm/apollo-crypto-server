const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
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
    time: String
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
];

const trades = [
  {
    id: 1,
    user: {
      id: 1,
      name: 'Kyle Zimmer',
      userName: 'kzimms',
      passWord: 'gatsbydev',
      avatar:
        'https://scontent-ort2-1.xx.fbcdn.net/v/t1.6435-1/p200x200/122237101_10217929826332394_8775051635289547377_n.jpg?_nc_cat=105&ccb=1-3&_nc_sid=7206a8&_nc_ohc=Lf1_q9SM6DkAX_RPfg4&_nc_ht=scontent-ort2-1.xx&oh=8dcbcc17e7d3defbadb0914f9a02353e&oe=612C5038',
      bio: 'Creator of Crypto Book',
      subLevel: 'GOLD',
    },
    coin: {
      id: 1,
      name: 'Bitcoin',
      symbol: 'BTC',
      slug: 'bitcoin',
      price: 41780.24208515556,
      volume_24h: 28688620020.972775,
    },
    amount: 1,
    time: '7/31/2021_16:45',
  },
];

const resolvers = {
  Query: {
    users: () => {
      return users;
    },
    user: (obj, args, context, info) => {
      const foundUser = users.find((user) => (user.id = args.id));
      return foundUser;
    },
    coins: () => {
      return coins;
    },
    trades: () => {
      return trades;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server started at ${url}`);
});
