$(document).ready(function(){
	disableIpadScrolling();	
	Hammer(document).on("touch", function(e) {
	    if ($(e.target).closest(".popup.active").get(0) == null && exists(".popup.active")) {
	    	backToMainPresentation();	    	
	    }   
	});
	$('.popup .close').each(function(index,ele){
		Hammer(ele).on("tap", function(e) {
			backToMainPresentation();	     
		});
	});
});


backToMainPresentation = function(){
	link = window.localStorage.getItem('global_previous_slide_title');
	global_previous_presentation_external_id = window.localStorage.getItem('global_previous_presentation_title');	
	//global_previous_presentation_external_id = $("meta[name=back-external-id]").attr("content");	
	console.log(link);	
	console.log(global_previous_presentation_external_id);	
	com.veeva.clm.gotoSlide(link,global_previous_presentation_external_id);
}

//Disable vertical scrolling on ipad
disableIpadScrolling = function(){
	$(document).on('touchmove', function(e){
		e.preventDefault();
	});
}

/* check if a specified element exists */
exists = function(elem){
	if ( $(elem).length > 0 ) {
		return true;
	}else{
		return false;
	}
}


