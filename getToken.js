const { authorize } = require('./oauth2');

authorize(() => {
  console.log('Tokens obtenidos y almacenados correctamente.');
});