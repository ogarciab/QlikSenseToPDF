define( ["./jspdf","./jspdf.plugin.javascript","./jspdf.plugin.addimage","./html2canvas","./jspdf.plugin.from_html"
,"./jspdf.plugin.sillysvgrenderer","./jspdf.plugin.split_text_to_size","./jspdf.plugin.standard_fonts_metrics"
,"./jspdf.min","./jspdf.debug","./FileSaver"
],

function ( ) {

	return {
		
			paint: function ($element) {
					
			var html = "<button id='exp'>DownLoad ScreenShot (.pdf) </button>";
			//html +="<br><div id='ime'><img id='my_image' src=''></div>";		
			
			$element.html(html);
			
			function parseAndHideHtmlTags($param) {  						
   						//we remove temporally the PDF Button and the ToolBar Container
   						//in order to take the ScreenShot that it will be record in the PDF File
   						$("#exp").hide();
   						$("#qv-toolbar-container").hide();   						
   						var origen = $("body").html();
   						
						return $param; 
   			}		
														
									 			
 			$element.find("button").on("qv-activate", function() {						
 								            	
		       html2canvas(parseAndHideHtmlTags($("body")), {
		       onrendered: function(canvas) {
		    	//we show the button again & the toolbar
		    	$("#exp").show();
		    	$("#qv-toolbar-container").show();  
		    					   
				//var ctx = canvas.getContext("2d");
				
				var imgData = canvas.toDataURL('image/jpeg');
				
				//We scalate the picture to the PDF file A4 size dimensions
				
				var originalWidth = canvas.width;
    			var originalHeight = canvas.height;

    			
    			var safeWidth = 210 - 10;
    			var safeHeight = 297 - 10;

			    var scaleWidth = originalWidth / safeWidth;
			    var scaleHeight = originalHeight / safeHeight;
				
				var withh =  0;
			    var heightt = 0;
				
			    if (scaleWidth > scaleHeight)
			    {
			         withh =  originalWidth / scaleWidth;
			         heightt =  originalHeight / scaleWidth;
			    }
			
			    else
			    {
			         withh = originalWidth / scaleHeight;
			         heightt= originalHeight / scaleHeight;
			    }						
				    //we create 	
					var doc = new jsPDF();
					
					doc.addImage(imgData, 'JPEG', 5,5, withh, heightt,"ScreenShot","SLOW",180);
					//We get the TimeStamp in order to save the PDF file 
					var resultado = $.now();
					//The pdf file is saved directly from the browser 
					doc.save(resultado+".pdf");

			    }
			   });
		  });	
		  
		  
		}
	};

} );
