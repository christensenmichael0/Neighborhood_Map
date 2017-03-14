####Front-End Web Developer Nanodegree Project 5 -- Neighborhood Map
Michael Christensen
March 2017

####Objectives:
--------------
The goal of this project was to develop a single page application featuring a map of your neighborhood or a neighborhood you would like to visit. We were tasked with building in additional functionality to this map including the ability to search or highlight locations and display information about them. As an athlete and exercise enthusiast, I decided to build my custom application utilizing the Meetup API to show exercise group gatherings in and around Boston, Massachusetts (where I plan to move within the next several months). The user is able to filter Meetups by either time or distance from the center of the city. Clicking on a map marker (which represents a meetup venue location) brings up an information window about the meetup(s) originating at that particular place. 

####Steps to run application:
--------------
Go to my Github page and clone "Neighborhood_Map" repository: https://github.com/christensenmichael0

####File Structure:
---------------
*In the project folder root index.html is the minified version of index_pretty.html 

src: expanded working files with comments
dist: production ready outputfiles after running grunt -- minified html/css, uglified js

####Open application on local server:
----------------------------
1.) Install python and open the command line

$> cd /path/to/your-project-folder
$> python -m SimpleHTTPServer 8000

2.) Point web browser to http://localhost:8000/

####Run application from my website:
----------------------------

Point browser to: christensen-michael.com/Neighborhood_Map

####Resources:
----------------------------

Meetup API
---
| https://www.meetup.com/meetup_api/docs/2/open_events/

JS
---
| http://www.w3schools.com/js/js_comparisons.asp
| http://stackoverflow.com/questions/12856112/using-knockout-js-with-jquery-ui-sliders
| http://stackoverflow.com/questions/18759289/how-to-access-parent-or-root-viewmodels-from-within-custom-binding-in-durandal-k
| http://stackoverflow.com/questions/135448/how-do-i-check-if-an-object-has-a-property-in-javascript
| http://stackoverflow.com/questions/19590865/from-an-array-of-objects-extract-value-of-a-property-as-array
| http://stackoverflow.com/questions/9548859/how-do-you-increment-a-knockout-js-observable (incrementing ko observable)
| http://stackoverflow.com/questions/15310659/using-chrome-console-to-access-knockout-viewmodel-with-requirejs

Google Maps API
---------------
| https://mapstyle.withgoogle.com/
| https://developers.google.com/maps/documentation/javascript/controls
| https://github.com/googlemaps/js-info-bubble

GitHub Repositories
-------------------
| https://github.com/mikejoyceio
| https://github.com/allanbreyes/

CSS
----
| http://stackoverflow.com/questions/5703552/css-center-text-horizontal-and-vertical-inside-a-div-block
| http://stackoverflow.com/questions/29793160/making-unordered-list-scrollable
| http://weloveiconfonts.com/


