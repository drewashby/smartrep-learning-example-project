$(document).ready(function() {
	$('.hotlink').each(function(index,ele){
		Hammer(ele).on('tap', function(e){
			console.log($(ele).attr('data-link'));
			console.log($(ele).attr('data-presentation'));
			if($(ele).attr('data-setpathway')!=''){
				window.localStorage.setItem('pathway_id',$(ele).attr('data-setpathway'));
			}
			if($(ele).attr('data-previous-slide')!=''){
				if(typeof(isManageCareSlide)=='undefined'){
					window.localStorage.setItem('CONTRAVE_hotlink_previous_slide',$('#presentation_name').val()+'_'+$('#slide_name').val()+'.zip');	
					window.localStorage.setItem('CONTRAVE_hotlink_previous_slide',$('#presentation_name').val()+'_'+$('#slide_name').val()+'.zip');							
				}
			}
			if($(ele).attr('data-presentation')!=''){
				global_previous_slide_title = $("meta[name=slide-title]").attr("content");
				global_previous_presentation_external_id = $("meta[name=external-id]").attr("content");
				window.localStorage.setItem('global_previous_slide_title',global_previous_slide_title);
				window.localStorage.setItem('global_previous_presentation_title',global_previous_presentation_external_id);
				com.veeva.clm.gotoSlide($(ele).attr('data-link'),$(ele).attr('data-presentation'));
			}else{
				com.veeva.clm.gotoSlide($(ele).attr('data-link'));
			}
		});
	});
});
