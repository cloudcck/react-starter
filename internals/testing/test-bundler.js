// needed for regenerator-runtime
// (ES7 generator support is required by redux-saga)
import 'babel-polyfill';

// If we need to use Chai, we'll have already chaiEnzyme loaded
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
chai.use(chaiEnzyme());

// Include all .js files under `app`, except app.js, reducers.js, and routes.js.
// This is for code coverage
// const context = require.context('../../src', true, /^^((?!(index|reducer|routes)).)*\.js$/);
const context = require.context('../../src', true, /^^((?!(index|reducer|routes)).)*\.js$/);
const keys = context.keys();
console.log(JSON.stringify(keys, '', 2));
context.keys().forEach(context);
