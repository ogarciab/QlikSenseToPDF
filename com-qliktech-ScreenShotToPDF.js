define(["./jspdf", "./jspdf.plugin.javascript", "./jspdf.plugin.addimage", "./html2canvas", "./jspdf.plugin.from_html"
	, "./jspdf.plugin.split_text_to_size", "./jspdf.plugin.standard_fonts_metrics", "./FileSaver"
],

	function () {
		'use strict';
		
		var pageFormats = {
			'a3': [297, 420],
			'a4': [210, 297],
			'a5': [148, 210]
		};
		
		var downloadPdf = {
			ref: "downloadPdfButtonText",
			type: "string",
			label: "Download PDF button text"
		};
		var pageOrientation = {
			ref: "pageOrientation",
			type: "string",
			component: "dropdown",
			label: "Page Orientation",
			options: [{
				value: "p",
				label: "Portrait"
			}, {
				value: "l",
				label: "Landscape"
			}],
			defaultValue: "p"
		};
		var pageFormat = {
			ref: "pageFormat",
			type: "string",
			component: "dropdown",
			label: "Page Format",
			options: [{
				value: "a3",
				label: "A3"
			}, {
				value: "a4",
				label: "A4"
			}, {
				value: "a5",
				label: "A5"
			}],
			defaultValue: "a4"
		};
		
		return {
			definition: {
				type: "items",
				component: "accordion",
				items: {
					appearancePanel: {
						uses: "settings",
						items: {
							pdfExportOptions:{
								type: "items",
								label: "Export Options",
								items:{
									downloadPdf : downloadPdf,
									pageOrientation: pageOrientation,
									pageFormat: pageFormat
								}
							}	
						}
					}
				}
			},

			paint: function ($element, layout) {

				$element.empty();
				var $downloadPdfButton = document.createElement('button');
				$downloadPdfButton.id = 'exp';
				$downloadPdfButton.innerHTML = layout.downloadPdfButtonText;
				$downloadPdfButton.setAttribute('class', 'qui-button noIcon');

				$element.append($downloadPdfButton);

				function parseAndHideHtmlTags($param) {
					//we remove temporally the PDF Button and the ToolBar Container
					//in order to take the ScreenShot that it will be record in the PDF File
					$("#exp").hide();
					$("#qv-toolbar-container").hide();
					var origen = $("body").html();

					return $param;
				}

				$element.find("button").on("qv-activate", function () {

					html2canvas(parseAndHideHtmlTags($("body")), {
						onrendered: function (canvas) {
							//we show the button again & the toolbar
							$("#exp").show();
							$("#qv-toolbar-container").show();

							//var ctx = canvas.getContext("2d");

							var imgData = canvas.toDataURL('image/jpeg'); 
														
							//We scalate the picture to the PDF file A4 size dimensions

							var originalWidth = canvas.width;
							var originalHeight = canvas.height;
							
							var selectedOrientation = layout.pageOrientation
							var selectedPageFormat = layout.pageFormat
							
							if (selectedOrientation == 'l') {
								var safeWidth = pageFormats[selectedPageFormat][1] - 10;
								var safeHeight = pageFormats[selectedPageFormat][0] - 10;
							}
							else{
								var safeWidth = pageFormats[selectedPageFormat][0] - 10;
								var safeHeight = pageFormats[selectedPageFormat][1] - 10;
							}

							var scaleWidth = originalWidth / safeWidth;
							var scaleHeight = originalHeight / safeHeight;

							var withh = 0;
							var heightt = 0;

							if (scaleWidth > scaleHeight) {
								withh = originalWidth / scaleWidth;
								heightt = originalHeight / scaleWidth;
							}

							else {
								withh = originalWidth / scaleHeight;
								heightt = originalHeight / scaleHeight;
							}
							//we create 	
							var doc = new jsPDF(selectedOrientation, 'mm', selectedPageFormat);

							doc.addImage(imgData, 'JPEG', 5, 5, withh, heightt, "ScreenShot", "SLOW", 180);
							//We get the TimeStamp in order to save the PDF file 
							var resultado = $.now();
							//The pdf file is saved directly from the browser 
							doc.save(resultado + ".pdf");

						}
					});
				});
			}
		};
	});
