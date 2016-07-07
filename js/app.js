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
  var styles = [{
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
  ]}]; // Closes Styles

  var styledMap = new google.maps.StyledMapType(styles, {name: "Styled Map"});

  var Sanfrancisco = {lat: 37.7749300, lng: -122.4194200};

  var mapOptions = {
    center: Sanfrancisco,
    zoom: 14,
    mapTypeControl: false,
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
    }
  }; // Closes mapOptions

  map = new google.maps.Map(document.getElementById('map'), mapOptions);
  map.mapTypes.set('map_style', styledMap);
  map.setMapTypeId('map_style');

  ko.applyBindings(new ViewModel());
}; // Closes InitMap()

var ViewModel = function() {
  var self = this;
  var currentAttraction;
  var marker;
  var text;
  var query = ko.observable("");

  var TheaterLocation = function(data) {
    this.selected = ko.observable(true);
    this.name = data.name;
    this.position = data.position;
    this.type = data.type;
    this.marker = data.marker;
  }; // Closes TheaterLocation object

  self.theaterList = ko.observableArray([]);

  theaterPlaces.forEach(function(theaterPlaceItem){
    self.theaterList.push(new TheaterLocation(theaterPlaceItem));
  }); // Closes theaterPlaces loop

  self.infoWindow = new google.maps.InfoWindow({});

  for (var i = 0; i < self.theaterList().length; ++i){
    marker = new google.maps.Marker({
      map: map,
      position: self.theaterList()[i].position,
      label: self.theaterList()[i].type
    }); // Closes marker definition

    self.theaterList()[i].marker = marker;

    marker.addListener('click', (function(markerCopy, iCopy) {
      return function(){
        currentAttraction = self.theaterList()[iCopy];
        setMarkerBounce(markerCopy);
        setWindow(currentAttraction);
      };
    })(marker, i)); // Closes addListener
  } // Closes For Loop

  var CLIENT_ID = "BBJS5241JFYBAHPKSHMJMDOZ3UGSE41V1GAZUGP3VQT12NXS";
  var CLIENT_SECRET = "CNLK5KCQXDVRWBX03CA0TCNFDMK35UUTQQ3HGG4AE4L5XWH3";
  var contentString;

  var setWindow = function(attraction) {
    var FourSquareURL = "https://api.foursquare.com/v2/venues/search?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&v=20130815&ll=37.7749300,-122.4194200&query=" + attraction.name + "&match&limit=1";
    $.getJSON(FourSquareURL, function(data) {
      if (data.response.venues.length >0) {
        var locationAddress; //placeholder variable
        if (data.response.venues[0].location.address) { // If this variable is defined
          locationAddress = data.response.venues[0].location.address; // Assign it to our locationAddress Variable
        } else { // Else the variable is undefined
          locationAddress = "This location has no street address"; // Let's put some filler text.
        }

        var formattedPhone; // Placeholder variable
        if (data.response.venues[0].contact.formattedPhone) { // If this variable is defined
          formattedPhone = data.response.venues[0].contact.formattedPhone; // Assign it to our formattedAddress variable
        } else { // Else the variable is undefined
          formattedPhone = "This location has no phone number"; // Let's put some filler text.
        }

        contentString = '<div id="window-content">'+
                        '<h4 id="name">'+attraction.name+'</h4>'+
                        '<h5 id="address">'+locationAddress+'</h5>'+ // Note we've changed this to use our location address!
                        '<h5 id="phone">'+formattedPhone+'</h5>'+
                        '<h6 id="attribution">(Information provided by FourSquare)</h6>'+
                        '</div>';

        self.infoWindow.setContent(contentString);
        self.infoWindow.open(map,attraction.marker);

        contentString = '<div id="window-content">'+
                        '<h4 id="name">'+attraction.name+'</h4>'+
                        '<h5 id="address">'+data.response.venues[0].location.address+'</h5>'+
                        '<h5 id="phone">'+data.response.venues[0].contact.formattedPhone+'</h5>'+
                        '<h6 id="attribution">(Information provided by FourSquare)</h6>'+
                        '</div>';

        self.infoWindow.setContent(contentString);
        self.infoWindow.open(map,attraction.marker);
      } else {
        contentString = '<div id="window-content">'+
                        '<h4 id="name">'+attraction.name+'</h4>'+
                        '<h6 id="error-msg">Further information not available</h6>'+
                        '</div>';

        self.infoWindow.setContent(contentString);
        self.infoWindow.open(map,attraction.marker);
      }
    }).fail(function(e){ // regular error handling
        contentString = '<div id="window-content">'+
                        '<h4 id="name">'+attraction.name+'</h4>'+
                        '<h6 id="attribution">Further information not available</h6>'+
                        '</div>';

        self.infoWindow.setContent(contentString);
        self.infoWindow.open(map,attraction.marker);
      }); // Closes $.getJSON()
  }; // Closes setWindow function


  this.filter = function() {
    console.log(query());
    var lowerCaseQuery = query().toLowerCase();
    for (var i=0; i < self.theaterList().length; i++) {
      if (self.theaterList()[i].name.toLowerCase().indexOf(lowerCaseQuery) !== -1) {
        self.theaterList()[i].selected(true);
        self.theaterList()[i].marker.setVisible(true);
      }
      else {
        self.theaterList()[i].selected(false);
        self.theaterList()[i].marker.setVisible(false);
      } // Closes If/Else
    }; // Closes for loop
  }; // Closes filter function*/

  function setMarkerBounce(marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function () {
      marker.setAnimation(null);
    }, 2000); // Closes Set Timeout
  }; // Closes setMarkerBounce function

  this.setCurrentAttraction = function(nextAttraction){
    currentAttraction = nextAttraction;
    setMarkerBounce(currentAttraction.marker);
    setWindow(currentAttraction);
  }; // CLoses setCurrentAttraction

}; // Closes ViewModel Definition



