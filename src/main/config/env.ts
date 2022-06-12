export default {
  mongoDocker: 'mongodb://mongo:27017/',
  mongoUrl:  'mongodb://localhost:27017/' || process.env.MONGODB_URI, 
  port: 3535,
  jwtSecret: "abcd==sakapecatrn**ou" ||process.env.SECRET_KEY,
};

