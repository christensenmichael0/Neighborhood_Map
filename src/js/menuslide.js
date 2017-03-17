// 	var isMenuOpen = true;
	
// $('.menu-toggle').on('click',
//         function (){
// 			var slideDistance = $('.menu-main').outerWidth();
//             if(isMenuOpen){
//                 isMenuOpen = false;
//                 $('.combined-menu-toggle').animate({'left':'-'+slideDistance+'px'},1000, function() {
// 				$('.menu-toggle').html('<span class="fontawesome-chevron-right"></span>');
// 				});
//             }
//             else {
//                 isMenuOpen = true;
//                 $('.combined-menu-toggle').animate({'left':'0px'},1000, function() {
// 				$('.menu-toggle').html('<span class="fontawesome-chevron-left"></span>');
// 				})
//             }
//         }
//     )
	
// 	var isMenuOpenSmall = true;
	
// $('.menu-toggle-smallscreen').on('click',
//         function (){
// 			var slideDistanceSmall = $('.menu-main').outerHeight();
//             if(isMenuOpenSmall){
//                 isMenuOpenSmall = false;
//                 $('.combined-menu-toggle').animate({'top':'-'+slideDistanceSmall+'px'},1000, function() {
// 				$('.menu-toggle-smallscreen').html('<span class="fontawesome-chevron-down"></span>');
// 				});
//             }
//             else {
//                 isMenuOpenSmall = true;
//                 $('.combined-menu-toggle').animate({'top':'0px'},1000, function() {
// 				$('.menu-toggle-smallscreen').html('<span class="fontawesome-chevron-up"></span>');
// 				})
//             }
//         }
//     )