setInterval(
	function() {
		if ($('.btn-group.bizmoduleselect').find($('.btn.chbtn.active')).length != 0) {
			$('#sInptBtn').html('Search')
		} else {
			$('#sInptBtn').html('Search All')
		}
}, 100);

function removeActiveClass() {
	$(".rToolBtns.rToolBtnActive").each(function(index) {
		$(this).removeClass("rToolBtnActive");
	});
}

function removeActiveClassInfoBtn() {
	$(".infoBtn.rToolBtnActive").each(function(index) {
		$(this).removeClass("rToolBtnActive");
	});
}

function hideInfoDetails(){
	$('.medicationDetails').hide();
	$('.procDetails').hide();
	$('.aboutDetails').hide();
}

function showInfoDetails(div){
	hideInfoDetails();
	$(div).show();
}
(function filterScore(){
	//Show only those reuslts that are four stars and up
	var stars;

	function rmActiveAttr(fBtn){
		//remove active attributes from all the button
		fBtn.closest($(".dropdown-menu")).find($(".fBtn")).each(function(index){
			$(this).find($(".fa.fa-chevron-circle-right")).removeClass("fBtnActive");
		});
	};

	function preLoader(){
		//To improve the user experience add the loader for showig the users that it has been filtered
		$(".sResultsMain").hide();
		$("#loader_divFilter").show();
		setTimeout(function(){
		 	$(".sResultsMain").show();
			$("#loader_divFilter").hide();
		}, 500);
	};

	function filter(fBtn, rating){
		preLoader();
		//if filter applied, then remove the funnel icon and add the double tick icon
		fBtn.closest($(".dropdown")).find($("#fScore .ionicons.ion-funnel")).remove();
		if(fBtn.closest($(".dropdown")).find($("#fScore .ionicons.ion-android-done-all")).length==0){
			fBtn.closest($(".dropdown")).find($("#fScore")).append("<i class='ionicons ion-android-done-all'></i>");
		}
		rmActiveAttr(fBtn);
		fBtn.find($(".fa.fa-chevron-circle-right")).addClass("fBtnActive");
		var counterNotShown=0,counterShown=0;
		$(".sResultsMain").find($(".sResultBox")).each(function(){
			stars = parseInt($(this).find($(".star-ratings-css-top")).css("width"))/20;
			if(stars<rating){
				$(this).fadeOut();
				counterNotShown++;
			}
			if(stars>=rating){
				$(this).fadeIn();
				counterShown++;
			}
		});
		fBtn.closest($("#recentSearch")).find($("#numberResults")).text("Showing "+counterShown+" results");
	};

	function rmFilter(fBtn){
		//To improve the user experience add the loader for showig the users that it has been filtered
		preLoader();
		//if filter is not applied, then remove the double tick icon and add the double tick icon
		fBtn.closest($(".dropdown")).find($("#fScore .ionicons.ion-android-done-all")).remove();
		if(fBtn.closest($(".dropdown")).find($("#fScore .ionicons.ion-funnel")).length==0){
			fBtn.closest($(".dropdown")).find($("#fScore")).append("<i class='ionicons ion-funnel'></i>");
		}
		rmActiveAttr(fBtn);
		//display all the results
		$(".sResultsMain").find($(".sResultBox")).each(function(){
			if($(this).css("display")=="none")
				$(this).fadeIn();
		});
		var totalResults = $(".sResultsMain").find($(".sResultBox")).length;
		fBtn.closest($("#recentSearch")).find($("#numberResults")).text("Showing "+totalResults+" results");
	};

	function hideRmFilter(){
		console.log($(".dropdown-menu").find($(".fBtnActive")).length);
		if($(".dropdown-menu").find($(".fBtnActive")).length!=0)
		{
			$(".dropdown-menu").find("#rmFilterDiv").show();
		}
		else{
			$(".dropdown-menu").find("#rmFilterDiv").hide();
		}
	};

	hideRmFilter();
	$(document).click(function(){
		hideRmFilter();
	});

	$("#fourUpRate").click(function(){
		filter($(this),4);
	});

	//Show only those reuslts that are three stars and up
	$("#threeUpRate").click(function(){
		filter($(this),3);
	});

	//Show only those reuslts that are two stars and up
	$("#twoUpRate").click(function(){
		filter($(this),2);
	});

	//Show only those reuslts that are one stars and up
	$("#oneUpRate").click(function(){
		filter($(this),1);
	});

	//Show only those reuslts that are one stars and up
	$("#removeFilter").click(function(){
		rmFilter($(this));
	});

})();

function addActiveClass(element) {
	element.addClass("rToolBtnActive");
}

(function showAll() {
	$(".showAll").click(function() {
		//Remove the active class from all the tool buttons
		removeActiveClass();
		//Add the active class to the save button
		addActiveClass($(this));
		//Show the details of the recent searches
		$("#recentSearch").show();
		//Hide the details of all the saved results
		$("#savedSearch").hide();
	});
})();

//Run this function to show the saved results
(function showSaved() {
	$(".rSaved").click(function() {
		//Remove the active class from all the tool buttons
		removeActiveClass();
		//Add the active class to the save button
		addActiveClass($(this));
		//This is done because the we are interating over the entir list and appending them one by one everytime we click saved button
		$(".sResultsSaved").html("");
		for (i = 0; i < localStorage.length; i++) {
			//Outer div is useful while deleting the saved result
			$(".sResultsSaved").append("<div class='outerDiv'>" + localStorage.getItem(localStorage.key(i)) + "</div>");
		}
		//Modify the dom a bit to replace the download button into a delete button
		$(".sResultsSaved .sResultBox").each(function() {
			$(this).find($(".mineNameHeader .rStats i.fa.fa-download")).remove();
			$(this).find($(".mineNameHeader .rStats")).append('<i class="ionicons ion-android-delete rDeleteBtn" data-toggle="tooltip" titile="Delete"></i>');
		});
		//Load the number of saved results
		$("#numberResultsSaved").html("Showing " + localStorage.length + " results");

		//Hide the details of the recent searches
		$("#recentSearch").hide();
		//Show the details of the saved searches
		$("#savedSearch").show();
		//Hide the mine Information
		$(".sResultsMine").hide();
		//Deletion of saved results
		$(".rDeleteBtn").click(function() {
			$(this).closest(".outerDiv").hide();
			$(this).closest($(".rStats")).append('<i class="fa fa-download rSavedBtn" data-toggle="tooltip" title="Save"></i>');
			var div = $(this).closest(".sResultBox");
			var divHTML = div[0].outerHTML;
			$(this).remove();
			var divHTML = div[0].outerHTML;
			localStorage.removeItem(divHTML);
			$("#numberResultsSaved").html("Showing " + localStorage.length + " results");
			$('.rToolBtns.rSaved .badge').text(localStorage.length);
		});
	});
})();

//function to close the modify searchbox
(function closeModifySearchBox() {
	$("#mClose").click(function() {
		removeActiveClass();
		addActiveClass($(".showAll"));
		$(".mMines").fadeOut();
		//Show the details of the recent searches
		$("#recentSearch").show();
		//Hide the details of all the saved results
		$("#savedSearch").hide();
	});
})();

//The following function is used for modifying the search parameters like mines, number of results to be fetched etc
(function modifySearch() {
	$(".mSearch").click(function() {
		removeActiveClass();
		addActiveClass($(this));
		$(".mMines").fadeIn();
	});
})();

function addInfoDiv(details){
	//console.log(details);
	let diseaseInfo = details.diseaseInfo[0];
	let name = diseaseInfo.name;
	let parentName = diseaseInfo.parentName;
	let info = diseaseInfo.info.slice(0, 520) + "...";
	let imgLogo = diseaseInfo.logo;
	let medications = diseaseInfo.medication;
	let procedure = diseaseInfo.procedure;
	console.log(details, diseaseInfo, name);

	let medicationDiv="", procDiv="";

	medicationDiv += '<ul id="medInfo">';
	for(var i in medications){
		medicationDiv += '<li class="info">' +
												'<span class="infoTitle"><a href="' + medications[i].url + '">' + medications[i].title + '</a></span><br>' +
												'<span class="infoTitleDetails">' + medications[i].info + '</span><hr style="margin:10px">'
										 '</li>';
	}
	medicationDiv += '</ul>';

	procDiv += '<ul id="procInfo">';
	for(var i in procedure){
		procDiv += '<li class="info">' +
												'<span class="infoTitle" ><a href="' + procedure[i].url + '">' + procedure[i].title + '</a></span><br>' +
												'<span class="infoTitleDetails">' + procedure[i].info + '</span><hr style="margin:10px">'
										 '</li>';
	}
	procDiv += '</ul>';

	let div = '<div class="mineInfoHeader">\
	<div class="mineInfoName">\
	<h2>\
	<h style="color:black">' + name + '</h>\
	<p style="\
    font-size: 14px;\
    color: gray;\
">Also called: '+ parentName +'</p>\
	</h2>\
	</div><div class="mineInfoLogo"><a href="http://maizemine.rnet.missouri.edu:8080/maizemine" style="color:black"><img src="' + imgLogo +'" alt="Insta-MediCare" height="100px"></a></div></div><div>\
  <div class="infoBtnDiv">\
    <p class="infoBtn rToolBtnActive about">About</p>\
    <p class="infoBtn med">Medications</p>\
    <p class="infoBtn proc">Medical Procedures</p>\
  </div>\
</div>\
<div class="aboutDetails">\
<p>' + info + '</p><p style="text-align:right;font-size:12px"><em>Data from <a href="http://medicinenet.com">MedicineNet</a></em></p>\
</div>\
<div class="medicationDetails">'
+ medicationDiv+
'</div>\
<div class="procDetails">'
+ procDiv +
'</div>'

	$('.sResultsMine').html(div);
	$('.sResultsMine').show();
	$('.medicationDetails').hide();
	$('.procDetails').hide();

	$('.infoBtn.med').click(function(){
		removeActiveClassInfoBtn();
		addActiveClass($(this));
		showInfoDetails('.medicationDetails');
	});

	$('.infoBtn.proc').click(function(){
		removeActiveClassInfoBtn();
		addActiveClass($(this));
		showInfoDetails('.procDetails');
	})

	$('.infoBtn.about').click(function(){
		removeActiveClassInfoBtn();
		addActiveClass($(this));
		showInfoDetails('.aboutDetails');
	})
}

(function clickDiseaseDiv(){
	$('.sResultBox').click(function(){
		let diseaseName = $(this).find('.rClassType').text();
		console.log(diseaseName);
		$.ajax({
			url : "/getDiseaseInfo/"+diseaseName,
			method : 'GET',
			statusCode : {
					200 : function(res){
						addInfoDiv(res);
					},
					400 : function(res){
						console.log(res.responseJSON.message);
					}
				}
		});
	});
})();
