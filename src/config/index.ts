const isDev = false;

export const config = {
  baseApiUrl: isDev ? 'http://localhost:3000/api' : 'https://18.231.114.96.nip.io/api',
  googleMapsApiKey: 'AIzaSyDsHLVMf9I5_PT8xZ4IQZs9Ieigk-qtERU',
  firebaseConfig: {
    apiKey: 'AIzaSyBhRqD4avFjyp6MElWLGGTNMuFLXmNKxyI',
    authDomain: 'pagbarato-auth.firebaseapp.com',
    projectId: 'pagbarato-auth',
    storageBucket: 'pagbarato-auth.appspot.com',
    messagingSenderId: '52475764497',
    appId: '1:52475764497:web:7a0296b0287201b99836b0',
    measurementId: 'G-S0HLSJFDYE',
  },
};
