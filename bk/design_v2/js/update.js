window.onload = function (){

	var i, a, b, c, d, itm1, itm2, itm3;
	var div, ul, li, span, img;

	var dbody = document.body,
		json,
		page_y,
		wn,
		win_w,
		win_h,
		bt_event,
		lg,
		mobile,
		delay,
		cur_layout,
		cur_target,
		n_hubs,
		n_signals;

	var dur = 350, // animation
	 	dur2 = 550, // layout
		in_out = "easeInOutQuart",
		_out = "easeOutQuart",
		in_ = "easeInQuart";

	var root = location.origin;
	var path = location.pathname.split('/');

	for(i=0; i<path.length-1; i++){
		root += path[i] + '/';
	}

	var hub_filters = [];
	var sig_filters = [];

	var labels = {
		hub: { "_pt":"hub" },
		hubs: { "_pt":"hubs" },
		signal: { "_pt":"sinal" },
		signals: { "_pt":"sinais" },
		kind: { "_pt":"natureza" },
		method: { "_pt":"método" }
	}

	console.log( "ROOT: " + root );

	var colors = {
		bg1:'#212733', // map bg
		bg2:'#2d3340', // bt bg
		bg3:'#262c38', // bt hover
		blue:'#6cadd9',
		wt:'#fff',
		hub:['#d87d7d','#adcc8f'],
		sig:['#adcc8f','#9e8fcc']
	}

	var scale_kind,
		scale_method;

	// map vars

	var c_total;
	var c_parcial;
	var svg_map;

	var svg_nodes;
	var svg_force;
	var svg_circles;

	//////////////////////////////// OBJECTS ////////////////////////////////

	function get(id){ return document.getElementById(id)};
	function reg(id){ window[id] = get(id) }

	reg('menu');
	reg('menu_bt');
	reg('menu_close');
	reg('email');
	reg('twitter');
	reg('github');
	reg('fbook');

	reg('container');

	reg('home');
	reg('intro');
	reg('explore');
	reg('credit_who');
	reg('credit_what');

	reg('header');
	reg('language');
	reg('update_logo');

	reg('map_container');
	reg('map');
	reg('legends');
	reg('legend_sig_title');
	reg('legend_hub_title');
	reg('zoom');
	reg('zoom_in');
	reg('zoom_out');

	reg('control');
	reg('help_bt');
	reg('help');
	reg('help_x');
	reg('help_next');
	reg('help_prev');
	reg('help_nav_pos');
	reg('help_title');
	reg('help_text');
	reg('help_frame');
	reg('circles');
	reg('circles_out');
	reg('circles_in');

	reg('control_left');
	reg('control_hub_lb');
	reg('control_sig');
	reg('control_sig_lb');

	reg('control_center');
	reg('control_score_pos');
	reg('score');
	reg('score_nb');
	reg('score_lb');
	reg('search');
	reg('search_str');
	reg('search_x');

	reg('control_right');
	reg('control_filters');
	reg('filters');
	reg('filters_lb');
	reg('filters_nb');
	reg('trash');

	//////////////////////////////// MOBILE ////////////////////////////////

	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
		BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
		any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};

	if( isMobile.any() ){
		mobile = true;
		$(dbody).addClass('mobile');
		bt_event = 'touchstart';
	}else{
	    mobile = false;
		bt_event = 'click';
	}

	console.log( "MOBILE: " + mobile );

	//////////////////////////////// HEADER ////////////////////////////////

	menu.open = false;

	$(menu_bt).on( bt_event, function (){
		open_menu();
	});

	$(menu_close).on( bt_event, function (){
		close_menu();
	});

	if(!mobile){
		$(menu).on('mouseleave', function (){
			close_menu();
		});
	}

	function open_menu(){
		menu.open = true;
		$(menu).animate({left:0}, dur, _out);
		$(container).animate({left:$(menu).width()/5, opacity:.3}, dur, _out);
	}

	function close_menu(){
		menu.open = true;
		$(menu).animate({left:-1*$(menu).width()}, dur, _out);
		$(container).animate({left:0, opacity:1}, dur, _out);
	}

	// LOGO

	$(update_logo).on(bt_event, function(){
		if(cur_layout == 'map') set_layout('home');
		if(cur_layout == 'list') set_layout('map');
	});

	// LG

	var lgs = [
		{lg:"_pt", lb:"PT"},
		{lg:"_es", lb:"ES"},
		{lg:"_en", lb:"EN"}
	];

	function set_lg(_lg){
		for( i in lgs ){
			if( lgs[i].lg != _lg ) $(lgs[i].li).removeClass('selected');
			else $(lgs[i].li).addClass('selected');
		}
		sessionStorage.setItem('lg', _lg);
		lg = _lg;
		// update text
	}

	for( i in lgs ){
		li = document.createElement('li');
		li.lg = lgs[i].lg;
		$(li).html(lgs[i].lb);
		$(li).addClass("lang");
		lgs[i].li = li;
		language.appendChild(li);
		$(li).on(bt_event, function(){
			set_lg(this.lg);
		});
		if( i < lgs.length-1){
			li = document.createElement('li');
			li.className = "lg_sep";
			language.appendChild(li);
		}
	}

	if( !sessionStorage.getItem('lg')) set_lg('_pt'); // defaut lang
	else  set_lg(sessionStorage.getItem('lg'));

	//////////////////////////////// WINDOW ////////////////////////////////

	function resize(){
		win_w = $( window ).width();
		win_h = $( window ).height();
		if(mobile){
			if(win_w < win_h) $(dbody).addClass('port');
			else $(dbody).addClass('land');
		}

		$(list).height(win_h - 200);

		if(cur_layout == 'home'){
			$(control).css({top:win_h});
			$(map_container).height(win_h);
		}
		if(cur_layout == 'map'){
			$(list).css({top:win_h});
			$(control).css({top:win_h - 80});
			$(map_container).height(win_h - 80);
			$(filters).height(win_h - 80); // aqui. no resize da bug
		}
		if(cur_layout == 'list') $(filters).height(win_h - 160); // aqui. no resize da bug

	}

	window.onresize = resize;
	resize();

	//////////////////////////////// LAYOUTS ////////////////////////////////

	$(map).css({backgroundSize:'100%', opacity:.2});

	function set_layout(lay){
		cur_layout = lay;
		switch(lay){
			case 'home':
				if(filters.open){
					close_filters();
					delay = dur;
				} else {
					delay = 0;
				}
				setTimeout( function(){
					$(home).delay(dur2/3).fadeIn(dur2/3);
					$(update_logo).animate({top:-32}, dur2, in_out);
					$(control).animate({top:'100%'}, dur2, in_out);
					$(legends).animate({left:-400}, dur2, in_out);
					$(zoom).animate({right:-50}, dur2, in_out);
					$(map).animate({backgroundSize:'100%', opacity:.2}, dur2, in_out);
					$(map_container).animate({height:win_h, opacity:1}, dur2, in_out);
					$(list).animate({ top: win_h }, dur2, in_out);
					$(control_score).css({backgroundImage:'url(layout/up.png)'});
					$(filters).css({bottom:80, height:win_h - 80});
					$(circles).fadeOut(dur2, in_out);
					$(help_bt).fadeOut(dur2, in_out);
				}, delay);
			break;
			case 'map':
				if(filters.open){
					close_filters();
					delay = dur;
				} else {
					delay = 0;
				}
				setTimeout( function(){
					$(home).delay(dur2/3).fadeOut(dur2/3);
					$(update_logo).animate({top:32}, dur2, in_out);
					$(legends).animate({left:30}, dur2, in_out);
					$(zoom).animate({right:25}, dur2, in_out);
					$(map).animate({backgroundSize:'45%', opacity:1}, dur2, in_out);
					$(map_container).animate({height:win_h-80, opacity:1}, dur2, in_out);
					$(control).animate({top:win_h - 80}, dur2, in_out);
					$(filters).css({bottom:80, height:win_h - 80});
					$(list).animate({ top: win_h }, dur2, in_out);
					$(flap_hub).fadeOut(dur2/2, function(){ $(flap_hub).css({ bottom:'inherit', top:0 })});
					$(flap_sig).fadeOut(dur2/2, function(){ $(flap_sig).css({ bottom:'inherit', top:0 })});
					if(cur_target == 'hub') $(flap_hub).fadeIn(dur2/2);
					if(cur_target == 'sig') $(flap_sig).fadeIn(dur2/2);
					$(circles).fadeIn(dur2, in_out);
					$(help_bt).fadeIn(dur2, in_out);
					setTimeout( function(){
						$(control_score).css({backgroundImage:'url(layout/up.png)'});
						$(control_score_lb).html('LISTA');
					}, dur2/2);
				}, delay);
			break;
			case 'list':
				if(filters.open){
					close_filters();
					delay = dur;
				} else {
					delay = 0;
				}
				setTimeout( function(){
					$(control).animate({top:80}, dur2, in_out);
					$(filters).css({bottom:0, height:win_h - 160})
					$(list).animate({ top:200 }, dur2, in_out);
					$(map_container).animate({height:win_h-240, opacity:0}, dur2, in_out);
					$(flap_hub).fadeOut(dur2/2, function(){ $(flap_hub).css({ bottom:0, top:'inherit' }) });
					$(flap_sig).fadeOut(dur2/2, function(){ $(flap_sig).css({ bottom:0, top:'inherit' }) });
					if(cur_target == 'hub') $(flap_hub).fadeIn(dur2/2);
					if(cur_target == 'sig') $(flap_sig).fadeIn(dur2/2);
					$(circles).fadeOut(dur2, in_out);
					$(help_bt).fadeOut(dur2, in_out);
					setTimeout( function(){
						$(control_score).css({backgroundImage:'url(layout/down.png)'});
						$(control_score_lb).html('MAPA');
					}, dur2/2);
				}, delay);
			break;
		}
	}

	//////////////////////////////// HOME ////////////////////////////////

	$(intro).on(bt_event, function(){
		console.log('INTRO!');
	})

	$(explore).on(bt_event, function(){
		set_layout('map');
	})

	//////////////////////////////// MAP ////////////////////////////////


	function calc_radius(area){
		return 30 * Math.sqrt(area / Math.PI);
	}

	function tick(e) {
		svg_circles.each(gravity(.08 * e.alpha))
		.each(collide(.1))
		.attr('transform', function (d) {
			return 'translate(' + d.x + ' ' + d.y + ')';
		});
	}

	// Move nodes toward cluster focus.
	function gravity(alpha) {
		return function (d) {
			d.y += (d.cy - d.y) * alpha;
			d.x += (d.cx - d.x) * alpha;
		};
	}

	// Resolve collisions between nodes.
	function collide(alpha) {
		var quadtree = d3.geom.quadtree(svg_nodes);
		return function (d) {
			var r = d.radius,
			nx1 = d.x - r,
			nx2 = d.x + r,
			ny1 = d.y - r,
			ny2 = d.y + r;
			quadtree.visit(function (quad, x1, y1, x2, y2) {
				if (quad.point && (quad.point !== d)) {
					var x = d.x - quad.point.x,
					y = d.y - quad.point.y,
					l = Math.sqrt(x * x + y * y),
					r = d.radius + quad.point.radius + (d.color !== quad.point.color);
					if (l < r) {
						l = (l - r) / l * alpha;
						d.x -= x *= l;
						d.y -= y *= l;
						quad.point.x += x;
						quad.point.y += y;

					}
				}
				return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
			});
		};
	}

	function create_map(){

		var list;
		var nodes;
		var color;
		var group;

		// if(trg == 'hub'){
		// 	nodes = json.filters.kind.itens;
		// 	color = scale_kind;
		// 	list = json.hubs;
		// 	group = "kind";
		// }
		//
		// if(trg == 'sig'){
		// 	nodes = json.filters.method.itens;
		// 	color = scale_method;
		// 	list = json.signals;
		// 	group = "method";
		// }

		// svg_map.selectAll("*").remove();

		svg_nodes = json.hubs.map(function (d,i) {
			return {
				id: d.id,
				signals: d.signals,
				fill: scale_kind(d.kind),
				cx: 1000,
				cy: 1000,
			};
		});

		svg_force = d3.layout.force()
			.nodes(svg_nodes)
			.size([2000, 2000])
			.gravity(0)
			.charge(1)
			.on('tick', tick)
			.start();

		// circles

		svg_circles = svg_map.selectAll('g')
		.data(svg_nodes)
		.enter()
		.append('g')
		.attr('style', 'cursor:pointer')
		.on('click', function(d){
		    // alert('CÍRCULO ' + d.ID);
		})
		// .call(svg_force.drag)
		.each(function (d, i) {

			c_total = d3.select(this)
				.append('circle')
				.attr('id', 'circ' + d.id + '_total')
				.attr('fill-opacity', 1)
				.attr('r', 5)
				.attr('fill', function (d) {
					return d.fill;
				});

			d.total = 0;

			for( a in d.signals ){
				d.total += 5;
				d3.select(this)
					.append('circle')
					.attr('r', 6 + d.total)
					.attr('stroke', '#fff' )
					.attr('fill', 'none' )
					.attr('stroke-opacity', .2 )
					.attr('stroke-width', .5 )
			}


			d.radius = 10 + d.total;


			// c_parcial = d3.select(this)
			// 	.append('circle')
			// 	.attr('id', 'circ' + i + '_parcial')
			// 	.attr('fill', function (d) {
			// 		return d.fill;
			// 	});

			// d.c_total = c_total;
			// d.c_parcial = c_parcial;
			// d.total = 0;
			// d.parcial = 0;

			// d.list = [];
			// list.forEach( function( sd, si ){
			// 	if(sd[group].indexOf( d.id ) >= 0) {
			// 		d.total ++;
			// 		d.list.push(sd);
			// 	}
			// });
			//
			// d.radius = calc_radius(d.total) + 1;
			// d.c_total.attr('r', calc_radius(d.total));

		});

		// set_all_circles();

	}

	function set_all_circles(){
		svg_circles = svg_map.selectAll('g')
		.each( function (d, i) {
			d.parcial = 0;
			d.list.forEach( function( sd, si ){
				if(sd.visible) d.parcial ++;
			});
			d.c_parcial.transition().duration(dur).attr('r', calc_radius(d.parcial));
		});
	}

	// legend

	// zoom

	// this

	function set_target(trg){
		console.log('target: ' + trg);
		cur_target = trg;
		switch(trg){
			case "hub":
				// $(legend_hub).delay(dur/2).animate({left:0}, dur/2);
				// $(legend_sig).animate({left:-300}, dur/2 );
				$(list_hub).fadeIn(dur);
				$(control_hub).addClass('selected');
				$(control_hub_lb).animate({opacity:1}, dur);
				$(flap_hub).fadeIn(dur);
				$(control_sig).removeClass('selected');
				$(control_sig)
					.css({backgroundColor:'#262c38'})
					.animate({backgroundColor:'#2d3340'}, dur/2, function(){
						$(this).css({backgroundColor:''})
					});
				$(list_sig).hide();
				$(control_sig_lb).animate({opacity:.2}, dur/2);
				$(flap_sig).fadeOut(dur/2);
				$(circles_out).html(labels.kind[lg].toUpperCase());
				$(circles_in).html(labels.hubs[lg].toUpperCase());
				$(score_nb).html(n_hubs);
				$(score_lb).html(labels.hubs[lg].toUpperCase());
				// for(i in sig_filters) $(sig_filters[i]).hide();
				// for(i in hub_filters) $(hub_filters[i]).show();
			break;
			case "sig":
				// $(legend_sig).delay(dur/2).animate({left:0}, dur/2 );
				// $(legend_hub).animate({left:-300}, dur/2 );
				$(list_sig).fadeIn(dur);
				$(control_sig).addClass('selected');
				$(control_sig_lb).animate({opacity:1}, dur );
				$(flap_sig).fadeIn(dur);
				$(control_hub).removeClass('selected');
				$(control_hub)
					.css({backgroundColor:'#262c38'})
					.animate({backgroundColor:'#2d3340'}, dur/2, function(){
						$(this).css({backgroundColor:''})
					});
				$(list_hub).hide();
				$(control_hub_lb).animate({opacity:.2}, dur/2 );
				$(flap_hub).fadeOut(dur/2);
				$(circles_out).html(labels.method[lg].toUpperCase());
				$(circles_in).html(labels.signals[lg].toUpperCase());
				$(score_nb).html(n_signals);
				$(score_lb).html(labels.signals[lg].toUpperCase());
				// for(i in hub_filters) $(hub_filters[i]).hide();
				// for(i in sig_filters) $(sig_filters[i]).show();
			break;
		}

		create_map(trg);
		//$(map).fadeOut(dur/2, function(){ $(map).css({ backgroundImage:'url(layout/bg_map_'+ trg +'.png)' }).fadeIn(dur/2); })
	}

	$(control_hub).on(bt_event, function(){
		if( cur_target != 'hub') set_target('hub');
	});

	$(control_sig).on(bt_event, function(){
		if( cur_target != 'sig') set_target('sig');
	});

	// filters

	filters.open = false;

	function open_filters() {
		filters.open = true;
		$(filters).animate({right:0}, dur, in_out);
		$(control_filters).css({backgroundImage:'url(layout/minus.png)'});
	}

	function close_filters() {
		filters.open = false;
		$(filters).animate({right:'-34%'}, dur, in_out);
		$(control_filters).css({backgroundImage:'url(layout/plus.png)'});
	}

	$(control_filters).on( bt_event, function(){
		if(filters.open){
			close_filters();
		}else{
			open_filters();
		}
	})

	// search

	$(search_str).on('click', function(event){
		 event.stopPropagation();
	});

	//////////////////////////////// HELP ////////////////////////////////

	var help_itens = [
		{
			"obj": control_left,
			"cont": control,
			"title":{
				"_pt": "ESCOLHA HUBS OU SINAIS"
			},
			"text":{
				"_pt": "alvo : Lorem ipsum dolor. Sit amet sollicitudin. Pellentesque tortor cursus id ullamcorper in quisque elit lobortis. Phasellus velit faucibus laoreet blandit integer. Ac ornare eget mattis ut ultrices. Pulvinar et convallis. Eleifend ac ante aliquam nec eget. Egestas quis odio posuere id turpis magnis wisi laoreet. Ut tincidunt risus."
			}
		},
		{
			"obj": control_right,
			"cont": control,
			"title":{
				"_pt": "FILTROS"
			},
			"text":{
				"_pt": "Filtros : Lorem ipsum dolor. Sit amet sollicitudin. Pellentesque tortor cursus id ullamcorper in quisque elit lobortis. Phasellus velit faucibus laoreet blandit integer. Ac ornare eget mattis ut ultrices. Pulvinar et convallis. Eleifend ac ante aliquam nec eget. Egestas quis odio posuere id turpis magnis wisi laoreet. Ut tincidunt risus."
			}
		},
		{
			"obj": control_center,
			"cont": control,
			"title":{
				"_pt": "LISTA DE RESULTADOS"
			},
			"text":{
				"_pt": "lista : Lorem ipsum dolor. Sit amet sollicitudin. Pellentesque tortor cursus id ullamcorper in quisque elit lobortis. Phasellus velit faucibus laoreet blandit integer. Ac ornare eget mattis ut ultrices. Pulvinar et convallis. Eleifend ac ante aliquam nec eget. Egestas quis odio posuere id turpis magnis wisi laoreet. Ut tincidunt risus."
			}
		}
	];

	help_itens.pos = 0;

	function clone(trg, cont){
		return {
			width: $(trg).width(),
			height: $(trg).height(),
			left: $(trg).position().left,
			top: $(cont).position().top
		}
	}

	function help_pos(pos){
		help_itens.pos = pos;
		var cln = clone( help_itens[pos].obj, help_itens[pos].cont );
		$(help_frame)
			.css({
				width: cln.width,
				height: cln.height,
				left: cln.left,
				top: cln.top
			});
		$(help_title).html(help_itens[pos].title[lg]);
		$(help_text).html(help_itens[pos].text[lg]);
		$(help_nav_pos).html( (help_itens.pos+1) + ' / ' + help_itens.length);

		if (pos == 0) $(help_prev).css({opacity: .2, cursor:'default'});
		else $(help_prev).css({opacity: 1, cursor:'pointer'});

		if (pos == help_itens.length-1) $(help_next).css({opacity: .2, cursor:'default'});
		else  $(help_next).css({opacity: 1, cursor:'pointer'});

	}

	$(help_x).on(bt_event,function(){
		$(help).fadeOut(dur);
	});

	$(help_next).on(bt_event,function(){
		if(help_itens.pos < help_itens.length-1) help_pos(help_itens.pos + 1)
	})

	$(help_prev).on(bt_event,function(){
		if(help_itens.pos > 0) help_pos(help_itens.pos - 1)
	})

	$(help_bt).on(bt_event, function(){
		help_pos(0);
		$(help).fadeIn(dur);
	});

	//////////////////////////////// LIST ////////////////////////////////

	$(control_center).on(bt_event, function () {
		if(cur_layout == 'map') set_layout('list');
		else set_layout('map');
	})

	//////////////////////////////// FILTERS ////////////////////////////////

	var filter_h = 25;
	filters.score = 0;

	function reset_filters_score(clear){
		filters.score = 0;
		$(filters_nb).css({opacity:.2}).html(0);
		for( i in json.filters ){
			json.filters[i].active = [];
			$(json.filters[i].nb).css({opacity:.2}).html(0);
			if(clear){
				for(b in json.filters[i].itens){
					json.filters[i].itens[b].on = false;
				}
			}
		}
	}

	function check_filters() {
		reset_filters_score(false);
		for ( i in json.filters ) {
			var all_off = true;
			for( a in json.filters[i].itens ) {
				if( json.filters[i].itens[a].on ) {
					all_off = false;
					filters.score ++;
					json.filters[i].active.push(json.filters[i].itens[a].id);
					$(json.filters[i].itens[a].li).addClass('selected');
				}else{
					$(json.filters[i].itens[a].li).removeClass('selected');
				}
			}
			// all filters off = no filter = all on
			for( a in json.filters[i].itens ){
				if(all_off)	$(json.filters[i].itens[a].li).css({ opacity:1 });
				else $(json.filters[i].itens[a].li).css({  opacity:'' });
			}
			if(filters.score > 0){
				$(filters_nb).css({opacity:1}).html( filters.score );
			}
			if(json.filters[i].active.length > 0){
				$(json.filters[i].nb).css({opacity:1}).html( json.filters[i].active.length );
			}

		}

		//trash
		if(filters.score > 0) $(trash).removeClass('empty');
		else $(trash).addClass('empty');

		// hubs list
		n_hubs = update_list( json.hubs, 'hub' );

		// signals list
		n_signals = update_list( json.signals, 'sig' );

	}

	$(trash).on(bt_event, function(){
		reset_filters_score(true);
		check_filters();
	});

	function update_list(data, cod){
		var n = data.length;
		for(a in data){
			d = data[a];
			$(d.li).show();
			d.visible = true;
			for( i in json.filters ){
				if( d[i] &&	d.visible && json.filters[i].active.length > 0 ){
					var found = false;
					if(i != 'method' && i != 'kind'){
						if(	json.filters[i].active.indexOf( d[i] )  >= 0 ){
								found = true;
							}
					}else{
						for( b in d[i]){
							if( json.filters[i].active.indexOf( d[i][b] ) >= 0 ) {
								found = true;
							}
						}
					}
					if(	!found ){
						d.visible = false;
						n --;
						$(d.li).hide();
					}
				}
			}
		}
		if(cur_target == cod) $(score_nb).html(n);
		set_all_circles();
		return n;
	}

	function reset_open_filters(ignore){
		for( i in json.filters ){
			if(json.filters[i].open && json.filters[i] != ignore ) toggle_list(json.filters[i]);
		}
	}

	function toggle_list(trg){
		if(trg.open){
			trg.open = false;
			$(trg.list).animate({height: 0 }, dur, in_out, function(){
				$(trg).css({ backgroundImage: 'url(layout/plus.png)'});
			});
		}else{
			trg.open = true;
			$(trg).css({ backgroundImage: 'url(layout/minus.png)'});
			$(trg.list).animate({height: 30 + trg.itens.length * filter_h}, dur, in_out);
		}
	}

	function toggle_filter(trg){
		if(trg.on){
			trg.on = false;
		}else{
			trg.on = true;
		}
		check_filters();
	}

	function sep_filters(tx){
		div = document.createElement('div');
		$(div)
			.addClass('sep')
			.html(tx);
		filters.appendChild(div);
	}

	function create_filters(data, target){

		var title;

		title = document.createElement('div');
		$(title)
			.addClass('title')
			.html(data[lg]);
		filters.appendChild(title);

		span = document.createElement('span');
		$(span)
			.html(0)
			.addClass('counter');
		title.appendChild(span);

		ul = document.createElement('ul');
		$(ul)
			.addClass('group')
			.height(0);
		filters.appendChild(ul);

		$(title).on('click', function(){
			reset_open_filters(this.data);
			toggle_list(this.data);
		});

		if(target){
			target.push(title);
			target.push(ul);
		}

		title.data = data;
		data.list = ul;
		data.nb = span;
		data.open = false;
		data.score = 0;
		data.active = [];

		for( i in data.itens ){

			d = data.itens[i];

			li = document.createElement('li');
			li.on = false;
			$(li)
				.addClass('filter')
				.css({opacity:1})
				.html( d[lg] )
			ul.appendChild(li);

			$(li).on('click', function(){
				toggle_filter(this.data);
			});

			d.li = li;
			li.data = d;

		}
	}

	function arr_search( arr, id ){
		for( var i in arr ){
			if( arr[i].id && arr[i].id == id ) return arr[i];
		}
	}

	//////////////////////////////// LOAD ////////////////////////////////

	function load(){

		simulate_db(json);
		console.log(json);

		// hubs
		n_hubs = json.hubs.length;

		for( i in json.hubs ){

			d = json.hubs[i];

			li = document.createElement('li');
			li.data = json.hubs[i];
			$(li)
				.addClass('list_item')
				.on('click', function(){
					console.log(this.data.name);
				});

			d.li = li;

			img = new Image();
			img.src = "layout/go.png";
			li.appendChild(img);

			div = document.createElement('div');
			$(div)
				.addClass('title')
				.html(d.name)
			li.appendChild(div);

			div = document.createElement('div');
			$(div)
				.addClass('subtitle')
				.html( arr_search( json.filters.origin.itens, d.origin )[lg] )
			li.appendChild(div);

			list_hub.appendChild(li);
		}

		// signals
		n_signals = json.signals.length;

		for( i in json.signals ){

			d = json.signals[i];

			li = document.createElement('li');
			li.data = json.signals[i];
			$(li)
				.addClass('list_item')
				.on('click', function(){
					console.log(this.data.name);
				});

			d.li = li;

			img = new Image();
			img.src = "layout/go.png";
			li.appendChild(img);

			div = document.createElement('div');
			$(div)
				.addClass('title')
				.html(d.name)
			li.appendChild(div);

			div = document.createElement('div');
			$(div)
				.addClass('subtitle')
				.html( arr_search(json.filters.origin.itens, d.origin)[lg] )
			li.appendChild(div);

			list_sig.appendChild(li);

		}

		// scale_kind = d3.scale.linear().domain([0,json.filters.method.itens.length-1]).range(colors.hub).interpolate(d3.interpolateHcl);
		scale_kind = d3.scale.linear().domain([0,json.filters.kind.itens.length-1]).range(colors.sig).interpolate(d3.interpolateHcl);

		$(legend_hub).height(json.filters.kind.itens.length * 21 );
		// $(legend_sig).height(json.filters.method.itens.length * 21 );

		create_filters(json.filters.origin, false);
		create_filters(json.filters.coverage, false);
		sep_filters("FILTROS DE HUBS");
		create_filters(json.filters.kind, hub_filters);
		sep_filters("FILTROS DE SINAIS");
		create_filters(json.filters.method, sig_filters);
		create_filters(json.filters.purpose, sig_filters);
		create_filters(json.filters.type, sig_filters);

		reset_filters_score(true);

		set_layout('home');

		//method legend

		// $(legend_sig_title).html( json.filters.method[lg] );

		// for( i in json.filters.method.itens ){
		//
		// 	// legend
		//
		// 	d = json.filters.method.itens[i];
		// 	li = document.createElement('li');
		// 	$(li)
		// 		.addClass('legend')
		// 	legend_sig.appendChild(li);
		//
		// 	div = document.createElement('div');
		// 	$(div)
		// 		.addClass('color')
		// 		.css({background:scale_method(i)})
		// 	li.appendChild(div);
		//
		// 	div = document.createElement('div');
		// 	$(div)
		// 		.addClass('lb')
		// 		.html( d[lg] )
		// 	li.appendChild(div);
		//
		// }

		// hub legend

		// $(legend_hub_title).html( json.filters.kind[lg] );

		for( i in json.filters.kind.itens ){

			d = json.filters.kind.itens[i];

			li = document.createElement('li');
			$(li)
				.addClass('legend')
			legend_hub.appendChild(li);

			div = document.createElement('div');
			$(div)
				.addClass('color')
				.css({background:scale_kind(i)})
			li.appendChild(div);

			div = document.createElement('div');
			$(div)
				.addClass('lb')
				.html( d[lg] )
			li.appendChild(div);

		}

		// SVG MAP

		svg_map = d3.select('#map')
			.append('svg')
			.attr('id', 'svg_map');


		// X central teste
		// svg_sig.append('line')
		// 	.attr('stroke', '#f00')
		// 	.attr('x1',0)
		// 	.attr('y1',0)
		// 	.attr('x2',2000)
		// 	.attr('y2',2000)
		//
		// svg_sig.append('line')
		// 	.attr('stroke', '#f00')
		// 	.attr('x2',0)
		// 	.attr('y2',2000)
		// 	.attr('x1',2000)
		// 	.attr('y1',0)


		// initial target: signals

		set_target('sig');

	} // load

	//////////////////////////////// LOAD EXTERNAL DATA ////////////////////////////////

	$.ajax({
		url: 'data.json',
		dataType: 'json',
		success: function(data){

			json = data;
			load();
		}
	});


} // window load


	/*

	"hubs":[
		{
			"name":"",
			"kind":1a12,
			"origin":1a5,
			"coverage":1a4
		}
	],
	"signals":[
		{
			"name":"signal title",
			"method":[1a9],
			"origin":1a5,
			"coverage":1a4
			"type":1a5,
			"purpose":1a2
		}
	]

	*/

function rand(n){
	return Math.ceil(Math.random()*n);
}

function rand_shift(n){
	var shift = Math.random();
	if(shift <= .2)	return Math.ceil(Math.random()*n*20);
	if(shift > .2 && shift <= .5)	return Math.ceil(Math.random()*n*10);
	if(shift > .5 && shift <= .8) return Math.ceil(Math.random()*n*5);
	else return Math.ceil(Math.random()*n);
}

function simulate_db(db){

	for( var l=1; l<livros.length; l++ ){
		var livro = {};
		livro.autor = livros[l].split('-')[1];
		livro.titulo = livros[l].split('-')[0];
		if(livro.titulo.indexOf(',') >= 0){
			livro.titulo = livro.titulo.split(',')[1] + ' ' + livro.titulo.split(',')[0];
		}
		livros[l] = livro;
	}

	for(var h=1; h<=215; h++){
		var hb = {};
		hb.id = h;
		hb.visible = true;
		hb.name = livros[rand(livros.length-1)].autor;
		hb.kind = rand(12);
		hb.origin = rand(5);
		hb.coverage = rand(4);
		hb.signals = [];
		var rand_sig = rand(4);
		for( var r=0; r<rand_sig; r++ ){
			hb.signals.push(rand(445));
		}
		db.hubs.push(hb);
	}

	for(var s=1; s<=445; s++){
		var sg = {};
		sg.id = s;
		sg.visible = true;
		sg.name = livros[rand(livros.length-1)].titulo;
		sg.method = [rand_shift(9),rand_shift(9)];
		sg.origin = rand(5);
		sg.coverage = rand(4);
		sg.type = rand(5);
		sg.purpose = rand(2);
		db.signals.push(sg);
	}
}

var livros = [null,
"Abel e Helena - Artur Azevedo",
"Agosto - Rubem Fonseca",
"Águia e a Galinha, A - Leonardo Boff",
"Alfarrábios - José de Alencar",
"Alienista, O - Machado de Assis",
"Alguma Poesia - Carlos Drummond de Andrade",
"Alguma Poesia - Machado de Assis",
"Alma - Oswald de Andrade",
"Alma do Lázaro, A - José de Alencar",
"Alma Inquieta - Olavo Bilac",
"Alquimista, O - Paulo Coelho",
"Americanas - Machado de Assis",
"Amor com Amor se Paga - França Júnior",
"Amor de Perdição - Josué Guimarães",
"Amor e Pátria - Joaquim Manuel de Macedo",
"Amor por Anexins - Artur Azevedo",
"Ana Terra, Érico Veríssimo",
"Antes da Missa - Machado de Assis",
"Antes do Baile Verde - Lygia Fagundes Telles",
"Aos Vinte Anos - Aluísio de Azevedo",
"Arcádia e a Inconfidência, A - Oswald de Andrade",
"Arquivos do inferno - Paulo Coelho",
"Asa Esquerda do Anjo, A - Lya Luft",
"Asas de um Anjo, As - José de Alencar",
"As horas nuas - Lygia Fagundes Telles",
"As Meninas - Lygia Fagundes Telles",
"Assassinatos na Academia Brasileira de Letras - Jô Soares",
"Assovio, Qorpo Santo",
"Ateneu, O - Raul Pompéia",
"Aventuras de Tibicuera, Érico Veríssimo",
"Bacia das Almas - Luiz Antônio de Assis Brasil",
"Bahia de Todos os Santos - Jorge Amado",
"Baladas para El Rei - Cecília Meireles",
"Balas de Estalo - Machado de Assis",
"Balé Branco, O - Carlos Heitor Cony",
"Bandoleiros - João Gilberto Noll",
"Barca de Gleyre, A - Monteiro Lobato",
"Batuque - Cecília Meireles",
"Baú de Ossos - Pedro Nava",
"Beira Mar - Pedro Nava",
"Beira Rio Beira Vida - Assis Brasil",
"Bela e a Fera, A - Clarice Lispector",
"Bela Madame Vargas, A - João do Rio",
"Bem Amado, O - Dias Gomes",
"Bola e o goleiro, A - Jorge Amado",
"Bons Dias - Machado de Assis",
"Bote de Rapé, O - Machado de Assis",
"Biblioteca - Lima Barreto",
"Boca do Inferno - Ana Miranda",
"Bom Crioulo - Adolfo Caminha",
"Bons Dias - Machado de Assis",
"Broquéis - Cruz e Sousa",
"Bruzundangas - Lima Barreto",
"Burgo - Gregório de Matos",
"Bugrinha - Afrânio Peixoto",
"Brida - Paulo Coelho",
"Cabeleira - Franklin Távora",
"Cabocla - Ribeiro Couto",
"Cacau - Jorge Amado",
"Cacto Vermelho, O - Lygia Fagundes Telles",
"Cães da Província - Luiz Antônio de Assis Brasil",
"Caetés - Graciliano Ramos",
"Café da Manhã - Dináh Silveira de Queiróz",
"Camilo Mortágua - Josué Guimarães",
"Caminhos cruzados - Érico Veríssimo",
"Canções - Cecília Meireles",
"Capitães da Areia - Jorge Amado",
"Capital Federal - Artur Azevedo",
"Caramuru - Frei José de Santa Rita Durão",
"Carnaval dos Animais, O - Moacyr Sclyar",
"Carne - Júlio Ribeiro",
"Carolina - Casimiro de Abreu",
"Carrilhões - Murilo Araújo",
"Cartas Chilenas - Tomaz Antonio Gonzaga",
"Cartas perto do Coração - Clarice Lispector",
"Carteira - Machado de Assis",
"Casa das Quatro Luas, A - Josué Guimarães",
"Casadas Solteiras - Martins Pena",
"Casa de Pensão - Álvares de Azevedo",
"Casadinha de Fresco - Artur Azevedo",
"Casa Fechada - Roberto Gomes",
"Casa Velha - Machado de Assis",
"Castelo no Pampa, Um - Luiz Antônio de Assis Brasil",
"Cavaleiro da Esperança, O - Jorge Amado",
"Cavalo Cego, O - Josué Guimarães",
"Cavalos e Obeliscos - Moacyr Sclyar",
"Cemitério - Lima Barreto",
"Centauro no Jardim, O - Moacyr Sclyar",
"Certa Entidade em Busca de Outra - Qorpo Santo",
"Certo Henrique Bertaso, Um - Érico Veríssimo",
"Ciclo das Águas, O - Moacyr Sclyar",
"Cidade Sitiada, A - Clarice Lispector",
"Cinco Minutos - José de Alencar",
"Ciranda de Pedra - Lygia Fagundes Telles",
"Clara dos Anjos - Lima Barreto",
"Clarissa - Érico Veríssimo",
"Clô Dias & Noites - Sérgio Jockymann",
"Comba Malina - Dináh Silveira de Queiróz",
"Com o Vaqueiro Mariano - João Guimarães Rosa",
"Como o Homem Chegou - Lima Barreto",
"Como Nasceram as Estrelas - Clarice Lispector",
"Como se Fazia um Deputado - França Júnior",
"Concerto Campestre - Luiz Antônio de Assis Brasil",
"Condição Judaica, A - Moacyr Sclyar",
"Conexão Beirute Teeran - Luis Eduardo Matta",
"Conto de Escola - Machado de Assis",
"Contos Fluminenses - Machado de Assis",
"Contos Gauchescos - Simões Lopes Neto",
"Contrastes e Confrontos - Euclides da Cunha",
"Coronel e o Lobisomem, O - José Cândido de Carvalho",
"Corpo de Baile - João Guimarães Rosa",
"Correspondência - Emílio de Menezes",
"Correspondência - Machado de Assis",
"Correspondências - Clarice Lispector",
"Cortiço, O - Aluízio Azevedo",
"Credor da Fazenda Nacional - Qorpo Santo",
"Criança, Meu Amor - Cecília Meireles",
"Crisálidas - Machado de Assis",
"Crítica - Machado de Assis",
"Crônica Trovada da Cidade de San Sebastian do Rio de Janeiro - Cecília Meireles",
"Dança de Espelhos - Kátya Chamma",
"Demônio e a Srta. Prym, O - Paulo Coelho",
"Demônio Familiar - José de Alencar",
"Depois do Último Trem - Josué Guimarães",
"Descrição da Ilha de Itaparica, Termo da Cidade da Bahia - Frei Manuel de Santa Rita Itaparica",
"Desencantos - Machado de Assis",
"Deuses de Raquel, Os - Moacyr Sclyar",
"Diário de um Mago, O - Paulo Coelho",
"Dicionário do Viajante Insólito - Moacyr Sclyar",
"Diplomático - Machado de Assis",
"Disciplina do Amor, A - Lygia Fagundes Telles",
"Discurso de Posse na Academia Brasileira de Letras - Emílio de Menezes",
"Diva - José de Alencar",
"Doença de Antunes - Lima Barreto",
"Dom Casmurro - Machado de Assis",
"Dom Supremo, O - Paulo Coelho",
"Dona Anja - Josué Guimarães",
"Dona Flor e Seus Dois Maridos - Jorge Amado",
"Donaguidinha - Manuel de Oliveira Paiva",
"Doutor Miragem - Moacyr Sclyar",
"Durante Aquele Estranho Chá: Perdidos e Achados - Lygia Fagundes Telles",
"E do meio do Mundo Prostituto, só Amores Guardei ao meu Charuto - Rubem Fonseca",
"Encarnação - José de Alencar",
"Enquanto a Noite não Chega - Josué Guimarães",
"Esaú e Jacó - Machado de Assis",
"Esganadas, As - Jô Soares",
"Espumas Flutuantes - Castro Alves",
"Estranha Nação de Rafael Mendes, A - Moacyr Scliar",
"Exército de um Homem Só, O - Moacyr Scliar",
"Falenas - Machado de Assis",
"Ferro e Fogo, A - Josué Guimarães",
"Festa no Castelo - Moacyr Sclyar",
"Floradas na Serra - Dináh Silveira de Queiróz",
"Gato no Escuro, O - Josué Guimarães",
"Gato Preto em Campo de Neve - Érico Veríssimo",
"Gaúcho, O - José de Alencar",
"Grande Mulher Nua, A - Luís Fernando Veríssimo",
"Guarani, O - José de Alencar",
"Guerra no Bom Fim, A - Moacyr Sclyar",
"Guida, Caríssima Guida - Dináh Silveira de Queiróz",
"Gula - O Clube dos Anjos - Luís Fernando Veríssimo",
"Helena - Machado de Assis",
"História da Província de Santa Cruz - Pero de Magalhães Gândavo",
"História de Quinze Dias - Machado de Assis",
"Histórias da Meia Noite - Machado de Assis",
"Histórias Escolhidas - Luís Fernando Veríssimo",
"História só pra Mim, Uma - Moacyr Sclyar",
"Histórias sem Data - Machado de Assis",
"Hora da Estrela, A - Clarice Lispector",
"Iaiá Garcia - Machado de Assis",
"I Juca Pirama - Gonçalves Dias",
"Ilha de Maré, À - Manuel Botelho de Oliveira",
"Incidente em Antares - Érico Veríssimo",
"Infância - Graciliano Ramos",
"Inocência - Visconde de Taunay",
"Insônia - Graciliano Ramos",
"Introdução à Lógica Amorosa - Moacyr Sclyar",
"Ira Implacável - Luis Eduardo Matta",
"Iracema - José de Alencar",
"Israel em Abril - Érico Veríssimo",
"Jardim do Diabo, O - Luís Fernando Veríssimo",
"Jubiabá - Jorge Amado",
"Laços de Família - Clarice Lispector",
"Lendas do Sul - Simões Lopes Neto",
"Lição de Botânica - Machado de Assis",
"Linhas Tortas - Graciliano Ramos",
"Livro Derradeiro, O - Cruz e Sousa",
"Lucíola - José de Alencar",
"Lugar ao Sol, Um - Érico Veríssimo",
"Luneta Mágica, A - Joaquim Manuel de Macedo",
"Macário - Álvares de Azevedo",
"Mad Maria - Márcio de Souza",
"Mãe do Freud, A - Luís Fernando Veríssimo",
"Maktub - Paulo Coelho",
"Manhã Transfigurada - Luiz Antônio de Assis Brasil",
"Manual do Guerreiro da Luz, O - Paulo Coelho",
"Manuelzão e Miguilim - Guimarães Rosa",
"Mão e a Luva, A - Machado de Assis",
"Margarida la Rocque - A Ilha dos Demônios - Dináh Silveira de Queiróz",
"Marido do Doutor Pompeu, O - Luís Fernando Veríssimo",
"Max e Os Felinos - Moacyr Sclyar",
"Memorial de Aires - Machado de Assis",
"Memórias de um Sargento de Milícias - Manuel António de Almeida",
"Memórias do Cárcere - Graciliano Ramos",
"Memórias Póstumas de Brás Cubas - Machado de Assis",
"Mentiras que os Homens Contam, As - Luís Fernando Veríssimo",
"Mês de Cães Danados - Moacyr Sclyar",
"Meus Lampejos - Geziel Ramos",
"Meu Último Dragão - Josué Guimarães",
"México - Érico Veríssimo",
"Minas de Prata, As - José de Alencar",
"Moço Loiro, O - Joaquim Manuel de Macedo",
"Monte Cinco, O - Paulo Coelho",
"Moreninha, A - Joaquim Manuel de Macedo",
"Mortalha de Alzira, A - Aluízio Azevedo",
"Mulato, O - Aluízio Azevedo",
"Mulher do Silva, A - Luís Fernando Veríssimo",
"Muralha, A - Dináh Silveira de Queiróz",
"Música ao Longe - Érico Veríssimo",
"Noite na Taverna, Álvares de Azevedo",
"Noites - Érico Veríssimo",
"Novas Crônicas da Vida Privada - Luís Fernando Veríssimo",
"O País do Carnaval - Jorge Amado",
"Ocidentais - Machado de Assis",
"Olga - Fernando Morais",
"Olhai os Lírios do Campo - Érico Veríssimo",
"Orelha de Van Gogh, A - Moacyr Sclyar",
"Orgia dos Duendes, A - Bernardo Guimarães",
"Orgias - Luís Fernando Veríssimo",
"Origem do Mênstruo, A - Bernardo Guimarães",
"Outras do Analista de Bagé - Luís Fernando Veríssimo",
"Páginas Recolhidas - Machado de Assis",
"País do Carnaval, O - Jorge Amado",
"Paixão segundo G.H., A - Clarice Lispector",
"Papéis Avulsos - Machado de Assis",
"Pata da Gazela, A - José de Alencar",
"Pecado - Lima Barreto",
"Pedro Gobá - Ezequiel Freire",
"Pele o Lobo - Artur Azevedo",
"Peru versus Bolívia - Euclides da Cunha",
"Pessoas Beneméritas - Gregório de Matos",
"Pequena História da República - Graciliano Ramos",
"Pequenas Criaturas - Rubem Fonseca",
"Poesias - Alphonsus de Guimarães",
"Poemas Malditos - Álvares de Azevedo",
"Poesias Coligidas - Castro Alves",
"Poética 1 - Gregório de Matos",
"Poética 2 - Gregório de Matos",
"Porque Não Se Matava - Lima Barreto",
"Primeiras Estórias - Guimarães Rosa",
"Primeiros Cantos - Gonçalves Dias",
"Primo da califórnia, O - Joaquim Manuel de Macedo",
"Princesa dos Cajueiros - Artur Azevedo",
"Prisioneiro, O - Érico Veríssimo",
"Prole do Corvo, A - Luiz Antônio de Assis Brasil",
"Prosopopéia - Bento Teixeira",
"Quarto de Légua em Quadro, Um - Luiz Antônio de Assis Brasil",
"Quem Casa, Quer Casa - Martins Pena",
"Quincas Borba - Machado de Assis",
"Relíquias de Casa Velha - Machado de Assis",
"Recordações do Escrivão Isaías Caminha - Lima Barreto",
"Relíquias de Casa Velha - Machado de Assis",
"Resto É Silêncio, O - Érico Veríssimo",
"Retirada da Laguna - Visconde de Taunay",
"Rio de Janeiro em 1877 - Artur Azevedo",
"Sacrifício - Franklin Távora",
"Saga - Érico Veríssimo",
"Sagarana - Guimarães Rosa",
"Santo e a Porca, O - Ariano Suassuna",
"São Bernardo - Graciliano Ramos",
"Semana - Machado de Assis",
"Senhora - José de Alencar",
"Senhor Embaixador, O - Érico Veríssimo",
"Sertões, Os - Euclides da Cunha",
"Solo de Clarineta - Érico Veríssimo",
"Sorriso do Lagarto, O - João Ubaldo Ribeiro",
"Sonhos D'Oro - José de Alencar",
"Souvenir iraquiano - Robinson dos Santos",
"Subterraneo do Morro Castelo - Lima Barreto",
"Suicida e o Computador, O - Luís Fernando Veríssimo",
"Suje se Gordo! - Machado de Assis",
"Suor - Jorge Amado",
"Suspiros Poéticos e Saudades - Domingos Gonçalves de Magalhães",
"Tambores Silenciosos, Os - Josué Guimarães",
"Tarde para Saber, É - Josué Guimarães",
"Tchau - Lygia Bojunga Nunes",
"Tempo de Felicidade - Geziel Ramos",
"Tempo e o Vento, O - Érico Veríssimo",
"Terra dos Meninos Pelados, A - Graciliano Ramos",
"Tenda dos Milagres - Jorge Amado",
"Tentação - Adolfo Caminha",
"Teresa Batista Cansada de Guerra - Jorge Amado",
"Terras do Sem Fim - Jorge Amado",
"Tieta do Agreste - Jorge Amado",
"Til - José de Alencar",
"Tio que Flutuava, O - Moacyr Sclyar",
"Traçando Paris - Luís Fernando Veríssimo",
"Traçando Roma - Luís Fernando Veríssimo",
"Triste Fim de Policarpo Quaresma - Lima Barreto",
"Ubirajara - José de Alencar",
"Última Bruxa, A - Josué Guimarães",
"Últimos Sonetos - Cruz e Sousa",
"Um e Outro - Lima Barreto",
"Um Lugar Ao Sol - Érico Veríssimo",
"Único Assassinato de Cazuza - Lima Barreto",
"Valkírias, As - Paulo Coelho",
"Vaqueano - Apolinário Porto-Alegre",
"Várias Histórias - Machado de Assis",
"Vastas Emoções e Pensamentos Imperfeitos - Rubem Fonseca",
"Velhinha de Taubaté, A - Luís Fernando Veríssimo",
"Venha ver o Pô do Sol - Lygia Fagundes Telles",
"Veronika decide Morrer - Paulo Coelho",
"Verso e Reverso - José de Alencar",
"Véspera de Reis - Artur Azevedo",
"Viagem - Graciliano Ramos",
"Viagem à Aurora do Mundo - Érico Veríssimo",
"Vida de Joana D'Arc, A - Érico Veríssimo",
"Vida e Morte de M. J. Gonzaga de Sá - Lima Barreto",
"Videiras de Cristal - Luiz Antônio de Assis Brasil",
"Vinte Anos - Álvares de Azevedo",
"Virtudes da Casa, As - Luiz Antônio de Assis Brasil",
"Viuvinha, A - José de Alencar",
"Viventes das Alagoas - Graciliano Ramos",
"Volta do Gato Preto, A - Érico Veríssimo",
"Voluntários, Os - Moacyr Sclyar",
"Xerloque da Silva em: O Rapto da Dorotéia - Josué Guimarães",
"Xerloque da Silva em: Os Ladrões da Meia Noite - Josué Guimarães",
"Zoeira - Luís Fernando Veríssimo	"
];