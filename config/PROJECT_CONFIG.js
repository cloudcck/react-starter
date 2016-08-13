const path = require('path');

let project_config = {
  PATH: {
    SRC: path.join(__dirname, '../', 'src'),
    DIST: path.join(__dirname, '../', 'dist'),
    NODE_MODULES: path.join(__dirname, '../', 'node_modules')
  }

};

module.exports = project_config;;