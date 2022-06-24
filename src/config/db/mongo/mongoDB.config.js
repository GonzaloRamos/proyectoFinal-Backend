const mongoDB = {
  uri: `mongodb+srv://gonzalo:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}.1bu3e.mongodb.net/${process.env.MONGO_COLLECTION}?retryWrites=true&w=majority`,
};

module.exports = mongoDB;
