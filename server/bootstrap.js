var csv = Npm.require('csv');
var fs = Npm.require('fs');

Meteor.startup(function(){

  function importHubNature() {
    HubNatureCollection.remove({});

    // [name_pt, plural, institutional]
    var natures = [
      ["Indivíduo",false,false],
      ["Instituto, Fundação",true,true],
      ["Empresa",true,true],
      ["Partido",true,true],
      ["Organismo multilateral / Internacional",true,true],
      ["Orgão Governamental",true,true],
      ["ONG",true,true],
      ["Academia",true,true],
      ["Não Identificada",true,true],
      ["Coletivo",true,false],
      ["Movimento",true,false],
      ["Aliança (a+a)",true,false],
      ["Rede (p2p)",true,false],
      ["Parceria (a+b)",true,false]
    ];

    _.each(natures, function(nature) {
      HubNatureCollection.insert({
        name_pt: nature[0],
        isPlural: nature[1],
        isInstitution: nature[2]
      });
    });
  }

  function importHubs() {
    var hubs;

    HubsCollection.remove({});

    Async.runSync(function(doneImportHubs){
      rs = fs.createReadStream(process.env.PWD +'/data/hubs.csv');
      var parser = csv.parse({columns: true}, function(err, data){
        if (err) return doneImportHubs(err);
        hubs = data;
        doneImportHubs();
      });
      rs.pipe(parser);
    });

    _.each(hubs, function(hub){
      HubsCollection.insert(hub);
    });
  }

  importHubNature();
  importHubs();

});
