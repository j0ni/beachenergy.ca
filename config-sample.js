module.exports = {
  mongo: {
    url: 'mongodb://localhost:27017/beachenergy'
  },

  email: {
    name: 'Sendmail',
    options: '/usr/sbin/sendmail'
  }

  // or...

  // email: {
  //   host: 'smtp.example.com',
  //   port: 25,
  //   name: 'beachenergy.ca',
  //   auth: {
  //     user: 'username',
  //     pass: 'password'
  //   }
  // }

};
