$(document).ready(function() {
	var devmode_console_scroll;
	$('body').append('<div class="devmode"></div>');
	$('.devmode').append('<h1>Mode dev : <span>console</span></h1>');
	$('.devmode').append('<button class="error msgctrl" data-type="error">Js error</button>');
	$('.devmode').append('<button class="console_error msgctrl" data-type="console_error">Console error</button>');
	$('.devmode').append('<button class="ajax_error msgctrl" data-type="ajax_error">Ajax error</button>');
	$('.devmode').append('<button class="console_log msgctrl" data-type="console_log">Console log</button>');
	$('.devmode').append('<button class="console_info msgctrl" data-type="console_info">Console info</button>');
	$('.devmode').append('<button class="localstorage msgctrl" data-type="localstorage">Local storage</button>');
	$('.devmode').append('<button class="console_debug msgctrl" data-type="console_debug">Console debug</button>');
	$('.devmode').append('<button class="ajax_success msgctrl" data-type="ajax_success">Ajax success</button>');
	$('.devmode').append('<div class="scroll"><div class="msg console"></div></div>');
	$('.devmode').append('<button class="clearconsole consolectrl" data-type="ajax_success">Clear console</button>');
	$('.devmode').append('<button class="clearlocalstorage consolectrl" data-type="ajax_success">Clear local storage</button>');
	$('.devmode').append('<button class="getlocalstorage consolectrl" data-type="ajax_success">Get local storage</button>');
	$('.devmode').append('<button class="slidereload consolectrl" data-type="ajax_success">Slide reload</button>');
	$('.devmode>h1').click(function(){
		$('.devmode').toggleClass('minimized');
	});
	console.error = function(message) {
		if(!$('.devmode button.console_error').hasClass('inactive')){
			var msg = "<h1>Console Error</h1>";
			msg += "<p><span>Description</span> : " + message + "</p>";
			msg = "<div class='msg console_error'>" + msg + "</div>";
		    $('.devmode .console').append(msg);
		    devmode_console_scroll_resfresh();				
		}
	}
	console.log = function(message) {
		if(!$('.devmode button.console_log').hasClass('inactive')){	
			var msg = "<h1>Console Log</h1>";
			msg += "<p><span>Description</span> : " + message + "</p>";
			msg = "<div class='msg console_log'>" + msg + "</div>";
		    $('.devmode .console').append(msg);
		    devmode_console_scroll_resfresh();
		}
	}
	console.debug = function(message) {			
		if(!$('.devmode button.console_debug').hasClass('inactive')){	
			var msg = "<h1>Console Debug</h1>";
			msg += "<p><span>Description</span> : " + message + "</p>";
			msg = "<div class='msg console_debug'>" + msg + "</div>";
		    $('.devmode .console').append(msg);
		    devmode_console_scroll_resfresh();
		}
	}
	console.info = function(message) {			
		if(!$('.devmode button.console_info').hasClass('inactive')){
			var msg = "<h1>Console Info</h1>";
			msg += "<p><span>Description</span> : " + message + "</p>";
			msg = "<div class='msg console_info'>" + msg + "</div>";
		    $('.devmode .console').append(msg);
		    devmode_console_scroll_resfresh();
		}
	}
	window.onerror = function (data, url, line) {				
		if(!$('.devmode button.error').hasClass('inactive')){
			var msg = "<h1>Javascript Error</h1>";
			msg += "<p><span>Line</span> : " + line + "</p>";
			msg += "<p><span>Url</span> : " + url + "</p>";
			msg += "<p><span>Description</span> : " + data + "</p>";
			msg = "<div class='msg error'>" + msg + "</div>";
		    $('.devmode .console').append(msg);
		    devmode_console_scroll_resfresh();
		    return true;
		}
	}
	$( document ).ajaxError(function(event, xhr, settings, thrownError) {
		if(!$('.devmode button.ajax_error').hasClass('inactive')){
			var msg = "<h1>Ajax Error</h1>";
			msg += "<p><span>Http Status</span> : " + xhr.status + "</p>";
			msg += "<p><span>Url</span> : " + settings.url + "</p>";
			msg = "<div class='msg ajax_error'>" + msg + "</div>";
		    $('.devmode .console').append(msg);
		    devmode_console_scroll_resfresh();
		}
	});
	$( document ).ajaxSuccess(function( event, xhr, settings ) {
		if(!$('.devmode button.ajax_success').hasClass('inactive')){
			var msg = "<h1>Ajax Success</h1>";
			msg += "<p><span>Url</span> : " + settings.url + "</p>";
			msg = "<div class='msg ajax_success'>" + msg + "</div>";
		    $('.devmode .console').append(msg);
		    devmode_console_scroll_resfresh();
		}
	});
	devmode_console_get_localstorage();

	$('.devmode button.msgctrl').click(function(){		
		if($(this).hasClass('inactive')){
			var devmode_button = $(this);
			$(this).removeClass('inactive');
			$('.devmode .console .msg').each(function(){
				if($(this).hasClass(devmode_button.attr('data-type'))){
					$(this).removeClass('inactive');
				}
			})
		}
		else{
			var devmode_button = $(this);
			$(this).addClass('inactive');
			$('.devmode .console .msg').each(function(){
				if($(this).hasClass(devmode_button.attr('data-type'))){
					$(this).addClass('inactive');
				}
			})			
		}
		devmode_console_scroll_resfresh();
	});	

	$('.devmode button.consolectrl').click(function(){				
		if($(this).hasClass('clearconsole')){						
			devmode_clear_console();
		}				
		if($(this).hasClass('clearlocalstorage')){			
			devmode_console_clear_localstorage();
		}				
		if($(this).hasClass('getlocalstorage')){
			devmode_console_get_localstorage();
		}				
		if($(this).hasClass('slidereload')){
			slidereload();
		}
		devmode_console_scroll_resfresh();
	});	

	function devmode_console_scroll_resfresh(){
		/*
		setTimeout(function () {
			devmode_console_scroll.refresh();
		}, 0)
		setTimeout(function () {
			devmode_console_scroll.scrollToElement('.devmode .console div:last-child', 100);
		}, 0)

		*/

	}
	function devmode_console_get_localstorage(){	
		for (var key in localStorage){
			if(!$('.devmode button.localstorage').hasClass('inactive')){
				var msg = "<h1>Local Storage</h1>";
				msg += "<p><span>Key</span> : " + key + "</p>";
				msg += "<p><span>Value</span> : " + localStorage[key] + "</p>";
				msg = "<div class='msg localstorage'>" + msg + "</div>";
				$('.devmode .console').append(msg);
			    devmode_console_scroll_resfresh();
			}
		}
	}
	function devmode_clear_console(){		
		$('.devmode .console .msg').each(function(){			
			$(this).remove();
		})	
	}
	function devmode_console_clear_localstorage(){		
		Object.keys(localStorage).forEach(function(key){
            localStorage.removeItem(key);           
       });
	}
	function slidereload(){		
		window.location.reload()
	}
	Hammer(document).on("pinchout", function() {				
		if(!$('.devmode').hasClass('active')){
			$('.devmode').show();
			$('.devmode').addClass('active');
			devmode_console_scroll_resfresh();
		}else{
			$('.devmode').hide();
			$('.devmode').removeClass('active');			
		}	
	});
});