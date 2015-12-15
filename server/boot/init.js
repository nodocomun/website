var async = require('async');
var populate = require('../../lib/populate.js')

module.exports = function(app, donePopulate) {

  var tasks = [];

  if (process.env.NODE_ENV != 'production') {
    tasks.push(
      populate.clearDb,
      populate.loadCsv,
      populate.loadMethods,
      populate.importHubs,
      populate.setHubsParents
    );
  }

  async.series(tasks, donePopulate)


}
