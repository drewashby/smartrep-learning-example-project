$(document).ready(function(){
	$('[data-popup]').each(function(index,ele){
		var target = $(ele).attr('data-popup');
		var button_class = $(ele).attr('data-class');
		var button_hide = $(ele).attr('data-hide');

		Hammer(ele).on('tap', function(e){
			closeAllPopups();
			if($(ele).attr('data-grey-background')=='false'){
				$(target+', .button_for_popup_'+button_class).addClass('active');
				$('.popup.active').css({'z-index':' 9000'})
			}
			else if($(ele).attr('data-grey-background')=='full'){
				if($(ele).hasClass('button_for_popup_formulary_tool') && !navigator.onLine){
					$('.grey_layer').addClass('full')
					$('.popup_ft_offline, .grey_layer, .button_for_popup_'+button_class).addClass('active');
				}else{
					$('.grey_layer').addClass('full')
					$(target+', .grey_layer, .button_for_popup_'+button_class).addClass('active');
				}
			}
			else{
				console.log($(ele).attr('class'));
				$(target+', .grey_layer, .button_for_popup_'+button_class).addClass('active');
			}
			if(button_hide == 'remove_btn'){
				$('.button_for_popup_' + button_class).fadeOut();
			}
			if($(target).find('.emailField').length>0){
				$(target).find('.emailField').prop('disabled',false);
			}
			if($(target).find('#ft_zipcode').length>0){
				$(target).find('#ft_zipcode').prop('disabled',false);
			}
			setTimeout(function(){
				$(target).trigger('modalopen');
			},300);
			stopPropagationShield('show');


		});
	});
	$('.close_btn').each(function(index,ele){
		Hammer(ele).on('tap', function(e){
			closeAllPopups();
			$(ele).parent('.popup.active').removeClass('active');
			if($('.popup.active').length<=0){
				$('.grey_layer').removeClass('active');
				$('.button_for_popup').removeClass('active');
				stopPropagationShield('hide');
			}
		});
	});
});
