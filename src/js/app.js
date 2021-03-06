"use strict";

// signed url from meetup api, taken from https://secure.meetup.com/meetup_api/console/?path=/2/open_events
var meetupApiUrl = 'https://api.meetup.com/2/open_events?and_text=False&offset=0&format=json&lon=-71.0589&limited_events=False&photo-host=public&page=100&radius=30&category=9&lat=42.3601&status=upcoming&desc=False&sig_id=35254712&sig=7e6d98b3125f607299e60bca0ba88f3aa7d483e2';
var dateObj = new Date();
var presentTime = dateObj.getTime();
var ONEDAY = 86400000;
var cityCenter = [42.3601, -71.0589];

// Initialize Google Maps when the library is asynchronously loaded to avoid unexpected errors
var map, mapCanvas, center, infoWindow;

function initMap() {
    console.log('initializing map');
    mapCanvas = $('.map-canvas')[0],
        center = new google.maps.LatLng(cityCenter[0], cityCenter[1]);
    map = GoogleMap(center, mapCanvas);

    infoWindow = new InfoBubble({
        map: map,
        content: '',
        shadowStyle: 1,
        padding: 0,
        backgroundColor: '#ffffe6',
        borderRadius: 5,
        maxWidth: 300,
        maxHeight: 250,
        arrowSize: 10,
        borderWidth: 1,
        borderColor: '#000000',
        arrowPosition: 25,
        arrowStyle: 2,
    });
}

/* Handle Google Map API failure */
function googleFail() {
    $('.distance-control').css("display", "none");
    $('.menu-main').append("<div class='load-fail'>Unable to load Google Maps API</div>");
}


/* Extend the String class by adding a firstLetterUpperCase method */
String.prototype.firstLetterUpperCase = function() {
    var words = this.split(' ');
    var wordArray = [];
    var firstLetter, remainingText;
    for (var i = 0; i < words.length; ++i) {
        firstLetter = words[i].charAt(0).toUpperCase();

        remainingText = words[i].slice(1);
        wordArray.push(firstLetter + remainingText);
    }
    return wordArray.join(' ');
};


/* Checks if a substring `other` is found inside the string */
String.prototype.contains = function(other) {
    return this.indexOf(other) !== -1;
};

/* Extend the array class with the method contains */
Array.prototype.contains = function(element) {
    return this.indexOf(element) > -1;
};

/* function for testing latitude and longitude values*/
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}


/* Represents an excercise group's location, or the geographic coordinates of the venue lat/lon
 * @constructor
 * @param {object} venueObject - JSON-like venue from the Meetup open_venue API
 */
var VenueLocation = function(venueObject, map) {
    var self = this;

    // utilize the venue lat/lon 
    self.lat = venueObject.lat;
    self.lon = venueObject.lon;

    self.location = ko.computed(function() {
        // instantiate a google maps coordinate if lat/lon are numeric
        if (isNumeric(self.lat) && isNumeric(self.lon) && self.lat !== 0 && self.lon !== 0) {
            return new google.maps.LatLng(self.lat, self.lon);
        } else {
            return null;
        }
    });


    // grab venue id and name
    self.id = venueObject.id;
    self.name = venueObject.name.firstLetterUpperCase();

    // initialize empty meetup array to be filled if multiple meetups for one venue
    self.meetups = ko.observableArray([]);

    // initialize marker
    self.marker = (function(venueloc) {
        var marker;

        // ensure a location exists
        if (venueloc.location()) {
            marker = new google.maps.Marker({
                position: venueloc.location(),
                map: map,
            });
        }

        // return the marker object
        return marker;
    })(self);

    // returns the formatted HTML for a group locations upcoming open meetups
    self.formattedMeetupList = function() {
        var meetupSubstring = '<ol class="info-window-list">';
        self.meetups().forEach(function(meetup) {
            meetupSubstring += '<li class="info-window-list-items">' + '<div class="primary-info"><b>Group:</b> ' + meetup.group + '</div>' +
                '<div class="primary-info"><b>Event:</b> ' + '<a href="' + meetup.url + '">' + meetup.name +
                '</a>' + '</div>' + '<div class="primary-info"><b>Date:</b> ' + meetup.date + '</div>' +
                '<div class="primary-info"><b>Attending:</b> ' + meetup.attending + '</div>' +
                '<div class="primary-info"><b>Description:</b></div>' +
                '<div class="meetup-descrip">' + meetup.description + '</div>' +
                '</li>';
        });
        meetupSubstring += '</ol>';

        return '<div class="info-window-content">' +
            '<span class="info-window-header">' + self.name + '</span>' +
            meetupSubstring +
            '</div>';
    };
};

/* Represents a Meetup event
 * @constructor
 * @param {object} meetup - JSON-like meetup from the Meetup open_venue API
 */
var Meetup = function(meetup) {
    var self = this;

    // attach venue object
    self.venueObject = meetup.venue;

    self.id = meetup.id;
    self.name = meetup.name.toUpperCase();
    self.venueName = meetup.venue.name; //fixed
    self.group = meetup.group.name;
    self.attending = meetup.yes_rsvp_count;
    self.description = meetup.description;
    self.distance = meetup.distance;
    self.url = meetup.event_url;

    if (self.description == null) {
        self.description = 'None Available';
    }

    self.milliseconds = meetup.time; //milliseconds since Jan 1, 1970 00:00:00 UTC
    self.date = new Date(self.milliseconds);
    self.numDayDif = (meetup.time - presentTime) / ONEDAY;
    self.numWeekDif = Math.floor((meetup.time - presentTime) / (7 * ONEDAY));

    // converts milliseconds date to a more readable form
    self.date = self.date.toLocaleDateString();

};

/* Google Map object */
var GoogleMap = function(center, element) {
    var self = this;

    //var roadAtlasStyles defined mapElementStyles in js/mapElementStyles.js

    var mapOptions = {
        zoom: 9,
        center: center,
        mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'usroadatlas']
        },

        // customize controls
        mapTypeControl: false,
        panControl: false,
        streetViewControl: true,
        zoomControl: true
    };

    // assign a google maps element
    var map = new google.maps.Map(element, mapOptions);

    // apply custom map styling
    var styledMapOptions = {};
    var usRoadMapType = new google.maps.StyledMapType(roadAtlasStyles, styledMapOptions);
    map.mapTypes.set('usroadatlas', usRoadMapType);
    map.setMapTypeId('usroadatlas');

    return map;
};


/* Main application view model */
var ViewModel = function() {
    var self = this;

    self.closeMenu = ko.observable(false);

    self.clickToggle = function() {
        self.closeMenu(!self.closeMenu());
    };


    self.numWeeks = ko.observable(2);

    self.radius = ko.observable(5);

    // list of meetups, not currently used in view
    self.meetupList = ko.observableArray([]);

    // list of group locations, bound to `.list`
    self.venueLocList = ko.observableArray([]);

    // number of group locations, bound to `.search-summary p`
    self.numGroups = ko.observable(0);

    self.numMeetups = ko.observableArray([]);

    // bound to `.search-input` search box
    self.query = ko.observable('');

    // filter the data based on time,distance,query name
    self.filteredList = ko.computed(function() {

        // loop through group locations and clear map markers
        self.venueLocList().forEach(function(venueloc) {
            venueloc.marker.setMap(null);
        });

        //clear the venue list and re-extract meetup venue locations 
        self.venueLocList([]);
        grabLocs();

        self.venueLocList().forEach(function(venueloc) {
            venueloc.marker.setMap(map);
        });

        //Make sure the google and google.maps objects are availabe before trying to fit markers to bounds
        if (typeof google !== "undefined" && typeof google.maps !== "undefined") {
            fitBoundsToVisibleMarkers();
        }


        self.numGroups(self.venueLocList().length);
        return self.venueLocList();
    });


    /* triggered when a group location in `.list` is clicked or a marker is clicked
     
     Grabs from marker/infobubble data and animate markers
     * @param {object} venueloc 
     */
    self.selectVenueLoc = function(venueloc) {
        // fetch and set html to info window content
        infoWindow.setContent(venueloc.formattedMeetupList());

        // open up the appropriate info window at the selected group location's marker
        infoWindow.open(map, venueloc.marker);

        // scroll the map to the marker's position
        map.panTo(venueloc.marker.position);

        // animate markers
        venueloc.marker.setAnimation(google.maps.Animation.BOUNCE);
        self.venueLocList().forEach(function(spot) {
            if (venueloc != spot) {
                spot.marker.setAnimation(null);
            }
        });
    };

    /* Fetches meetups via JSON-P from Meetup API
     * @params {string} url - Meetup API URL */

    // create data array outside the function so I can access it more easily
    self.data = [];

    function fetchMeetups(url) {

        // execute JSON-P request
        $.ajax({
            type: "GET",
            url: url,
            timeout: 5000,
            contentType: "application/json",
            dataType: "jsonp",
            cache: false,

            // when done
        }).done(function(response) {
            // pull `results` array from JSON
            self.data = response.results;

            // loop through results and populate `meetupList` only if there is a venue object inside
            self.data.forEach(function(meetup) {
                if (meetup.hasOwnProperty('venue')) {
                    self.meetupList.push(new Meetup(meetup));
                }
            });

            // if failed
        }).fail(function(response, status, error) {
            $('.menu-main').append("<div class='load-fail'>Unable to load Meetup data</div>");
        });
    }

    // fetch the meetups
    fetchMeetups(meetupApiUrl);

    var bounds;

    function fitBoundsToVisibleMarkers() {
        bounds = new google.maps.LatLngBounds();
        self.venueLocList().forEach(function(venueloc) {
            bounds.extend(venueloc.marker.getPosition());
        });
        if (typeof map !== 'undefined') {
            map.fitBounds(bounds);
        }
    }


    /* check to see if a venue id already exists
     * @param {integer} venueID 
     */
    function hasVenueId(venueID) {
        var existVenueID = false;
        if (self.venueLocList().length > 0) {
            var extractVenueIDs = self.venueLocList().map(function(a) {
                return a.id.toString();
            });
            existVenueID = extractVenueIDs.contains(venueID.toString());
        }
        return existVenueID;
    }


    /* select a venue object
     * @param {integer} venueID 
     */

    function getVenueById(venueID) {
        var extractTrueIndex = self.venueLocList().map(function(a) {
            return a.id.toString() === venueID.toString();
        });
        var venueIndex = extractTrueIndex.indexOf(true);
        if (venueIndex !== -1) {
            return self.venueLocList()[venueIndex];
        } else {
            return null;
        }
    }


    /* Goes through the meetupList and populates the venueLocList array */
    function grabLocs() {

        // loop through meetup list
        self.meetupList().forEach(function(meetup) {
            // check if meetup object has a valid venue id 
            if (meetup.distance < self.radius() && meetup.numWeekDif < self.numWeeks() &&
                meetup.venueName.toLowerCase().contains(self.query().toLowerCase())) {

                var venueloc;
                var id = meetup.venueObject.id;

                if (hasVenueId(id)) {
                    // push the meetup object onto the group location's meetups
                    venueloc = getVenueById(id);
                    venueloc.meetups.push(meetup);

                    // if does not exist
                } else {
                    // instantiate a new venueloc object
                    venueloc = new VenueLocation(meetup.venueObject, map);

                    // check if has valid location
                    if (venueloc.location()) {
                        // push it to the venueLocList
                        self.venueLocList.push(venueloc);

                        // and push the meetup object onto that new venueloc object
                        venueloc.meetups.push(meetup);

                        // add a marker callback
                        google.maps.event.addListener(venueloc.marker, 'click', function() {
                            self.selectVenueLoc(venueloc);
                        });

                        // Event that closes the infobubble with a click on the map
                        google.maps.event.addListener(map, 'click', function() {
                            infoWindow.close();
                        });
                    }
                }
            }
        });
    }
};

//normal slider
ko.bindingHandlers.slider = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var options = allBindingsAccessor().sliderOptions || {};
        $(element).slider(options);
        ko.utils.registerEventHandler(element, "slidechange", function(event, ui) {
            var observable = valueAccessor();
            observable(ui.value);
        });
        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
            $(element).slider("destroy");
        });
        ko.utils.registerEventHandler(element, "slide", function(event, ui) {
            var observable = valueAccessor();
            observable(ui.value);
        });
    },
    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        if (isNaN(value)) value = 0;
        $(element).slider("option", allBindingsAccessor().sliderOptions);
        $(element).slider("value", value);
    }
};

//roundSlider
ko.bindingHandlers.slider2 = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        ko.utils.registerEventHandler(element, "change", function(event) {
            var observable = valueAccessor();
            var value = $(element).roundSlider("option", "value");
            observable(value);
        });
        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
            $(element).roundSlider("destroy");
        });
    },
    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        if (isNaN(value)) value = 0;
        $(element).roundSlider("value", value);
    }
};

var slideDistance, slideDistanceSmall;

ko.bindingHandlers.shiftVisible = {
    update: function(element, valueAccessor) {
        var value = valueAccessor();

        //console.log(windowInnerWidth);
        if (window.innerWidth > 700) {
            slideDistance = $('.menu-main').outerWidth();

            ko.unwrap(value) ? $(element).animate({
                'left': '-' + slideDistance + 'px'
            }, 1000, function() {
                $('.menu-toggle').html('<span class="fontawesome-chevron-right"></span>');
            }) : $('.combined-menu-toggle').animate({
                'left': '0px'
            }, 1000, function() {
                $('.menu-toggle').html('<span class="fontawesome-chevron-left"></span>');
            });
        } else {
            slideDistanceSmall = $('.menu-main').outerHeight();

            ko.unwrap(value) ? $(element).animate({
                'top': '-' + slideDistanceSmall + 'px'
            }, 1000, function() {
                $('.menu-toggle-smallscreen').html('<span class="fontawesome-chevron-down"></span>');
            }) : $('.combined-menu-toggle').animate({
                'top': '0px'
            }, 1000, function() {
                $('.menu-toggle-smallscreen').html('<span class="fontawesome-chevron-up"></span>');
            });
        }
    }
};

ko.applyBindings(new ViewModel());