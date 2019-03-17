module.exports = {
  mongodb: {
    dbURI: process.env.MONGODB,
  },
  cookieKey: process.env.COOKIE_KEY,
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
};
