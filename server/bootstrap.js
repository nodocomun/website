// Meteor.startup(function(){
//
//   var fs = Npm.require('graceful-fs');
//   var csv = Npm.require('csv');
//
//   function importPurposes(){
//     var purposes =[{
//       en: "Empowerment",
//       pt: "Empoderamento",
//       es: "Empoderamiento"
//     },{
//       en: "Incidency",
//       pt: "Incidência",
//       es: "Incidencia"
//     }]
//
//     _.each(purposes, function(i){
//       Purposes.insert(i);
//     });
//   }
//
//   function importIncidencyReachs(){
//     var incidencies =[{
//       en: "Local",
//       pt: "Local",
//       es: "Local"
//     },{
//       en: "Regional",
//       pt: "Regional",
//       es: "Regional"
//     },{
//       en: "National",
//       pt: "Nacional",
//       es: "Nacional"
//     },{
//       en: "International",
//       pt: "Internacional",
//       es: "Internacional"
//     }]
//
//     _.each(incidencies, function(i){
//       IncidencyReachs.insert(i);
//     });
//   }
//
//   function importIncidencyTypes(){
//     var incidencyType =[{
//       en: "Executive",
//       pt: "Executivo",
//       es: "Executivo"
//     },{
//       en: "Legislative",
//       pt: "Legislativo",
//       es: "Legistativo"
//     },{
//       en: "Justice",
//       pt: "Judiciário",
//       es: "Judicial"
//     }]
//
//     _.each(incidencyType, function(i){
//       IncidencyTypes.insert(i);
//     });
//   }
//
//   function importHubs() {
//     var hubs;
//
//     Async.runSync(function(doneImportHubs){
//       rs = fs.createReadStream(process.env.PWD +'/data/hubs.csv');
//       var parser = csv.parse({columns: true}, function(err, data){
//         if (err) return doneImportHubs(err);
//         hubs = data;
//         doneImportHubs();
//       });
//       rs.pipe(parser);
//     });
//
//     // variable to keep hub names and ids
//     var hubNamesToIds = {};
//
//     // import basic properties
//     for ( let i = 0; i < hubs.length; i++ ) {
//       var item = _.pick(hubs[i], 'name', 'description_en', 'description_pt', 'description_es', 'incidencyReach', 'nature', 'website', 'city');
//
//       var placesOfOriginIds = hubs[i].placesOfOriginIds;
//       if (placesOfOriginIds) {
//         item.placesOfOrigin = placesOfOriginIds.split(',');
//       }
//
//       item.nature = Natures.findOne({en: item.nature})._id;
//       hubNamesToIds[item.name] = Hubs.insert(item);
//     }
//
//     // set hub relations
//     for ( let i = 0; i < hubs.length; i++ ) {
//       var hubId = hubNamesToIds[hubs[i].name];
//
//       var relatedHubsNames = hubs[i].relatedHubsNames;
//       var relatedHubsIds = [];
//       if (relatedHubsNames) {
//         relatedHubsNames = relatedHubsNames.split(';');
//         _.each(relatedHubsNames, function(hubName){
//           var hubId = hubNamesToIds[hubName.trim()];
//           if (hubId) relatedHubsIds.push(hubId);
//         });
//       }
//
//       var parentHubNames = hubs[i].parentHubNames;
//       var parentHubIds = [];
//       if (parentHubNames) {
//         parentHubNames = parentHubNames.split(';');
//         _.each(parentHubNames, function(hubName){
//           var hubId = hubNamesToIds[hubName.trim()];
//           if (hubId) parentHubIds.push(hubId);
//         });
//       }
//
//       Hubs.update({_id: hubId}, {
//         $set: {
//           relatedHubs: relatedHubsIds,
//           parentHubs: parentHubIds
//         }
//       });
//     }
//   }
//
//   function importOrigins() {
//     var origins;
//
//     Origins.remove({});
//
//     Async.runSync(function(doneImportOrigins){
//       rs = fs.createReadStream(process.env.PWD +'/data/origins.csv');
//       var parser = csv.parse({columns: true}, function(err, data){
//         if (err) return doneImportOrigins(err);
//         origins = data;
//         doneImportOrigins();
//       });
//       rs.pipe(parser);
//     });
//
//     _.each(origins, function(country){
//       Origins.insert(country);
//     });
//   }
//
//   function importNatures() {
//     var natures;
//
//     Async.runSync(function(doneImportNatures){
//       rs = fs.createReadStream(process.env.PWD +'/data/natures.csv');
//       var parser = csv.parse({columns: true}, function(err, data){
//         if (err) return doneImportNatures(err);
//         natures = data;
//         doneImportNatures();
//       });
//       rs.pipe(parser);
//     });
//
//     _.each(natures, function(nature){
//       Natures.insert(nature);
//     });
//   }
//
//   function importThemes() {
//     var themes;
//
//     Async.runSync(function(doneImportThemes){
//       rs = fs.createReadStream(process.env.PWD +'/data/themes.csv');
//       var parser = csv.parse({columns: true}, function(err, data){
//         if (err) return doneImportThemes(err);
//         themes = data;
//         doneImportThemes();
//       });
//       rs.pipe(parser);
//     });
//
//     _.each(themes, function(theme){
//       Themes.insert(theme);
//     });
//   }
//
//   function importMechanisms() {
//
//     var mechanisms;
//
//     Async.runSync(function(doneImportMechanisms){
//       rs = fs.createReadStream(process.env.PWD +'/data/mechanisms.csv');
//       var parser = csv.parse({columns: true}, function(err, data){
//         if (err) return doneImportMechanisms(err);
//         mechanisms = data;
//         doneImportMechanisms();
//       });
//       rs.pipe(parser);
//     });
//
//     _.each(mechanisms, function(mechanism){
//       Mechanisms.insert(mechanism);
//     });
//   }
//
//
//   function importMethods() {
//     var methods;
//
//     Async.runSync(function(doneImportMethods){
//       rs = fs.createReadStream(process.env.PWD +'/data/methods.csv');
//       var parser = csv.parse({columns: true}, function(err, data){
//         if (err) return doneImportMethods(err);
//         methods = data;
//         doneImportMethods();
//       });
//       rs.pipe(parser);
//     });
//
//     var methodIds = {};
//     _.each(methods, function(method){
//       method.mechanism = Mechanisms.findOne({pt: method.mechanism})._id;
//       methodIds[method.pt] = Methods.insert(method);
//     });
//   }
//
//   function importSignals() {
//     var signals;
//
//     Async.runSync(function(doneImportSignals){
//       rs = fs.createReadStream(process.env.PWD +'/data/signals.csv');
//       var parser = csv.parse({columns: true}, function(err, data){
//         if (err) return doneImportSignals(err);
//         signals = data;
//         doneImportSignals();
//       });
//       rs.pipe(parser);
//     });
//
//     _.each(signals, function(signal){
//
//       signal.methods = [];
//
//       _.each(signal["Conexão e Diálogo "].split(';'), function(method){
//         if (method) {
//           signal.methods.push(Methods.findOne({pt: method.trim()})._id)
//         }
//       });
//
//       _.each([
//         "Coletiva (HUB)",
//         "Sensibilização",
//         "Formação",
//         "Produção de Conhecimento",
//         "Levantamento e Visualização de Informação",
//         "Fomento",
//         "Fiscalização e Monitoramento",
//         "Disseminação",
//         "Mobilização e Pressão",
//         "Contribuição e Colaboração"
//       ], function(mechanism) {
//         _.each(signal[mechanism].split(','), function(method){
//           if (method) {
//             signal.methods.push(Methods.findOne({pt: method.trim()})._id)
//           }
//         });
//       });
//
//
//
//       // parse places
//       if (signal.placesOfOriginNames) {
//         var places = signal.placesOfOriginNames.split(',');
//         signal.placesOfOrigin = [];
//         _.each(places, function(place){
//           place = place.trim();
//           signal.placesOfOrigin.push(Origins.findOne({pt: place})._id);
//         });
//       }
//
//       // parse themes
//       if (signal.themes) {
//         var themes = signal.themes.split(',');
//         signal.mainThemes = [];
//         _.each(themes, function(theme){
//           signal.mainThemes.push(Themes.findOne({pt: theme})._id);
//         });
//       }
//
//       // parse secondaryThemes
//       if (signal.secondaryThemes) {
//         var secondaryThemes = signal.secondaryThemes.split(',');
//         signal.secondaryThemes = [];
//         _.each(secondaryThemes, function(theme){
//           signal.secondaryThemes.push(Themes.findOne({pt: theme.trim()})._id);
//         });
//       } else signal.themes = [];
//
//       // parse purpose
//       signal.purpose = Purposes.findOne({pt: signal.purpose})._id;
//
//       // parse parentHub
//       if (signal.parentHub) {
//         var parentHubs = signal.parentHub.split(';');
//         signal.parentHubs = [];
//         _.each(parentHubs, function(hubName){
//           var hub = Hubs.findOne({name: hubName.trim()});
//           if (hub) {
//             signal.parentHubs.push(hub._id);
//           }
//         });
//       } else signal.parentHubs = [];
//
//       if (signal.incidencyReach) {
//         signal.incidencyReach = IncidencyReachs.findOne({pt: signal.incidencyReach})._id;
//       }
//
//
//       // parse incidencyTypes
//       if (signal.incidencyType) {
//         var incidencyTypes = signal.incidencyType.split(',');
//         signal.incidencyTypes = [];
//         _.each(incidencyTypes, function(typeName){
//           var type = IncidencyTypes.findOne({pt: typeName.trim()});
//           if (type) {
//             signal.incidencyTypes.push(type._id);
//           }
//         });
//       } else signal.incidencyTypes = [];
//
//
//       switch (signal.isOpenLicense) {
//         case 'TRUE':
//           signal.isOpenLicense = true;
//           break;
//         case 'false':
//           signal.isOpenLicense = false;
//           break;
//       }
//
//       Signals.insert(signal);
//     });
//   }
//
//   if (Origins.find({}).count() == 0) importOrigins();
//   if (Natures.find({}).count() == 0) importNatures();
//   if (Hubs.find({}).count() == 0) importHubs();
//   if (Themes.find({}).count() == 0) importThemes();
//   if (Mechanisms.find({}).count() == 0) importMechanisms();
//   if (Methods.find({}).count() == 0) importMethods();
//   if (IncidencyReachs.find({}).count() == 0) importIncidencyReachs();
//   if (IncidencyTypes.find({}).count() == 0) importIncidencyTypes();
//   if (Purposes.find({}).count() == 0) importPurposes();
//   if (Signals.find({}).count() == 0) importSignals();
//
// });