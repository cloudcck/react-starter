const path = require('path');

let project_config = {
  PATH: {
    SRC: path.join(__dirname, '../', 'src'),
    DIST: path.join(__dirname, '../', 'dist'),
    NODE_MODULES: path.join(__dirname, '../', 'node_modules')
  },
  PORT:{
    CLIENT:4000,
    MOCKAPI:9000
  }

};

module.exports = project_config;;