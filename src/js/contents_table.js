$(document).ready(function(){
	$('section.contents_table').contents_table();
});


$.fn.contents_table = function( options ){
	return this.each(function(){
		var dis = $(this);
		var dis_position_left = parseFloat($(this).css('left').replace('px',''));
		var dis_footer = $(this).children('footer');
		var dis_content = $(this).children('.contents_table_container');
		var dis_content_width = parseFloat(dis_content.css('width').replace('px',''));
		var dis_content_padding_left = parseFloat(dis_content.css('padding-left').replace('px',''));
		var dis_content_padding_right = parseFloat(dis_content.css('padding-right').replace('px',''));	

		dis_footer.off().on('touchstart',function(){
			if(dis.hasClass('active')){
				dis.css('left',dis_position_left+'px');
				setTimeout(function(){					
					dis.find('a').each(function(index,element){
						$(this).removeAttr('href');
					})
				},500);
				dis.removeClass('active');
			}else{
				dis.css('left',(dis_position_left+dis_content_width+dis_content_padding_left+dis_content_padding_right)+'px');
				setTimeout(function(){					
					dis.find('a').each(function(index,element){
						$(this).attr('href',$(this).attr('data-href'));
					})
				},500);
				dis.addClass('active');
			}			
		});
	});
}		







