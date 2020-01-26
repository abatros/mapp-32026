module.exports = {
  servers: {
    one: {
      // TODO: set host address, username, and authentication method
      host: 'abatros.com',
      username: 'dkz',
    }
  },

  app: {
    // TODO: change app name and path
    name: 'museum-32026',
    path: '/home/dkz/2019/mapp-32026',

    volumes: {
       // passed as '-v /host/path:/container/path' to the docker run command
//       '/home/dkz/museum-pub': '/home/dkz/museum-pub',
//       '/home/dkz/ultimheat.com/museum':'/home/dkz/ultimheat.com/museum'
       '/home/dkz/museum-assets':'/home/dkz/museum-assets'
     },


    servers: {
      one: {},
    },

    buildOptions: {
      serverOnly: true,
    },

    env: {
      // TODO: Change to your app's url
      // If you are using ssl, it needs to start with https://
//      ROOT_URL: 'http://ultimheat.com/dkz-jou',
      ROOT_URL: 'http://museum2.abatros.com',
//      ROOT_URL: 'http://ultimheat.com/',
      PORT: 32026
//      MONGO_URL: 'mongodb://localhost/meteor',
    },

    // ssl: { // (optional)
    //   // Enables let's encrypt (optional)
    //   autogenerate: {
    //     email: 'email.address@domain.com',
    //     // comma separated list of domains
    //     domains: 'website.com,www.website.com'
    //   }
    // },

    docker: {
      // change to 'kadirahq/meteord' if your app is using Meteor 1.3 or older
      image: 'abernix/meteord:node-8.4.0-base'
    },

    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: true
  },

/*
  mongo: {
    version: '3.4.1',
    servers: {
      one: {}
    }
  }
  */
};
