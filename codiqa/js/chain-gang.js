var user = {Id:"", Name:"", Auth:"", TotDist:"", TotEle:"", Img:""};
                        var apiUrl = "http://ridewithgps.com";
                        var gotRoutes = false;
                        var route = {Id:"", Name:""};
                        var plot;
                        var routeDetailFirst = true;
            			var mapFirst = true;
                        
                        //Create Nearby Cyclists Array
                        var Nearby = [];
                        
                        //Create Friend Requests Data
                                var friendRequests = [];
                        		var fr1 = {Id:"c1", Name:"Hugh Stone", TotDist:4120, TotEle:21420, Img:"https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSdj5WkUxSbGjMMo8IOe9CttwIuSV7IjWcNRRgxeQaJdizZGJJWxw", Desc:"On the road night and day!", Local:"Sligo"};
                        		friendRequests.push(fr1);
                        		Nearby.push(fr1);
                        		
                        		var fr2 = {Id:"c2", Name:"Kristopher Trafton", TotDist:1120, TotEle:11420, Img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlAObjDS8220OS2byIbHt8Rgl-3wET-lT-X3OapB68CfiNF7qBwg", Desc:"On the road night and day!", Local:"Sligo"};
                        	
                        		friendRequests.push(fr2);
                        		Nearby.push(fr2);
                        								
                        		//Create Friends Data
                        		
                        		var Friends = [];
                        		var f = {Id:"c3", Name:"Chelsey Drain", TotDist:2150, TotEle:23550, Img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ09pGOQksse1xJkMzut2w4qzxUv1PZ6vvWJVqucbZ_WTp0U5s9", Desc:"On the road night and day!", Local:"Sligo"};
                        		Friends.push(f);
                        		Nearby.push(f);		
                        		
                        		var f = {Id:"c4", Name:"Kris Godby", TotDist:6120, TotEle:33320, Img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-jlW6VdXRZ_98OFmXOdF9HjdvL3h-iQaPP_4lY93fX2wLwB8xJg", Desc:"On the road night and day!", Local:"Sligo"};		
                        		Friends.push(f);
                        		Nearby.push(f);
                        		
                        		var f = {Id:"c5", Name:"Timothy Tienda", TotDist:6524, TotEle:51420, Img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT40TVnNsbwsC_0rUr9gDBtjy7sT_hMmORr15YFtKGIwvAATMBf", Desc:"On the road night and day!", Local:"Sligo"};			
                        		Friends.push(f);
                        		Nearby.push(f);
                        		
                        		var f = {Id:"c6", Name:"Eloise Infante", TotDist:3524, TotEle:21426, Img:"https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTHn9yMWpeW6y7LVWdwkjIYKp4-swUrK_8vO7wMCkcRa0DxpBKf4g", Desc:"On the road night and day!", Local:"Sligo"};
                        		Friends.push(f);
                        		Nearby.push(f);
                        				
                        
                        var gradient = [];
                        var gradient2 = [];  
                        
                        $( document ).on( "pageshow", "#loginPage", function() {
                        	$("#txtEmail").val("s00009509@mail.itsligo.ie");
                        	$("#txtPass").val("12345");			
                        });  
                        
                        $( document ).on( "click", "#btnSignOut", function() {
                           //alert(user.Id);
                           gotRoutes = false;
                           $("#lstRoutes").empty()
                        	user.Auth = "";
                        	user.Id = "";
                        	$.mobile.changePage("#loginPage", { transition: "flip"} );             
                        	//alert(user.Id);		
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
                        			//user.TotDist = (result.user.total_trip_distance / 1000);
                        			//user.TotEle = result.user.total_trip_elevation_gain;
                        			user.TotDist = 4528;
                        			user.TotEle = 30125;
                        			user.Img = result.user.highlighted_photo_id;
                        			
                        			$("#userImg").attr("src", "http://assets0.ridewithgps.com/photos/" + user.Img + "/centi.jpg");
                        			$("#lblName").text(user.Name);
                        			$("#lblUserDis").text("Total Dist: " + user.TotDist+ "km");
                        			$("#lblUserEle").text("Total Elev: " + user.TotEle+ "m");
                        							
                        			$.mobile.changePage("#HomePage", { transition: "flip"} ); 		
                        		},
                        		error: function (request,error) {
                        			alert(error);
                        		}
                        	});                     
                        	
                        });
                        
                        $( document ).on( "pageshow", "#HomePage", function() {
                        	$("#btnInvites").attr('data-collapsed','false');
                        	$("#btnNextChain").attr('data-collapsed','false');
                        	$("#btnLatest").attr('data-collapsed','false');
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
                        				$('<li data-role="list-divider" role="heading">Your Routes<span id="routeCount" class="ui-li-count">' + result.results.length + '</span></li>').appendTo($("#lstRoutes"));
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
                        
                        
                        $( document ).on( "pageshow", "#RouteDetailPage", function() {
                        	if(route.Id !== undefined && mapFirst)
                        	{
                        		var script = document.createElement('script');
                        				script.type = 'text/javascript';
                        				script.src = 'https://maps.googleapis.com/maps/api/js?v=3&sensor=false&callback=initialize';
                        				document.body.appendChild(script);
                        			mapFirst = false;
                        	}
        					else
        					{
        						initialize();
        					}
                        });
                		
                		$( document ).on( "pageshow", "#FriendsPage", function() {
                        	$("#friendReqCount").html(friendRequests.length);
                			$("#friendsCount").html(Friends.length);
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
                        					var bounds = new google.maps.LatLngBounds();
                        					route.Name = result.route.name;
                        					var dista = (result.route.metrics.distance/1000).toFixed(2);
                        					var eleva = (result.route.metrics.ele_gain).toFixed(0);
                        					$("#txtRouteDistance").html("<b>Route Distance: " + dista + "km</b>");		
                        					$("#txtRouteElev").html("<b>Elevation Gain: " + eleva + "m</b>");										
                        					var mapOptions = {
                        					/*zoom: 12,
                        					center: new google.maps.LatLng(result.route.track_points[0].y, result.route.track_points[0].x),*/
                        					mapTypeId: google.maps.MapTypeId.TERRAIN
                        				  };
                        				
                        				  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
                        					var routeCoordinates = [];
                        					var elevationPoints = [];
                        					var elevDist = 0;
                        				for(var i = 0; i < result.route.track_points.length; i++)
                        				{
                        					bounds.extend(new google.maps.LatLng(result.route.track_points[i].y, result.route.track_points[i].x));
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
                        				  
                        					map.fitBounds(bounds);
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
                        
                        $( document ).on( "click", "#btnRouteDynamic", function() {
                        						   
                        	 switch($("#btnRouteDynamic").text())
                        	 {
                        		case "Join Gang":
                        			 alert("join gang");
                        			 break;
                        		case "Create Gang":
                        			 alert("Create Gang");
                        			 break;
                        		case "Leave Gang":
                        			 alert("leave gang");
                        			 break; 
                        	 }
                        			
                        });
                        
                        $( document ).on( "pageshow", "#RouteProfilePage", function() {
                        		$(window).on('orientationchange', function() {
                                                $('#chartdiv').empty();
                                                setTimeout(function() {                                   
                                                    plot.replot({resetAxes:true});
                                                }, 200);
                                         });
                                   
                        	//$("#chartParent").empty();
                        	plot = $.jqplot('chartdiv', gradient,
                        	 { 	series:[{showMarker:false}],
                        		title: route.Name + ' Profile',
                        		axesDefaults: { labelRenderer: $.jqplot.CanvasAxisLabelRenderer },
                        		axes:{ xaxis:{ label:'Distance (km)', pad:0}, yaxis:{ label:'Elevation (m)', pad:0}}
                        	 });
                        });
                        
                        function ShowInvite(id){
                        	route.Id = id; 
                        	if(routeDetailFirst)   
                        	{
                        		$("#btnRouteDynamic").text("Join Gang");
                        		routeDetailFirst = false;
                        	}
                        	else
                        	{
                        		$("#btnRouteDynamic  span span").text("Join Gang");
                        	}                                    
                        	$.mobile.changePage("#RouteDetailPage", { transition: "flip"} );
                        }
                        
                        function ShowNext(id){
                        	route.Id = id; 
                        	if(routeDetailFirst)   
                        	{
                        		$("#btnRouteDynamic").text("Leave Gang");
                        		routeDetailFirst = false;
                        	}
                        	else
                        	{
                        		$("#btnRouteDynamic  span span").text("Leave Gang");
                        	}                                    
                        	$.mobile.changePage("#RouteDetailPage", { transition: "flip"} );
                        }
                        
                        //When a route is selected	
                        function ShowRoute(id){
                        	route.Id = id;	
                        	if(routeDetailFirst)   
                        	{
                        		$("#btnRouteDynamic").text("Create Gang");
                        		routeDetailFirst = false;
                        	}
                        	else
                        	{
                        		$("#btnRouteDynamic  span span").text('Create Gang');			
                        	}
                        	$.mobile.changePage("#RouteDetailPage", { transition: "flip"} );
                        
                        }
                        
                        function ShowLatest(id){
                        	route.Id = id;	
                        	if(routeDetailFirst)   
                        	{
                        		$("#btnRouteDynamic").text("Create Gang");
                        		routeDetailFirst = false;
                        	}
                        	else
                        	{
                        		$("#btnRouteDynamic  span span").text('Create Gang');			
                        	}
                        	$.mobile.changePage("#RouteDetailPage", { transition: "flip"} );
                        }
                        
                        function ShowCyclist(id){
                        			alert(id);
                					var cyc = $("#" + id + "l");
                					cyc.removeClass("inviteClass").addClass("nextClass");
                					$("#" + id + "l").remove();
                					$("#lstFriends").append(cyc);
                					for(var i = 0; i < friendRequests.length; i++)
                					{
                						if(friendRequests[i].Id === id)
                						{
                							var friend = friendRequests[i];
                							friendRequests.splice(i, 1);
                						}
                					}
                					Friends.push(friend);
                					$("#friendReqCount").html(friendRequests.length);
                					$("#friendsCount").html(Friends.length);
                					$("#lstRequests").listview('refresh');  
                        			var result = $.grep(Nearby, function(val){ return val.Id === id; });
                        			alert(result[0].Name);   
                        }