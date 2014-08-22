$(document).ready(function(){
	if(exists(".prescribing_information_container")){
		setTimeout(function () {
			prescibing_information_scroller = new iScroll($('.prescribing_information_container').get(0), {
				scrollbarClass: 'prescribing_information_scrollbar',
				hideScrollbar:false,
				bounce:false
			});
		}, 0);
	}
	$('section.prescribing_information .title').menuPi();
});



$.fn.menuPi = function (options){
	return this.each(function(){
		var dat = $(this);
		var prescribing_information_popup = $(this).parents('section.prescribing_information');
		var prescribing_information_menu = prescribing_information_popup.find('menu');
		var prescribing_information_menu_title = prescribing_information_menu.find('.title h1');
		var prescribing_information_menu_arrow = prescribing_information_popup.find('.arrow');
		var prescribing_information_menu_anchors = prescribing_information_menu.find('.links');
		var prescribing_information_menu_list = prescribing_information_menu.find('.prescribing_information_menu');
		var prescribing_information_menu_list_item = prescribing_information_menu_list.find('li');

		dat.on({click : function(e){display(e);}});
		prescribing_information_menu_list_item.on({click : function(e){goToPosition(e, this);}});
		prescribing_information_popup.on({click : function(e){closeMenu(e);}});

		function goToPosition(e, item){
			var position_x = $(item).data('position-x')*-1;
			prescibing_information_scroller.scrollTo(0, position_x, 200);
			if(prescribing_information_menu_anchors.hasClass('active')){
				prescribing_information_menu_anchors.removeClass('active');
				prescribing_information_menu_arrow.addClass('down').removeClass('up');
				prescribing_information_menu_title.removeClass('open');
				popup_pi_menu_scroller.destroy();
				popup_pi_menu_scroller = null;;
			}
		}

		function closeMenu(e){
			if(prescribing_information_menu_anchors.hasClass('active')){
				prescribing_information_menu_anchors.removeClass('active');
				prescribing_information_menu_arrow.addClass('down');
				prescribing_information_menu_arrow.removeClass('up');
				prescribing_information_menu_title.removeClass('open');
				popup_pi_menu_scroller.destroy();
				popup_pi_menu_scroller = null;;
			}
		}
		function display(e){
			e.preventDefault();
			e.stopPropagation();
			if(prescribing_information_menu_anchors.hasClass('active')){
				prescribing_information_menu_anchors.removeClass('active');
				prescribing_information_menu_arrow.addClass('down');
				prescribing_information_menu_arrow.removeClass('up');
				prescribing_information_menu_title.removeClass('open');
				popup_pi_menu_scroller.destroy();
				popup_pi_menu_scroller = null;;
			}
			else{
				prescribing_information_menu_anchors.addClass('active');
				prescribing_information_menu_arrow.addClass('up');
				prescribing_information_menu_title.addClass('open');
				prescribing_information_menu_arrow.removeClass('down');
				popup_pi_menu_scroller = new iScroll(prescribing_information_menu_list.get(0), {
					scrollbarClass: 'prescribing_information_menu_scrollbar',
					hideScrollbar:false,
					bounce:false
				});
			}
		}
	});
}
