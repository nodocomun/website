
// public vars
var i, a, b, c, d, itm1, itm2, itm3;
var div, ul, li, li2, span, img, hr;
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


var bar_h = 80;


var pages = [
    { _pt:'IN&Iacute;CIO', _en:'HOME', html:"index.html",},
    { _pt:'UPDATE', _en:'UPDATE', html:"update.html", submenu : [
      {_pt : "Sobre o Update", anchor:'intro' },
      {_pt : "Quem somos", anchor:'who' },
      {_pt : "Quem nos financia + parceiros", anchor:'partners' }
    ]},
    { _pt:'METODOLOGIA', _en:'METODOLOGY', html:"methodology.html"},
    { _pt:'PAÍSES', _en:'COUNTRIES', html:"countries.html", submenu : [
     {_pt : "Introdução / O que é", anchor:'intro' },
     {_pt : "Paises/Iniciativas", anchor:'countries' },
     {_pt : "Abrangência", anchor:'coverage' }
    ]},
    { _pt:'HUBS', _en:'HUBS', html:"hubs.html", submenu : [
     {_pt : "Introdução / O que é", anchor:'intro' },
     {_pt : "Natureza", anchor:'kind' },
     {_pt : "Financiador", anchor:'financer' }
    ]},
    { _pt:'SINAIS', _en:'SIGNALS', html:"signals.html", submenu : [
     {_pt : "Introdução / O que é", anchor:'intro' },
     {_pt : "Tecnologia", anchor:'tech' },
     {_pt : "Temas", anchor:'theme' },
     {_pt : "Propósito", anchor:'purpose' },
     {_pt : "Métodos", anchor:'method' }
    ]},
    { _pt:'DOWNLOAD', html:"download.html" },
    { _pt:'CADASTRE SUA INICIATIVA', html:"initiative.html" },
    { _pt:'EXPLORE', _en:'EXPLORE', html:"chart.html", html2:"list.html" }
];


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
var resize_explore = false;
var resize_list = false;

// location

function navigate( html, code ){
  var new_loc = root + html;
  if(code) new_loc += "?code=" + code;
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
  $(language).animate({top:-30}, dur/2, in_out);
  if(mobile) $(cur_lang).animate({top:12}, dur/2, in_out);
  else $(cur_lang).animate({top:25}, dur/2, in_out);
}

function open_lang(){
  if(mobile) $(language).animate({top:12}, dur/2, in_out);
  else $(language).animate({top:25}, dur/2, in_out);
  $(cur_lang).animate({top:-30}, dur/2, in_out);
}

// WINDOW

function resize(){

    // public resize
	win_w = $( window ).width();
	win_h = $( window ).height();

  if(mobile){
    bar_h = 50;
  }else{
    bar_h = 80;
  }

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

    // local resize
	if(resize_explore) resize_explore();
	if(resize_list) resize_list();

}

window.onresize = resize;
resize();

if(cur_page != 'index.html'){
  $(update_logo).on(bt_event, function(){
    console.log('aqui');
      navigate('index.html', false);
  });
}


function scroll(trg, to, dur){

  var pos = $(to).offset().top - bar_h;

	$(trg).scrollTo( pos, {
		duration: dur2,
		easing: in_out,
		axis:'y'
	});
}

// menu

function $_GET() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function set_code(c){
  sessionStorage.setItem('code',c);
  cur_code = c;
}

function get_code(){
   return sessionStorage.getItem('code');
}

function check_code(){
  cur_code = get_code();
  if(!cur_code) set_code('sig');
}

function open_menu(){
    menu.open = true;
    $(menu).animate({left:0}, dur, _out);
    $(container).animate({left:$(menu).width()/5}, dur, _out);
    $(header).animate({left:$(menu).width()/5 }, dur, _out);
    if(cur_page == 'list.html' || cur_page == 'chart.html') $(control).animate({left:$(menu).width()/5 }, dur, _out);
    $(curtain).fadeIn(dur, _out);
    if( (cur_page == 'list.html' || cur_page == 'chart.html') && filters.open ) close_filters();
 }

function close_menu(){
    menu.open = false;
    $(menu).animate({left:-1*$(menu).width()}, dur, _out);
    $(container).animate({left:0}, dur, _out);
    $(header).animate({left:0 }, dur, _out);
    if(cur_page == 'list.html' || cur_page == 'chart.html') $(control).animate({left:0 }, dur, _out);
    $(curtain).fadeOut(dur, _out); 
}

$(curtain).on(bt_event, function(){
  if(menu.open) close_menu();
  if(modal && modal.open) close_modal();
});

for( i in pages ){

    li = document.createElement('li');
    li.d = pages[i];
    pages[i].li = li;
    $(li)
        .addClass('bt')
        .html( pages[i][lg] )
        .on( bt_event, function(){
            navigate(this.d.html, this.d.code);
            close_menu();
        });

    menu_bts.appendChild(li);

    if( pages[i].html == cur_page || pages[i].html2 == cur_page ){
      $(li).addClass('selected');

      // submenu
      if( pages[i].submenu ) {
        for(a in pages[i].submenu){
          li2 = document.createElement('li');
          li2.anchor = pages[i].submenu[a].anchor;

          $(li2)
            .addClass('sub_bt')
            .html(pages[i].submenu[a][lg])
            .on( bt_event, function(){
                scroll(window, "#"+this.anchor, dur);
                close_menu();
            });

          menu_bts.appendChild(li2);

        }
      }
    }
  }


menu.open = false;

$(menu_bt).on( bt_event, function (){
    if(!menu.open) open_menu();
});

$(menu_close).on( bt_event, function (){
    close_menu();
});

if(!mobile){
    $(menu).on('mouseleave', function (){
        close_menu();
    });
}
