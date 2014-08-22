$(document).ready(function() {
	/* CLICK OUTSIDE POPUP TO CLOSE IT */
	bindOutsideClick();
	/* disable ipad scrolling */
	disableIpadScrolling();
	if(typeof(isManageCareSlide)=='undefined'){
		localStorage.removeItem('CONTRAVE_hotlink_previous_slide');
		localStorage.removeItem('CONTRAVE_hotlink_previous_slide');
	}
	setTimeout(function () {
			isi_scroller = new iScroll($('.isi_container').get(0), {
					hideScrollbar:false
			});
	}, 0);
});

/* check if a specified element exists */
function exists(elem){
	if ( $(elem).length > 0 ) {
		return true;
	}else{
		return false;
	}
}


var trace = function ( text ) {
	if( typeof console != 'undefined' ) {
		console.log( text );
		return true;
	}
	return false;
}


closeAllPopups = function(){
	$('.popup').each(function(index,ele){
		$(ele).removeClass('active');
	});
	$('.grey_layer, .button_for_popup').removeClass('active');
	$('.grey_layer.active').removeClass('full');
}





/*disable ipad scrolling*/
function disableIpadScrolling(){
	$(document).on('touchmove', function(e){
		e.preventDefault();
	});
}

/*close popup by clicking outside*/
//Close popup when you click outside
bindOutsideClick = function(){
	Hammer(document).on("touch", function(e) {

			if ($(e.target).closest(".popup.active").get(0) == null && exists(".popup.active")) {
		    	closeAllPopups();
		    	hideKeyboard();
			}
		    if ($(e.target).closest(".grey_layer").get(0) != null && exists(".grey_layer.active")) {
		    	closeAllPopups();
		    	hideKeyboard();
			}

	});
}
stopPropagationShield = function(how){
	if(how=='show'){
	setTimeout(function(){
	$('.stop_propagation_shield').addClass('active');
	},200);
	}else{
	setTimeout(function(){
	$('.stop_propagation_shield').removeClass('active');
	},200);
	}
};
hideKeyboard = function() {
    document.activeElement.blur();
    $("input").blur();
};
/* ajax popups */
function getAjaxPage(trigger,target,callback){
	if(trigger.attr('data-ajax')!=undefined ){
		$.get('res/html/'+trigger.attr('data-ajax')+'.html',function(data){
			if(trigger.attr('data-triggered')!='true'){
				$(target).append(data);
			}
			if(callback!=null){
				callback();
				trigger.attr('data-triggered','true');
			}
			bindOutsideClick();
			if ( $('body').hasClass('centralizedSlide') ) {
				$('a.global_med_guide,a.global_isi,a.global_pi').on({
					touchstart : function(e) {
						e.preventDefault();
						e.stopPropagation();
						var m = $("meta[name=slideTitle]");
						localStorage.slideTitle = (m.attr("content"));
						document.location = $(this).attr("href");
					}
				});
			}
		});
	}
}
