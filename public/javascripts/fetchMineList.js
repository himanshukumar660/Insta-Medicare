//The following block of code displays the page only when the ajax to get the list of Symptoms completes

//The following code fetches all the Symptom list
var fetchSymptomList = (function() {
	var regEndPnt = "/getSymptomList";
	$.ajax({
		type: 'get',
		url: regEndPnt,
		success: searchCallback,
		error: errorAPICall
	});

	function searchCallback(data) {
		console.log(data);
		if (data.statusCode == 200) {
			var SymptomList = [];
			var SymptomColor = {};
			var sex = new Set();
			for (each in data.instances) {
				var SymptomName = data.instances[each].Name;
				var SymptomID = data.instances[each].ID;
				SymptomList.push([SymptomName, SymptomID]);
			}
			sex.add(["Male", "male"]);
			sex.add(["Female", "female"]);

			//Add the different sex list in the front end
			var sex = Array.from(sex);
			for (item in sex) {
				let div = '<div id="sInfo" class="choiceLst">\
					<div data-toggle="buttons" class="btn-group bizmoduleselect">\
						<label class="btn chbtn">\
							<div class="bizcontent">\
								<button id="choices">\
									<input type="checkbox" name="sex" value="' +
				sex[item][1] + '"/>\
									' + sex[item][0] + '\
								</button>\
							</div>\
						</label>\
					</div>\
				</div>';

				$(".sInfoSex").append(
					div
				);
			};

			var css = document.createElement("style");
			css.innerHTML = "." + sex[item] + "{" + "background-color:#bed73b!important;\
				color: black!important;\
				font-weight: 500;\
			border:none!important;\
			box-shadow:0 0.3em 0.5em -0.2em rgba(100,100,100,1),\
			 0 1em 2em -0.75em rgba(100,100,100,0.75),\
			 0 0.31em 0.5em -0.5em rgba(100,100,100,0.5),\
			 0 0.3em 0.5em -0.2em rgba(100,100,100,0.2);\
			}";
			$("head").append(css);

			symptomListDiv = Array();
			for (each in SymptomList) {
				let div = '<div id="sInfo" class="choiceLst">\
						<div data-toggle="buttons" class="btn-group bizmoduleselect">\
							<label class="btn chbtn">\
								<div class="bizcontent">\
									<button id="choices">\
										<input type="checkbox" name="mines" value="' +
				SymptomList[each][1] + '"/>\
										' + SymptomList[each][0] + '\
									</button>\
								</div>\
							</label>\
						</div>\
					</div>';
					symptomListDiv.push(div);
				}

			for(var i=0;i<Math.min(25, symptomListDiv.length);i++){
				$(".sInfoMines").append(
					symptomListDiv[i]
				);
			}

			if(symptomListDiv.length>=25){
				$(".sBox").append(
					'<br><button class="showBtn" id="showMoreSymp" type="" name="">Show More</button>'
				);
			}

			for(var i=25;i<symptomListDiv.length;i++){
				symptomListDiv[i] = $(symptomListDiv[i]).attr('class', 'extraSymp');
				$(".sInfoMines").append(
				 	symptomListDiv[i]
				);
			}

			$('.extraSymp').hide();
			var s = document.createElement("script");
			s.innerHTML = '\
				$(".btn.chbtn").click(function() {\
					var mineName = $(this).find($(".bizcontent button#choices")).text();\
					$(this).find($(".bizcontent button#choices")).toggleClass("sVisited")\
				});'
			$("head").append(s);
			$('.showBtn#showMoreSymp').click(function(){
				$(this).hide();
				$('.extraSymp').show();
			})
		}
	}

	function errorAPICall(xhr, textStatus, errorThrown) {

	}
}());
