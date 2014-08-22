const API_KEY_REPBAG = '825343F79C2749A295EAA7A8FEB265D7'
const API_ENDPOINT_REPBAG = 'https://isasupport.takeda.us/api/repbag';
const PRESENTATION_ID_REPBAG = 'CONTRAVE_20140527_REPBAG';






/* FAKE DATA */
//fakedata = {"status":200,"RepBag":[{"presentationId":"temporary_id_001","slideList":[{"mediaFileName":"filename1.zip","menuTitle":"title1"},{"mediaFileName":"filename2.zip","menuTitle":"title2"},{"mediaFileName":"filename3.zip","menuTitle":"title3"}]},{"presentationId":"presentationid002","slideList":[{"mediaFileName":"filename4.zip","menuTitle":"title4"},{"mediaFileName":"filename5.zip","menuTitle":"title5"},{"mediaFileName":"filename5.zip","menuTitle":"title5"}]}]};





//the parent object that will contain all properties and methods.
function Repbag(){
	this.repbag = {};
	if(navigator.onLine){
		this.fetchMostRecent();
	}else{
		this.buildRepbagMenuFromLocalStorage();
		this.buildRepbagMenu();
	}
}

//fetch the most recent content from the API
Repbag.prototype.fetchMostRecent = function(){
	var dis = this;
	var arguments = "presentationid="+PRESENTATION_ID_REPBAG+"&apikey="+API_KEY_REPBAG;


	$.ajax({
		url : API_ENDPOINT_REPBAG+"?"+arguments,
		dataType: 'json',
		crossDomain : true,
		error : function(){
			//TODO : Need to hide repbag button
			dis.buildRepbagMenuFromLocalStorage();
			dis.buildRepbagMenu();
		},
		success : function(data,status,jqXHR){
			dis.repbag = data.RepBag;
			localStorage.setItem('repbag', JSON.stringify(data));
			dis.buildRepbagMenu();
		}

	})

}

Repbag.prototype.buildRepbagMenuFromLocalStorage = function(){
	if(typeof (localStorage['repbag'])!= 'undefined'){
		Repbag = JSON.parse(localStorage.getItem('repbag'));
		this.repbag = Repbag.RepBag;
		console.log(this.Repbag)
	}else{
		this.repbag = null;
		setTimeout(function(){
			$('.repbag_btn').addClass('disable');
		},20)
	}
	console.log(this.Repbag);
}

//print out the posters based on this.posterdata
Repbag.prototype.buildRepbagMenu = function(){
	var repbagMenu = $('menu.repbag');
	var repbags = this.repbag;
	var rebbag_disabled = true;
	for(repbag in repbags){
		if(JSON.stringify(repbags[repbag].presentationId).replace(/"/g, '') == PRESENTATION_ID_REPBAG){
			// repbagMenu.append('<div class="popover_top"></div><ul></ul><div class="popover_bot"></div>');
			repbagMenu = $('menu.repbag > ul');
			for(slides in repbags[repbag].slideList){
				rebbag_disabled = false;
				mediaFileName = repbags[repbag].slideList[slides].mediaFileName;
				menuTitle = repbags[repbag].slideList[slides].menuTitle;
				repbagMenu.append('<li><div class="button" data-href="'+mediaFileName+'">'+menuTitle+'</button></li>');
			}
			repbagMenu.find('.button').each(function(index,element){
				Hammer(element).on('tap', function(e){
					slideLink = $(element).attr('data-href');
					console.debug('com.veeva.clm.gotoSlide('+slideLink+','+PRESENTATION_ID_REPBAG+');')
					com.veeva.clm.gotoSlide(slideLink,PRESENTATION_ID_REPBAG);
				});
			});
			// if(rebbag_disabled){
			// 	$('.repbag_btn').addClass('disable');
			// }

		}
	}
	repbagMenu.find('.button.fakeRepb').each(function(index,element){
		Hammer(element).on('tap', function(e){
			slideLink = $(element).attr('data-href');
			console.debug('com.veeva.clm.gotoSlide('+slideLink+','+PRESENTATION_ID_REPBAG+');')
			com.veeva.clm.gotoSlide(slideLink,PRESENTATION_ID_REPBAG);
		});
	});
}

//print out error
Repbag.prototype.printError = function(message){

}

$(document).ready(function(){
	var repBag = new Repbag();
	$('.repbag_btn').each(function(index,element){
		Hammer(element).on('tap', function(e){
			closeAllPopups();
			if($('menu.repbag').hasClass('active')){
				setTimeout(function(){
					$('menu.repbag').removeClass('active');
					$(element).removeClass('active');
				},0);
			}else{
				setTimeout(function(){
					$('menu.repbag').addClass('active');
					$(element).addClass('active');
				},0);
			}
			return false;
		});
	});
});

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
