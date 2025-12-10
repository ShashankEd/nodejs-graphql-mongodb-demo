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
const  {Product}  = require("../models/products");
const  {Order} = require("../models/orders");

const ProductType = require("./TypeDefs/ProductType");
const UserType = require("./TypeDefs/UserType");
const OrderType = require("./TypeDefs/OrderType");

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
        console.log("resolve called " + JSON.stringify
          (args)
        )
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

        return newProduct;;
      },
      async reject(error) {
                console.log("reject called " + JSON.stringify
          (error)
        )
      }
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
}});

// Export a GraphQLSchema that includes the RootQuery.
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});