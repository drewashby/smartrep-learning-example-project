var slide_id;
var slide_name;
var presentation_id;
var presentation_name;
var pathway_current_id=false;
var pathway_previous_slide_id=false;
var pathway_previous_slide_name=false;
var pathway_next_slide_id=false;
var pathway_next_slide_name=false;



$(document).ready(function() {	
	slide_id = $('#slide_id').val();
	slide_name = $('#slide_name').val();
	presentation_id = $('#presentation_id').val();
	presentation_name = $('#presentation_name').val();

	console.debug('presentation_id:'+presentation_id);
	console.debug('presentation_name:'+presentation_name);
	console.debug('slide_id:'+slide_id);
	console.debug('slide_name:'+slide_name);

	if(exists('#pathway_current_id')){pathway_current_id = $('#pathway_current_id').val();console.debug('pathway_current_id:'+pathway_current_id);}
	if(exists('#pathway_previous_slide_id')){pathway_previous_slide_id = $('#pathway_previous_slide_id').val();console.debug('pathway_previous_slide_id:'+pathway_previous_slide_id);}
	if(exists('#pathway_previous_slide_name')){pathway_previous_slide_name = $('#pathway_previous_slide_name').val();console.debug('pathway_previous_slide_name:'+pathway_previous_slide_name);}
	if(exists('#pathway_next_slide_id')){pathway_next_slide_id = $('#pathway_next_slide_id').val();console.debug('pathway_next_slide_id:'+pathway_next_slide_id);}
	if(exists('#pathway_next_slide_name')){pathway_next_slide_name = $('#pathway_next_slide_name').val();console.debug('pathway_next_slide_name:'+pathway_next_slide_name);}

	if(pathway_current_id!=false){
		Hammer(document).on("swipeleft", function() {				
			console.debug('veeva:gotoSlide('+presentation_name+'_'+pathway_next_slide_name+'.zip)');
			document.location = 'veeva:gotoSlide('+presentation_name+'_'+pathway_next_slide_name+'.zip)' 
		});
		Hammer(document).on("swiperight", function() {				
			console.debug('veeva:gotoSlide('+presentation_name+'_'+pathway_previous_slide_name+'.zip)');
			document.location = 'veeva:gotoSlide('+presentation_name+'_'+pathway_previous_slide_name+'.zip)'
		});
	}
});	

