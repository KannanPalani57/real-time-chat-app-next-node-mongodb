export default {
  port: 5000,
  dbUri:
    // "mongodb+srv://kalyan:jeyanthi12345678@newdb.jvj4ad5.mongodb.net/narrativeapp?retryWrites=true&w=majority",
    // dbUri:'mongodb://localhost:27017/Narrative',

    "mongodb://0.0.0.0:27017/real-time-chat-app",


  logLevel: "info",
  accessTokenPrivateKey: "randomvalue",
  refreshTokenPrivateKey: "",
  smtp: {
    user: "litzy.sawayn30@ethereal.email",
    pass: "ehXVMvfpAE6A7cT9EB",
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
  },
};
