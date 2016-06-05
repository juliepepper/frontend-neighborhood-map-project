var initialTheaters = [
	{
	clickCount : 0,
	name : "A.C.T"
	},
	{
	clickCount : 0,
	name: "Lorraine_Hansberry_Theater"
	},
	{
	clickCount : 0,
	name : "The_Marsh"
	},
	{
	clickCount : 0,
	name : "San_Francisco_Playhouse"
	},
	{
	clickCount : 0,
	name : "Thick_House"
	},
	clickCount : 0,
	name : "Strand"
	}
];

var Theater = function(data) {
	this.clickCount = ko.observable(data.clickCount);
	this.name = ko.observable(data.name);
};

function initMap() {
  var myLatLng = {lat: -25.363, lng: 131.044};

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: myLatLng
  });

  /*createMapMarker(placeData) reads Google Places search results to create map pins.
  //placeData is the object returned from search results containing information
  //about a single location.
  */
  function createMapMarker(placeData) {

    // The next lines save location data from the search result object to local variables
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
  window.mapBounds = new google.maps.LatLngBounds();

  // locations is an array of location strings returned from locationFinder()
  locations = locationFinder();

  // pinPoster(locations) creates pins on the map for each location in
  // the locations array
  pinPoster(locations);

var ViewModel = function() {
	var self = this;

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

ko.applyBindings(new ViewModel());