// Import necessary GraphQL modules and dependencies.
const graphql = require("graphql");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
} = graphql;

// Import data models for products and orders.
const { Product } = require("../models/products");
const { Order } = require("../models/orders");
const { User } = require("../models/users");

const ProductType = require("./TypeDefs/ProductType");
const UserType = require("./TypeDefs/UserType");
const OrderType = require("./TypeDefs/OrderType");

const dotenv = require("dotenv");
dotenv.config(".env");

const jwt = require("jsonwebtoken");

// Define the RootQuery, which is the entry point for querying data.
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    // Products Queries
    getAllProduct: {
      type: new GraphQLList(ProductType), // Define the type of data to be returned (a list of products).
      args: { id: { type: GraphQLString } }, // Specify any input arguments that can be used in the query (in this case, an 'id').
      async resolve(parent, args) {
        // The 'resolve' function specifies how to fetch and return the requested data.
        // In this case, it fetches and returns a list of all products.
        const productList = await Product.find();
        return productList;
      },
    },
    getProduct: {
      type: ProductType, // Define the type of data to be returned (a single product).
      args: { id: { type: GraphQLString } }, // Specify an input argument 'id'.
      async resolve(parent, args) {
        // The 'resolve' function fetches and returns a specific product based on the provided 'id'.
        const product = await Product.findById(args.id);
        return product;
      },
    },
    // Orders Queries
    getAllOrders: {
      type: new GraphQLList(OrderType), // Define the type of data to be returned (a list of orders).
      args: { id: { type: GraphQLString } }, // Specify an input argument 'id'.
      async resolve(parent, args, req) {
        // The 'resolve' function fetches and returns a list of orders for a specific user, but only if the user is authenticated.
        if (!req.isAuth) {
          throw new Error("Unauthenticated");
        }
        const orderList = await Order.find({ userId: args.id });
        return orderList;
      },
    },
    getUser: {
      type: UserType,
      args: {
        username: { type: GraphQLString },
      },
      async resolve(parent, args) {
        const user = await User.findOne({ username: args.username });
        return user;
      },
    },
    getAllUsers: {
      type: new GraphQLList(UserType),
      args: { id: { type: GraphQLString } },
      async resolve(parent, args, req) {
        const userList = await User.find({ id: args.id });
        return userList;
      },
    },
  },
});
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    //Product mutations
    createProduct: {
      type: ProductType,
      args: {
        brand: { type: GraphQLString },
        category: { type: GraphQLString },
        description: { type: GraphQLString },
        discountPercentage: { type: GraphQLFloat },
        images: { type: GraphQLString },
        price: { type: GraphQLFloat },
        rating: { type: GraphQLFloat },
        stock: { type: GraphQLInt },
        thumbnail: { type: GraphQLString },
        title: { type: GraphQLString },
      },
      async resolve(parent, args, req) {
        console.log("resolve called " + JSON.stringify(args));
        const newProduct = new Product({
          title: args.title,
          brand: args.brand,
          category: args.category,
          description: args.description,
          discountPercentage: args.discountPercentage,
          images: args.images,
          price: args.price,
          rating: args.rating,
          stock: args.stock,
          thumbnail: args.thumbnail,
        });

        await newProduct.save();

        return newProduct;
      },
      async reject(error) {
        console.log("reject called " + JSON.stringify(error));
      },
    },
    updateProduct: {
      type: ProductType,
      args: {
        id: { type: GraphQLString },
        brand: { type: GraphQLString },
        category: { type: GraphQLString },
        description: { type: GraphQLString },
        discountPercentage: { type: GraphQLFloat },
        images: { type: GraphQLString },
        price: { type: GraphQLFloat },
        rating: { type: GraphQLFloat },
        stock: { type: GraphQLInt },
        thumbnail: { type: GraphQLString },
        title: { type: GraphQLString },
      },
      async resolve(parent, args, req) {
        const newProduct = await Product.findByIdAndUpdate(args.id, {
          brand: args.brand,
          category: args.category,
          description: args.description,
          discountPercentage: args.discountPercentage,
          images: args.images,
          price: args.price,
          rating: args.rating,
          stock: args.stock,
          thumbnail: args.thumbnail,
          title: args.title,
        });

        return newProduct;
      },
    },
    deleteProduct: {
      type: ProductType,
      args: {
        id: { type: GraphQLString },
      },
      async resolve(parent, args) {
        console.log(args.id);

        const deletedProduct = await Product.findByIdAndDelete(args.id);

        return args;
      },
    },
    registerUser: {
      type: GraphQLString,
      args: {
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        isAdmin: { type: graphql.GraphQLBoolean },
      },
      async resolve(parent, args, req) {
        console.log("Register resolve called " + JSON.stringify(args));
        const newUser = new User({
          username: args.username,
          email: args.email,
          password: args.password,
          isAdmin: args.isAdmin,
        });
        try {
          await newUser.save();
          return "Registration successful";
        } catch (error) {
          throw new Error("Registration failed");
        }
      },
    },
    login: {
      type: GraphQLString,
      args: {
        username: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve: async (parent, args) => {
        console.log(`****Login API called*****`);
        const user = await User.findOne({ username: args.username });
        if (!user) {
          console.log(`user not found ${args.username} ${args.password}`);
          throw new Error("User not found");
        }
        if (user.password !== args.password) {
          console.log(`Incorrect pass`);
          throw new Error("Incorrect password");
        }
        const payload = { sub: user.id };
        const token = jwt.sign(payload, process.env.SECRET_KEY, {
          expiresIn: "1d",
        });
        return token;
      },
      reject: async (error) => {
        console.log(`Login error ${JSON.stringify(error)}`);
      },
    },
  },
});

// Export a GraphQLSchema that includes the RootQuery.
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
