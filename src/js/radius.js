$(document).ready(function () {
            $("#radius-slider").roundSlider({
				radius: 50,
				width: 14,
				handleSize: "24,12",
				handleShape: "square",
                min: 1,
				max: 30,
				step: 1,
				value: 5,
				sliderType: "min-range"
            });
})