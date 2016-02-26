
// public vars
var i, a, b, c, d, itm1, itm2, itm3;
var div, ul, li, span, img, hr;
var dbody = document.body,
    mobile,
    bt_event,
    lg,
    delay;

var dur = 350, // animation
    dur2 = 550, // layout
    in_out = "easeInOutQuart",
    _out = "easeOutQuart",
    in_ = "easeInQuart";

// public funcions

function get(id){ return document.getElementById(id)};
function reg(id){ document[id] = get(id) }

var root = location.origin;
var path = location.pathname.split('/');
console.log( "ROOT: " + root );

var cur_page = path[path.length-1];
console.log( "cur_page: " + cur_page );

for(i=0; i<path.length-1; i++){
    root += path[i] + '/';
}

// placeholders for local functions
var resize_update = false;

// location

function navigate( html, cod ){
  var new_loc = root + html;
  if(cod) new_loc += "?cod=" + cod;
  document.location.href = new_loc;
}


// MOBILE

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

// Lang

var lgs = [
    {lg:"_pt", lb:"PT"},
    {lg:"_es", lb:"ES"},
    {lg:"_en", lb:"EN"}
];

function set_lg(_lg){
    sessionStorage.setItem('lg', _lg);
    lg = _lg;
    location.reload();
}

// header objects

reg('header');
reg('language');
reg('cur_lang');
reg('cur_lang_lb');
reg('update_logo');
reg('menu');
reg('menu_bt');
reg('menu_bts');
reg('menu_close');
reg('email');
reg('twitter');
reg('github');
reg('fbook');
reg('curtain');


// lg

if( !sessionStorage.getItem('lg')) set_lg("_pt"); // defaut lang
else lg = sessionStorage.getItem('lg');
console.log(sessionStorage.getItem('lg'));

for( i in lgs ){
    li = document.createElement('li');
    li.lg = lgs[i].lg;
    $(li).html(lgs[i].lb);
    $(li).addClass("lang");
    lgs[i].li = li;
    language.appendChild(li);
    $(li).on(bt_event, function(){
      if( lg == this.lg ) close_lang();
      else set_lg(this.lg);
    });

    if( li.lg == lg ){
      $(cur_lang_lb).html(lgs[i].lb);
      $(li).addClass('selected');
    }

    if( i < lgs.length-1){
        li = document.createElement('li');
        li.className = "lg_sep";
        language.appendChild(li);
    }
}

$(cur_lang).on('click', function(){
  open_lang();
  setTimeout(function(){
    close_lang();
  }, 3000);
});

// $(language).on('mouseleave', close_lang);

function close_lang(){
  $(language).animate({top:-30}, dur/2, _out);
  $(cur_lang).animate({top:25}, dur/2, _out);
}

function open_lang(){
  $(language).animate({top:25}, dur/2, _out);
  $(cur_lang).animate({top:-30}, dur/2, _out);
}

// WINDOW

function resize(){

    // public resize
	win_w = $( window ).width();
	win_h = $( window ).height();

	if(mobile){
		if(win_w < win_h){
            $(dbody).addClass('port');
            $(dbody).removeClass('land');
        } else {
            $(dbody).removeClass('port');
            $(dbody).addClass('land');
        }
	}else{
		if( win_w > 1200 ) $(dbody).addClass('layout2');
		else $(dbody).removeClass('layout2');
	}

  close_menu();

    // local resize
	if(resize_update) resize_update();

}

window.onresize = resize;
resize();

// menu

var pages = [
    { _pt:'IN&Iacute;CIO', _en:'HOME', html:"index.html", cod:false },
    { _pt:'EXPLORE', _en:'EXPLORE', html:"explore.html", cod: false },
    { _pt:'SINAIS', _en:'SIGNALS', html:"list.html", cod:'sig' },
    { _pt:'HUBS', _en:'HUBS', html:"list.html", cod:'hub' },
    { _pt:'METODOLOGIA', _en:'METODOLOGY', html:"methodology.html", cod:false },
    { _pt:'SOBRE', _en:'ABOUT', html:"about.html", cod:false }
];

function open_menu(){
    menu.open = true;
    $(menu).animate({left:0}, dur, _out);
    $(container).animate({left:$(menu).width()/5}, dur, _out);
    $(header).animate({left:$(menu).width()/5 }, dur, _out);
    $(curtain).fadeIn(dur, _out);
}

function close_menu(){
    menu.open = true;
    $(menu).animate({left:-1*$(menu).width()}, dur, _out);
    $(container).animate({left:0}, dur, _out);
    $(header).animate({left:0 }, dur, _out);
    $(curtain).fadeOut(dur, _out);
}

function set_menu(id){
    for( i in pages ){
        if( i == id) $(pages[i].li).addClass('selected');
        else $(pages[i].li).removeClass('selected');
    }
}

$(curtain).on(bt_event, close_menu);

for( i in pages ){

    li = document.createElement('li');
    li.d = pages[i];
    pages[i].li = li;
    $(li)
        .addClass('bt')
        .html( pages[i][lg] )
        .on( bt_event, function(){
            navigate(this.d.html, this.d.cod);
            close_menu();
        });

    if(pages[i].html == cur_page){
        $(li).addClass('selected');
    }

    menu_bts.appendChild(li);

}


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
