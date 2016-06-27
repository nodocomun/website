/*
 * List View
 */

Template.list.onRendered(function(){
  var bar_h = 80;

  $('body').addClass('light_bg');
  Template.instance().$('#list').css({ marginTop:bar_h+40, marginBottom:bar_h});

  $('#search_str').on('input', _.debounce(function(){
    var searchStr = $("#search_str").val();

    if (searchStr == "") $("#search_x").hide();
    else $("#search_x").show();

    Session.set('searchStr', searchStr);
  }, 200) );
});

Template.list.onDestroyed(function(){
  var bar_h = 80;

  $('body').removeClass('light_bg');
});

/*
 * List initiatives
 */

Template.infiniteList.helpers({
  listItems: function(){
    var context = Session.get('currentContext');
    var filters = JSON.parse(Session.get('filters'));
    filters = _.extend(filters['general'], filters[context]);
    var query = {};

    var searchStr = Session.get('searchStr');
    if (searchStr != "") {
      check(searchStr, String);
      query['name'] = { $regex: searchStr, $options: 'i' };
    }

    // build query for mongodb
    _.each(_.keys(filters), function(property){
      var selected = _.filter(filters[property], function(i){ return i.selected })
      if (selected.length) {
        if (property != 'mechanisms')
          query[property] = { $in: _.map(selected, function(s){ return s._id }) }
        else {
          mechanismIds = _.map(selected, function(s){ return s._id });
          query['methods'] = {
            $in: Methods
              .find({mechanism: {$in: mechanismIds}}, {fields: {_id: true}})
              .map(function(i) {return i._id} )
            }
        }
      }
    });

    // get items
    var items;
    if (context == 'signals') {
      items = Signals.find(query, {
        sort: { name: 1},
        limit: 50,
        fields: {
          name: 1,
          placesOfOrigin: 1,
          incidencyReach: 1,
          purpose: 1,
          technologyType: 1,
          labels: 1
        }
      }).fetch();
    } else {
      items = Hubs.find(query, {
        sort: { name: 1},
        limit: 50,
        fields: {
          name: 1,
          placesOfOrigin: 1,
          incidencyReach: 1,
          nature: 1,
          isSponsor: 1,
          labels: 1
        }
      }).fetch();
    }

    return items;
  }
});
