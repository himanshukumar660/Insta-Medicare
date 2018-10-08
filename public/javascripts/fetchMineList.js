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
				SymptomList.push(SymptomName);
			}
			sex.add("Male");
			sex.add("Female");

			//Add the different sex list in the front end
			var sex = Array.from(sex);
			for (item in sex) {
				$(".sInfoSex").append(
					'<div id="sInfo" class="choiceLst">\
						<div data-toggle="buttons" class="btn-group bizmoduleselect">\
							<label class="btn chbtn">\
								<div class="bizcontent">\
									<button id="choices">\
										<input type="checkbox" name="sex" value="' +
					sex[item] + '"/>\
										' + sex[item] + '\
									</button>\
								</div>\
							</label>\
						</div>\
					</div>'
				);
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
			};

			for (each in SymptomList) {
				$(".sInfoMines").append(
					'<div id="sInfo" class="choiceLst">\
							<div data-toggle="buttons" class="btn-group bizmoduleselect">\
								<label class="btn chbtn">\
									<div class="bizcontent">\
										<button id="choices">\
											<input type="checkbox" name="mines" value="' +
					SymptomList[each] + '"/>\
											' + SymptomList[each] + '\
										</button>\
									</div>\
								</label>\
							</div>\
						</div>'
				);
			}

			var s = document.createElement("script");
			s.innerHTML = '\
				$(".btn.chbtn").click(function() {\
					var mineName = $(this).find($(".bizcontent button#choices")).text();\
					$(this).find($(".bizcontent button#choices")).toggleClass("sVisited")\
				});'
			$("head").append(s);
		}
	}

	function errorAPICall(xhr, textStatus, errorThrown) {

	}
}());
