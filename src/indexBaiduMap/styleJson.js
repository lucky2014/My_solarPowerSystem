define(function(require,exports,module){
    //个性化在线编辑器地址：http://developer.baidu.com/map/custom/
    /*var styleJson = [
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": {
                "color": "#202b33"
            }
        }, 
        {
            "featureType": "land",
            "elementType": "all",
            "stylers": {
                "color": "#2d4455"
            }
        }, 
        {
            "featureType": "boundary",
            "elementType": "geometry",
            "stylers": {
                "color": "#212d35"
            }
        }, 
        {
            "featureType": "railway",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        }, 
        {
            "featureType": "highway",
            "elementType": "geometry",
            "stylers": {
                "color": "#b5ae57"
            }
        }, 
        {
            "featureType": "highway",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#b5ae57",
                "lightness": 1
            }
        }, 
        {
            "featureType": "highway",
            "elementType": "labels",
            "stylers": {
                "visibility": "on"
            }
        }, 
        {
            "featureType": "arterial",
            "elementType": "geometry",
            "stylers": {
                "color": "#004981",
                "lightness": -39
            }
        }, 
        {
            "featureType": "arterial",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#00508b"
            }
        }, 
        {
            "featureType": "poi",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        }, 
        {
            "featureType": "green",
            "elementType": "all",
            "stylers": {
                "color": "#056197",
                "visibility": "off"
            }
        }, 
        {
            "featureType": "subway",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        }, 
        {
            "featureType": "manmade",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        }, 
        {
            "featureType": "local",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        }, 
        {
            "featureType": "arterial",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, 
        {
            "featureType": "boundary",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#029fd4"
            }
        }, 
        {
            "featureType": "building",
            "elementType": "all",
            "stylers": {
                "color": "#1a5787"
            }
        }, 
        {
            "featureType": "label",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        }, 
        {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#ffffff"
            }
        }, 
        {
            "featureType": "poi",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#1e1c1c"
            }
        }, 
        {
            "featureType": "administrative",
            "elementType": "labels",
            "stylers": {
                "visibility": "on"
            }
        },
        {
            "featureType": "road",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }
    ];*/
    var styleJson = [
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": {
                "color": "#a5d6fa"
            }
        }, 
        {
            "featureType": "land",
            "elementType": "all",
            "stylers": {
                "color": "#fff"
            }
        }, 
        {
            "featureType": "boundary",
            "elementType": "geometry",
            "stylers": {
                "color": "#fff"
            }
        }, 
        {
            "featureType": "railway",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        }, 
        {
            "featureType": "highway",
            "elementType": "geometry",
            "stylers": {
                "color": "#f60"
            }
        }, 
        {
            "featureType": "highway",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#f60",
                "lightness": 0
            }
        }, 
        {
            "featureType": "highway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, 
        {
            "featureType": "arterial",
            "elementType": "geometry",
            "stylers": {
                "lightness": 3
            }
        }, 
        {
            "featureType": "arterial",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#9ed3fc"
            }
        }, 
        {
            "featureType": "poi",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        }, 
        {
            "featureType": "green",
            "elementType": "all",
            "stylers": {
                "color": "#97d2f5",
                "visibility": "off"
            }
        }, 
        {
            "featureType": "subway",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        }, 
        {
            "featureType": "manmade",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        }, 
        {
            "featureType": "local",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        }, 
        {
            "featureType": "arterial",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, 
        {
            "featureType": "boundary",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#97d2f5"
            }
        }, 
        {
            "featureType": "building",
            "elementType": "all",
            "stylers": {
                "color": "#97d2f5"
            }
        }, 
        {
            "featureType": "label",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        }, 
        {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#ffffff"
            }
        }, 
        {
            "featureType": "poi",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "red"
            }
        }, 
        {
            "featureType": "administrative",
            "elementType": "labels",
            "stylers": {
                "visibility": "on",
            }
        },
        {
            "featureType": "road",
            "elementType": "labels",
            "stylers": {
                "visibility": "on",
                "color": "#444",
            }
        }
    ];

    return styleJson;
});