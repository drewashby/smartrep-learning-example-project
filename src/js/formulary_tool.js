/*timer*/
var toLimitInMS = 120000;
var to = setTimeout(function(){},100);

function startFtTimeout(){
	clearTimeout(to);
	to = setTimeout(function(){
		error_ft('timeout');
		ajaxrequests.cancelAll();
	},toLimitInMS);
}

/*need to handle multiple concurrent ajax requests*/
function AjaxRequests(){
	this.arr = [];
}

AjaxRequests.prototype.push = function(newAjaxRequest){
	this.arr.push(newAjaxRequest);
}

AjaxRequests.prototype.cancelAll = function(){
	for(var i=0; i<this.arr.length; i++){
		//if(typeof(this.arr[i]) == ){
			this.arr[i].abort();
		//}
	}
	this.arr = [];
}

var ajaxrequests = new AjaxRequests();

var popup_ft_scroller;
var popup_ftgraph_scroller;
var debug = true,
	geoloc = false,
	zip_code,
	StartTime ,
	DexilantID = 2349,
	AciphexID = 720,
	NexiumID = 721,
	api_uri = 'http://futureapi.fingertipformulary.com/',
	api_key = '58b820698bc272db6febbb0141acd76208927487';

var inProgress = false;
var accountZipCode;

var drugs = new Array();
var healthplans = new Array();


var ft_btn;
$(document).ready(function() {
	ft_btn = $('.button_formulary_tool');
	if(!ft_btn.hasClass('multiselect')){
		ft_btn.popupFt({"multi":false});
	}else{
		ft_btn.off().on('touchstart', function(e){
			e.stopPropagation();
			e.preventDefault();
			$('section.popup_bottom_bar, section.popover_bottom_bar, section.popover_top_bar').each(function() {
				if($(this).data('button')!='ft'){
					$('section.bar_bottom .action .'+$(this).data('button')).removeClass('on');
					$('section.bar_top .action button.'+$(this).data('button')).removeClass('on');
				}
				$(this).removeClass('active');
			});

			if ( ft_btn.hasClass('on') )
				ft_btn.siblings('.popover').removeClass('active');
			else
				ft_btn.siblings('.popover').addClass('active');

			ft_btn.toggleClass('on');
			//ft_btn.siblings('.ft_multiselect').toggleClass('active');

		});
		ft_btn.siblings('.ft_multiselect').find('a').popupFt({"multi":true});
	}
	$('.grey_layer.active').on('touchstart', function(){
		removeZipFocus();
	});
	$('.ft_close').on('touchstart', function(){
		removeZipFocus();
	})
	removeZipFocus = function(){
		if($('#ft_zipcode').is(':focus')){
			$('#hidekeyboard').removeAttr("disabled").focus().blur().attr("disabled", "disabled");
		}
	}
});



//Depending of the postal code value, return an error or launch the search
$.fn.searchFt = function (options){
	return this.each(function(){
		dat = $(this);
		var postalField = $('#ft_zipcode');
		dat.off().on({
			touchstart : function(e){
				ajaxrequests.cancelAll();
				postalVal = postalField.val().toString();
				$('section.popup_ft .errorBox div, section.popup_ft .errorBox').removeClass('active');
				if(postalVal==''){
					error_ft('required');
				}else if(!validatePostalCode(postalVal)){
					error_ft('invalid');
				}else if(!navigator.onLine){
					error_ft('internet');
				}else{
					searchData(e,'submit');
				}
			}
		});
	});
}

//Reinitialize the formulary tool and grab information for aera POL and are Healthplan list
function searchData(e,type){
	e.preventDefault();
	e.stopPropagation();
	var healthplantypeList = new Array();
	$('section.popup_ft .ft_action2 li').each(function(){
		healthplantypeList.push($(this).attr('data-hptype'));
	});
	if(!inProgress){
		inProgress = true;
		$('#ft_result_term').html($('section.popup_ft #ft_zipcode').val());
		$('button.ft_graph').hide();
		$('#ft_zipcode').removeClass('error');
		$('.content_loader').addClass('active');
		if($('#ft_zipcode').is(':focus')){
			$('#hidekeyboard').removeAttr("disabled").focus().blur().attr("disabled", "disabled");
		}
		$('.ft_result_pol').each(function() {
			$(this).html('&nbsp;');
		});
		for(var i=0;i<drugs.length;i++){
			if(drugs[i].Active){
				for(var j=0;j<healthplantypeList.length;j++){
					getJsonInfo('POL', 'lives', api_key, drugs[i], healthplantypeList[j], '');
				}
			}
		}
		for(var j=0;j<healthplantypeList.length;j++){
			getJsonInfo('HP', 'health_plans', api_key, drugs[0], healthplantypeList[j], '');
		}



		$('.ft_result_bottom table:not(first-child) td').each(function(index){
			$(this).html('&nbsp;');
		});

		setTimeout(function(){
			$('.specialBrand').show();
		},4000)

	}
}

function getJsonInfo(what, jsonFile, apikey, drug, healthplantype, healthplanlist){
	var zipcode = $('section.popup_ft #ft_zipcode').val();
	//var healthplantype = $('section.popup_ft .ft_action2 li.active').attr('data-hptype');
	if(what=='NATPOL'){
		var _url = api_uri+jsonFile+'.json?api_key='+api_key+'&drug_id='+drug.id+'&health_plan_types='+healthplantype;
		console.log('NATPOL request : '+_url);
	}
	if(what=='POL'){
		var _url = api_uri+jsonFile+'.json?api_key='+api_key+'&drug_id='+drug.id+'&zip_code='+zipcode+'&health_plan_types='+healthplantype;
		console.log('POL request : '+_url);
	}
	if(what=='HP'){
		var _url = api_uri+'takeda/'+drug.Urlname+'/top_plans.json?api_key='+api_key+'&limit=10&zip_code='+zipcode+'&health_plan_type_ids='+healthplantype;
		console.log('HP request : '+_url);
	}
	if(what=='CHPD'){
		var _url = api_uri+jsonFile+'.json?api_key='+api_key+'&drug_id='+drug.id+'&health_plan_list='+healthplanlist;
		console.log('CHPD request : '+_url);
	}
	startFtTimeout();
	ajaxrequests.push($.ajax({
		url: _url,
		dataType: 'json',
		success: function(data){
			clearTimeout(to);
			console.log('success!');
			if(what=='NATPOL'){
				$('#natpol').html(Math.round((data[0].life.percent_of_lives_covered*100)*100)/100+'%');
				console.log(Math.round((data[0].life.percent_of_lives_covered*100)*100)/100)
			}
			if(what=='POL'){
				for(var i=0; i<drugs.length; i++){
					if(drugs[i].id == drug.id){
						switch(healthplantype){
							case '1,2,4,9,11,12':
								drugs[i].HPcommercial = Math.round((data[0].life.percent_of_lives_covered*100)*100)/100+'%';
								if(exists($('section.popup_ft .ft_action2 li.active[data-hptype="'+healthplantype+'"]'))){
									fill_POL(healthplantype,drug.id);
								}
								drugs[i].percentLives_commercial = Math.round((data[0].life.percent_of_lives_covered*100)*100)/100;
								$('button.ft_graph').fadeIn();
								break;
							case '5,6,7':
								drugs[i].HPmedicareD = Math.round((data[0].life.percent_of_lives_covered*100)*100)/100+'%';
								if(exists($('section.popup_ft .ft_action2 li.active[data-hptype="'+healthplantype+'"]'))){
									fill_POL(healthplantype,drug.id);
								}
								drugs[i].percentLives_medicareD = Math.round((data[0].life.percent_of_lives_covered*100)*100)/100;
								break;
							case '3,10':
								drugs[i].HPmedicaid = Math.round((data[0].life.percent_of_lives_covered*100)*100)/100+'%';
								if(exists($('section.popup_ft .ft_action2 li.active[data-hptype="'+healthplantype+'"]'))){
									fill_POL(healthplantype,drug.id);
								}
								drugs[i].percentLives_medicaid = Math.round((data[0].life.percent_of_lives_covered*100)*100)/100;
								break;
							case '8':
								drugs[i].HPfederal = Math.round((data[0].life.percent_of_lives_covered*100)*100)/100+'%';
								if(exists($('section.popup_ft .ft_action2 li.active[data-hptype="'+healthplantype+'"]'))){
									fill_POL(healthplantype,drug.id);
								}
								drugs[i].percentLives_federal = Math.round((data[0].life.percent_of_lives_covered*100)*100)/100;
								break;
						}
					}
				}
				//show the graph now.

			}
			if(what=='HP'){
				var HealthplansIDs = new Array();
				var HealthplansNames = new Array();
				var HealthplansNamesTemp = new Array();

				for (var i = 0; i < data.health_plans.length; i++) {
					HealthplansIDs.push(data.health_plans[i].health_plan.displayid);
					HealthplansNamesTemp.push(data.health_plans[i].health_plan.name);
				}
				$.each(HealthplansNamesTemp, function(i, el){
				    if($.inArray(el, HealthplansNames) === -1) HealthplansNames.push(el);
				});
				console.log(HealthplansNames);
				switch(healthplantype){
					case '1,2,4,9,11,12':
						healthplans.commercial_name = HealthplansNames;
						healthplans.commercial_id = HealthplansIDs;
						if(exists($('section.popup_ft .ft_action2 li.active[data-hptype="'+healthplantype+'"]'))){
							fill_table_HP(HealthplansNames);
						}
						for(var i=0;i<drugs.length;i++){
							if(drugs[i].Active){
								getJsonInfo('CHPD', 'formularies', api_key, drugs[i], '1,2,4,9,11,12', HealthplansIDs.join(','));
							}
						}
						break;
					case '5,6,7':
						healthplans.medicareD_name = HealthplansNames;
						healthplans.medicareD_id = HealthplansIDs;
						if(exists($('section.popup_ft .ft_action2 li.active[data-hptype="'+healthplantype+'"]'))){
							fill_table_HP(HealthplansNames);
						}
						for(var i=0;i<drugs.length;i++){
							if(drugs[i].Active){
								getJsonInfo('CHPD', 'formularies', api_key, drugs[i], '5,6,7', HealthplansIDs.join(','));
							}
						}
						break;
					case '3,10':
						healthplans.medicaid_name = HealthplansNames;
						healthplans.medicaid_id = HealthplansIDs;
						if(exists($('section.popup_ft .ft_action2 li.active[data-hptype="'+healthplantype+'"]'))){
							fill_table_HP(HealthplansNames);
						}
						for(var i=0;i<drugs.length;i++){
							if(drugs[i].Active){
								getJsonInfo('CHPD', 'formularies', api_key, drugs[i], '3,10', HealthplansIDs.join(','));
							}
						}
						break;
					case '8':
						healthplans.federal_name = HealthplansNames;
						healthplans.federal_id = HealthplansIDs;
						if(exists($('section.popup_ft .ft_action2 li.active[data-hptype="'+healthplantype+'"]'))){
							fill_table_HP(HealthplansNames);
						}
						for(var i=0;i<drugs.length;i++){
							if(drugs[i].Active){
								getJsonInfo('CHPD', 'formularies', api_key, drugs[i], '8', HealthplansIDs.join(','));
							}
						}
						break;
				}
			}

			if(what=='CHPD'){
				var DrugCoverage = new Array();
				var DrugCoverageTemp = new Array();
				var DrugCoverageId = new Array();
				for (var i = 0; i < data.length; i++) {
					var qualifier_details = '';
					if(data[i].drug_formulary.qualifier_details.length>0){
						for(var j=0;j<data[i].drug_formulary.qualifier_details.length;j++){
							qualifier_details+='/'+data[i].drug_formulary.qualifier_details[j].codename;
						}
					}
					DrugCoverageTemp.push(data[i].drug_formulary.tier_name+qualifier_details);
					DrugCoverageId.push(data[i].drug_formulary.health_plan_id);
				}
				var hplist = healthplanlist.split(',');
				for (var i = 0; i < hplist.length; i++) {
					for (var j = 0; j < DrugCoverageId.length; j++) {
						if(DrugCoverageId[j]==hplist[i]){
							DrugCoverage.push(DrugCoverageTemp[j]);
						}
					}

				}




				switch(healthplantype){
					case '1,2,4,9,11,12':
						for(var i=0;i<drugs.length;i++){
							if(drugs[i].Active && drugs[i].id == drug.id){
								drugs[i].commercial = DrugCoverage;
								if(exists($('section.popup_ft .ft_action2 li.active[data-hptype="'+healthplantype+'"]'))){
									fill_table_CHPD(DrugCoverage,drug.id);
								}
							}
						}
						break;
					case '5,6,7':
						for(var i=0;i<drugs.length;i++){
							if(drugs[i].Active && drugs[i].id == drug.id){
								drugs[i].medicareD = DrugCoverage;
								if(exists($('section.popup_ft .ft_action2 li.active[data-hptype="'+healthplantype+'"]'))){
									fill_table_CHPD(DrugCoverage,drug.id);
								}
							}
						}
						break;
					case '3,10':
						for(var i=0;i<drugs.length;i++){
							if(drugs[i].Active && drugs[i].id == drug.id){
								drugs[i].medicaid = DrugCoverage;
								if(exists($('section.popup_ft .ft_action2 li.active[data-hptype="'+healthplantype+'"]'))){
									fill_table_CHPD(DrugCoverage,drug.id);
								}
							}
						}
						break;
					case '8':
						for(var i=0;i<drugs.length;i++){
							if(drugs[i].Active && drugs[i].id == drug.id){
								drugs[i].federal = DrugCoverage;
								if(exists($('section.popup_ft .ft_action2 li.active[data-hptype="'+healthplantype+'"]'))){
									fill_table_CHPD(DrugCoverage,drug.id);
								}
							}
						}
						break;
				}


				$('#hidekeyboard').removeAttr("disabled").focus().blur().attr("disabled", "disabled");
				$("#ft_zipcode").off().on("touchstart", function(e){
					$(this).focus();
				});
			}
		},
		error: function(o,c,m) {
			clearTimeout(to);
			if(m == "Bad Request"){
				$('.popup_ft .content_loader').removeClass('active');
				$("#ft_zipcode").addClass('error');
				$('.popup_ft .errorBox')
					.addClass('active')
					.children('.invalid').addClass('active')
					.siblings('div').removeClass('active');
				$('section.popup_ft .ft_result .ft_result_bottom .ft_result_left table, section.popup_ft .ft_result .ft_result_bottom .ft_result_right table').html('');
				if(typeof(popup_ft_scroller)!='undefined' && popup_ft_scroller!=null){
					popup_ft_scroller.destroy();
					popup_ft_scroller = null;
				}
				$('section.popup_ft').removeClass('ft_submitted');
				$('section.popup_ft .ft_result').removeClass('active');
				$('section.popup_ft .ft_result_top, section.popup_ft .ft_result_bottom').addClass('inactive');
			}else if(c == 'timeout'){
				error_ft('timeout');
			}else{
				error_ft('server');
			}
			inProgress = false;
			console.log("ocm");
			console.log(o);
			console.log(c);
			console.log(m);
		}
	}));
}



$.fn.tabFt = function (options){
	return this.each(function(){
		var dat = $(this);
		var button_action2 = $(this).data('tab');
		var hp_type = $(this).attr('data-hptype');
		dat.on({
			click : function(e){
				display(e);
			}
		});
		function display(e){
			e.preventDefault();
			e.stopPropagation();
			$('section.popup_ft .ft_result ul.ft_action2 li').each(function() {
				if($(this).data('tab')!=button_action2){
					$(this).removeClass('active');
				}
			});
			$('.ft_'+button_action2).addClass('active');
			$('section.popup_ft .errorBox div').removeClass('active');
			$('section.popup_ft .errorBox').removeClass('active');
			if(postalVal==''){
				error_ft('required');
			}else if(!validatePostalCode(postalVal)){
				error_ft('invalid');
			}else if(!navigator.onLine){
				error_ft('internet');
			}else{
				switch(hp_type){
					case '1,2,4,9,11,12':
						fill_table_HP(healthplans.commercial_name);
						for(var i=0;i<drugs.length;i++){
							if(drugs[i].Active){
								fill_table_CHPD(drugs[i].commercial,drugs[i].id);
								fill_POL(hp_type,drugs[i].id);
							}
						}
						break;
					case '5,6,7':
						fill_table_HP(healthplans.medicareD_name);
						for(var i=0;i<drugs.length;i++){
							if(drugs[i].Active){
								fill_table_CHPD(drugs[i].medicareD,drugs[i].id);
								fill_POL(hp_type,drugs[i].id);
							}
						}
						break;
					case '3,10':
						fill_table_HP(healthplans.medicaid_name);
						for(var i=0;i<drugs.length;i++){
							if(drugs[i].Active){
								fill_table_CHPD(drugs[i].medicaid,drugs[i].id);
								fill_POL(hp_type,drugs[i].id);
							}
						}
						break;
					case '8':
						fill_table_HP(healthplans.federal_name);
						for(var i=0;i<drugs.length;i++){
							if(drugs[i].Active){
								fill_table_CHPD(drugs[i].federal,drugs[i].id);
								fill_POL(hp_type,drugs[i].id);
							}
						}
						break;
				}
				//searchData(e,'tab');
			}
		}
	});
}

function fill_POL(hp_type,drugid){
	console.log(drugs);
	switch(hp_type){
		case '1,2,4,9,11,12':
			for(var i=0;i<drugs.length;i++){
				if(drugs[i].Active && drugs[i].id == drugid){
					$('#ft_result_'+drugid+'_POL').html(drugs[i].HPcommercial);
				}
			}
			break;
		case '5,6,7':
			for(var i=0;i<drugs.length;i++){
				if(drugs[i].Active && drugs[i].id == drugid){
					$('#ft_result_'+drugid+'_POL').html(drugs[i].HPmedicareD);
				}
			}
			break;
		case '3,10':
			for(var i=0;i<drugs.length;i++){
				if(drugs[i].Active && drugs[i].id == drugid){
					$('#ft_result_'+drugid+'_POL').html(drugs[i].HPmedicaid);
				}
			}
			break;
		case '8':
			for(var i=0;i<drugs.length;i++){
				if(drugs[i].Active && drugs[i].id == drugid){
					$('#ft_result_'+drugid+'_POL').html(drugs[i].HPfederal);
				}
			}
			break;
	}
}



function fill_table_HP(HealthplansNames){
	var tableResult = '';
	var resultContainerBottomLeft = $('section.popup_ft .ft_result_bottom .ft_result_left');
	for (var i = 0; i < HealthplansNames.length; i++) {
		tableResult += '<tr><td>'+HealthplansNames[i]+'</td></tr>';
	}
	tableResult = '<table>'+tableResult+'</table>';
	console.log(tableResult);
	resultContainerBottomLeft.html(tableResult);
}


function fill_table_CHPD(DrugCoverage,drugid){
	var tableResult = '';
	var tableResultEmpty = '';
	var tableClass;
	var resultContainerBottomRight = $('section.popup_ft .ft_result .ft_result_bottom .ft_result_right');
	var resultContainerTopRight = $('section.popup_ft .ft_result .ft_result_top .ft_result_right');


	if(DrugCoverage.length==0){
		//error_ft('no_result');
	}
	for (var i = 0; i < DrugCoverage.length; i++) {
		tableResult += '<tr><td>'+DrugCoverage[i]+'</td></tr>';
		tableResultEmpty += '<tr><td>&nbsp;</td></tr>';
	}
	switch(drugs.length){
		case 2:
			tableClass = 'two_drugs';
			break;
		case 3:
			tableClass = 'three_drugs';
			break;
	}
	$('.ft_result_table').each( function(index){
		if(typeof $(this).attr('id') == 'undefined' ){
			$(this).html(tableResultEmpty);
			$(this).addClass(tableClass);
		}
	});
	for(var i=0;i<drugs.length;i++){
		if(drugs[i].id == drugid){
			if(drugs[i].Active){
				$('#ft_result_table_'+drugs[i].id).html(tableResult);
				$('#ft_result_table_'+drugs[i].id).addClass(tableClass);
			}
		}
	}

	$('section.popup_ft .ft_result_left table:first-child tr td').each(function(index){
		var hasToBeHidden = true;
		for(var i=0;i<drugs.length;i++){
			if($('#ft_result_table_'+drugs[i].id+' tr:nth-child('+(index+1)+') > td').html()!= 'N/A'){
				hasToBeHidden = false;
			}
		}
		if(hasToBeHidden){
			$('section.popup_ft .ft_result_bottom .ft_result_right table tr:nth-child('+(index+1)+')').remove();
			$(this).parent('tr').remove();
		}
	});

	$('#ft_result_term').html($('#ft_zipcode').val());
	if(DrugCoverage.length!=0){
		$('.popup_ft').addClass('ft_submitted');
		$('.content_loader').removeClass('active');
		if(!$('section.popup_ft .ft_result').hasClass('active')){
			$('section.popup_ft .ft_result').addClass('active');
		}
		$('section.popup_ft .ft_result_top, section.popup_ft .ft_result_bottom').removeClass('inactive');
		$('section.popup_ft .ft_result_left table:first-child tr').each(function(index){
			$('section.popup_ft .ft_result_bottom .ft_result_right table tr:nth-child('+(index+1)+')').css('height',$(this).height()+'px');
		});
		$('.additional_infos').not('.additional_infos2').hide();
		$('.additional_infos2').show();

		if(typeof(popup_ft_scroller)!='undefined' && popup_ft_scroller!=null){
			popup_ft_scroller.destroy();
			popup_ft_scroller = null;
		}
		popup_ft_scroller = new iScroll($('section.popup_ft .content').get(0), {
			scrollbarClass: 'ftScrollbar',
			hideScrollbar:false,
			bounce:false
		});
	}
	inProgress = false;

}



//Return a specific error depending of the type
function error_ft(type){
	$('#ft_zipcode').addClass('error');
	$('#ft_zipcode').val("");
	$('section.popup_ft .errorBox div, .content_loader').removeClass('active');
	$('section.popup_ft').removeClass('ft_submitted');
	$('section.popup_ft .errorBox, section.popup_ft .errorBox div.'+type).addClass('active');
	$('section.popup_ft .ft_result .ft_result_bottom .ft_result_left table, section.popup_ft .ft_result .ft_result_bottom .ft_result_right table').html('');
	if(typeof(popup_ft_scroller)!='undefined' && popup_ft_scroller!=null){
		popup_ft_scroller.destroy();
		popup_ft_scroller = null;
	}
	$('section.popup_ft .ft_result').removeClass('active');
	$('section.popup_ft .ft_result_top, section.popup_ft .ft_result_bottom').addClass('inactive');
}






$.fn.popupFt = function (options){
	return this.each(function(){
		var opt = $.extend({
			"multi" : false
		}, options);
		var dat = $(this);
		var button_action1 = $('section.popup_ft').attr('data-button');
		var closeButton = $('section.popup_ft .close');
		var graph_btn = $('section.popup_ft .ft_graph');
		var closeButton_graph = $('section.popup_ft_graph .close');
		var backButton_graph = $('section.popup_ft_graph .backbtn');
		$('body').click(function(event){
			if ($(event.target).is('.ft_graph')) {
				var graphData = [];
				var hp_type =  $('section.popup_ft .ft_action2 li.active').attr('data-hptype');
				for(var i=0; i<drugs.length; i++){
					if(drugs[i].Active == true){
						var drugpercentLives;
						switch(hp_type){
							case '1,2,4,9,11,12':
								if(drugs[i].percentLives_commercial !== ""){
									drugpercentLives = 	drugs[i].percentLives_commercial;
								}
								break;
							case '5,6,7':
								if(drugs[i].percentLives_medicareD !== ""){
									drugpercentLives = 	drugs[i].percentLives_medicareD;
								}
								break;
							case '3,10':
								if(drugs[i].percentLives_medicaid !== ""){
									drugpercentLives = 	drugs[i].percentLives_medicaid;
								}
								break;
							case '8':
								if(drugs[i].percentLives_federal !== ""){
									drugpercentLives = 	drugs[i].percentLives_federal;
								}
								break;
						}
						graphData.push({
							"drugName" : drugs[i].Name,
							"drugPercent" : drugpercentLives
						});
					}
				}
				showGraph(graphData);
		     	displayGraph(event);
		    }
		});
		dat.on({
			touchstart : function(e){
				if($('.video_container').hasClass('active')){
					$('.done').trigger('click');
				}
				if(opt.multi == true){
					$(".popup.popup_bottom_bar.popup_ft, .popup.popup_bottom_bar.popup_ft_graph, .popup.popup_bottom_bar.popup_ft_offline").remove();
				}
				if(navigator.onLine){
					display(e);
					//display_na(e);
				}else{
					console.log('offline');
					display_offline(e);
				}
				if(opt.multi == true){
					dat.removeAttr('data-triggered');
				}
			}
		});
		closeButton.off().on({
			click : function(e){
				close(e);
			}
		});
		graph_btn.off().on({
			click : function(e){
				displayGraph(e);
				var graphData = [];
				var hp_type =  $('section.popup_ft .ft_action2 li.active').attr('data-hptype');
				for(var i=0; i<drugs.length; i++){
					if(drugs[i].Active == true){
						var drugpercentLives;
						switch(hp_type){
							case '1,2,4,9,11,12':
								if(drugs[i].percentLives_commercial !== ""){
									drugpercentLives = 	drugs[i].percentLives_commercial;
								}
								break;
							case '5,6,7':
								if(drugs[i].percentLives_medicareD !== ""){
									drugpercentLives = 	drugs[i].percentLives_medicareD;
								}
								break;
							case '3,10':
								if(drugs[i].percentLives_medicaid !== ""){
									drugpercentLives = 	drugs[i].percentLives_medicaid;
								}
								break;
							case '8':
								if(drugs[i].percentLives_federal !== ""){
									drugpercentLives = 	drugs[i].percentLives_federal;
								}
								break;
						}
						graphData.push({
							"drugName" : drugs[i].Name,
							"drugPercent" : drugpercentLives
						});
					}
				}
				showGraph(graphData);
			}
		});
		closeButton_graph.off().on({
			click : function(e){
				close(e);
			}
		});
		backButton_graph.off().on({
			click : function(e){
				closeGraph(e);
			}
		});

		function display_offline(e){
			e.preventDefault();
			e.stopPropagation();
			if($('section.popup_ft_offline').hasClass('active')){
				$('section.popup_ft_offline, .grey_layer').removeClass('active');
				dat.removeClass('on');
			}else{
				closeAllPopups();
				$('section.popup_bottom_bar').each(function() {
					if($(this).data('button')!=button_action1){
						$('section.bar_bottom .action .'+$(this).data('button')).removeClass('on');
					}
					$('.'+button_action1).removeClass('on');
					$(this).removeClass('active');
				});
				$('section.popup_ft_offline, .grey_layer').addClass('full').addClass('active');
				dat.addClass('on');
			}
			var closeButton = $('section.popup_ft_offline .close');
			closeButton.off().on({
				click : function(e){
					close(e);
				}
			});

		}

		function display_na(e){
			e.preventDefault();
			e.stopPropagation();
			if($('section.popup_ft_na').hasClass('active')){
				$('section.popup_ft_na, .grey_layer').removeClass('active');
				dat.removeClass('on');
			}else{
				closeAllPopups();
				$('section.popup_bottom_bar').each(function() {
					if($(this).data('button')!=button_action1){
						$('section.bar_bottom .action .'+$(this).data('button')).removeClass('on');
					}
					$('.'+button_action1).removeClass('on');
					$(this).removeClass('active');
				});
				$('section.popup_ft_na, .grey_layer').addClass('full').addClass('active');
				dat.addClass('on');
			}
			var closeButton = $('section.popup_ft_na .close');
			closeButton.off().on({
				click : function(e){
					close(e);
				}
			});
		}

		function display(e){
			e.preventDefault();
			e.stopPropagation();
			var irepZipcodeBtn = $('.btn_location');
			var href = "veeva:getDataForObject(Address),fieldName(Zip_vod__c),iRepZipCode(result)";

			$('section.popup_ft .ft_plus').popupFtAddDrug();
			drugs = new Array();
			document.location = href; 


			$('#ft_date').fillDate();
			if(exists('#ft_date2')){
				$('#ft_date2').fillDate();
			}

			$('.additional_infos').not('.additional_infos2').show();
			$('.additional_infos2').hide();
			$('section.popup_ft .errorBox div').removeClass('active');
			$('#ft_zipcode').removeClass('error');
			$('.ft_result_top, .ft_result_bottom').addClass('inactive');
			$('section.popup_ft .ft_result').removeClass('active');
			$('section.popup_ft .errorBox').removeClass('active');
			$('section.popup_ft').removeClass('ft_submitted');

			$('.ft_result_top .ft_result_right table td div.aciphex').html('');
			$('.ft_result_top .ft_result_right table td div.nexium').html('');
			$('.ft_result_top .ft_result_right table td div.ft_plus').removeClass('disabled');
			$('.ft_result_top .ft_result_right table td div.ft_cross').removeClass('active');
			$('.ft_result_top').removeClass('multiple');
			$('.popup_ft_add_drug ul li').each(function (index){
				$(this).removeClass('disabled');
			});

			if(typeof(popup_ft_scroller)!='undefined' && popup_ft_scroller!=null){
				popup_ft_scroller.destroy();
				popup_ft_scroller = null;
			}
			$('.druginfo').each(function(index,element){
				drug_id = $(this).val();
				drug_name = $(this).attr('data-drugname');
				drug_urlname = $(this).attr('data-urlname');
				if($(this).hasClass('active')){
					drug_active = true;
				}else{
					drug_active = false;
				}
				drug = MakeDrugObject(drug_id, drug_name, drug_urlname, drug_active);
				if(index==0){
					getJsonInfo('NATPOL', 'lives', api_key, drug, '1,2,3,4,5,6,7,8,9,10,11,12', '');
				}
				drug.percentLives = "";
				drugs.push(drug);
			});

			$('section.popup_ft .btn_submit').searchFt();
			$('section.popup_ft .ft_action2 li').tabFt();
			if($('section.popup_ft').hasClass('active')){
				if($('.video').hasClass('active')){
					var video = document.getElementById("video_moa");
					video.play();
					$(video).fadeIn(300);
				}
				$('section.popup_ft, .grey_layer').removeClass('active');
				dat.removeClass('on');
			}else{
				if($('.video').hasClass('active')){
					var video = document.getElementById("video_moa");
					video.pause();
					$(video).fadeOut(300);
				}
				closeAllPopups();
				$('section.popup_bottom_bar, section.popover_bottom_bar, section.popover_top_bar').each(function() {
					//console.log('button_action1');
					if($(this).data('button')!='ft'){
						$('section.bar_bottom .action .'+$(this).data('button')).removeClass('on');
						$('section.bar_top .action button.'+$(this).data('button')).removeClass('on');
					}
					//$('.'+button_action1).removeClass('on');
					$(this).removeClass('active');
				});
				$('section.popup_ft').fadeIn(300);
				$('section.popup_ft, .grey_layer').addClass('full').addClass('active');
				dat.addClass('on');
				if($('section.popup_ft').find('#ft_zipcode').length>0){
					$('section.popup_ft').find('#ft_zipcode').prop('disabled',false);
				}
			}
			var closeButton = $('section.popup_ft .close');
			closeButton.off().on({
				click : function(e){
					close(e);
				}
			});
			var closeButton_graph = $('section.popup_ft_graph .close');
			closeButton_graph.off().on({
				click : function(e){
					close(e);
				}
			});

			var backButton_graph = $('section.popup_ft_graph .backbtn');
			backButton_graph.off().on({
				click : function(e){
					closeGraph(e);
				}
			});
			return false;
		}
		function close(e){
			$('.ft_cross').click();
			e.preventDefault();
			e.stopPropagation();
			if($('.video').hasClass('active')){
				var video = document.getElementById("video_moa");
				video.play();
				$(video).fadeIn(300);
			}
			$('section.popup_bottom_bar').each(function() {
				if($(this).data('button')!=button_action1){
					$('section.bar_bottom .action .'+$(this).data('button')).removeClass('on');
				}
				$('.'+button_action1).removeClass('on');
				$(this).removeClass('active');
			});
			$('section.popup_ft').fadeOut(300);
			$('section.popup_ft_offline').fadeOut(300);
			$('section.popup_ft').removeClass('active');
			$('section.popup_ft_offline').removeClass('active');
			$('.grey_layer').removeClass('active');

			//Fix amitiza hotsport threetabs template
			if(exists('.tt_hotspot')){
				$('.tt_hotspot').fadeIn(300);
			}
		}
		function displayGraph(e){
			e.preventDefault();
			e.stopPropagation();
			if($('section.popup_ft').hasClass('active')){
				$('section.popup_ft').removeClass('active');
				$('section.popup_ft_graph').addClass('active');
				$('section.popup_ft_graph #ft_date').fillDate();
				if(typeof(popup_ftgraph_scroller)!='undefined' && popup_ftgraph_scroller!=null){
					popup_ftgraph_scroller.destroy();
					popup_ftgraph_scroller = null;
				}
				popup_ftgraph_scroller = new iScroll($('section.popup_ft_graph .content').get(0), {
					scrollbarClass: 'ftScrollbar',
					hideScrollbar:false,
					bounce:false
				});

			}else{
				$('section.popup_ft').addClass('active');
				$('section.popup_ft_graph').removeClass('active');
			}

		}
		function closeGraph(e){
			e.preventDefault();
			e.stopPropagation();
			if($('section.popup_ft_graph').hasClass('active')){
				$('section.popup_ft').addClass('active');
				$('section.popup_ft_graph').removeClass('active');
			}else{
				$('section.popup_ft').removeClass('active');
				$('section.popup_ft_graph').addClass('active');
			}
		}
		function getZipCode(){
			if($('#irepzipcode').val()!='Address.Zip_vod__c' && $('#irepzipcode').val()!='' ){
				$('#ft_zipcode').val($('#irepzipcode').val());
			}
		}
	});
}

$.fn.popupFtAddDrug = function (options){
	return this.each(function(){
		var dat = $(this);
		var popup_target = $('.popup_ft_add_drug.'+dat.data('target'));
		var delete_drug = $('section.popup_ft .ft_cross');
		var drug_list = popup_target.find('li');
		dat.off().on({
			click : function(e){
				display(e);
			}
		});
		drug_list.off().on({
			click : function(e){
				selectDrug(e,this,popup_target);
			}
		})
		delete_drug.off().on({
			click : function(e){
				deleteDrug(e,this,popup_target);
			}
		})
		function display(e){
			e.preventDefault();
			e.stopPropagation();
			if(popup_target.hasClass('active')){
				popup_target.removeClass('active');
			}
			else{
				$('.popup_ft_add_drug').each(function() {
					$(this).removeClass('active');
				});
				popup_target.addClass('active');
			}
		}
		function selectDrug(e, drug, popup_target){
			e.preventDefault();
			e.stopPropagation();
			var drug_id = $(drug).attr('data-id');
			var drug_name = $(drug).attr('data-name');
			if(!$(drug).hasClass('disabled')){
				$('.popup_ft_add_drug li').each(function() {
					if($(this).attr('data-id')==drug_id){
						$(this).addClass('disabled');
					}
				});
				$('.drug_name').each(function() {
					if($(this).attr('data-target')==dat.data('target')){
						$(this).html(drug_name);
					}
				});
				for(var i=0;i<drugs.length;i++){
					if(drugs[i].id == drug_id){
						drugs[i].Active = true;
					}
				}
				$('.ft_result_pol').each(function() {
					if($(this).attr('data-target')==dat.data('target')){
						$(this).attr('id','ft_result_'+drug_id+'_POL');
					}
				});

				$('.ft_result_table').each(function() {
					if($(this).attr('data-target')==dat.data('target')){
						$(this).attr('id','ft_result_table_'+drug_id);
					}
				});

				$('.ft_plus').each(function() {
					if($(this).attr('data-target')==dat.data('target')){
						$(this).addClass('disabled');
					}
				});
				$('.ft_cross').each(function() {
					if($(this).attr('data-target')==dat.data('target')){
						$(this).addClass('active');
						$(this).attr('data-id',drug_id);
						$('.ft_result_top').addClass('multiple');
					}
				});
				$('.ft_result_percentages .drug_add[data-target="'+popup_target+'"] span').each(function() {
					if($(this).attr('data-id')==drug_id){
						$(this).addClass('active');
					}else{
						$(this).removeClass('active');
					}
				});
				popup_target.removeClass('active');
				inProgress = false;
				searchData(e,'submit');
			}
		}

		function deleteDrug(e, drug, popup_target){
			e.preventDefault();
			e.stopPropagation();
			var drug_id = $(drug).attr('data-id');
			var drug_name = $(drug).attr('data-name');
			var target = $(drug).attr('data-target');




			$('.popup_ft_add_drug li').each(function() {
				if($(this).attr('data-id')==drug_id){
					$(this).removeClass('disabled');
				}
			});
			$('.drug_name').each(function() {
				if($(this).attr('data-target')==target){
					$(this).html('');
				}
			});

			for(var i=0;i<drugs.length;i++){
				if(drugs[i].id == drug_id){
					drugs[i].Active = false;
					drugs[i].percentLives = "";
				}
			}

			$('.ft_result_table').each(function() {
				if($(this).attr('data-target')==target){
					$(this).find('td').each(function(){
						$(this).html('&nbsp;')
					});
					$(this).removeAttr('id');
				}
			});

			$('.ft_plus').each(function() {
				if($(this).attr('data-target')==target){
					$(this).removeClass('disabled');
				}
			});
			$('.ft_cross').each(function() {
				if($(this).attr('data-target')==target){
					$(this).removeClass('active');
					$(this).removeAttr('data-id');
					if ( !( $('.ft_cross').hasClass('active') ) ) {
						$('.ft_result_top').removeClass('multiple');
					}
				}
			});
			$('.ft_result_percentages .drug_add[data-target="'+target+'"] span').each(function() {
				if($(this).attr('data-id')==drug_id){
					$(this).removeClass('active');
				}else{
					$(this).addClass('active');
				}
			});
			$('.ft_result_pol').each(function() {
				if($(this).attr('data-target')==target){
					$(this).html('');
					$(this).removeAttr('id');
				}
			});
		}
	});
}



function MakeDrugObject(id, Name, UrlName, Active) {
	return {
		id: id,
		Name: Name,
		Urlname : UrlName,
		NatPOL: null,
		POL: null,
		Formularies: null,
		Active: Active
	}
}

function bench(){
	return (new Date().getTime() - StartTime)/1000;
}

$.fn.getLocation = function(){
	$(this).each(function(i,ele){
		var self = $(ele);
		self.off().on('click', function(e){
			e.stopPropagation();
			e.preventDefault();
			getLoc();
		});

		function getLoc(){
			if(navigator.geolocation){
				navigator.geolocation.getCurrentPosition(outputPosition);
			}
		}

		function outputPosition(pos){
			geoloc = pos;
		}
	});
}







function validatePostalCode(postalVal) {
	console.log(postalVal);
    /* US + CANADA */
    /*
    var regex = new RegExp(/^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i);
    if(!regex.test(postalVal)){
    	regex = new RegExp(/(^\d{5}$)|(^\d{5}-\d{4}$)/);
		if(!regex.test(postalVal)){
			return false;
		}
		else{
			return true;
		}
    }
    return true;
    */
    var regex = new RegExp(/(^\d{5}$)|(^\d{5}-\d{4}$)/);
    if(!regex.test(postalVal)){
    	return false;
	}else{
		return true;
	}
}

$.fn.fillDate = function( options ) {
	if ( $(this).length > 0 ) {

		var now = new Date();
		var day = now.getDate();
		var month = now.getMonth() + 1;
		var year = now.getFullYear();
		var hours = now.getHours()
		var minutes = now.getMinutes()

		if (minutes < 10)
			minutes = "0" + minutes

		var suffix = "AM";
		if (hours >= 12) {
			suffix = "PM";
		}
		if (hours == 0) {
			htmlours = 12;
		}

		$(this).text(month + "/" + day + "/" + year + " - " + hours + ":" + minutes);
	}
}


//run to generate graph
var FormularyToolGraphDrugMinimumHeight = 11;
function showGraph(dataObject){
	/*dataobject strucutre:
	= [
		{
			"drugName" : "stuff",
			"drugPercent" : "50"
		},
		{
			"drugName" : "bar",
			"drugPercent" : "50"
		}
	]
	*/
	var graphContent = $(".popup_ft_graph .graphContent");
	var bars = graphContent.find('.bars');
	var labels = graphContent.find('.labels');

	graphContent.removeClass('oneDrug twoDrugs threeDrugs');
	switch(dataObject.length){
		case 1:
			graphContent.addClass('oneDrug');
			break;
		case 2:
			graphContent.addClass('twoDrugs');
			break;
		case 3:
			graphContent.addClass('threeDrugs');
			break;
	}

	graphContent.find('.bars, .labels').empty();
	for(var i=0; i<dataObject.length; i++){
		if(dataObject[i].drugPercent<11){
			bars.append('<div><div style="height:'+dataObject[i].drugPercent+'%;"><span class="top">'+dataObject[i].drugPercent+'%</span></div></div>');
		}else{
			bars.append('<div><div style="height:'+dataObject[i].drugPercent+'%;"><span>'+dataObject[i].drugPercent+'%</span></div></div>');
		}

		labels.append('<div>'+dataObject[i].drugName+'</div>');

		//fix for small numbers not fitting in the bars
		if(dataObject[i].drugPercent < FormularyToolGraphDrugMinimumHeight){
			bars.children().last().addClass('tiny');
		}
	}
}


function sanitizeDrugName(name){
	var htmlRegex = /(<([^>]+)>)/ig;
	string.replace(htmlRegex, "");
	return name;
}


function preventSubmit(e){
	e.preventDefault();
	$('button.btn_submit').trigger('touchstart');
	return false;
}



iRepZipCode = function(result) {
    accountZipCode =  result.Address.Zip_vod__c;
    if(accountZipCode!='Address.Zip_vod__c' && accountZipCode!='' ){
		$('#ft_zipcode').val(accountZipCode);
	}
}
