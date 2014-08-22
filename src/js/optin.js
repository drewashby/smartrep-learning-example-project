var product_type = "CONTRAVE";
var current_marketing_optin_data = "";

$(document).ready(function() {
	$('.optin_popup').optin_popup();
});



$.fn.optin_popup = function(options) {
	return this.each(function() {
		var emailField = $(this).find('.emailField');
		var errorBox = $(this).find('.errorBox');
		var successBox = $(this).find('.successBox');
		var submitButton = $(this).find('.emailSubmit');
		var emailField = $(this).find('.emailField');
		var href = "veeva:getDataForObject(Account),fieldNames(TKD_Marketing_Opt_In_Product_and_Date__c),log(result)";
		document.location = href;

		submitButton.off().on({
			click: function(e) {
				sendMail(e);
			}
		});


		function sendMail(e) {
			e.preventDefault();
			e.stopPropagation();
			successBox.removeClass('active');
			errorBox.removeClass('active');
			emailField.removeClass('errorBox successBox');
			var emailVal = emailField.val().toString();
			if (navigator.onLine) {
				if (emailField.val() == '') {
					console.log('required');
					//empty email
					error('required');
				} else if (!validateEmail(emailVal)) {
					console.log('incorrect');

					//does not pass regexp
					error('incorrect');
				} else {
					console.log('successss');
					mailSend();
				}
			} else {
				error('connection');
			}
			if(emailField.is(':focus')){
				$('#hidekeyboard').removeAttr("disabled").focus().blur().attr("disabled", "disabled");
			}
		}

		function error(errorType) {
			successBox.removeClass('active');
			emailField.addClass('errorBox');
			errorBox.removeClass('incorrect required connection unlinked').addClass(errorType);
			errorBox.addClass('active');
		}

		function success() {
			successBox.addClass('active');
			errorBox.removeClass('active');
	    	hideKeyboard();
		}

		function validateEmail(emailVal) {
			console.log(emailVal);
			var re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
			return re.test(emailVal);
		}

		function mailSend() {
			var getEmail = emailField.val();
			var currentdate = new Date();
			var newAccountFieldTest = {};
			newAccountFieldTest.TKD_Marketing_Email__c = getEmail;
			/*
				productfamily1_datetime; productfamily2_datetime;......; productfamilyN_datetime

				AMITIZA_8/8/2013 @ 15:57:33

				if the current productfamily exists, overwrite it.
				else, append to the current string.
			*/
			console.log(current_marketing_optin_data);
			if (current_marketing_optin_data != "") {
				if (current_marketing_optin_data.indexOf(product_type) >= 0 && current_marketing_optin_data.indexOf(";") >= 0) {
					//it exists and there are more than one entry
					//update string with latest date
					var start = current_marketing_optin_data.indexOf(product_type);
					var end = current_marketing_optin_data.indexOf("; ", current_marketing_optin_data.indexOf(product_type));
					end = end < 0 ? current_marketing_optin_data.length : end; //if it doesn't find a semicolon

					newAccountFieldTest.TKD_Marketing_Opt_In_Product_and_Date__c = current_marketing_optin_data.replace(current_marketing_optin_data.substring(start, end), "") + "; ";
					//trim semicolon if necessary
					if (newAccountFieldTest.TKD_Marketing_Opt_In_Product_and_Date__c.indexOf("; ") == 0) {
						newAccountFieldTest.TKD_Marketing_Opt_In_Product_and_Date__c = newAccountFieldTest.TKD_Marketing_Opt_In_Product_and_Date__c.substring(2, newAccountFieldTest.TKD_Marketing_Opt_In_Product_and_Date__c.length);
					}

				} else if (current_marketing_optin_data.indexOf(product_type) >= 0) {
					//it exists and it is the only entry
					newAccountFieldTest.TKD_Marketing_Opt_In_Product_and_Date__c = "";
				} else {
					//it does not exist, but there is something already there.
					newAccountFieldTest.TKD_Marketing_Opt_In_Product_and_Date__c = current_marketing_optin_data + "; ";
				}
			} else {
				//the entry is blank
				newAccountFieldTest.TKD_Marketing_Opt_In_Product_and_Date__c = "";
			}

			console.log(newAccountFieldTest.TKD_Marketing_Opt_In_Product_and_Date__c);

			newAccountFieldTest.TKD_Marketing_Opt_In_Product_and_Date__c += product_type + "_" + currentdate.getDate() + "/" + (currentdate.getMonth() + 1) + "/" + currentdate.getFullYear() + " @ " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
			var myJSONTextFactor = JSON.stringify(newAccountFieldTest);
			var requestFactor = "veeva:saveObject(Account),value(" + myJSONTextFactor + "),callback(saved)";
			//console.log(newAccountFieldTest);
			document.location = requestFactor;
		}

		saved = function(result) {
			var testobjectId = result.objectId;
			if (String(result["objectId"]).length <= 3) { //if the result is 001
				//show error type: broken because in media mode

				error('unlinked');
			} else {
				//show success
				success();
			}

		}



		var topresult;
		log = function(result) {
			topresult = result;
			var href = "veeva:getDataForObject(Account),fieldNames(TKD_Marketing_Email__c),log2(result)";
			document.location = href;

		}
		log2 = function(result){
			if (result.Account.TKD_Marketing_Email__c != '' && result.Account.TKD_Marketing_Email__c != 'Account.TKD_Marketing_Email__c') {
				if(topresult.Account.TKD_Marketing_Opt_In_Product_and_Date__c.indexOf(product_type) >= 0){
					emailField.val(result.Account.TKD_Marketing_Email__c);
				}
				current_marketing_optin_data = topresult.Account.TKD_Marketing_Opt_In_Product_and_Date__c;
			}
			//$('#accountname2').html(JSON.stringify(result));
		}


	});
}
