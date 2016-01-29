(function ($) {
    $.fn.initial = function (options) {
        
        // Defining Colors
        var colors = ["#f44336", 
                      "#E91E63", 
                      "#9C27B0", 
                      "#673AB7", 
                      "#3F51B5",
                     "#3F51B5",
                     "#2196F3",
                     "#03A9F4",
                     "#00BCD4",
                     "#009688",
                     "#4CAF50",
                     "#8BC34A",
                     "#CDDC39",
                     "#FFEB3B",
                     "#FFC107",
                     "#FF9800",
                     "#FF5722",
                     "#795548",
                     "#9E9E9E",
                     "#607D8B"];
        
        //need to add more colors
        
        return this.each(function () {

            var e = $(this);
            var settings = $.extend({
                // Default settings
                name: '',
                seed: 0,
                charCount: 1,
                textColor: '#ffffff',
                height: 100,
                width: 100,
                fontSize: 60,
                fontWeight: 400,
                fontFamily: 'HelveticaNeue-Light,Helvetica Neue Light,Helvetica Neue,Helvetica, Arial,Lucida Grande, sans-serif',
                radius: 0
            }, options);

            // overriding from data attributes
            settings = $.extend(settings, e.data());

            // making the text object
            var c = settings.name.substr(0, settings.charCount).toUpperCase();
            var cobj = $('<text text-anchor="middle"></text>').attr({
                'y': '50%',
                'x': '50%',
                'dy' : '0.35em',
                'pointer-events':'auto',
                'fill': settings.textColor,
                'font-family': settings.fontFamily
            }).html(c).css({
                'font-weight': settings.fontWeight,
                'font-size': settings.fontSize+'px',
            });

            var colorIndex = Math.floor((c.charCodeAt(0) + settings.seed) % colors.length);

            var svg = $('<svg></svg>').attr({
                'xmlns': 'http://www.w3.org/2000/svg',
                'pointer-events':'none',
                'width': settings.width,
                'height': settings.height
            }).css({
                'background-color': colors[colorIndex],
                'width': settings.width+'px',
                'height': settings.height+'px',
                'border-radius': settings.radius+'px',
                '-moz-border-radius': settings.radius+'px'
            });

            svg.append(cobj);
           // svg.append(group);
            var svgHtml = window.btoa(unescape(encodeURIComponent($('<div>').append(svg.clone()).html())));

            e.attr("src", 'data:image/svg+xml;base64,' + svgHtml);

        })
    };
console.log("letter avatar");
}(jQuery));


