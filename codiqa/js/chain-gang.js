var user = {Id:"", Name:"", Auth:"", TotDist:"", TotEle:"", Img:""};
        var apiUrl = "http://ridewithgps.com";
        var gotRoutes = false;
        var route = {Id:"", Name:""};
        var plot;
        
        var gradient = [];
        var gradient2 = [];          
        
        $("#txtEmail").text("s00009509@mail.itsligo.ie");
        $("#txtPass").text("12345");				        					
        
        
        $( document ).on( "click", "#btnSignOut", function() {
           alert(user.Id);
           gotRoutes = false;
           $("#lstRoutes").empty()
        	user.Auth = "";
        	user.Id = "";
        	$.mobile.changePage("#loginPage", { transition: "flip"} );             
        	alert(user.Id);		
        });
        
        $( document ).on( "click", "#btnLogin", function() {
        					
        	var email = $("#txtEmail").val();
        	var pass = $("#txtPass").val();
        	
        	$.ajax({
        		url: apiUrl + '/users/current.json?email=' + email + '&password=' + pass + '&apikey=testkey1&version=2',					
        		beforeSend: function() {
        			$.mobile.loading( 'show', { theme: "c", text: "Logging In", textVisible: true });						
        		},
        		complete: function() {
        			$.mobile.loading( 'hide', {});						
        		},
        		success: function (result) {
        			user.Auth = result.user.auth_token;
        			user.Id = result.user.id;
        			user.Name = result.user.name;
        			user.TotDist = (result.user.total_trip_distance / 1000);
        			user.TotEle = result.user.total_trip_elevation_gain;
        			user.Img = result.user.highlighted_photo_id;
        			
        			$("#userImg").attr("src", "http://assets0.ridewithgps.com/photos/" + user.Img + "/centi.jpg");
        			$("#txtUserName").text(user.Name);
        			$("#txtUserDist").text("Total Dist:" + user.TotDist+ "km");
        			$("#txtUserElev").text("Total Elev:" + user.TotEle+ "m");
        							
        			$.mobile.changePage("#HomePage", { transition: "flip"} ); 		
        		},
        		error: function (request,error) {
        			alert(error);
        		}
        	});                     
        	
        });
        
        $( document ).on( "pageshow", "#HomePage", function() {
        	
        });
        
        $( document ).on( "pageshow", "#RoutesPage", function() {
        	if(user.Id == "" || user.Auth == "")
        	{
        		$.mobile.changePage("#loginPage", { transition: "flip"} );
        	}
        	else
        	{	
        		if(!gotRoutes)
        		{			
        			$.ajax({
        			url: apiUrl + '/users/' + user.Id + '/routes.json?offset=0&limit=100&apikey=testkey1&version=2&auth_token=' + user.Auth,
        			beforeSend: function() {
        				$.mobile.loading( 'show', { theme: "c", text: "Loading Routes", textVisible: true });						
        			},
        			complete: function() {
        				$.mobile.loading( 'hide', {});						
        			},
        			success: function (result) {
        				$('<li data-role="list-divider" role="heading">Your Routes</li>').appendTo($("#lstRoutes"));
        				$('#lstRoutes').listview('refresh');
						var routeClass;
        				for(var i = result.results.length - 1; i >= 0; i--)
        				{
							if(i % 2 == 0)
							{
								routeClass = "routes";
							}
							else
							{
								routeClass = "routes2";
							}
        					var dist = (result.results[i].distance / 1000).toFixed(2);
        					var ele = result.results[i].elevation_gain.toFixed(0);
        					var id = result.results[i].id;
        					$('<li id="' + id + '" data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="c" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-c ' + routeClass + '"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a id="' + id + '" onClick="ShowRoute(' + id + ')" class="ui-link-inherit"><h4 id="' + id + '" class="ui-li-heading">' + result.results[i].name + '</h4><p id="' + id + '" class="ui-li-desc">Dist: ' + dist + 'km   Elev: ' + ele + 'm</p></a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>').appendTo($('#lstRoutes'));
        					
        					$('#lstRoutes').listview('refresh');
        					//alert(result.results[i].name);
        				}
        				gotRoutes = true;
        			},
        			error: function (request,error) {
        				alert(error);
        			}
        		});   
        		}
        		
        	}
        }); //End pageshow Routes Page
        
        //When a route is selected	
        //$("#lstRoutes").on('click', 'li', function() {           
        function ShowRoute(id){
        route.Id = id;				
        $.mobile.changePage("#RouteDetailPage", { transition: "flip"} );
        
        }
        
        $( document ).on( "pageshow", "#RouteDetailPage", function() {
        	if(route.Id !== undefined)
        	{
        		var script = document.createElement('script');
        				script.type = 'text/javascript';
        				script.src = 'https://maps.googleapis.com/maps/api/js?v=3&sensor=false&callback=initialize';
        				document.body.appendChild(script);
        			
        	}
        });
        
        function initialize(){
        $.ajax({
        			
        				url: apiUrl + '/routes/' + route.Id + '.json?apikey=testkey1&version=2&auth_token=' + user.Auth,
        				beforeSend: function() {
        					$.mobile.loading( 'show', { theme: "c", text: "Loading Route", textVisible: true });						
        				},
        				complete: function() {
        					$.mobile.loading( 'hide', {});						
        				},
        				success: function (result) {
        					route.Name = result.route.name;
        					var mapOptions = {
        					zoom: 12,
        					center: new google.maps.LatLng(result.route.track_points[0].y, result.route.track_points[0].x),
        					mapTypeId: google.maps.MapTypeId.TERRAIN
        				  };
        				
        				  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        					var routeCoordinates = [];
        					var elevationPoints = [];
        					var elevDist = 0;
        				for(var i = 0; i < result.route.track_points.length; i++)
        				{
        					routeCoordinates.push(new google.maps.LatLng(result.route.track_points[i].y, result.route.track_points[i].x));
        					if(result.route.track_points[i].d == undefined)
        					{
        						elevDist = 0;
        					}
        					else
        					{
        						elevDist = result.route.track_points[i].d / 1000;
        					}
        					var point = [elevDist, result.route.track_points[i].e]
        					elevationPoints.push(point);
        					
        				}
        					gradient = [];
        					gradient.push(elevationPoints);
        				  var cyclePath = new google.maps.Polyline({
        					path: routeCoordinates,
        					geodesic: true,
        					strokeColor: '#FF0000',
        					strokeOpacity: 1.0,
        					strokeWeight: 2
        				  });
        				
        				  cyclePath.setMap(map);	
        														
        				  
        				},
        				error: function (request,error) {
        					alert(error);
        				}
        			});  
        }
        //});//end listview click
        
        $( document ).on( "click", "#btnGradient", function() {
        						   
        	$.mobile.changePage("#RouteProfilePage", { transition: "flip"} );             
        			
        });
        
        $( document ).on( "pageshow", "#RouteProfilePage", function() {
        	//$("#chartParent").empty();
        	plot = $.jqplot('chartdiv', gradient,
        	 { 	series:[{showMarker:false}],
        	 	title: route.Name + ' Profile',
        		axesDefaults: { labelRenderer: $.jqplot.CanvasAxisLabelRenderer },
        		axes:{ xaxis:{ label:'Distance (km)', pad:0}, yaxis:{ label:'Elevation (m)', pad:0}}
             }).replot();
        });