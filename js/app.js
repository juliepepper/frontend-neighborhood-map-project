var theaterPlaces = [
	{

	name: "A.C.T",
  position: {lat: 37.773972, lng: -122.431297},
  type: 'Theater'
	},
	{

	name: "Lorraine_Hansberry_Theater",
  position: {lat: 37.7883267, lng: -122.4137036},
  type: 'Theater'
	},
	{

	name: "The_Marsh",
  position: {lat: 37.7558531, lng: -122.4212321},
  type: 'Theater'
	},
	{

	name: "San_Francisco_Playhouse",
  position: {lat: 37.7883553, lng: -122.4094125},
  type: 'Theater'
	},
	{

	name: "Thick_House",
  position: {lat: 37.7620355, lng: -122.399214},
  type: 'Theater'
	},
  {

	name: "Strand",
  position: {lat: 37.7795906, lng: -122.4129569},
  type: 'Theater'
	}
];

var map;
//used for the data-bind menu
var placeTypes = ['All', 'Theater'];

function initMap() {
//googlemaps style wizard created json
    var styles = [
  {
    "featureType": "poi.attraction",
    "stylers": [
      { "visibility": "on" },
      { "invert_lightness": true },
      { "color": "#ad9996" },
      { "weight": 2.8 },
      { "saturation": -11 },
      { "hue": "#bb00ff" },
      { "lightness": 1 },
      { "gamma": 0.88 }
      ]
    }
];

var styledMap = new google.maps.StyleMapType(styles, {name: "Styled Map"});

var Sanfrancisco = {lat: 37.7749300, lng: -122.4194200};

var mapOptions = {

      center: Sanfrancisco,
      zoom: 14,
      mapTypeControl: false,
      mapTypeControlOptions: {
        mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
      }
    };
      map = new google.maps.Map(document.getElementById('map'), mapOptions);
    map.mapTypes.set('map_style', styledMap);
      map.setMapTypeId('map_style');

    ko.applyBindings(new ViewModel());
}
        };
        })(marker, i));
};

var ViewModel = function() {

  var self = this;
  var infoWindow;
  var currentAttraction;
  var marker;
  var text;
  query = "";

  var TheaterLocation = function(data) {
   this.selected = ko.observable(true);
   this.name = data.name;
   this.position = data.position;
   this.type = data.type;
   this.marker = data.marker;

  };

  //an observable array to store the theaters, their names, and locations
  theaterList = ko.observableArray([]);
  //populate ko observable list of theaters
  theaterPlaces.forEach(function(theaterPlaceItem){
    theaterList.push(new TheaterLocation(theaterPlaceItem));
    });

  //create infowindow, this will change when appropriate
  infowindow = new google.maps.InfoWindow({
    });

  //create markers, add them to theaterList and assign event listeners
  for (var i = 0; i < theaterList().length; ++ {
      marker = new google.maps.Marker({
        map: map,
        position: theaterList()[i].position,
        label: theaterList()[i].type
    })

    theaterList()[i].marker = marker;


    marker.addListener('click', (function(markerCopy, iCopy) {
        return function(){
          currentAttraction = theaterList()[iCopy];
          setMarkerBounce(markerCopy);
          setWindow(currentAttraction);
      };
      })(marker, i));
  };

  // setWindow gets the info from foursquare and updates the content of the infowindow
    var CLIENT_ID = "BBJS5241JFYBAHPKSHMJMDOZ3UGSE41V1GAZUGP3VQT12NXS";
    var CLIENT_SECRET = "CNLK5KCQXDVRWBX03CA0TCNFDMK35UUTQQ3HGG4AE4L5XWH3";
    var contentString;

  var setWindow = function(attraction) {

      var FourSquareURL = "https://api.foursquare.com/v2/venues/search?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&v=20130815&ll=39.9526,-75.1652&query=" + attraction.name + "&match&limit=1";
      $.getJSON(FourSquareURL, function(data) {

        if (data.response.venues.length >0) {
          //if the venue is found, populate the info window
          contentString = '<div id="window-content">'+
                  '<h4 id="name">'+attraction.name+'</h4>'+
                  '<h5 id="address">'+data.response.venues[0].location.address+'</h5>'+
                  '<h5 id="phone">'+data.response.venues[0].contact.formattedPhone+'</h5>'+
                  '<h6 id="attribution">(Information provided by FourSquare)</h6>'+
                  '</div>';

          infoWindow.setContent(contentString);
          infoWindow.open(map,attraction.marker);
        }

        else {
          // If the venue is not found, but the getJSON doesn't fail - populate the info window with error message
          contentString = '<div id="window-content">'+
                  '<h4 id="name">'+attraction.name+'</h4>'+
                  '<h6 id="error-msg">Further information not available</h6>'+
                  '</div>';
          infoWindow.setContent(contentString);
          infoWindow.open(map,attraction.marker);
        }

      }).fail(function(e){ // regular error handling
        contentString = '<div id="window-content">'+
                '<h4 id="name">'+attraction.name+'</h4>'+
                '<h6 id="attribution">Further information not available</h6>'+
                '</div>';
        infoWindow.setContent(contentString);
        infoWindow.open(map,attraction.marker);
      });

  };

  // this.filter is bound to the search box and sets the visibility of each
  // location if it matches the search criteria
  this.filter = function() {


    infoWindow.close();
    var lowerCaseQuery = query.toLowerCase();

    for (var i=0; i < theaterList().length; i++) {
      if (theaterList()[i].name.toLowerCase().indexOf(lowerCaseQuery) !== -1) {
        theaterList()[i].selected(true);
        theaterList()[i].marker.setVisible(true);
      }
      else {
        theaterList()[i].selected(false);
        theaterList()[i].marker.setVisible(false);
      }
    };
  };

  function setMarkerBounce(marker) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function () {
          marker.setAnimation(null);
      }, 2000);
    };

  // bound to listed attractions/places/venues
  this.setCurrentAttraction = function(nextAttraction){
    currentAttraction = nextAttraction;
    setMarkerBounce(currentAttraction.marker);
    setWindow(currentAttraction);
  };

};

ko.applyBindings(new ViewModel());


var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);

var marker = new google.maps.Marker({
  position:myCenter,
  });

marker.setMap(map);

google.maps.event.addListener(marker, 'click', function() {
  infowindow.open(map,marker);
  });
}

  var myLatLng = {lat: 37.7749300, lng: -122.4129569};

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: myLatLng
  });

  var marker = new google.maps.Marker({
    position : myLatLng,
    map: map,
    title: "Live Theater!"
  })
    google.maps.event.addDomListener(window, 'load', initialize);
    window.mapBounds = new google.maps.LatLngBounds();
 }

  /*createMapMarker(placeData) reads Google Places search results to create map pins.
  //placeData is the object returned from search results containing information
  //about a single location.
  */
 function createMapMarker(placeData) {

   //The next lines save location data from the search result object to local variables
    var lat = placeData.geometry.location.lat();  // latitude from the place service
    var lon = placeData.geometry.location.lng();  // longitude from the place service
    var name = placeData.formatted_address;   // name of the place from the place service
    var bounds = window.mapBounds;            // current boundaries of the map window

    // marker is an object with additional data about the pin for a single location
    var marker = new google.maps.Marker({
      map: map,
      position: placeData.geometry.location,
      title: name
    });

    // infoWindows are the little helper windows that open when you click
    // or hover over a pin on a map. They usually contain more information
    // about a location.
    var infoWindow = new google.maps.InfoWindow({
      content: "Live theater!"
    });

    // hmmmm, I wonder what this is about...
    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.open(map, marker); // your code goes here!
    });

    // this is where the pin actually gets added to the map.
    // bounds.extend() takes in a map location object
    bounds.extend(new google.maps.LatLng(lat, lon));
    // fit the map to the new marker
    map.fitBounds(bounds);
    // center the map
    map.setCenter(bounds.getCenter());
  }

  /*
  callback(results, status) makes sure the search returned results for a location.
  If so, it creates a new map marker for that location.
  */
function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      createMapMarker(results[0]);
    }
  }
  /*
  pinPoster(locations) takes in the array of locations created by locationFinder()
  and fires off Google place searches for each location
  */
 function pinPoster(locations) {

    // creates a Google place search service object. PlacesService does the work of
    // actually searching for location data.
    var service = new google.maps.places.PlacesService(map);

    // Iterates through the array of locations, creates a search object for each location
    for (var place in locations) {

      // the search request object
      var request = {
        query: locations[place]
      };

      // Actually searches the Google Maps API for location data and runs the callback
      // function with the search results after each search.
      service.textSearch(request, callback);
    }
  }

  // Sets the boundaries of the map based on pin locations


  // locations is an array of location strings returned from locationFinder()
   locations = locationFinder();

  // pinPoster(locations) creates pins on the map for each location in
  // the locations array
   pinPoster(locations);



	this.theaterList = ko.observableArray([]);

	initialTheaters.forEach(function(theaterItem){
		self.theaterList.push( new Theater(theaterItem) );
	});

	this.currentTheater = ko.observable( this.theaterList()[0] );

	this.incrementCounter = function() {
		self.currentTheater().clickCount(self.currentTheater().clickCount() + 1);
	};

	this.setTheater = function(clickedTheater) {
		self.currentTheater(clickedTheater);
	};
};



