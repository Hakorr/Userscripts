var setting_clock_12h;
var setting_clock_local;
var setting_filter_selective_unblocking;
var setting_map_atc;
var setting_map_left_menu_view;
var setting_map_lightning;
var setting_map_navdata;
var setting_map_track_tooltip;
var setting_map_tracks;
var setting_map_weather;
var setting_map_weather_tile_air_sigmets;
var setting_map_weather_tile_global_radar;
var setting_map_weather_tile_ir_satellite;
var setting_map_weather_tile_precipitation_rate_forcast;
var setting_map_weather_tile_sigwx_high;
var setting_map_weather_tile_volcanic_eruptions;
var setting_map_weather_tile_wind_speed;
var setting_map_weather_tile_icing;
var setting_map_weather_tile_naradar;
var setting_map_weather_tile_auradar;
var setting_map_weather_tile_incloudturb;
var setting_map_weather_tile_clearairturb;
var setting_unit_alt;
var setting_unit_dist;
var setting_unit_speed;
var setting_unit_temp;
var setting_user_feed_share;


var atcPopups = {};
var fetchByRegInterval = null;
var infowindow;
var infowindowHide = null;
var intAircraftLimitForLabel = 400;
var last_polycircle_time = null;
var mapAtcLayer = null;
var mapAtcLayerIdx = -1;
var objSelectedAirportMarker = null;
var paramMaxAlt = parseInt(getParam(\"maxAlt\", 50000));
var paramMaxSpeed = parseInt(getParam(\"maxSpeed\", 1000));
var paramMinAlt = parseInt(getParam(\"minAlt\", 0));
var paramMinSpeed = parseInt(getParam(\"minSpeed\", 0));
var polylineInCoverage = [];
var polyPointCircles = [];
var polyPointCirclesRaw = [];
var radarRegexp = /^F-EST[1-3]?$/;
var selected_airline = null;
var tooltipRadius = {2: 125, 3: 83, 4: 62, 5: 50, 6: 41, 7: 35, 8: 31, 9: 27, 10: 25, 11: 22, 12: 20, 13: 19, 14: 13, 15: 8, 16: 4, 17: 3, 18: 2, 19: 1, 20: 1, 21: 1, 22: 1};


var aInterval = false;
var aircraft_id, aircraft_track;
var aircraftInfoLevel = dispatcher.userFeatures['map.info.aircraft'];
var aircraftInfowindow = null;
var airport_index = new Map();
var clock_interval = 5000;
var continents = [1, 3, 4, 5, 6, 7];
var cookie_enc = null;
var cookie_pubkey = null;
var current_hover;
var document_title = 'Flightradar24';
var enabledShowMessageViews = ['mapView', 'fullscreenView'];
var feed_error = 0;
var feed_request_method = 'json';
var feed_request_slam_ms = 1000;
var feed_state = 'init';
var fetchInterval, timeInterval, preFetchInterval, loginCheckInterval, updateInterval, niteInterval;
var flightInfoLevel = dispatcher.userFeatures['map.info.flight'];
var follow_aircraft = 0;
var force_init_call = 0;
var geolocation_move = false;
var ignoredSettings = ['map_lat', 'map_lon', 'map_zoom', 'new_version_dialog_closed', 'map_left_menu_view'];
var init_aircraft_size = 'auto';
var init_airport_density = 100;
var init_ash_alt = '1;1;1';
var init_ash_valid = 0;
var atcLayerColor = 'none';
var init_call = 0;
var init_clock_12h;
var init_clock_local;
var init_filter;
var init_filter_check = 0;
var init_follow = 0;
var init_goto_aircraft = null;
var init_label_1 = 'cs', init_label_2, init_label_3, init_label_4;
var init_labels = 0;
var init_lat = 51;
var init_lon = -2;
var init_navcharts = 'none';
var init_track_tooltip = 0;
var init_tracks = 0;
var init_type = 'terrain';
var init_unit_alt = 'ft';
var init_unit_dist = 'km';
var init_unit_speed = 'kt';
var init_unit_temp = 'c';
var init_unit_wspeed = 'kt';
var init_zoom = 6;
var init_user_feed_share = 0;
var isDragged = false;
var isMapDblClick;
var load3dView = false;
var map;
var map_delays_mode = false;
var map_fullscreen_view = 0;
var map_left_menu_view = 'mapView';
var map_nav_pins = {airport: {}, route: {}};
var mouseEvent = document.createEvent('MouseEvents');
var multi_select_mode = false;
var nav_list = {airport: [], route: []};
var pauseFeed = false;
var plane_list = {}, plane_list_old = {}, plane_list_org = {};
var plane_list_next = false;
var planeInfoLoadingTimeout;
var planes_array = {};
var plane_details = new WeakMap();
var plane_animated_list = new Set();
var planeRenderQueue;
var markerCache;
var pinCache;
var labelHandler;
var planes_showing = 0;
var planes_total = 0;
var playback_tick_ms_real = 0;
var tracked_aircraft = null;
var playback_fetch_time = 0;
var selected_aircraft = null;
var selected_aircraft_array = [];
var selected_aircraft_limit = 6;
var selected_count = {};
var selected_data = {};
var selected_data_ems = {'ems': {}, 'availability': [], aircraft: null, airspace: ''};
var selective_unblocking = [];
var selected_airport;
var show_labels = 0;
var showLeftOverlay = true;
var showMultiSelectInfo = true;
var showMultiSelectRoute = false;
var sidebar_closed = 0;
var subscriptionFeatureTooltip = (dispatcher.userSubscriptionPlatform === 'web') ? (dispatcher.display.isDevice ? '' : 'hasTooltip') : 'hasTooltip';
var subscriptionUpgradetext = dispatcher.subscriptionUpgradetext;
var timeLocal = new Date();
var traceFlightInfoOpen;
var traceAirportPanelOpen;
var planes_snap_position = 0;

if (simple_mode == true) {
    var init_airports = 0;
    var init_fade = 30;
} else {
    var init_airports = 1;
    var init_fade = 40;
}

// const defaultRefreshRate = 16000;
var fetchPlainListFailCount = 0;
// if (typeof (refresh_rate) === 'undefined') {
    window.refresh_rate = window.dispatcher.isPremium ? 16000 : 32000;
// }

var init_vor = 0;
var init_ndb = 0;
var init_sidemenu_photo_hide = 0;
var init_topbar = 1;
var init_weather = 0;
var init_clouds = 0;
var init_lightning = 0;
var init_nite = 1;
var nite_initialised = 0;

var ground_traffic = 1;
var glider_traffic = 1;
var vehicular_traffic = 1;
var airborn_traffic = 1;
var faa_traffic = 1;
var mlat_traffic = 1;
var adsb_traffic = 1;
var flarm_traffic = 1;
var fsat_traffic = 1;
var estimated_traffic = 240;
var init_ash_clouds = 1;
var init_navdata = 0;
var max_filters = 7;
var cloudLayer, weatherLayer, lightningLayer, weather_tile_ir_satellite = 0, weather_tile_global_radar = 0, weather_tile_air_sigmets = 0, weather_tile_volcanic_eruptions = 0, weather_tile_naradar = 0, weather_tile_auradar = 0, weather_tile_icing = '', weather_tile_incloudturb = '', weather_tile_clearairturb = '', weather_tile_sigwx_high = 0, weather_tile_precipitation_rate_forcast = 0, weather_tile_wind_speed = 'none', weather_tile_lightning_heat_map = 0;

var enable_filters = 1;
var init_unblock_filters = 0;

var query_flight_id = '', query_callsign = '', query_pb_date = '', query_pb_time = '', query_lat = '', query_lon = '', query_z = '', query_airport = '', query_airportInfo = 0, query_solo = 0, query_view = 0, query_single = 0, $query_callsign = null;
var setCookie, getCookie;
var polylines = {};
var polylines_index = {};
var polylines_fake = {};
var polylines_fake_index = {};
var show_aircraft_data_requests = 0, show_aircraft_data_threshold = 3;
var init_anim = 1;
var a_active = 0;
var mouseMove = 0;
var total_count = 0;
var planes_array_fake = {};
var i;
var aircraft_static_values = [[\"Airline\", \"airline\"], [\"Flight\", \"flight\"], [\"From\", \"from_city\"], [\"Via\", \"via\"], [\"Via\", \"via2\"], [\"To\", \"to_city\"], [\"Comment\", \"comment\"], [\"Aircraft\", \"aircraft\"]];
var aircraft_dynamic_values = [[\"ETA\", 17], [\"Reg\", 9], [\"Altitude\", 4], [\"V/S\", 15], [\"Speed\", 5], [\"Track\", 3], [\"Hex\", 0], [\"Squawk\", 6], [\"Pos\", 'p'], [\"Radar\", 7]];

var waiting_for_data = false;
var waiting_for_pb_data = false;
var pb_data_fail_count = 0;
var pb_data_fail_timeout;
var idleTimeout;
var currentZoom;
var currentBounds;
var currentMapLatitude = init_lat;
var polyLineCoordinates, polyLine;
var element;
var api;
var delayStatsInterval;
var searchAnimTimeout;
var searchLoadingTimeout;
var disableTimeout = 1800000;
var playback_time;
var playback_mode = 0;
var playback_play = 0;
var playback_last;
var timeline_options;
var trail_color = 'rainbow';
var map_layers = [];
var mediaFeedInterval = null;
var first_run = 1;
var overlay_vor = 0;
var loadFullFeed = false;
var goToDelayed = '';
var hideOthers = 0;
var showRoute = 0;
var showRouteEnabled = true;
var showRoutePrevPos = [];
var link_url = 'https://fr24.com';
var isResizeForMobile = false;
var g_hasAC = false;
var mapBoundsOffset = 0.1;
var mapClickCounter = 0;
var adRefreshClickCount = 5;
var goToWasHovered = false;

var g_MapControls = {};
var g_MapControlPosition = {
    'logo': 0,
    'jump': 3
};

var zoomAnimationLookupTable = {
    // How much it takes for plane with 430kts speed to move by one pixel (based on https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Resolution_and_Scale)
    '0': 705000,
    '1': 352000,
    '2': 176000,
    '3': 88000,
    '4': 44000,
    '5': 22000,
    '6': 11000,
    '7': 5000,
    '8': 2700,
    '9': 1300,
    '10': 600,
    '11': 340,
    '12': 170
};

function selectAircraft(aircraftId) {
    window.selected_aircraft = aircraftId;

    if(aircraftId === null) {
        window.fr24getEventBus().emit('map.flight.selected', null);
    }
}

window.selectAircraft = selectAircraft;

function showModernError(errorConfiguration) {
    window.whenModuleLoaded('mapView', function () {
        window.fr24getEventBus().emit('errors.add', errorConfiguration);
    });
}

// When site loads, we want to show Baron error only once
var baronErrorShown = false;
var baronErrorShownFor = new Set(); // used for weather layer sliders

function showBaronError() {
    showModernError({
        title: 'We\\'re sorry,',
        description: 'data for clear air turbulence, in cloud turbulence and global icing layers are currently unavailable. Our weather provider is currently working with the data source to resume functionality. We expect this layer to be available again in April 2021.'
    });
}

var planePositionsWorker = (function () {
    try {
        return new Worker('/static/js/workers/planePositionsWorker.js?' + dispatcher.deployTimestamp, { type: 'module' });
    } catch (error) {
        showModernError({
            title: 'Your Chrome version is not supported by flightradar24.com.',
            // This issue happens only for Chrome version lower than 80
            description: 'Please update to the latest version or use another browser.',
            options: {
                permanent: true
            }
        });

        throw error;
    }
})();

window.addEventListener('unload', function () {
    stopFetchPlane();
    clearTimeout(aInterval);
    clearTimeout(timeInterval);
    clearTimeout(updateInterval);
    clearTimeout(niteInterval);
    // save filters before leave page
    if (window.NavigationManager) {
        NavigationManager.updateUserProfile(\"put\");
    }
});

function whenDomLoaded(callback) {
    if (['interactive', 'complete', 'loaded'].indexOf(document.readyState) > -1) {
        callback();
    } else {
        document.addEventListener('DOMContentLoaded', callback);
    }
}

function increaseMapClickCounter() {
    mapClickCounter++;
}

function resetLeftPanelAdIfNeeded(resetFunction) {
    if (mapClickCounter < adRefreshClickCount) return;

    resetFunction();
    mapClickCounter = 0;
}

// var initialRequest = true;
// window.fetch_plane_list = window.FR24Utils.debounce(fetchPlaneList, 500);
window.fetch_plane_list = window.FR24Utils.debounce(fetchPlaneList, window.dispatcher.isPremium ? 500 : 5000);


function CustomLabel(map, aircraft_id, active_label) {
    this.div_;
    this.current_data_ = null;
    this.current_pos_ = null;
    this.latlng_ = null;
    this.active_label = active_label;
    this.aircraft_id = aircraft_id;

    this.setMap(map);
}

CustomLabel.prototype = new google.maps.OverlayView();

CustomLabel.prototype.onAdd = function () {
    this.div_ = document.createElement('div');

    if (this.active_label == 1) {
        const ac_type = (
            plane_list
            && plane_list[this.aircraft_id]
            && plane_list[this.aircraft_id][8]
         ) || '';

        this.div_.id = 'label_active_' + this.aircraft_id;
        this.div_.className = [
            'aircraft_label_container',
            ac_type.length > 0 ? 'aircraft_label_container--' + ac_type.toLowerCase().replace(/[^a-z0-9]/g, '') : '',
        ].join(' ');
    } else {
        this.div_.id = 'label_' + this.aircraft_id;
        this.div_.className = 'marker_label';
    }

    this.getPanes().overlayImage.appendChild(this.div_);

    this.rewrite();
}


CustomLabel.prototype.onRemove = function() {
    if (this.div_) {
        this.div_.parentNode.removeChild(this.div_);
        this.div_ = null;
    }
}

CustomLabel.prototype.move = function( latlng ) {
    this.latlng_ = latlng;

    this.draw();
}

CustomLabel.prototype.rewrite = function () {
    var div = this.div_;

    if (div) {
        if (this.active_label == 1) {
            if (typeof plane_list[this.aircraft_id][16] === \"undefined\" ||  plane_list[this.aircraft_id][16].length === 0 ) {
                label_data = 'No callsign';
            } else {
                label_data = plane_list[this.aircraft_id][16].replace('#', '');
            }

            label_data = label_data.replace('*', '');

            label_data = '<div class=\"aircraft_label\">' + label_data + '</div><div class=\"aircraft_label_bottom\"></div>';
        } else {
            var label_data = '';

            label_data += this.returnLabel(init_label_1, 1);

            if (init_label_2 !== null && map.zoom > 7) {
                label_data += this.returnLabel(init_label_2, 2);
            }

            if (init_label_3 !== null && map.zoom > 7) {
                label_data += this.returnLabel(init_label_3, 3);
            }

            if (init_label_4 !== null && map.zoom > 7) {
                label_data += this.returnLabel(init_label_4, 4);
            }
        }

        if (this.current_data_ !== label_data) {
            if (label_data == '') {
                div.style.display='none';
            } else {
                div.innerHTML = label_data;
            }
            this.current_data_ = label_data;
        }
    }
};

CustomLabel.prototype.returnLabel = function (label, row) {
    if (row > 2 && dispatcher.isPremium !== true) { // If not premium
        return '';
    }

    var udef;
    var label_data = '';
    var vspd_symbol = '';

    if (label === 'alt' || label === 'altspeed') {
        if (plane_list[this.aircraft_id][15] > 128) {
            vspd_symbol = '&nbsp;↗';
        } else if (plane_list[this.aircraft_id][15] < -128) {
            vspd_symbol = '&nbsp;↘';
        }
    }

    switch (label) {
        case \"acreg\":
            if (plane_list[this.aircraft_id][9] && plane_list[this.aircraft_id][8]) {
                label_data += plane_list[this.aircraft_id][8] + '&nbsp;' + plane_list[this.aircraft_id][9];
            } else if (plane_list[this.aircraft_id][8]) {
                label_data += plane_list[this.aircraft_id][8];
            } else if (plane_list[this.aircraft_id][9]) {
                label_data += plane_list[this.aircraft_id][9];
            }
            break;
        case \"altspeed\":
            label_data += MapUtils.format_flight_level(plane_list[this.aircraft_id][4]) + vspd_symbol + '&nbsp;' + window.Units.convert(\"speed\", plane_list[this.aircraft_id][5], udef, udef, udef, true);
            break;
        case \"tofrom\":
            if (plane_list[this.aircraft_id][11] && plane_list[this.aircraft_id][12])
                label_data += plane_list[this.aircraft_id][11] + '&nbsp;-&nbsp;' + plane_list[this.aircraft_id][12];
            break;
        case \"ac\":
            if (plane_list[this.aircraft_id][8]) {
                label_data += plane_list[this.aircraft_id][8];
            }
            break;
        case \"reg\":
            if (plane_list[this.aircraft_id][9]) {
                label_data += plane_list[this.aircraft_id][9];
            }
            break;
        case \"flight\":
            if (plane_list[this.aircraft_id][13]) {
                label_data += plane_list[this.aircraft_id][13];
            }
            break;
        case \"alt\":
            label_data += MapUtils.format_flight_level(plane_list[this.aircraft_id][4]) + vspd_symbol;
            break;
        case \"speed\":
            label_data += window.Units.convert(\"speed\", plane_list[this.aircraft_id][5], udef, udef, udef, true);
            break;
        case \"cs\":
            if (typeof plane_list[this.aircraft_id][16] === \"undefined\" ||  plane_list[this.aircraft_id][16].length === 0 ) {
                label_data = 'No callsign';
            } else {
                label_data = plane_list[this.aircraft_id][16].replace('#', '');
            }

            label_data = label_data.replace('*', '');

            break;
    }

    if (row > 1 && label_data != '') {
        label_data = '<span>' + label_data + '</span>';
    }

    return label_data;
};

CustomLabel.prototype.draw = function ( ) {
    if (!this.div_) {
        return;
    }

    let point;
    if (this.latlng_) {
        point = this.getProjection().fromLatLngToDivPixel(this.latlng_);

        if (this.current_pos_ !== null) {
            if (Math.round(point.x) === this.current_pos_.x && Math.round(point.y) === this.current_pos_.y) {
                return;
            }
        }
    } else {
        return;
    }

    if (planes_array && planes_array[this.aircraft_id]) {
        var icon = planes_array[this.aircraft_id].getIcon().size;
        var left, top = 0;

        this.current_pos_ = {
            x: Math.round(point.x),
            y: Math.round(point.y)
        };

        if (this.active_label == 1) {
            left = this.current_pos_.x - (icon.width / 2) + 1;
            top  = this.current_pos_.y - (icon.height / 2) + 2;
        } else {
            left = this.current_pos_.x + (icon.width / 2) + 1;
            top  = this.current_pos_.y - (icon.height / 2) + 4;
        }

        this.div_.style.transform = this.div_.style.webkitTransform = 'translate(' + left + 'px,' + top + 'px)';
    }
};





function initSettings()
{
    try {
        var setting_clock_local = parseInt(settingsService.syncGetSetting(\"global.clock_local\"));
        var setting_clock_12h = parseInt(settingsService.syncGetSetting(\"global.clock_12h\"));

        init_clock_local = setting_clock_local;
        init_clock_12h = setting_clock_12h;

        settingsService.setSetting(\"global.clock_12h\", init_clock_12h);
        settingsService.setSetting(\"global.clock_local\", init_clock_local);

        setting_unit_speed = settingsService.syncGetSetting(\"unit.speed\");
        if (setting_unit_speed !== null) {
            init_unit_speed = setting_unit_speed;

            updateSliderUnits();
        }

        setting_unit_temp = settingsService.syncGetSetting(\"unit.temp\");
        if (setting_unit_temp !== null) {
            init_unit_temp = setting_unit_temp;
        }

        setting_unit_alt = settingsService.syncGetSetting(\"unit.alt\");
        if (setting_unit_alt !== null) {
            init_unit_alt = setting_unit_alt;

            updateSliderUnits();
        }

        setting_unit_dist = settingsService.syncGetSetting(\"unit.dist\");
        if (setting_unit_dist !== null) {
            init_unit_dist = setting_unit_dist;
        }

        setting_map_track_tooltip = settingsService.syncGetSetting(\"map.trail_tooltip\");
        if (setting_map_track_tooltip !== null && typeof window.get_navdata === \"function\") {
            init_track_tooltip = parseInt(setting_map_track_tooltip);
        }

        setting_map_tracks = settingsService.syncGetSetting(\"map.oceanic_tracks\");
        if (setting_map_tracks !== null && window.fr24Tracks !== undefined) {
            init_tracks = parseInt(setting_map_tracks);
            if (init_tracks === 1) {
                fr24Tracks.loadTracks();
            } else {
                fr24Tracks.removeTracks();
            }
        }

        setting_map_atc = settingsService.syncGetSetting(\"map.atc_boundaries\");
        if (setting_map_atc !== null && typeof window.get_navdata === \"function\") {
            atcLayerColor = setting_map_atc;
            // Legacy conversion: previously map_atc was int (0/1), where 1 meant \"red\" color
            var integerATCSetting = parseInt(atcLayerColor);
            if (!isNaN(integerATCSetting)) {
                atcLayerColor = integerATCSetting === 1 ? \"red\" : \"none\";
            }
            if (atcLayerColor !== \"none\") {
                setTimeout(function () {
                    loadATC(atcLayerColor);
                }, 0);
            } else {
                setTimeout(function () {
                    removeATC();
                }, 0);
            }
        }

        setting_map_navdata = settingsService.syncGetSetting(\"map.aeronautical_charts\");
        if (setting_map_navdata !== null && typeof window.get_navdata === \"function\") {
            init_navcharts = setting_map_navdata;
            if (init_navcharts !== \"none\") {
                setTimeout(function () {
                    navdataLayer = new NavDataLayer();
                    navdataLayer.createLayer(setting_map_navdata)
                }, 200);
            } else {
                setTimeout(function () {
                    if (typeof navdataLayer !== \"undefined\") {
                        navdataLayer.removeLayer()
                    }
                }, 300);
            }
        }

        setting_map_left_menu_view = settingsService.syncGetSetting(\"map.selected_view\");
        if (setting_map_left_menu_view !== null) {
            map_left_menu_view = setting_map_left_menu_view;
            var viewElem = map_left_menu_view.replace(\"View\", \"\");
            if (viewElem === \"airport\") {
                var airport = settingsService.syncGetSetting(\"view.airport.selected\");
                angular.element(\"#fr24_ViewsDropdown\").scope().openAirportView(airport);
            } else {
                viewElem = $(\"#fr24_ViewsDropdown a[data-value='\" + viewElem + \"']\");
                angular.element(viewElem).triggerHandler(\"click\");
            }
            if (viewElem === \"airport\" || viewElem === \"fleet\") {
                angular.element($(\"#fr24_ViewsDropdownContainer\")).triggerHandler(\"click\");
            }
        }

        setting_filter_selective_unblocking = settingsService.syncGetSetting(\"filter.selective_unblocking\");
        if (setting_filter_selective_unblocking !== null) {
            selective_unblocking = setting_filter_selective_unblocking;
            Object.keys(selective_unblocking).forEach(function (i) {
                $(\"#selective_unblocking input[data-value='\" + selective_unblocking[i] + \"']\")
                    .prop(\"checked\", true)
                    .parents('li').addClass('selected');
            });
            if (NavigationManager && typeof NavigationManager.renderFilterPopup === \"function\") {
                NavigationManager.renderFilterPopup();
            }
        }

        setting_user_feed_share = settingsService.syncGetSetting(\"user.feed_share\");
        if(typeof setting_user_feed_share !== 'undefined') {
            init_user_feed_share = setting_user_feed_share;
        } else {
            settingsService.setSetting('user.feed_share', init_user_feed_share);
        }



    } catch (error) {

    }
}

function updateBounds() {
    if (typeof map === 'undefined') {
        return;
    }
    var bounds = map.getBounds();
    if (bounds) {
        currentBounds = bounds.toJSON();
        currentBounds.ne = bounds.getNorthEast();
        currentBounds.sw = bounds.getSouthWest();
        currentBounds.id = bounds.toString();
    }
}

function initialize_map() {
    var enc = getCookie('_frPl');
    cookie_enc = (enc && enc.trim() !== '' && enc.trim() !== 'empty') ? enc : null;

    const _frPubKey = settingsService.syncGetSetting('_frPubKey');
    if (typeof dispatcher !== 'undefined' && _frPubKey !== 'undefined' && _frPubKey !== null && _frPubKey.trim() !== '' && _frPubKey.trim() !== 'empty') {
        cookie_pubkey = _frPubKey;
    }

    if (simple_mode == false) {
        init_labels = (parseInt(settingsService.syncGetSetting(\"map.show_labels\")) === 1) ? 1 : 0; // If user has enabled labels
        show_labels = init_labels;
        if (init_labels === 1) { // Check which labels the user has enabled
            init_label_2 = '';
            init_label_3 = '';
            const setting_map_label_1 = settingsService.syncGetSetting(\"map.label_1\");
            const setting_map_label_2 = settingsService.syncGetSetting(\"map.label_2\");
            const setting_map_label_3 = settingsService.syncGetSetting(\"map.label_3\");
            const setting_map_label_4 = settingsService.syncGetSetting(\"map.label_4\");
            if (setting_map_label_1 !== null) {
                init_label_1 = setting_map_label_1;
            }
            if (setting_map_label_2 !== null) {
                init_label_2 = setting_map_label_2;
            }
            if (setting_map_label_3 !== null) {
                init_label_3 = setting_map_label_3;
            }
            if (setting_map_label_4 !== null) {
                init_label_4 = setting_map_label_4;
            }
        }
    } else {
        show_labels = init_labels;
    }

    const labelBackground = settingsService.syncGetSetting(\"map.label_background\");

    if (labelBackground == 0) {
        $('body').addClass('hide-label-bkg');
    }

    //Check if user has enabled ground traffic

    const setting_enable_filters = settingsService.syncGetSetting(\"filter.enable_filters\");
    if (setting_enable_filters != null) {
        enable_filters = (setting_enable_filters == 1) ? 1 : 0;
    } else {
        enable_filters = 0;
    }

    const settingUnblockFiltersEnabled = settingsService.syncGetSetting(\"filter.enable_unblock_filters\");

    if (settingUnblockFiltersEnabled != null ) {
        init_unblock_filters = (settingUnblockFiltersEnabled == 1) ? 1 : 0;
    }

    const setting_animate_aircraft = settingsService.syncGetSetting(\"map.animate_aircraft\");
    if (setting_animate_aircraft != null) {
        init_anim = (setting_animate_aircraft == 1) ? 1 : 0;
    } else {
        settingsService.setSetting(\"map.animate_aircraft\", init_anim);
    }

    //Check if user has enabled ground traffic
    const setting_ground_traffic = settingsService.syncGetSetting('map.ground_traffic');
    if (setting_ground_traffic != null) {
        ground_traffic = (setting_ground_traffic == 1) ? 1 : 0;
    }

    //Check if user has enabled ground traffic
    let setting_vehicular_traffic = settingsService.syncGetSetting('map.show_vehicles');
    if (setting_vehicular_traffic != null) {
        vehicular_traffic = (setting_vehicular_traffic == 1) ? 1 : 0;
    }

    //Check if user has enabled ground traffic
    const setting_glider_traffic = settingsService.syncGetSetting('map.show_gliders');
    if (setting_glider_traffic != null) {
        glider_traffic = (setting_glider_traffic == 1) ? 1 : 0;
    }

    //Check if user has enabled ground traffic
    const setting_airborn_traffic = settingsService.syncGetSetting('map.airborn_traffic');
    if (setting_airborn_traffic != null) {
        airborn_traffic = (setting_airborn_traffic == 1) ? 1 : 0;
    }

    //Check if user has enabled FAA traffic
    const setting_faa_traffic = settingsService.syncGetSetting('map.faa_traffic');
    if (setting_faa_traffic != null) {
        faa_traffic = (setting_faa_traffic == 1) ? 1 : 0;
    }

    //Check if user has enabled FSAT traffic
    const setting_fsat_traffic = settingsService.syncGetSetting('map.fsat_traffic');
    if (setting_fsat_traffic != null) {
        fsat_traffic = (setting_fsat_traffic == 1) ? 1 : 0;
    }

    //Check if user has enabled MLAT traffic
    const setting_mlat_traffic = settingsService.syncGetSetting('map.mlat_traffic');
    if (setting_mlat_traffic != null) {
        mlat_traffic = parseInt(setting_mlat_traffic);
    } else {
        mlat_traffic = 1;
    }

    //Check if user has enabled ADS-B traffic
    let setting_adsb_traffic = settingsService.syncGetSetting('map.adsb_traffic');
    if (setting_adsb_traffic != null) {
        adsb_traffic = (setting_adsb_traffic == 1) ? 1 : 0;
    }

    //Check if user has enabled FLARM traffic
    let setting_flarm_traffic = settingsService.syncGetSetting('map.flarm_traffic');
    if (setting_flarm_traffic != null) {
        flarm_traffic = (setting_flarm_traffic == 1) ? 1 : 0;
    }

    //Check if user has enabled Estimated traffic
    let setting_estimated_traffic = settingsService.syncGetSetting('map.estimated_traffic');
    if (setting_estimated_traffic != null) {
        estimated_traffic = parseInt(setting_estimated_traffic);
    }

    let setting_map_type = settingsService.syncGetSetting(\"map.type\");

    if (setting_map_type !== null) { // Use map type from cookie
        init_type = setting_map_type.split('\"').join('');
    }

    let setting_map_fade = settingsService.syncGetSetting(\"map.fade\");
    if (setting_map_fade !== null) { // Use brightness from cookie
        init_fade = parseInt(setting_map_fade);
    }

    let setting_map_aircraft_size = settingsService.syncGetSetting(\"map.aircraft_icon_size\");

    // work around for people with broken icons
    if (setting_map_aircraft_size == parseInt(setting_map_aircraft_size)) {
        setting_map_aircraft_size = 'auto';
        settingsService.syncGetSetting(\"map.aircraft_icon_size\");
    }

    if (setting_map_aircraft_size !== null) { // Use size from cookie
        init_aircraft_size = setting_map_aircraft_size;
    }

    let setting_map_airports = settingsService.syncGetSetting(\"map.show_airports\");
    if (setting_map_airports !== null) { // If user has disabled airports
        init_airports = parseInt(setting_map_airports);
    }

    let setting_map_airport_density = settingsService.syncGetSetting(\"map.airport_density\");
    if (setting_map_airport_density !== null) { // If user has disabled airports
        init_airport_density = parseInt(setting_map_airport_density);
    }

    let setting_map_sidemenu_photo_hide = settingsService.syncGetSetting(\"misc.sidemenu_photo_hide\");
    if (setting_map_sidemenu_photo_hide !== null) {
        init_sidemenu_photo_hide = parseInt(setting_map_sidemenu_photo_hide);
        toggleAircraftPhoto();
    } else if (setting_map_sidemenu_photo_hide === null) {
        settingsService.setSetting(\"misc.sidemenu_photo_hide\", 0);
    }

    let setting_map_nite = settingsService.syncGetSetting(\"map.night_line\");

    if (setting_map_nite !== null) {
        init_nite = parseInt(setting_map_nite);
    }

    if (!playback_mode && !dispatcher.isLoggedIn) {
        const weatherVolcano = parseInt(settingsService.syncGetSetting('weather.volcano'));
        if (weatherVolcano) {
            HandleWeatherTileChange('map_weather_tile_volcanic_eruptions', weatherVolcano);
        }
    }

    //Always close sidebar in simple mode
    if (simple_mode == true) {
        sidebar_closed = 1;
        window.filtersHandler.clearFilters();
    }
    whenDomLoaded(initSettings);
    showLeftOverlay = isMapView();

    if (simple_mode == true) {
        get_querystrings_simple(); // Parse data in querystring
        loadFullFeed = true;
    } else {
        get_querystrings(); // Parse data in querystring
    }
    whenDomLoaded(ViewHandler.adjustView);
    
    if (query_callsign.length > 1) { // If a plane is in url
        init_call = query_callsign; // Put the callsign here (we will search for it when we have the feed)
        query_callsign = '';
    }

    const setting_lat = settingsService.syncGetSetting(\"map.latitude\"); // Get map position from localstorage/cookie
    const setting_lon = settingsService.syncGetSetting(\"map.longitude\");
    const setting_zoom = settingsService.syncGetSetting(\"map.zoom\");

    // If there are valid position data in the url...
    if( MapUtils.validLat(query_lat) && MapUtils.validLon(query_lon) && MapUtils.validZoom(query_z) ) {

        init_lat = query_lat; // use this data
        init_lon = query_lon;
        init_zoom = parseInt(query_z);

        settingsService.setSetting(\"map.latitude\", init_lat);
        settingsService.setSetting(\"map.longitude\", init_lon);
        settingsService.setSetting(\"map.zoom\", init_zoom);

    } else if (setting_lat !== null || setting_lon !== null || setting_zoom !== null) { // If there are positions in cookie...
        init_lat = setting_lat; // use them!
        init_lon = setting_lon;
        init_zoom = parseInt(setting_zoom, 10) || 6;
    } else {
        if(!simple_mode) {
            handleGeoIPLocation();
        }
    }

    const myLatlng = new google.maps.LatLng(init_lat, init_lon); // Set map position to the position we have in init_lat/lon (either from database, cookie, or url)

    // cache current map latitude for `getAnimationInterval` function
    currentMapLatitude = init_lat;

    const maxAbsLatitude =  85.05115;
    const maxAbsLongitude = 180;
    const mapRestriction = {
        latLngBounds: {
            east:   maxAbsLongitude,
            north:  maxAbsLatitude,
            south: -maxAbsLatitude,
            west:  -maxAbsLongitude
        },
        strictBounds: false
    };

    let mapOptions;

    if (simple_mode == true) {
        mapOptions = {
            zoom: init_zoom,
            center: myLatlng,
            backgroundColor: getComputedBackgroundColour(100 - init_fade, init_type),
            zoomControl: true,
            tilt: 0,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.SMALL,
                position: google.maps.ControlPosition.TOP_LEFT
            },
            panControl: false,
            fullscreenControl: false,
            streetViewControl: false,
            navigationControlOptions: {
                position: google.maps.ControlPosition.TOP_RIGHT
            },
            mapTypeControl: false,
            clickableLabels: false,
            clickableIcons: false,
            gestureHandling: \"greedy\",
            restriction: mapRestriction
        };
    } else {
        mapOptions = {
            minZoom: 2,
            zoom: init_zoom,
            center: myLatlng,
            tilt: 0,
            backgroundColor: getComputedBackgroundColour(100 - init_fade, init_type),
            zoomControl: false,
            panControl: false,
            fullscreenControl: false,
            scaleControl: true,
            scaleControlOptions: {
                position: google.maps.ControlPosition.BOTTOM_RIGHT
            },
            streetViewControl: false,
            mapTypeControl: false,
            clickableLabels: false,
            clickableIcons: false,
            gestureHandling: \"greedy\",
            restriction: mapRestriction
        };
    }

    map = new google.maps.Map(document.getElementById(\"map_canvas\"), mapOptions); // Create map
    setMapStyles( map, init_type );

    map.addListener(\"dblclick\", function(e) {
        isMapDblClick = true;
        setTimeout(function()
        {
            isMapDblClick = false;
        }, 500);
    });

    map.addListener(\"click\", function(e) {
        // abcdef
        setTimeout(function() {
            if(!isMapDblClick) {
                const noAircraftSelected = !selected_aircraft || selected_aircraft === null;
                const shouldUseMapClickEvent = window.multiViewPanels.queue.count() === 0 && noAircraftSelected;
                const eventName = shouldUseMapClickEvent
                    ? 'map.click'
                    : 'map.selection.clear';

                close_aircraft_data();

                window.fr24getEventBus().emit(eventName);

                window.multiViewPanels.removeAll()

                if(window.airportInfoHandler) {
                    window.airportInfoHandler.close();
                }

                isMapDblClick = false;
            }
        }, 500);
    });

    map.panToOffsetted = window.panToOffsetted;

    infowindow = new google.maps.InfoWindow({
        maxWidth: 300
    });

    if (typeof nite != \"undefined\")
    {
        if (init_nite == 1)
        {
            nite_initialised = 1;

            nite.init(map);

            nite.show();

            niteInterval = setInterval(function () {
                nite.refresh();
            }, 10000);
        }
    }

    function filterLayer(map) {
        this.map = map;

        this.setMap(map);
    }

    filterLayer.prototype = new google.maps.OverlayView();

    filterLayer.prototype.onAdd = function() {
        google.maps.event.addListenerOnce(this.map, 'tilesloaded', this.setBrightness.bind(this));
        google.maps.event.addListenerOnce(this.map, 'tilesloaded', this.applyTransition.bind(this));

        google.maps.event.addListener(map, 'maptypeid_changed', function() {
            setTimeout(function() {
                window.brightnessControl.applyTransition();
                window.brightnessControl.setBrightness();
            }, 1);
        });
    }

    filterLayer.prototype.applyTransition = function() {
        this.map.getDiv().style.transition = this.getCanvas().style.transition = 'filter 200ms ease';
    }

    filterLayer.prototype.getCanvas = function() {
        var panes = this.getPanes();

        return panes ? panes.mapPane.parentElement.lastChild : false;
    }

    filterLayer.prototype.setBrightness = function( percent ) {
        var canvas = this.getCanvas();

        if (!percent) {
            percent = 100 - init_fade;
        }

        if (canvas) {
            canvas.style.filter = 'brightness(' + percent + '%)';
        }

        this.map.getDiv().firstChild.style.backgroundColor = getComputedBackgroundColour( percent, init_type );
    }

    filterLayer.prototype.setBlur = function( pixels, blockPointer ) {
        this.map.getDiv().style.filter = (pixels === 0 ? null : 'blur(' + pixels + 'rem)');

        if (blockPointer) {
            this.map.getDiv().style.pointerEvents = (pixels === 0 ? null : 'none');
        }
    }

    // Overlay stub for projection queries ( probably )
    var mapCanvasStub = function (map) {
        this.setMap(map);
    };

    mapCanvasStub.prototype = new google.maps.OverlayView();
    mapCanvasStub.prototype.draw = function () {};

    window.brightnessControl = new filterLayer(map);

    window.mapCanvasStub = new mapCanvasStub(map);

    window.labelHandler = new LabelHandler(map, CustomLabel);

    markerCache = new MarkerCache(google, map, get_sprite());
    markerCache.on('click',     markerClickEvent);
    markerCache.on('mouseover', markerMouseOverEvent);
    markerCache.on('mouseout',  markerMouseOutEvent);
    markerCache.warmup(1500);

    pinCache = {
        airport: new MarkerCache( google, map, {
            anchor: new google.maps.Point(8, 20),
            origin: new google.maps.Point(0, 0),
            scaledSize: new google.maps.Size(18, 18),
            size: new google.maps.Size(20, 20),
            url: dispatcher.urls.static + \"/images/airport_pin_40_blue.png\"
        }),

        selected: new MarkerCache( google, map, {
            anchor: new google.maps.Point(8, 20),
            origin: new google.maps.Point(0, 0),
            scaledSize: new google.maps.Size(18, 18),
            size: new google.maps.Size(20, 20),
            url: dispatcher.urls.static + \"/images/airport_pin_40_red.png\"
        }),

        route: new MarkerCache( google, map, {
            anchor: new google.maps.Point(8, 20),
            origin: new google.maps.Point(0, 0),
            scaledSize: new google.maps.Size(18, 18),
            size: new google.maps.Size(20, 20),
            url: dispatcher.urls.static + \"/images/airport_pin_40_yellow.png\"
        })
    };

    pinCache.airport.on('click', pinClickEvent);
    pinCache.selected.on('click', pinClickEvent);

    pinCache.airport.warmup(init_airport_density);
    pinCache.selected.warmup(10);
    pinCache.route.warmup(3);

    var boundsTimeout;

    google.maps.event.addListener(map, 'bounds_changed', function (evt) {
        updateBounds();
        currentZoom = map.getZoom();

        if (!boundsTimeout) {
            boundsTimeout = setTimeout(function() {
                boundsTimeout = null;

                update_static_pins(currentBounds);

                if (selected_aircraft !== null) {
                    var radius = tooltipRadius[currentZoom];
                    for (i = 0; i < polyPointCircles.length; i++) {
                        polyPointCircles[i].setRadius(radius);
                    }
                }
            }, 500);
        }
    });

    google.maps.event.addListener(map, 'projection_changed', function () {
        getCurrentProjection(map,true);
    });

    google.maps.event.addListenerOnce(map, 'projection_changed', function ()
    {
        window.moduleLoaded('map');

        if (init_goto_aircraft === 'selected') {
            goToAircraft(selected_aircraft, true);
        } else if (init_goto_aircraft === 'query_callsign' && !multi_select_mode) {
            goToAircraft(init_call);
        } else if (init_goto_aircraft === 'simple_callsign') {
            goToAircraft(init_call);
        }

        fetch_airport_list();
        executeFetchPlane();
    });

    if (simple_mode == false) {
        var ignoreZoom = false;

        google.maps.event.addListener(map, 'maptypeid_changed', function () {
            if (map_left_menu_view !== \"delayView\" && map.mapTypeId !== settingsService.syncGetSetting('map_type')) {
                settingsService.setSetting('map.type', map.mapTypeId);
            }
        });
    }

    google.maps.event.addListener(map, 'idle', function () {
        const centerCoordinates = map.getCenter();
        const maxAbsLatitude =  85.05115;
        const maxAbsLongitude = 180;

        if (follow_aircraft === 0 && !playback_mode) {
            fetch_plane_list(currentBounds);
        }

        if (Math.abs(centerCoordinates.lat()) > maxAbsLatitude ||
            Math.abs(centerCoordinates.lng()) > maxAbsLongitude) {
            const normalisedCenter = new google.maps.LatLng(centerCoordinates.lat(), centerCoordinates.lng(), false);
            map.setCenter(normalisedCenter);
        }
        historyReplaceState();
    });

    google.maps.event.addListener(map, 'dragstart', function () {
        animationPause();
        stopFetchPlane();
    });

    var dChangeTimer;
    google.maps.event.addListener(map, 'dragend', function () {
        isDragged = true;
        if (follow_aircraft == 1) {
            follow_aircraft = 0;
            $(\"li#follow-aircraft, #btn-aircraft-action-follow\").removeClass(\"active\");
        }

        if ($(\"body.mobile\").length) {
            checkSidebarState();
        }

        clearTimeout(dChangeTimer);
        dChangeTimer = setTimeout(function () {
            if (!playback_mode && settingsService.syncGetSetting(\"map.animate_aircraft\")) {
                animationPlay();
            }

            fr24getEventBus().emit('map.dragEnd');
        }, 100);
    });

    var zChangeTimer;
    google.maps.event.addListener(map, 'zoom_changed', function () {
        animationPause();
        stopFetchPlane();
        clearTimeout(zChangeTimer);
        clearTimeout(aInterval);
        if(window.navdataLayer && navdataLayer.layer) {
            navdataLayer.layer.setOpacity(0);
        }

        zChangeTimer = setTimeout(function () {
            if (settingsService.syncGetSetting(\"map.animate_aircraft\")) {
                animationPlay();
            }
            if (playback_play == 1) {
                if (selected_aircraft == null) {
                    remove_polylines();
                }

                fr24getEventBus().emit('map.zoomChanged');
            }

            if (follow_aircraft == 1) {
                setFetchPlaneTimer(1000);
            }
        }, 100);
    });

    if (dispatcher.userFeatures['map.timeout.mins'] != -1 && (typeof _initBlackout == 'undefined' || _initBlackout == true))
    {
        idleTimeout = setTimeout(exit_map, (parseInt(dispatcher.userFeatures['map.timeout.mins']) * 30 * 1000));
    }

    setTimeout(updateUserFeatures, (5 * 60 * 1000));

    $(\"div#preload-active\").addClass(\"aircraft_marker\").addClass(((init_aircraft_size == 'auto') ? 'normal' : init_aircraft_size)).addClass(\"active\");

    setTimeout(function () {
        if (typeof plane_list === 'undefined') {
            google.maps.event.trigger(map, 'projection_changed');
        }
    }, 3000);
}


function closeSearchAutocomplete() {
    $(\"#searchBox\").autocomplete('close');
}

function initializeSearchAutocomplete() {

    if(!document.getElementById(\"searchBox\")) {
        return false;
    }

    const handleInputBlur = function () {
        $(\"#searchBox\").blur();
    };

    $(\"#searchBox\").focus(function () {
        document.getElementById('map_canvas').addEventListener(\"touchstart\", handleInputBlur);

        if(dispatcher.display.isMobile) {
            $(\"#searchBox\").prop(\"placeholder\", \"Flight number, airport, route or reg.\");
        }
        clearTimeout(searchAnimTimeout);
    });

    $(\"#searchBox\").on('blur', function () {
        document.getElementById('map_canvas').removeEventListener(\"touchstart\", handleInputBlur);

        if(dispatcher.display.isMobile) {
            $(\"#searchBox\").prop(\"placeholder\", \"\");
        }
        searchAnimTimeout = setTimeout(function () {
            $('#searchBox').val('');
        }, 100);
    });

    // Init autocomplete for search
    var objSearchCache = {};
    var searchLiCounter = 0;
    var currentCat;

    var isModernLayout = parseBool(dispatcher.isModernView);
    var isMobile = parseBool(dispatcher.display.isMobile);
    // This is changed per FRWEB-3872 to be right aligned without an offset, keeping this here for future reference
    // var leftMargin = ($(window).width() < 860 && $(window).width() > 680) ? (860 - $(window).width()) : 0;
    var leftMargin = 0;

    var topOffset = 10;
    if(isModernLayout && isMobile) {
        topOffset = 5;
    }

    $(\"#searchBox\").autocomplete({
        appendTo: '#content-container',
        autoFocus: true,
        delay: 50,
        minLength: 3,
        position: {my: \"right top+\"+topOffset, at: \"right+\" + leftMargin + \" bottom\"},
        search: function (event, ui) {
            // close viewSelector if opened
            window.fr24getEventBus().emit('map.canvas.click');
            searchLiCounter = 0;
            currentCat = null;
            searchStats = {};
            clearTimeout(searchLoadingTimeout);
            searchLoadingTimeout = setTimeout(\"$('#searchBox').removeClass('ui-autocomplete-loading');\", 5000);
        },
        response: function (event, ui) {
            $(this).removeClass(\"ui-autocomplete-loading\");
            ui.content.push({\"type\": \"adv\", \"label\": \"Advanced search\", items: ui.content.length || 0});
        },
        select: function (event, ui) {
            if (!multi_select_mode) {
                labelHandler.deselect(selected_aircraft)
            }
            ui.item.value = ''
            if (supportsLocalStorage() && ui.item.type !== \"adv\") {
                var pastSearches = [];
                try {
                    pastSearches = JSON.parse(localStorage.pastSearches);
                    if (!Array.isArray(pastSearches)) {
                        throw \"Not an array.\";
                    }
                } catch (e) {
                    pastSearches = [];
                }

                var searchTerm = document.getElementById(\"searchBox\").value;
                if (~pastSearches.indexOf(searchTerm)) {
                    pastSearches.splice(pastSearches.indexOf(searchTerm), 1);
                }

                pastSearches.push(searchTerm);
                pastSearches.splice(0, pastSearches.length - 5); // keep only the last 5
                localStorage.pastSearches = JSON.stringify(pastSearches);
            }
            switch (ui.item.type) {
                case 'live':
                    if (multi_select_mode) {
                        if(!window.multiViewPanels.queue.has(ui.item.id)) {
                            window.multiViewPanels.add(ui.item.id, true, false);
                        }
                        return;
                    }
                    if (goToWasHovered == true) {
                        if (typeof ui.item.detail.flight != \"undefined\") {
                            show_flight_info(ui.item.detail.flight);
                        } else if (typeof ui.item.detail.reg != \"undefined\") {
                            show_reg_info(ui.item.detail.reg);
                        } else {
                            goToAircraft(ui.item.id, true, false);
                        }
                    } else {
                        goToAircraft(ui.item.id, true, false);
                    }
                    break;
                case 'schedule':
                    show_flight_info(ui.item.id);
                    break;
                case 'aircraft':
                    show_reg_info(ui.item.id);
                    break;
                case 'airport':
                    if (multi_select_mode && window.multiViewPanels.queue.has(ui.item.id)) {
                        return;
                    }
                    show_airport_info(ui.item.id, null, true);
                    break;
                case 'operator':
                    document.location.href = \"/data/airlines/\" + ((ui.item.detail.iata) ? ui.item.detail.iata.toLowerCase() + \"-\" : \"\") + ui.item.id.toLowerCase();
                    break;
            }

            if (selected_aircraft != ui.item.id) {
                if (follow_aircraft == 1) {
                    follow_aircraft = 0;
                    $(\"li#follow-aircraft\").removeClass(\"active\");
                }
            }

            $(this).blur();
            window.fr24getEventBus().emit('search.blur');
        },
        source: function (request, response) {
            var term = request.term.trim().toLowerCase();
            if (term.length < 3) {
                return;
            }

            var limit = 13;
            var height = $(window).height();
            var itemHeight = 62;
            var layoutOffset = dispatcher.display.isMobile ? 140 : 260;

            limit = Math.floor((height - layoutOffset) / itemHeight);

            const searchApi = window.searchApi;
            searchApi.find({'query': term, 'limit': limit}).then(
                function (data) {
                    searchStats = data.stats;
                    response(data.results);
                }
            );
        },
        focus: function (event, ui) {
            return false;
        },
        blur: function (event, ui) {
            $(this).blur();
            window.fr24getEventBus().emit('search.blur');
            return true;
        },
        open: function (event, ui) {
            if (override_filters()) {
                removeShowAllMsg();
            }

            $(\"body\").addClass(\"show-search-overlay\");
            $(this).removeClass(\"ui-autocomplete-loading\");

            goToWasHovered = false;

            if (dispatcher.display.isMobile) {
                $(\"#fr24_ViewsToolbar\").hide();
            }
        },
        close: function (event, ui) {
            $(\"body\").removeClass(\"show-search-overlay\");
            $(this).removeClass(\"ui-autocomplete-loading\");

            goToWasHovered = false;
            if (dispatcher.display.isMobile) {
                $(\"#fr24_ViewsToolbar\").show();
            }
        }
    }).data(\"ui-autocomplete\")._renderItem = function (ul, item) {
        var buttonsHtml = '',
            term = $(\"#searchBox\").val().replace(/[^\\'\\.\\-0-9A-Za-z ]/g, ''),
            re;

        if (term.charAt(2) !== '-') {
            term = term.substr(0, 2) + '-' + term.substr(2);
        }
        re = new RegExp(term.replace(/([-.'])/g, '\\\\$1?'), \"gi\");

        item.resultLabel = item.label;
        if (item.type !== 'airport' && item.type !== 'operator') {
            item.resultLabel = item.resultLabel.replace(/^(.*-> )?([^/\\($]+)( \\/| \\(|$)/, '$1<span class=\"first\">$2</span>$3');
        }

        item.resultLabel = item.resultLabel.replace(re, \"<span class=\\\"match\\\">$&</span>\");

        if (typeof item.detail != \"undefined\" && typeof item.detail.route != \"undefined\") {
            if (isModernLayout) {
                item.detail.route = item.detail.route.replace('⟶', '&#8212'); // Em dash
            }
            item.resultLabel += '</span><span class=\"route\">' + item.detail.route;
        }

        if (item.type === 'adv') {
            if (item.items === 0) {
                return $(\"<li></li>\").append('<p class=\"autocomplete-no-data\">No matches found. Try checking the spelling,<br> type a new search or go to <a href=\"/data\">Advanced search</a></p>').appendTo(ul);
            }

            return $(\"<li class='advsearch'></li>\").append(\"<span onclick=\\\"document.location.href = '/data/';\\\">Advanced search</span><a style=\\\"display:none;\\\"></a>\").appendTo(ul);
        }

        if(['airport','operator'].indexOf(item.type) !== -1) {
            item.resultLabel = item.resultLabel.replace('(', '<span class=\"small\">');
            item.resultLabel = item.resultLabel.replace(')', '</span>');
        }

        var iconInfo = '#icon-fr24-info-boarder';
        var iconLive = '#icon-fr24-plane-boarder';
        if (isModernLayout) {
            iconInfo = '#icon-fr24-info-round';
            iconLive = '#icon-fr24-flight-live';
        }
        if (item.type === 'airport') {
            buttonsHtml = '<span class=\"rowButton departures\" data-iata=\"' + item.id + '\" title=\"Departures\"><svg><use xlink:href=\"#icon-fr24-departure\" /></svg></span>'
                        + '<span class=\"rowButton arrivals\" data-iata=\"' + item.id + '\" title=\"Arrivals\"><svg><use xlink:href=\"#icon-fr24-arrival\" /></svg></span>'
                        + '<span class=\"rowButton onground\" data-iata=\"' + item.id + '\" title=\"On ground\"><svg><use xlink:href=\"#icon-fr24-onground\" /></svg></span>';
        } else if (item.type === 'live') {
            buttonsHtml = '<span class=\"rowButton goto\" title=\"Go to flight\"><svg><use xlink:href=\"'+iconLive+'\" /></svg></span>'
                        + '<span class=\"rowButton info\" title=\"View flight info\"><svg><use xlink:href=\"'+iconInfo+'\" /></svg></span>';
        } else if (item.type === 'schedule') {
            buttonsHtml = '<span class=\"rowButton schedule\" title=\"View flight info\"><svg><use xlink:href=\"'+iconInfo+'\" /></svg></span>';
        }

        if (item.type != currentCat) {
            var label = '';

            switch (item.type) {
                case 'live':
                    label = 'Live flights';
                    break;
                case 'schedule':
                    label = 'Recent or scheduled flights';
                    break;
                case 'airport':
                    label = 'Airports';
                    break;
                case 'aircraft':
                    label = 'Aircraft';
                    break;
                case 'operator':
                    label = 'Airlines';
                    break;
            }

            if (label !== '') {
                $(\"<li class='sep'>\" + label + \"<div>\" + searchStats.count[item.type] + \" of \" + searchStats.total[item.type] + \" matches</div></li>\").appendTo(ul);
            }
        }

        currentCat = item.type;

        let img = '';
        const inlineStyleObject = {
            'background-image': 'none',
            'background-position': 'none',
            'background-repeat': 'no-repeat',
            'background-size': '6rem',
        };

        if (item.type === \"airport\") {
            img = \"<svg class='\" + item.type + \"'><use xlink:href='#icon-fr24-\" + item.type + \"' /></svg>\";
        } else if (typeof item.detail != \"undefined\" && typeof item.detail.logo != \"undefined\") {
            const img_parts = item.detail.logo.split(':');

            if (img_parts.length === 2) {
                const image_uri = img_parts[0] === 'fr24'
                    ? dispatcher.urls.static + dispatcher.urls.operators + \"/\" + img_parts[1]
                    : img_parts[0] === 's3'
                        ? '//cdn.flightradar24.com/assets/airlines/logotypes/' + img_parts[1]
                        : ''

                inlineStyleObject['background-image'] = 'url(\\'' + image_uri + '\\')'
                inlineStyleObject['background-position'] = 'center'
            }
        } else {
            inlineStyleObject['background-image'] = 'url(\\'' + dispatcher.urls.static + dispatcher.urls.operators + '/default.png\\')';
            inlineStyleObject['background-position'] = 'center'
            inlineStyleObject['background-size'] = '3rem'
        }

        const styleAttribute = Object.keys(inlineStyleObject)
            .reduce(function(styleString, key) {
                return styleString + key + \":\" + inlineStyleObject[key] + \";\"
            }, '')

        return $(\"<li class='\" + (searchLiCounter % 2 == 0 ? \"\" : \"odd\") + \"'></li>\")
            .append(\"<a class=\\\"\" + item.type + \"\\\"><span class=\\\"rowIcon\\\" style=\\\"\" + styleAttribute + \"\\\">\" + img + \"</span><span class=\\\"label \" + item.type + \"\\\">\" + item.resultLabel + \"</span><br class=\\\"clear\\\" /></a><div class='rowButtons'>\" + buttonsHtml + \"</div>\")
            .appendTo(ul);
    };


    var openSearchHistory = function (e) {
        if (!supportsLocalStorage()) {
            return;
        }

        if (document.getElementById(\"searchHistory\")) {
            // Already opened
            return;
        }


        if (!$('body').hasClass('show-search-overlay')) {
            $('body').addClass('show-search-overlay');
        }

        var pastSearches = [];
        try {
            pastSearches = JSON.parse(localStorage.pastSearches);
            if (!Array.isArray(pastSearches)) {
                throw \"Not an array.\";
            }
        } catch (e) {
            pastSearches = [];
        }

        if (pastSearches.length === 0) {
            return;
        }

        var resultEl = document.createElement(\"div\");
        resultEl.setAttribute(\"id\", \"searchHistory\");

        var titleEl = document.createElement(\"div\");
        titleEl.setAttribute(\"id\", \"searchHistory_title\");
        titleEl.innerText = \"Search history\";

        var clearEl = document.createElement(\"div\");
        clearEl.setAttribute(\"id\", \"searchHistory_clear\");
        clearEl.innerText = \"Clear\";
        clearEl.addEventListener(\"click\", function (e) {
            closeSearchHistory();
            localStorage.removeItem(\"pastSearches\");
        });

        titleEl.appendChild(clearEl);
        resultEl.appendChild(titleEl);
        pastSearches.reverse();
        var isModernLayout = parseBool(dispatcher.isModernView);
        var icon = isModernLayout ? '<svg><use xlink:href=\"#icon-fr24-search\"/></svg>': '';
        for (var i = 0; i < pastSearches.length; i++) {
            var pastSearch = pastSearches[i];
            var pastSearchEl = document.createElement(\"div\");
            pastSearchEl.setAttribute(\"class\", \"pastSearch\");
            pastSearchEl.innerHTML = icon + pastSearch;
            (function (pastSearch, pastSearchEl) {
                pastSearchEl.addEventListener(\"click\", function (e) {
                    document.getElementById(\"searchBox\").value = pastSearch;
                    $(\"#searchBox\").autocomplete(\"search\");
                    document.getElementById(\"searchBox\").focus();
                    closeSearchHistory();
                });
            })(pastSearch, pastSearchEl);
            resultEl.appendChild(pastSearchEl);
        }

        document.getElementById(\"fr24_SearchContainer\").appendChild(resultEl);
    };

    var closeSearchHistory = function (e) {
        var resultEl = document.getElementById(\"searchHistory\");
        if (resultEl) {
            resultEl.parentNode.removeChild(resultEl);
        }
        window.fr24getEventBus().emit('search.closed');
        $('body').removeClass('show-search-overlay');
    };

    document.getElementById(\"searchBox\").addEventListener(\"keydown\", closeSearchHistory);
    document.getElementById(\"searchBox\").addEventListener(\"click\", function (e) {
        window.fr24getEventBus().emit('search.selected');
        if (e.target.value.trim() === \"\") {
            openSearchHistory();
        }
    });

    document.body.addEventListener(\"click\", function (e) {
        var searchBox = document.getElementById('searchBox');
        var searchHistory = document.getElementById('searchHistory');
        var isPartOfSearch = (searchBox && searchBox.contains(e.target))
            || (searchBox && searchBox.isSameNode(e.target))
            || (searchHistory && searchHistory.contains(e.target))
            || (searchHistory && searchHistory.isSameNode(e.target));

        if (!isPartOfSearch && $('body').hasClass('show-search-overlay')) {
            closeSearchHistory(e);
        }
    });
}


function pointToLatLng(point) {
    if (!getCurrentProjection(map)) {
        return null;
    }
    var topRight = getCurrentProjection(map).fromLatLngToPoint(currentBounds.ne);
    var bottomLeft = getCurrentProjection(map).fromLatLngToPoint(currentBounds.sw);
    var scale = Math.pow(2, currentZoom);
    var worldPoint = new google.maps.Point(point.x / scale + bottomLeft.x, point.y / scale + topRight.y);
    return getCurrentProjection(map).fromPointToLatLng(worldPoint);
}

function getAvailableBound(view) {
    var se = pointToLatLng(new google.maps.Point($(\"#\" + view).outerWidth(), $(window).outerHeight()));
    var ne = pointToLatLng(new google.maps.Point($(window).outerWidth(), 0));
    var bounds = new google.maps.LatLngBounds(se, ne);

    return bounds;
}




function fetch_airport_list(isRetry)
{
    if (!nav_list.airport.length) // If airport array is empty, get it!
    {
        let airportList = settingsService.syncGetSetting('airport.list');
        let airportListUpdated = settingsService.syncGetSetting('airport.list.update');
        let version = 0;

        if (airportListUpdated) {
            version = parseInt(airportListUpdated);
        }

        // if older then 2 days
        if (version < (new Date().getTime() - 172800000) || version < 1462793230943) {
            version = 0;
        }

        // if missing city or country: gets the first item in the cache and checks if it has less than 8 values (8th is city, 9th country)
        const airportListValues = (airportList && Object.values(airportList)) || [];
        if (airportListValues.length && airportListValues[0].length < 9) {
            version = 0;
        }

        if (version < (new Date().getTime() - 86400000)) {
            const airportsApi = window.airportsApi;
            airportsApi.list({version: version}).then(function (data) {
                if (supportsLocalStorage() !== false)
                {
                    if (data.isUpToDate !== undefined && data.isUpToDate === true)
                    {
                        cb_airport_list(airportList);

                    } else {
                        settingsService.setSetting('airport.list', data);
                        settingsService.setSetting('airport.list.update', new Date().getTime());
                        cb_airport_list(data);
                    }
                } else {
                    cb_airport_list(data);
                }
                const eventBus = window.fr24getEventBus();
                eventBus.emit('airports.list.updated');
                return true;
            });
        } else {
            try {
                cb_airport_list(airportList);
            } catch (ex) {
                if (supportsLocalStorage()) {
                    settingsService.clearSetting(\"airport.list\");
                    settingsService.clearSetting(\"airport.list.update\");
                }
                if (!isRetry) { //Prevent infinite loop
                    fetch_airport_list(true);
                }
            }
        }
    }
    return true;
}

function cb_airport_list(data) {
    nav_list.airport = [];

    let airport;

    for (var i in data) {
        airport = {
            'id': data[i][0],
            'lat': data[i][3],
            'lng': data[i][4],
            'icao': data[i][1],
            'pos': new google.maps.LatLng(data[i][3], data[i][4]),
            'title': data[i][2] + ' (' + data[i][1] + '/' + data[i][0] + ')',
            'size': data[i][6]
        };

        nav_list.airport.push(airport);

        airport_index.set(airport.id, airport);
        airport_index.set(airport.icao, airport);

        if (query_airport != \"\" && airport.icao == query_airport) { // Airport is in query
            query_airport = \"\";
            geolocation_move = false;
            map.setCenter(new google.maps.LatLng(airport.lat, airport.lng));
            map.setZoom(10);
        }
    }

    // Sort airports by size
    nav_list.airport.sort(function (a, b) {
        return b.size - a.size;
    });

    if (!currentBounds) {
        updateBounds();
    }
    update_static_pins(currentBounds);

    query_airport = \"\"; // Reset
    query_airportInfo = 0;
}
function stopFetchPlane() {
    clearTimeout(fetchInterval);
}
function executeFetchPlane() {
    stopFetchPlane();
    fetch_plane_list();
}

function setFetchPlaneTimer(timeout, queuedRequest) {
    var timeout = timeout ? timeout : refresh_rate;
    var queuedRequest = queuedRequest ? queuedRequest : false;

    stopFetchPlane();
    fetchInterval = setTimeout(function() {
        fetch_plane_list(queuedRequest);
    }, timeout);
}

function fetchPlaneList(bQueuedRequest) {
    // if (initialRequest) {
    //     window.fetch_plane_list = window.FR24Utils.debounce(fetchPlaneList, window.dispatcher.isPremium ? 500 : 5000);
    //     initialRequest = false;
    // }
    var mapLoaded = map && map.constructor === google.maps.Map;
    // Making sure we don't send requests after session timeout or feed has paused
    if (pauseFeed || map_delays_mode === true || $(\"#disable-page-text\").is(\":visible\") === true || typeof map === 'undefined' || !mapLoaded || $('#mapDynamicOverlays').children(':visible').length > 0) {
        return true;
    }

    var projection = typeof mapCanvasStub != \"undefined\" && typeof mapCanvasStub.getProjection == \"function\" ? mapCanvasStub.getProjection() : \"undefined\";
    if (typeof projection === \"undefined\" || typeof currentBounds === \"undefined\") {
        setFetchPlaneTimer(500);
        return false;
    }

    var boolOverrideFilters = override_filters();
    let endPointParams = {
        bounds: getBoundsRequestValue(),
        faa: window.faa_traffic == 1 || boolOverrideFilters ? 1 : 0,
        satellite: window.fsat_traffic == 1 || boolOverrideFilters ? 1 : 0,
        mlat: window.mlat_traffic == 1 || boolOverrideFilters ? 1 : 0,
        flarm: window.flarm_traffic == 1 || boolOverrideFilters ? 1 : 0,
        adsb: window.adsb_traffic == 1 || boolOverrideFilters ? 1 : 0,
        gnd: window.ground_traffic ==1 ? 1 : 0,
        air: window.airborn_traffic === 1 ? 1 : 0,
        vehicles: window.vehicular_traffic === 1 ? 1 : 0,
        gliders: window.glider_traffic === 1 ? 1 :0,
        stats: 1
    };

    if (boolOverrideFilters) {
        endPointParams = Object.assign(endPointParams, {estimated: 1, maxage: 14400});
    } else if (window.estimated_traffic > 0) {
        endPointParams = Object.assign(endPointParams, {estimated: 1, maxage: window.estimated_traffic * 60});
    } else {
        endPointParams = Object.assign(endPointParams, {estimated: 0, maxage: 0});
    }

    if ((window.selected_aircraft !== null) || window.multiViewPanels.queue.hasFlights()) {
        const selected = window.multiViewPanels.queue.hasFlights() ? window.multiViewPanels.queue.getFlightPanelsAsString() : window.selected_aircraft;
        endPointParams = Object.assign(endPointParams, {selected: selected, ems: 1});
    }
    if (window.cookie_enc) {
        endPointParams = Object.assign(endPointParams, {enc: window.cookie_enc})
    }

    if (window.selected_airline !== null) {
        endPointParams = Object.assign(endPointParams, {airline: window.selected_airline});
    }

    var buildFilterParams = build_filter_params();
    if (feed_state === 'init' && init_call) {
        endPointParams= Object.assign(endPointParams, {filterInfo: 1});
    }

    if (playback_mode && playback_fetch_time != 0) {
        Object.assign(endPointParams, {history: Math.floor(playback_fetch_time.getTime() / 1000)});
    }

    endPointParams = Object.assign(endPointParams, {pk: getPublicKey() ? getPublicKey() : null });
    const planeFeedApi = window.planeFeedApi;
    planeFeedApi.list(endPointParams, buildFilterParams, feed_request_method)
    .then(function(response){
        feed_state = 'active';
        response.json().then(function(data) {
            fetchPlainListFailCount = 0;
            if(playback_mode === 1 && data['selected-aircraft']){
                updateSelectedPlaneProperties(data['selected-aircraft']);
            }else{
                pd_callback(data);
            }
        });
    })
    .catch(function(response) {
        fetchPlainListFailCount++;
        var timeout = fetchPlainListFailCount * 2000;
        if (timeout > refresh_rate) {
            timeout = refresh_rate
        }
        if (response.statusText === 'parsererror' && feed_state !== 'error') {
            feed_state = 'error';
        } else {
            if (feed_state === 'init') {
                feed_request_method = 'jsonp';
                feed_state = 'active';
            }
        }
        setFetchPlaneTimer(timeout);
    });
}

function setEms(selectedPlaneData) {

    selected_data_ems.ems = selectedPlaneData.ems;
    selected_data_ems.aircraft = selected_aircraft;
    selected_data_ems.availability = (typeof (selectedPlaneData['available-ems']) !== 'undefined') ? Object.keys(selectedPlaneData['available-ems']) : [];
    selected_data_ems.airspace = selectedPlaneData.airspace ? selectedPlaneData.airspace : 'N/A';

}

function updateSelectedPlaneProperties(selectedPlaneData) {

    setEms(selectedPlaneData);

    window.flightInfoHandler.setupBasicData(selected_aircraft);

    if (!multi_select_mode && selected_aircraft !== 'NULL' && init_call == 0 && waiting_for_data == false) {
        var active = (force_init_call === 1) ? 0 : 1;
        show_aircraft_data(selected_aircraft, active);// Update flight data if a flight is selected
    }
}

function pd_callback(data) {
    plane_list_old = $.extend(true, {}, plane_list_org); // Copy last original feed to _old
    planes_total = data.full_count;
    var queue_redraw = refresh_rate;
    const selectedAircraft = selected_aircraft && selected_aircraft !== null && selected_aircraft !== null ? selected_aircraft : null;

    if (typeof (data.stats) !== 'undefined') {
        window.fr24getEventBus().emit('aircraft.stats.updated', data.stats);
    }

    feed_error = 0; // Reset the error counter

    if (playback_mode == 0) { // Make sure we are live
        if (init_call === 1
            && data.selected
            && data.selected[selected_aircraft]
            && data.selected[selected_aircraft]['matched-filter'] === false) {

            window.filtersHandler.setShowAll(true);
            displayShowAllMsg();
            queue_redraw = 0;
        }

        var hasEms = (typeof (data['selected-aircraft']) !== 'undefined' && data['selected-aircraft'] !== null);
        if (hasEms && selectedAircraft) {
            setEms(data['selected-aircraft']);
        }

        delete data.version;
        delete data.full_count;
        delete data.stats;
        delete data.selected;
        delete data['selected-aircraft'];
        delete data['selected-matched:'];

        plane_list = {};

        Object.keys(data).sort(function (a, b) {
            return data[a][4] - data[b][4];
        }).forEach(function (item) {
            plane_list[item] = data[item];
        });

        if (selectedAircraft && typeof plane_list[selected_aircraft] === \"undefined\") {
            close_aircraft_data();
        }

        planes_showing = getLength(plane_list);  // minus full_count and version index

        plane_list_org = $.extend(true, {}, data); // Make a copy of the array. We now have two identical arrays, but we will not modify the _org one at all.

        if ($(\"#map_canvas\").length > 0 && mapCanvasStub.getProjection()) {
            update_planes(); // Call update_planes() if map is properly set up!
        }

        if (showRoute === 1 && !plane_list[selected_aircraft]) {
            showRoute = 0;
        }

        if (!multi_select_mode && selected_aircraft !== null && init_call == 0 && waiting_for_data == false) {
            var active = (force_init_call === 1) ? 0 : 1;
            show_aircraft_data(selected_aircraft, active);// Update flight data if a flight is selected
        }

        if (hasEms && selectedAircraft) {
            if (window.flightInfoHandler && !window.flightInfoHandler.isBasic && !window.flightInfoHandler.isSimple) {
                window.flightInfoHandler.setFlightDataExtendedProperties();
                window.flightInfoHandler.renderProperties();
            }
        }

        setFetchPlaneTimer(queue_redraw);
    }
}

function override_filters() {
    return window.filtersHandler.hasShowAll();
}

function build_filter_params() {
    var filtersEnabled = filtersHandler.isGlobalFilteringEnabled();

    var urlParams = {};
    var hasActiveFilters = window.filtersHandler.hasActiveFilters();

    var showAll = window.filtersHandler.hasShowAll();

    function add_single(sKey, sValue) {
        if (typeof urlParams[sKey] == \"undefined\") {
            urlParams[sKey] = sValue;

            return true;
        }

        return false;
    }

    function add_multi(sKey, sValue) {
        if (!add_single(sKey, sValue)) {
            urlParams[sKey] += ',' + sValue;

            return true;
        }

        return false;
    }

    var showAirline = window.fleetViewShowAirline;


    if ((!isFleetView() && !isAirportView()) || (isFleetView() && (!showAirline && hasActiveFilters))) {
        if (!showAll && filtersEnabled) {
            urlParams = window.filtersHandler.getUrlParams();
        }
    }

    var $viewObj = getCurrentView();
    if ($viewObj) {
        var view = null;
        switch (map_left_menu_view) {
            case 'airportView':
                var applyViewOnMap = fnParseBool(settingsService.syncGetSetting('view.airport.apply_on_map'));
                if(!applyViewOnMap) {
                    break;
                }
                var airport = settingsService.syncGetSetting('view.airport.selected');
                if(airport) {
                    var mode = settingsService.syncGetSetting('view.airport.mode'),
                        key = 'airport';
                    switch(mode) {
                        case 'both': key = 'airport'; break;
                        case 'arrivals': key = 'to'; break;
                        case 'departures': key = 'from'; break;
                    }
                    add_single(key, airport.toUpperCase());
                }
                var fleet = settingsService.syncGetSetting(\"airportViewFleet\");
                if(fleet && fleet !== '') {
                    add_single('fleets', fleet.toLowerCase());
                }
                break;
            case \"fleetView\":
            case \"fleetViewCustom\":
            case \"fleetViewAirline\":
                const showFleet = ($('#fleetViewShowOnlyFleet.on').length > 0);
                const showAirline = ($('#fleetViewShowOnlyAirline.on').length > 0);
                const fleetViewSettings = settingsService.syncGetSetting(\"view.fleet.airline\");
                if ((!showFleet && !showAirline) || !fleetViewSettings) {
                    break;
                }

                if (showFleet && fleetViewSettings.fleet) {
                    let fleet = [];
                    const fleetSetting = fleetViewSettings.fleet.split(',')
                    Object.keys(fleetSetting).forEach(function (index) {
                        var elem = fleetSetting[index];
                        if (index >= 5) {
                            return false;
                        }
                        fleet.push(elem);
                    });

                    fleet = fleet.join(',');
                    if (fleet) {
                        add_single('fleets', fleet.toLowerCase());
                    }
                }

                if (showAirline && fleetViewSettings.airline) {
                    let airline = [];
                    const fleetAirlineSetting = fleetViewSettings.airline.split(',');
                    Object.keys(fleetAirlineSetting).forEach(function (index) {
                        var elem = fleetAirlineSetting[index];
                        if (index >= 5) {
                            return false;
                        }
                        airline.push(elem);
                    });

                    airline = airline.join(',');
                    if (airline) {
                        add_single('airline', airline.toUpperCase());
                    }
                }
                break;
        }
    }

    return $.param(urlParams).replace(/\\%2C/gi, \",\");
}


function check_filter(index, elem) {
    var alt_match = 0;
    var alt_filter = 0;
    var speed_match = 0;
    var speed_filter = 0;

    // filters are disabled - show all
    if (window.filtersHandler.getActiveFiltersCount() === 0) {
        return true;
    }

    var filters = window.filtersHandler.getFilters();
    for (var i = 0; i <= filters.length - 1; i++) { // Loop all filters in the array \"filters\"
        if(!filters[i].enabled) {
            continue;
        }
        switch (filters[i].type) { // Which kind of filter do we have here?
            case \"altitude\":
                alt_filter = 1; // Same same, but altitude.
                if (parseInt(elem[4]) >= parseInt(filters[i].values[0]) && parseInt(elem[4]) <= parseInt(filters[i].values[1])) {
                    alt_match = 1;
                }
                break;
            case \"speed\":
                speed_filter = 1;
                if (parseInt(elem[5]) >= parseInt(filters[i].values[0]) && parseInt(elem[5]) <= parseInt(filters[i].values[1])) {
                    speed_match = 1;
                }
                break;
        }
    }

    if (alt_filter === 1 && alt_match === 0) { // and so on...
        return false;
    } else if (speed_filter === 1 && speed_match === 0) {
        return false;
    } else { // Flight seem to have passed all filters
        return true; // Yay!
    }
}

var activeMapPins = {
    'airport': new Set(),
    'route': new Set()
};

var pinMapping = new WeakMap();


function pinClickEvent() {
    if(simple_mode == true) {
        return false;
    }

    if (!window.airportInfoHandler) {
        window.airportInfoHandler = new window.AirportInfoHandler();
    }

    var clickedAirport = pinMapping.get(this);

    var currentAirport = window.airportInfoHandler.getIata();

    if(dispatcher.performanceMonitoring &&  window.firebasePerf) {
        traceAirportPanelOpen = window.firebasePerf.trace(\"openAirportInfoPanel\");
        traceAirportPanelOpen.putAttribute(\"subscriptionType\", dispatcher.userSubscription);
        traceAirportPanelOpen.start();
    }

    var shouldShowAirportData = clickedAirport && (!currentAirport || currentAirport.toUpperCase() !== clickedAirport.id);

    if (shouldShowAirportData) {
        show_airport_info(clickedAirport.icao);
        return
    }

    hide_airport_info();
    return

}

function renderMapPins( type, bounds, limit) {
    if (!bounds) {
        return false;
    }

    var visiblePins = 0;
    var activeList = new Set();
    limit = limit !== undefined ? limit : 999999999;

    const latitudeCheck = function(latitude, bounds) {
        return bounds.north >= latitude && bounds.south <= latitude;
    }

    const longitudeStdCheck = function(longitude, bounds) {
        return bounds.east >= longitude && bounds.west <= longitude;
    }

    // Split area for two chunks ( W...180 || -180...E ) and longitude should be contained in one of them
    const longitudeReverseAreaCheck = function(longitude, bounds) {
        return (bounds.west <= longitude && longitude <= 180)
            ||
            (-180 <= longitude && longitude <= bounds.east)
    }

    let reverseArea = false;
    if (bounds.west > 0 &&  bounds.east < 0) {
        // fix for New Zealand area where east takes negative values
        reverseArea = true;
    }

    nav_list[type].forEach(function( currentItem ) {
        if ( visiblePins < limit ) {
            if (latitudeCheck(currentItem.lat, bounds) &&
                (
                    longitudeStdCheck(currentItem.lng, bounds) ||
                    (reverseArea && longitudeReverseAreaCheck(currentItem.lng, bounds))
                )
            ) {
                visiblePins++;
                activeList.add(currentItem);
            }
        } else {
            return false;
        }
    });

    activeMapPins[type].forEach(function( currentItem ) {
        var detail = pinMapping.get(currentItem);
        if (!activeList.has(detail)) {
            pinMapping.delete(detail);
            pinMapping.delete(currentItem);
            pinCache[type].release(currentItem);
            activeMapPins[type].delete(currentItem);
        }
    });

    activeList.forEach(function( currentItem ) {
        if (!pinMapping.has(currentItem)) {
            var marker = pinCache[type].fetch({
                position: currentItem.pos,
                title: currentItem.title,
                zIndex: google.maps.Marker.MAX_ZINDEX + 90000 + currentItem.size
            });

            activeMapPins[type].add(marker);

            pinMapping.set(marker, currentItem);
            pinMapping.set(currentItem, marker);
        }

    });

    activeMapPins[type].forEach(function( currentItem ) {
        if (currentItem.getVisible() === false) {
            currentItem.setVisible(true);
        }
    });

}

function clearMapPins(type) {
    activeMapPins[type].forEach(function( currentItem ) {
        var detail = pinMapping.get(currentItem);

        pinMapping.delete(detail);
        pinMapping.delete(currentItem);
        pinCache[type].release(currentItem);
        activeMapPins[type].delete(currentItem);
    });
}



function update_static_pins(bounds) {
    if (map_left_menu_view === 'delayView') {
        return false;
    }

    if (init_airports >= 1 || init_vor == 1 || init_ndb == 1 || showRoute == 1) { // but just if the user want it

        var bounds = (bounds ? bounds : currentBounds);
        var maxVisibilePins;

        if (init_airports != 0) {
            if (init_airports == 1) {
                if (dispatcher.display.displayMode === 'mobile') {
                    maxVisibilePins = Math.min(init_airport_density, document.body.clientWidth / 10);
                } else {
                    maxVisibilePins = init_airport_density;
                }
            }

            renderMapPins('airport', bounds, maxVisibilePins);
        }


        if (showRoute == 1 && selected_aircraft != null) {
            var flight = plane_list[selected_aircraft];
            var origin = airport_index.get(flight[11]);
            var dest = airport_index.get(flight[12]);
            var real = null;

            if (selected_data[selected_aircraft] && selected_data[selected_aircraft].airport && selected_data[selected_aircraft].airport.real && selected_data[selected_aircraft].airport.real.code) {
                real = airport_index.get(selected_data[selected_aircraft].airport.real.code.iata);
            }

            nav_list.route = [];

            if (origin) {
                origin = jQuery.extend({}, origin);
                origin.marker = null;

                nav_list.route.push(origin);
            }

            if (dest) {
                dest = jQuery.extend({}, dest);
                dest.marker = null;

                nav_list.route.push(dest);
            }

            if (real) {
                real = jQuery.extend({}, real);
                real.marker = null;

                nav_list.route.push(real);
            }

            renderMapPins('route', bounds);
        } else {
            clearMapPins('route');
        }
    }

}

function markerMouseOverEvent() {
    var ac = plane_details.get(this);

    this.setIcon(
        get_sprite(
            ac.aircraft_type,
            ac.aircraft_track,
            true,
            ac.squawk,
            ac.radar
        )
    );

    labelHandler.select(ac.aircraft_id); // And add label
    current_hover = ac.aircraft_id; // also, put the callsign in current_hover
}

function markerMouseOutEvent() {
    var ac = plane_details.get(this);

    if (ac.aircraft_id != selected_aircraft && !window.multiViewPanels.queue.has(ac.aircraft_id)) { // If the aircraft is NOT selected
        this.setIcon(
            get_sprite(
                ac.aircraft_type,
                ac.aircraft_track,
                false,
                ac.squawk,
                ac.radar
            )
        );

        labelHandler.deselect(ac.aircraft_id, window.show_labels);
    }

    current_hover = ''; // We are not hovering it anymore
}

function markerClickEvent() {
    var ac = plane_details.get(this);
    var index = ac.aircraft_id;
    var onChangeAircraft = window.onChangeAircraft;
    window.fr24getEventBus().emit('map.flight.selected', null);

    if (typeof onChangeAircraft === \"function\") {
        onChangeAircraft();
    }

    if (multi_select_mode) {
        window.multiViewPanels.add(index);
        const payload = playback_mode ?  {
            flightId: window.multiViewPanels.queue.getAll()
        } :  {
            callsign: plane_list[index][16],
            flightId: index
        }
        window.fr24getEventBus().emit('map.selection.add', payload);
        return;
    }

    if (index !== selected_aircraft) { // If the plane is not selected
        var oldAircraftDetails = plane_details.get(planes_array[selected_aircraft]);

        labelHandler.select(index);
        labelHandler.deselect(selected_aircraft);

        // ensure that previously selected plane is no longer highlighted
        if (planes_array[selected_aircraft] && oldAircraftDetails) {
            planes_array[selected_aircraft].setIcon(
                get_sprite(
                    oldAircraftDetails.aircraft_type,
                    oldAircraftDetails.aircraft_track,
                    false,
                    oldAircraftDetails.squawk,
                    oldAircraftDetails.radar
                )
            );
        }

        // highlight the newly selected plane
        this.setIcon(
            get_sprite(
                ac.aircraft_type,
                ac.aircraft_track,
                true,
                ac.squawk,
                ac.radar
            )
        );

        selectAircraft(index);

        polylines_fake[index] = [];
        polylines_fake_index[index] = [];
        polylines[index] = [];
        polylines_index[index] = [];

        if(dispatcher.performanceMonitoring &&  window.firebasePerf) {
            traceFlightInfoOpen = window.firebasePerf.trace(\"openFlightInfoPanel\");
            traceFlightInfoOpen.putAttribute(\"subscriptionType\", dispatcher.userSubscription);
            traceFlightInfoOpen.start();
        }

        var globalEventBus = window.fr24getEventBus()

        globalEventBus.emit('map.selection.add', {
            callsign: plane_list[index][16],
            flightId: index
        });

        globalEventBus.emit('map.selectedAircraftUpdated', { aircraft: selected_aircraft });

        show_aircraft_data(index); // and show data of this plane

    } else { // If the plane IS selected
        close_aircraft_data(); // Close aircraft data
    }
}

function createMarkers(index, pCount) { // Loop all the planes in our plane list (the feed-filtered out planes)
    var elem = plane_list[index];
    var selectedIcon = false;

    if (showRoute === 1 && plane_list[selected_aircraft] && index !== selected_aircraft) { // If showRoute is enabled only add selected aircraft to map
        return true;
    }

    if (hideOthers === 1 && plane_list[selected_aircraft] && index !== selected_aircraft) { // If hide other aircraft is enabled, in flight info, only add selected aircraft to map
        return true;
    }

    var isInMultiSelect = window.multiViewPanels.queue.has(index);
    if (multi_select_mode && showMultiSelectRoute && !isInMultiSelect) {
        return true;
    }

    if (!elem) {
        return true;
    }

    var pos = new google.maps.LatLng(elem[1], elem[2]);

    if (simple_mode == true && query_reg != '' && (elem[9] == query_reg || elem[9].replace('-', '') == query_reg.replace('-', ''))) {
        show_aircraft_data(index);
        query_reg = '';

        if (simple_mode == 1 && query_z && init_zoom) {
            map.setZoom(init_zoom);
        } else {
            map.setZoom(8);
        }

        if (init_follow == 1) {
            if (!isAirportView()) {
                if (isMapPannable()) {
                    map.panToOffsetted(pos);
                } else {
                    map.setCenter(pos);
                }
            }
        }
    }

    if (index == selected_aircraft || index == current_hover || isInMultiSelect) { // If the plane is selected, or we are currently hovering it
        selectedIcon = true;
    }
    if (planes_array[index]) { // If the plane is already on the map (in planes_array) we should update its position

        var currentMarker = planes_array[index];
        var currentPosition = currentMarker.getPosition();

        if (elem[1] != currentPosition.lat() || elem[2] != currentPosition.lng()) { // If the position has changed. May be deprecated!

            var ac = plane_details.get(currentMarker);
            var updateZIndex = false;

            if (elem[4] !== ac.alt) {
                updateZIndex = true;
            }

            ac.aircraft_track = elem[3]; // Set the planes properties
            ac.alt = elem[4]; // Set the planes properties
            ac.aircraft_type = elem[8];
            ac.squawk = elem[6];
            ac.radar = elem[7];

            if (typeof (elem[16]) == 'undefined' || elem[16].length == 0) {
                ac.callsign = 'nocallsign_';
            } else {
                ac.callsign = elem[16];
            }

            var sprite = get_sprite(
                ac.aircraft_type,
                ac.aircraft_track,
                selectedIcon,
                ac.squawk,
                ac.radar
            );

            var currentSprite = currentMarker.icon;
            if (sprite.url !== currentSprite.url || sprite.origin.x !== currentSprite.origin.x || sprite.origin.y !== currentSprite.origin.y) {
                currentMarker.setIcon(sprite); // Update the icon of the plane with new data
            }

            if (updateZIndex) {
                currentMarker.setZIndex(google.maps.Marker.MAX_ZINDEX + ac.alt + pCount);
            }


            if (a_active == 0 || (playback_mode == 1 && playback_play == 0) || planes_snap_position === 1) {
                currentMarker.setPosition(pos);
                labelHandler.move(ac.aircraft_id, pos);
            }
        }

    } else {
        var overlay = markerCache.fetch({
            position: pos,
            icon: get_sprite(elem[8], elem[3], selectedIcon, elem[6], elem[7], elem[16]),
            zIndex: google.maps.Marker.MAX_ZINDEX + elem[4] + pCount//Math.round((elem[4] / 100) + 10)
        });

        plane_details.set(overlay, {
            aircraft_id: index,
            aircraft_track: elem[3],
            alt: elem[4], // And set its properties
            aircraft_type: elem[8],
            squawk: elem[6],
            radar: elem[7],
            callsign: ( typeof (elem[16]) == 'undefined' || elem[16].length == 0 ) ? 'nocallsign_' : elem[16]
        });

        if ( overlay.icon._framesNo > 1 ) {
            plane_animated_list.add(overlay);
        }

        planes_array[index] = overlay; // Add the overlay to our array
    }
}

var plane_list_length;

if ('ProcessQueue' in window) {
    planeRenderQueue = new ProcessQueue();
}

function update_planes(drag) {
    if (multi_select_mode && showMultiSelectRoute) {
        delete_all_planes();
    }

    delete_planes(plane_list);

    if (plane_list) { // If we have a list of planes
        // Add the planes

        if (playback_mode == 0) {
            planes_array_fake = {}; // Clear fake array
        }

        plane_list_length = getLength(plane_list);

        planeRenderQueue.clear();

        planeRenderQueue.addTasks(Object.keys(plane_list));
        planeRenderQueue.on('finish', function() {
            for (var updIndex in planes_array) {
                if (!planes_array[updIndex].getVisible()) {
                    planes_array[updIndex].setVisible(true);
                }
            }

            if (plane_animated_list.size > 0) {
                animateIcon();
            }

            planes_snap_position = 0;

            if (show_labels === 1 && plane_list_length <= intAircraftLimitForLabel) {
                labelHandler.showAll();
            }

            window.fr24getEventBus().emit('planes.list.updated');
        });

        planeRenderQueue.execute(createMarkers);

        // Now, we have added everything that SHOULD be on the map. But there might also be markers that should be deleted from the map (gone from feed or out of bounds)
        // Call this function to delete those

        if (follow_aircraft == 1 && selected_aircraft != null && plane_list[selected_aircraft] && (a_active == 0 || playback_mode == 1) && isMapPannable()) { // If we have chosen to follow an aircraft
            if (isMapPannable() && !isAirportView()) {
                map.panToOffsetted(new google.maps.LatLng(plane_list[selected_aircraft][1], plane_list[selected_aircraft][2]));
            }
        }

        updateViewData();
    }

    if (plane_list_org && init_call !== 0) { // If we have a plane list and a callsign in the url, search for it now
        plane_list = plane_list_org;

        if (plane_list_org[init_call]) { // If callsign is in plane list
            geolocation_move = false;

            if (init_follow == 1 && !multi_select_mode) {
                follow_aircraft = 1;
                var pos = new google.maps.LatLng(plane_list_org[init_call][1], plane_list_org[init_call][2]);
                if (!isAirportView() && !isListView()) {
                    if (isMapPannable()) {
                        map.panToOffsetted(pos);
                    } else {
                        map.setCenter(pos);
                    }
                }
            }

            $(\"li#follow-aircraft\").addClass(\"active\");

            if (!isAirportView() && !isListView() && !isFleetView()) {
                if (simple_mode == 1 && query_z && init_zoom) {
                    map.setZoom(init_zoom);
                } else {
                    map.setZoom(8);
                }
            }
            show_aircraft_data(init_call);

            if (query_view == 1) {
                query_view = 0;
            }

        } else { // Not live anymore
            var init_reg = '';

            Object.keys(plane_list_org).forEach(function (i) { // Loop flight to search for reg
                var elem = plane_list_org[i];
                if (elem) {
                    if (elem[9] == init_call) { // If reg = query_call
                        init_reg = i; // Put callsign of reg here
                        return false; // Found it, no need to search anymore
                    } else if (elem[16] == init_call) {
                        init_reg = i; // Put callsign of reg here
                        return false; // Found it, no need to search anymore
                    } else if (elem[13] == init_call) {
                        init_reg = i; // Put callsign of reg here
                        return false; // Found it, no need to search anymore
                    }
                }
            });

            if (init_reg != \"\") {

                if (simple_mode == 1 && query_z && init_zoom) {
                    map.setZoom(init_zoom);
                } else {
                    map.setZoom(8);
                }

                if (init_follow == 1 && !multi_select_mode) {
                    follow_aircraft = 1;
                    var pos = new google.maps.LatLng(plane_list_org[init_reg][1], plane_list_org[init_reg][2]);
                    if (!isAirportView()) {
                        if (isMapPannable()) {

                            map.panToOffsetted(pos);
                        } else {
                            map.setCenter(pos);
                        }
                    }
                }

                $(\"li#follow-aircraft\").addClass(\"active\");

                geolocation_move = false;
                show_aircraft_data(init_reg);

                if (query_view == 1) {
                    query_view = 0;
                }

            } else { // No active flight with that callsign or reg, search for it!
                historyReplaceState();
            }
        }
    }

    if (multi_select_mode && window.multiViewPanels.queue.hasFlights()) {
        selectAircraft(null);
        const aircrafts = window.multiViewPanels.queue.getFlightPanels();

        aircrafts.forEach(function(aircraft) {
            labelHandler.select(aircraft);
        });
    }
}

function get_sprite(ac_type, track, active, squawk, radar) {
    // size
    var size = window.init_aircraft_size || 'auto';
    if (size == \"auto\") {
        size = \"normal\";
        if (currentZoom >= 8) { size = \"large\";  }
        if (currentZoom <= 7  && currentZoom >= 5) { size = \"normal\"; }
        if (currentZoom <= 4  && currentZoom >= 1) { size = \"small\";  }
    }

    // color
    var color = \"yellow\";
    if (radar && radar.match(/(F-SAT|T-SAT)\\d+/) !== null) {
        color = \"blue\";
    }
    if (active === true || (squawk && (squawk == \"7500\" || squawk == \"7600\" || squawk == \"7700\"))) {
        color = \"red\";
    }
    if (ac_type === \"GRND\") {
        color = \"yellow\";
    }

    // Special override for santa;
    // Make as big as possible,
    // blue when unselected,
    // red when selected
    if (ac_type === 'SLEI') {
        size = \"xlarge\";
        color = \"blue\";
        if (active === true) {
            color = \"red\"
        }
    }

    return window.AircraftIcon.getConfiguration(color, size).getIcon({
        iteration: animateIconIteration || 0,
        aircraft: ac_type,
        rotation: track
    });
}

// Animate aircraft icons
var animateIconIteration = 0;
var animateIconTimer;

function animateIcon() {
    if (animateIconTimer) {
        return;
    }

    (function animateIconUpdate() {
        if (plane_animated_list.size === 0) {
            animateIconTimer = null;
            return;
        }

        plane_animated_list.forEach(function( marker ) {
            var ac = plane_details.get(marker);
            var selectedIcon = ac.aircraft_id == selected_aircraft || ac.aircraft_id == current_hover;

            marker.setIcon(
                get_sprite(
                    ac.aircraft_type,
                    ac.aircraft_track,
                    selectedIcon,
                    ac.squawk,
                    ac.radar
                )
            );
        });

        animateIconTimer = setTimeout(function () {
            animateIconIteration = ++animateIconIteration % 25;

            animateIconUpdate();
        }, 250);
    })();
}


function delete_planes(data) {
    if (typeof mapCanvasStub === 'undefined' || typeof mapCanvasStub.getProjection() === 'undefined') {
        return false;
    }

    var removeLabels = false;
    if (data) {
        if (init_labels == 1) {
            if (planes_showing > intAircraftLimitForLabel) {
                removeLabels = true;
                show_labels = 0;
            } else {
                show_labels = 1;
            }
        }

        // Delete planes
        for (var i in planes_array) {

            if (!data[i]) { // If not in feed
                labelHandler.remove(i);

                markerCache.release(planes_array[i]);

                if ( plane_animated_list.has(planes_array[i]) ) {
                    plane_animated_list.delete(planes_array[i]);
                }

                delete planes_array[i];
            } else if (removeLabels) {
                labelHandler.remove(i);
            }

        }

    }

    var zoomLevel = map.getZoom();

    update_map_position(map.center.lat(), map.center.lng(), zoomLevel);

    if (planes_showing < 250 && init_anim == 1 && playback_mode == 0) {
        a_active = 1;
    }

    if (playback_mode !== 1 && a_active == 1) {
        aInterval = setTimeout(animate, 100);
    }
}

function update_map_position(map_lat, map_lon, map_zoom) {

    const setting_lat = settingsService.syncGetSetting(\"map.latitude\"); // Get map position from localstorage/cookie
    const setting_lon = settingsService.syncGetSetting(\"map.longitude\");
    const setting_zoom = settingsService.syncGetSetting(\"map.zoom\");

    // cache current map latitude for `getAnimationInterval` function
    currentMapLatitude = map_lat;

    if (setting_lat !== map_lat) {
        settingsService.setSetting('map.latitude', map_lat);
    }
    if (setting_lon !== map_lon) {
        settingsService.setSetting('map.longitude', map_lon);
    }
    if (setting_zoom !== map_zoom) {
        settingsService.setSetting('map.zoom', map_zoom);
    }
}

function delete_all_planes() {
    labelHandler.removeAll();
    for (var i in planes_array) {
        markerCache.release(planes_array[i]);

        if ( plane_animated_list.has(planes_array[i]) ) {
            plane_animated_list.delete(planes_array[i]);
        }

        delete planes_array[i];
    }
}

function prePopulateComponent() {
    window.fr24getEventBus().emit('fr24Components.panels.shown', 'aircraft');

    if(!window.flightInfoHandler) {
        window.flightInfoHandler = new FlightInfoHandler();
    }
    if(window.flightInfoHandler.selectedAircraft !== selected_aircraft) {
        window.flightInfoHandler.setupBasicData(selected_aircraft);
    }
}

function populateComponent(data, selected_aircraft) {

    var handler = window.flightInfoHandler;

    if(!handler) {
        handler = window.flightInfoHandler = new FlightInfoHandler();
    }

    resetLeftPanelAdIfNeeded(
        handler.resetAdReload.bind(handler)
    );

    handler.setupData(selected_aircraft, data, selected_data_ems);
    handler.renderProperties();
    if(dispatcher.performanceMonitoring && traceFlightInfoOpen && traceFlightInfoOpen.state === 2) {
        traceFlightInfoOpen.stop();
    }
}


function flight_data_service_cb(data, isupdate)
{

    var _cntChSmAd = document.getElementById(\"cnt-ch-sm-ad\");
    if(_cntChSmAd)
    {
        _cntChSmAd.classList.remove(\"ad-hide\");
    }
    waiting_for_data = false;

    init_call = 0;

    if (selected_aircraft != null) {

        aircraft = selected_aircraft;

        if (isupdate) {
            //need to rewrite to_pos into selected_data on update
            if (selected_data[selected_aircraft] && selected_data[selected_aircraft]['from_pos'] && !data['from_pos']) {
                data.from_pos = selected_data[selected_aircraft]['from_pos'];
            }
            if (selected_data[selected_aircraft] && selected_data[selected_aircraft]['to_pos'] && !data['to_pos']) {
                data.to_pos = selected_data[selected_aircraft]['to_pos'];
            }
            if (selected_data[selected_aircraft] && selected_data[selected_aircraft]['old_pos'] && !data['old_pos']) {
                data.old_pos = selected_data[selected_aircraft]['old_pos'];
            }
            selected_data[selected_aircraft] = data;

        } else {
            selected_data[selected_aircraft] = data;
        }

        if (data.offline != '1' && plane_list[aircraft]) {
            populateComponent(data, selected_aircraft);

            if (isupdate) {
                return true;
            }

            if (playback_mode == 1) {
                if (playback_last > playback_time.getTime()) {
                    remove_polylines();
                }
                playback_last = playback_time.getTime();
            }

            remove_polylines_fake();

            if (data.trail &&  (data.trail.length > 1 || playback_mode == 1)) { // If there are polylines in feed, draw them
                selected_count[aircraft] = 0;

                if (playback_mode == 1 && selected_aircraft != null && plane_list[selected_aircraft]) {
                    var current_timestamp = plane_list[selected_aircraft][10];
                    var trail_timestamp = data.firstTimestamp;
                }


                var current_plane = plane_list_org[aircraft];
                var time_diff = 100;
                var last_state = 0;
                var last_state_limit = null;
                var radarTimeLimits = {\"default\": (15 * 60), \"T-F5M\": (30 * 60)}; // Different limit for T-F5M

                for (i = data.trail.length - 2; i > 0; i--) {
                    var radarName = (plane_list[aircraft]) ? plane_list[aircraft][7] : '';
                    last_state_limit = (radarName in radarTimeLimits) ? radarTimeLimits[radarName] : radarTimeLimits['default'];

                    if (playback_mode == 1) {

                        if (plane_list[aircraft][5] > 0) {
                            time_diff = plane_list[aircraft][5] * 1.5;
                        }

                        if (data.trail[i - 1].ts >= (current_timestamp - time_diff)) {

                            var lat2 = MapUtils.toRad(data.trail[i + 1].lat);
                            var lon2 = MapUtils.toRad(data.trail[i + 1].lng);
                            var lat1 = MapUtils.toRad(plane_list[aircraft][1]);
                            var lon1 = MapUtils.toRad(plane_list[aircraft][2]);
                            var dLon = (lon2 - lon1);
                            var y = Math.sin(dLon) * Math.cos(lat2);
                            var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
                            var brng = Math.atan2(y, x);
                            brng = (MapUtils.toDeg(brng) + 360) % 360; // New bearing

                            brngDiff = Math.abs(MapUtils.bearingDiff(brng, parseInt(plane_list[aircraft][3])));
                            // break drawing of the polyline at the aircrafts current position
                            if (brngDiff < 10 || data.trail[i - 1].ts >= current_timestamp) {
                                break;
                            }
                        }

                    } else {
                        if (current_plane[1] == data.trail[i - 1].lat && current_plane[2] == data.trail[i].lng) {
                            // break drawing of the polyline at the aircrafts current position
                            break;
                        }
                    }

                    if (polylines_index[aircraft] && !polylines_index[aircraft][data.trail[i].lat + '/' + data.trail[i].lng]) {
                        var polyLine = null;
                        var polyLineCoordinates = [new google.maps.LatLng(data.trail[i].lat, data.trail[i].lng), new google.maps.LatLng(data.trail[i + 1].lat, data.trail[i + 1].lng)];
                        var color = meter_to_color((data.trail[i].alt / 10) * 10 * 0.3048);

                        var _strokeOpacity, _icons = null;
                        if (typeof data.trail[i - 1] === 'undefined') {
                            if (last_state < last_state_limit) {
                                _icons = null;
                                _strokeOpacity = 0.6;
                            } else {
                                _icons = [{icon: {path: 'M 0,0 0,2', strokeColor: '#000', strokeOpacity: 0.5}, repeat: '10px'}];
                                _strokeOpacity = 0;
                            }
                        } else if (last_state < last_state_limit) {
                            _icons = null;
                            _strokeOpacity = 0.6;
                        } else if (data.trail[i].alt > 0) {
                            _icons = [{icon: {path: 'M 0,0 0,2', strokeColor: '#000', strokeOpacity: 0.5}, repeat: '10px'}];
                            _strokeOpacity = 0;
                        }

                        if (_strokeOpacity !== null) {
                            polyLine = new google.maps.Polyline({
                                path: polyLineCoordinates,
                                strokeColor: color,
                                strokeWeight: 3,
                                geodesic: true,
                                strokeOpacity: _strokeOpacity,
                                icons: _icons
                            });

                            polyLine.setMap(map);
                            pushPolyPoint(color,
                                [data.trail[i].lat, data.trail[i].lng],
                                {time: data.trail[i].ts,
                                    speed: data.trail[i].spd,
                                    alt: data.trail[i].alt
                                });

                            polylines[aircraft].push(polyLine);
                            polylines_index[aircraft][data.trail[i].lat + '/' + data.trail[i].lng] = '1';
                        }
                    }
                    last_state = data.trail[i - 1].ts - data.trail[i].ts;
                }

                drawPolyPoint();
                polylineInCoverage[aircraft] = true;

            } else { // If plane just flew into coverage and there were no polylines in feed, draw an empty so we can use it later
                polyLineCoordinates = [new google.maps.LatLng(plane_list[aircraft][1], plane_list[aircraft][2]), new google.maps.LatLng(plane_list[aircraft][1], plane_list[aircraft][2])];
                polyLine = new google.maps.Polyline({
                    path: polyLineCoordinates,
                    strokeColor: meter_to_color(plane_list[aircraft][4] * 0.3048),
                    strokeOpacity: 0.6,
                    strokeWeight: 3,
                    geodesic: true
                });
                if(plane_list[aircraft][8] !== \"SLEI\") {
                    polyLine.setMap(map);
                    polylines[aircraft].push(polyLine);
                    polylines_index[aircraft][plane_list[aircraft][1] + '/' + plane_list[aircraft][2]] = '1';
                }
            }
            if (polylines[aircraft] && polylines[aircraft].length > 0) { // If there are polylines, draw a fake one from the current position to the last
                selected_count[aircraft]++;

                if (typeof polylines[aircraft][polylines[aircraft].length - 1] !== 'undefined') {

                    var last_path = polylines[aircraft][polylines[aircraft].length - 1].getPath().getAt(0);
                    if (plane_list[aircraft][1] != last_path.lat() && plane_list[aircraft][2] != last_path.lng()) { // If current ac pos != last poly pos
                        last_state = plane_list[aircraft][10] - data.trail[0].ts;
                        var radar = (plane_list[aircraft]) ? plane_list[aircraft][7] : '';
                        if (!radar.match(radarRegexp) && last_state < last_state_limit) {
                            _icons = null;
                            _strokeOpacity = 0.6;
                        } else {
                            _icons = [{icon: {path: 'M 0,0 0,2', strokeColor: '#000', strokeOpacity: 0.5}, repeat: '10px'}];
                            _strokeOpacity = 0;
                        }
                        polyLineCoordinates = [new google.maps.LatLng(plane_list[aircraft][1], plane_list[aircraft][2]), last_path];
                        polyLine = new google.maps.Polyline({
                            path: polyLineCoordinates,
                            strokeColor: meter_to_color(plane_list[aircraft][4] * 0.3048),
                            strokeOpacity: _strokeOpacity,
                            strokeWeight: 3,
                            geodesic: true,
                            icons: _icons
                        });
                        polyLine.setMap(map);
                        if (last_state >= last_state_limit) {
                            polyLine.setMap(map);
                            pushPolyPoint(color, [data.trail[i].lat, data.trail[i].lng], {time: data.trail[i].ts, speed: data.trail[i].spd, alt: data.trail[i].alt * 10});

                            polylines[aircraft].push(polyLine);
                            polylines_index[aircraft][data.trail[i].lat + '/' + data.trail[i].lng] = '1';
                        } else {
                            polylines_fake[aircraft].push(polyLine);
                            polylines_fake_index[aircraft][plane_list[aircraft][1] + '/' + plane_list[aircraft][2]] = '1';
                        }
                    }
                }

            }

        } else {
            close_aircraft_data();
        }
    }
}

function warmUpPolyLines(aircraft) {
    if (typeof polylines[aircraft] === 'undefined') {
        polylines[aircraft] = [];
        polylines_index[aircraft] = [];
    }
    if (typeof polylines_fake[aircraft] === 'undefined') {
        polylines_fake[aircraft] = [];
        polylines_fake_index[aircraft] = [];
    }
}

function flight_data_service_cb_multi(data, isupdate, aircraft)
{
    waiting_for_data = false;
    if (!aircraft || aircraft === \"NULL\" || !multi_select_mode) {
        return false;
    }
    init_call = 0;

    $(\"#leftColOverlay, #cnt-panel-clickhandler\").removeClass(\"active\").hide();

    aircraft = (aircraft) ? aircraft : selected_aircraft;
    selected_data[aircraft] = data;
    // TODO: move to es6/polylines service
    if (plane_list[aircraft] && data.trail && (data.trail.length > 1 || parseInt(playback_mode) === 1)) { // If there are polylines in feed, draw them
        selected_count[aircraft] = 0;

        if (parseInt(playback_mode) === 1) {
            var current_timestamp = plane_list[aircraft][10];
            var trail_timestamp = data.firstTimestamp;
        }

        var current_plane = plane_list_org[aircraft];
        var time_diff = 100;
        var last_state = 0;
        var last_state_limit = null;
        var radarTimeLimits = {\"default\": (15 * 60), \"T-F5M\": (30 * 60)}; // Different limit for T-F5M

        for (i = data.trail.length - 2; i > 0; i--) {
            var radarName = (plane_list[aircraft]) ? plane_list[aircraft][7] : '';
            last_state_limit = (radarName in radarTimeLimits) ? radarTimeLimits[radarName] : radarTimeLimits['default'];

            if (parseInt(playback_mode) === 1) {

                if (plane_list[aircraft][5] > 0) {
                    time_diff = plane_list[aircraft][5] * 1.5;
                }

                if (data.trail[i - 1].ts >= (current_timestamp - time_diff)) {

                    var lat2 = MapUtils.toRad(data.trail[i + 1].lat);
                    var lon2 = MapUtils.toRad(data.trail[i + 1].lng);
                    var lat1 = MapUtils.toRad(plane_list[aircraft][1]);
                    var lon1 = MapUtils.toRad(plane_list[aircraft][2]);
                    var dLon = (lon2 - lon1);
                    var y = Math.sin(dLon) * Math.cos(lat2);
                    var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
                    var brng = Math.atan2(y, x);
                    brng = (MapUtils.toDeg(brng) + 360) % 360; // New bearing

                    brngDiff = Math.abs(MapUtils.bearingDiff(brng, parseInt(plane_list[aircraft][3])));
                    // break drawing of the polyline at the aircrafts current position
                    if (brngDiff < 10 || data.trail[i - 1].ts >= current_timestamp) {
                        break;
                    }
                }

            } else {
                if (current_plane[1] == data.trail[i - 1].lat && current_plane[2] == data.trail[i].lng) {
                    // break drawing of the polyline at the aircrafts current position
                    break;
                }
            }

            if (!(polylines_index[aircraft][data.trail[i].lat + '/' + data.trail[i].lng])) {
                var polyLine = null;
                var polyLineCoordinates = [new google.maps.LatLng(data.trail[i].lat, data.trail[i].lng), new google.maps.LatLng(data.trail[i + 1].lat, data.trail[i + 1].lng)];
                var color = meter_to_color((data.trail[i].alt / 10) * 10 * 0.3048);

                var _strokeOpacity, _icons = null;
                if (typeof data.trail[i - 1] === 'undefined') {
                    if (last_state < last_state_limit) {
                        _icons = null;
                        _strokeOpacity = 0.6;
                    } else {
                        _icons = [{icon: {path: 'M 0,0 0,2', strokeColor: '#000', strokeOpacity: 0.5}, repeat: '10px'}];
                        _strokeOpacity = 0;
                    }
                } else if (last_state < last_state_limit) {
                    _icons = null;
                    _strokeOpacity = 0.6;
                } else if (data.trail[i].alt > 0) {
                    _icons = [{icon: {path: 'M 0,0 0,2', strokeColor: '#000', strokeOpacity: 0.5}, repeat: '10px'}];
                    _strokeOpacity = 0;
                }

                if (_strokeOpacity !== null) {
                    polyLine = new google.maps.Polyline({
                        path: polyLineCoordinates,
                        strokeColor: color,
                        strokeWeight: 3,
                        geodesic: true,
                        strokeOpacity: _strokeOpacity,
                        icons: _icons
                    });

                    polyLine.setMap(map);

                    polylines[aircraft].push(polyLine);
                    polylines_index[aircraft][data.trail[i].lat + '/' + data.trail[i].lng] = '1';
                }
            }
            last_state = data.trail[i - 1].ts - data.trail[i].ts;
        }
        polylineInCoverage[aircraft] = true;

    } else if (polylines[aircraft] && plane_list[aircraft]) { // If plane just flew into coverage and there were no polylines in feed, draw an empty so we can use it later
        polyLineCoordinates = [new google.maps.LatLng(plane_list[aircraft][1], plane_list[aircraft][2]), new google.maps.LatLng(plane_list[aircraft][1], plane_list[aircraft][2])];
        polyLine = new google.maps.Polyline({
            path: polyLineCoordinates,
            strokeColor: meter_to_color(plane_list[aircraft][4] * 0.3048),
            strokeOpacity: 0.6,
            strokeWeight: 3,
            geodesic: true
        });
        polyLine.setMap(map);
        polylines[aircraft].push(polyLine);
        polylines_index[aircraft][plane_list[aircraft][1] + '/' + plane_list[aircraft][2]] = '1';
    }

    if (polylines[aircraft] && polylines[aircraft].length > 0) { // If there are polylines, draw a fake one from the current position to the last
        selected_count[aircraft]++;

        if (typeof polylines[aircraft][polylines[aircraft].length - 1] !== 'undefined') {

            var last_path = polylines[aircraft][polylines[aircraft].length - 1].getPath().getAt(0);
            if (plane_list[aircraft][1] != last_path.lat() && plane_list[aircraft][2] != last_path.lng()) { // If current ac pos != last poly pos
                last_state = plane_list[aircraft][10] - data.trail[0].ts;
                var radar = (plane_list[aircraft]) ? plane_list[aircraft][7] : '';
                if (!radar.match(radarRegexp) && last_state < last_state_limit) {
                    _icons = null;
                    _strokeOpacity = 0.6;
                } else {
                    _icons = [{icon: {path: 'M 0,0 0,2', strokeColor: '#000', strokeOpacity: 0.5}, repeat: '10px'}];
                    _strokeOpacity = 0;
                }
                polyLineCoordinates = [new google.maps.LatLng(plane_list[aircraft][1], plane_list[aircraft][2]), last_path];
                polyLine = new google.maps.Polyline({
                    path: polyLineCoordinates,
                    strokeColor: meter_to_color(plane_list[aircraft][4] * 0.3048),
                    strokeOpacity: _strokeOpacity,
                    strokeWeight: 3,
                    geodesic: true,
                    icons: _icons
                });
                polyLine.setMap(map);
                if (last_state >= last_state_limit) {
                    polyLine.setMap(map);

                    polylines[aircraft].push(polyLine);
                    polylines_index[aircraft][data.trail[i].lat + '/' + data.trail[i].lng] = '1';
                } else {
                    polylines_fake[aircraft].push(polyLine);
                    polylines_fake_index[aircraft][plane_list[aircraft][1] + '/' + plane_list[aircraft][2]] = '1';
                }
            }
        }
    }
}

function update_aircraft_data_overlay_multi(data, aircraft) {
    flight_data_service_cb_multi(data, false, aircraft);
}

function update_aircraft_data_overlay(data) {

    if (typeof data === 'undefined') {
        return false;
    }
    if (typeof plane_list_org[selected_aircraft] === 'undefined') {
        remove_polylines();
        show_aircraft_data(selected_aircraft);
        return;
    }

    var btnAircraftDataAdd = document.getElementById(\"btn-aircraft-data-add\");
    if (btnAircraftDataAdd instanceof HTMLElement)
    {
        if (!plane_list[aircraft][8] && plane_list[aircraft][0] && parseInt(plane_list[aircraft][0], 16) > 16383)
        {
            btnAircraftDataAdd.classList.remove(\"hidden\");
        } else {
            btnAircraftDataAdd.classList.add(\"hidden\");
        }
    }
    populateComponent(data, selected_aircraft);
}

function getTooltipUnits(unit, value) {
    var emsTranslation = {\"TAS\": \"speed\", \"IAS\": \"speed\", \"AGPS\": \"altitude\", \"OAT\": \"temperature\", \"WIND\": \"speed\"};
    if (emsTranslation[unit] !== undefined) {
        unit = emsTranslation[unit];
    }
    var ktsSpeed = window.Units.convert('speed', value, \"kt\", \"kt\");
    var kmhSpeed = window.Units.convert('speed', value, \"kt\", \"kmh\");
    var mphSpeed = window.Units.convert('speed', value, \"kt\", \"mph\");

    var mAlt = window.Units.convert('altitude', value, \"ft\", \"m\");
    var ftAlt = window.Units.convert('altitude', value, \"ft\", \"ft\");

    var msVS = window.Units.convert('vspeed', value, \"ft\", \"m\");
    var fpmVS = window.Units.convert('vspeed', value, \"ft\", \"ft\");

    var tempC = window.Units.convert('temperature', value, \"c\", \"c\");
    var tempF = window.Units.convert('temperature', value, \"c\", \"f\");

    var unitValues = {\"speed\": {\"kmh\": kmhSpeed, \"mph\": mphSpeed, \"kt\": ktsSpeed},
        \"altitude\": {\"m\": mAlt, \"ft\": ftAlt},
        \"vspeed\": {\"fpm\": fpmVS, \"m\": msVS},
        \"temperature\": {\"c\": tempC, \"f\": tempF}
    };
    var unitTooltip = \"\";

    var unitValue = unitValues[unit];
    if (unitValue) {
        Object.keys(unitValue).forEach(function (key) {
            var val = unitValue[key];
            if (key !== init_unit_speed && key !== init_unit_alt && key !== init_unit_temp && (key !== settingsService.syncGetSetting(\"unit.vspeed\"))) {
                unitTooltip += val + \", \";
            }
        });
    }

    unitTooltip = unitTooltip.substring(0, unitTooltip.length - 2);

    return unitTooltip;
}


function panAircraftIntoView(aFlightId, fullMapView) {
    if (aFlightId in plane_list && plane_list[aFlightId].length > 2) {
        const planeLat =  plane_list[aFlightId][1];
        const planeLng = plane_list[aFlightId][2];

        var projection = mapCanvasStub.getProjection();

        var mapCenter = projection.fromLatLngToContainerPixel(map.getCenter());

        var planePixelLoc = projection.fromLatLngToContainerPixel(new google.maps.LatLng(
                planeLat,
                planeLng
                ));

        var nePixelBounds = projection.fromLatLngToContainerPixel(currentBounds.ne);

        if (! dispatcher.display.isMobile && planePixelLoc.x <= 280) {
            var targetOffset = 260 + ( ( nePixelBounds.x - 260) / 2 );
            var newOffset = projection.fromContainerPixelToLatLng({ x: mapCenter.x - (targetOffset-planePixelLoc.x)  , y:mapCenter.y });


            map.panTo(newOffset);
        }
    }
}

function show_aircraft_data(aircraft, active) {
    active = (active !== undefined ? active : 0);
    init_call = 0;

    var domLink = document.getElementById(\"follow-aircraft\") || document.getElementById(\"btn-aircraft-action-follow\");
    hideShareBox();

    if(window.airportInfoHandler && window.airportInfoHandler.isOpen()) {
        window.airportInfoHandler.close();
    }

    var _btnFlightsToggle = document.getElementById(\"btn-ch-lg-flights-toggle\");
    if (active === 0 && _btnFlightsToggle && _btnFlightsToggle.classList.contains(\"active\")) {
        mouseEvent.initEvent(\"click\", true, false);
        _btnFlightsToggle.dispatchEvent(mouseEvent);
        _btnFlightsToggle.isDataLoaded = false;
    }

    // // If plane is in plane list
    if(plane_list && plane_list[aircraft]) {
        if(follow_aircraft === 1 && domLink) {
            document.getElementById(\"follow-aircraft\").classList.add(\"active\");
        }

        force_init_call = 0;
        if(aircraft != selected_aircraft && $(\"#aircraft_\" + selected_aircraft + \" .temporary_label\").length > 0){
            $(\"#aircraft_\" + selected_aircraft + \" .temporary_label\").removeClass(\"opacity_0\").show();
        }

        // If first time selected
        if(active === 0) {
            selectAircraft(aircraft);
            increaseMapClickCounter();

            if(!multi_select_mode) {
                if( !isFleetView() ) {
                    $('body').addClass('loading-left-overlay');
                }
                $(\"#leftColOverlay, #cnt-panel-clickhandler\").removeClass('no-image');

                remove_polylines(); // Remove possible polylines

                window.fr24getEventBus().once('planes.list.updated', function() {
                    if (selected_aircraft === null) {
                        return;
                    }
                    labelHandler.select(selected_aircraft);
                });
            }

            $(\".errorMsg\", \"#leftColOverlay, #cnt-panel-clickhandler\").remove();

            panAircraftIntoView(selected_aircraft);

        }

        if (active == 0) { // Only get data if playback mode or first time
            if(query_single !== 1) {
                $('#dialog-message.ui-dialog').dialog(\"close\");
                query_flight_data(aircraft);
                load_flight_ems();
            }
        } else { // If not playback mode, and not first time

            if(!multi_select_mode) {
                update_aircraft_data_overlay(selected_data[aircraft]);
                load_flight_ems();
            }

            var aircraftAlt = plane_list[aircraft][4];
            if(aircraftAlt < 10000) {
                selected_count[aircraft] = 3;
            } else if(aircraftAlt > 10000 && aircraftAlt < 20000 && selected_count[aircraft] === 1) {
                selected_count[aircraft] += 1;
            }

            draw_fake_polyline(aircraft, 1);

            if(load3dView && get3DButton().length > 0 && typeof cockpitViewModel === \"undefined\" &&
                (window.featureListDownloaded || !get3DButton().hasClass('disabled'))) {
                load3dView = false;
                get3DButton().click();
            }
        }

    } else {
        if(show_aircraft_data_requests > show_aircraft_data_threshold)
        {
            close_aircraft_data();
            show_aircraft_data_requests = 0;
        } else
        {
            show_aircraft_data_requests++;
        }
    }
    historyReplaceState();
}

function load_flight_ems()
{
    var hasEms = (aircraftInfoLevel === 'full' && typeof (selected_data_ems.ems) !== 'undefined' && selected_data_ems.ems !== null);

    var emsTypes = [
        [\"IAS\", \"speed\"],
        [\"TAS\", \"speed\"],
        [\"MACH\", \"speed\"],
        [\"AGPS\", \"altitude\"],
        [\"OAT\", \"temperature\"],
        [\"WIND\", \"wspeed\"]
    ]; //\"AMCP\",\"QNH\",\"AFMS\",\"APFLAGS\",

    $('#emsWDIR, #emsOAT, #emsIAS, #emsTAS, #emsMACH, #emsAGPS, #emsWIND').html('-');

    if (selected_data_ems.aircraft !== selected_aircraft) {
        selected_data_ems = {\"ems\": {}, \"availability\": [], aircraft: null, airspace: ''};
        return;
    }

    var featureMapping = {
        IAS: 124,
        TAS: 125,
        MACH: 126,
        AGPS: 129,
        OAT: 128,
        WIND: 127
    };
    Object.keys(emsTypes).forEach(function (idx) {
        var ems = emsTypes[idx];
        var emsType = ems[0];
        var emsUnit = ems[1];
        var featureId = featureMapping[emsType];
        var value = false;
        var el = $('#ems' + emsType);
        var emsTooltip = \"\";
        var premiumResponse = '<a href=\"javascript: void(0);\" target=\"premium\" class=\"' + subscriptionFeatureTooltip + ' premium-content disabled featureInfo-' + featureId + '\" data-tooltip-value=\"' + subscriptionUpgradetext + '\" data-tooltip-maxwidth=\"250px\"><svg class=\"premium-lock\"><use xlink:href=\"#icon-fr24-lock\" /></svg></a>';

        if (hasEms) {
            if (typeof (selected_data_ems.ems[emsType]) !== 'undefined') {
                if (emsType === 'WIND') {
                    value = selected_data_ems.ems[emsType].split('@');
                    emsTooltip = getTooltipUnits(emsType, parseInt(value[1]));
                } else {
                    value = selected_data_ems.ems[emsType];
                    emsTooltip = getTooltipUnits(emsType, value);
                }
            }
            if (flightInfoLevel === \"full\") {
                if (emsType === 'WIND' && Array.isArray(value)) {
                    el.html(\"<span class='hasTooltip' data-tooltip-value='\" + emsTooltip + \" \" + value[0] + \"&deg'>\" + window.Units.convert(emsUnit, value[1]) + '</span><span style=\"transform: rotate(' + (parseInt(value[0]) + 180) + 'deg);\" class=\"fa fa-long-arrow-up\"></span> ' + value[0] + '&deg;');
                } else if (value !== false && value !== '') {
                    if (emsType === 'MACH') {
                        el.html((value / 1000.0).toFixed(3) + ' Ma');
                    } else {
                        el.html(\"<span class='hasTooltip' data-tooltip-value='\" + emsTooltip + \"'>\" + window.Units.convert(emsUnit, value) + \"</span>\");
                    }
                } else {
                    el.html('N/A');
                }
            } else {
                el.html(premiumResponse);
            }
        } else if ((aircraftInfoLevel !== 'full') && selected_data_ems.availability.indexOf(emsType) !== -1) {
            el.html(premiumResponse);
        } else {
            el.html('N/A');
        }
    });

    if (hasEms && typeof selected_data_ems.ems['AGPS'] !== 'undefined'
            && typeof selected_data_ems.ems['OAT'] !== 'undefined'
            && typeof selected_data_ems.ems['QNH'] !== 'undefined') {
        // this almost certainly never happens
        $('#emsAP').html(MapUtils.atmosphericPressure(selected_data_ems.ems['QNH'], selected_data_ems.ems['AGPS'], selected_data_ems.ems['OAT']) + ' hPa');
    }

    if (aircraftInfoLevel !== 'full') {
        $('#emsAP,#emsWDIR').html('<a href=\"javascript: void(0);\" target=\"premium\" class=\"' + subscriptionFeatureTooltip + ' premium-content disabled featureInfo-53\" data-tooltip-value=\"' + subscriptionUpgradetext + '\" data-tooltip-maxwidth=\"250px\"><svg class=\"premium-lock\"><use xlink:href=\"#icon-fr24-lock\" /></svg></a>');
    }

    if (aircraftInfoLevel === 'full') {
        if (flightInfoLevel === \"full\") {
            if (selected_data_ems.airspace) {
                $('#firVal').html(selected_data_ems.airspace);
            } else if (playback_mode == 1) {
                $('#firVal').html('Not Available');
            } else {
                $('#firVal').html('Position Estimated');
            }

        } else {
            var premiumResponse = '<a target=\"premium\" href=\"javascript: void(0);\" class=\"' + subscriptionFeatureTooltip + ' premium-content disabled featureInfo-53\" data-tooltip-value=\"' + subscriptionUpgradetext + '\" data-tooltip-maxwidth=\"250px\"><svg class=\"premium-lock\"><use xlink:href=\"#icon-fr24-lock\" /></svg></a>';
            $('#firVal').html(premiumResponse.replace(\"featureInfo53\", \"featureInfo120\").replace(\"featureInfo-53\", \"featureInfo-120\"));
        }
    }
}
function query_flight_data(aircraft, isupdate) {
    if (pauseFeed === true || map_delays_mode === true || (aircraft !== selected_aircraft)) {
        return false;
    }
    waiting_for_data = true;
    clearTimeout(updateInterval);

    let endPointParams = {};

    if (isupdate) {
        Object.assign(endPointParams, {notrail: 'true'});
    }

    if (playback_mode && playback_fetch_time != 0) {
        Object.assign(endPointParams, {history: Math.floor(playback_fetch_time.getTime() / 1000)});
    }

    if (aircraft === tracked_aircraft) {
        Object.assign(endPointParams, {source: 'tophitsWeb'});
    }

    prePopulateComponent();

    aircraftInfoSlideIn();

    const clickHandlerApi = window.clickHandlerApi;
    clickHandlerApi.get(aircraft, endPointParams).then( function (data) {
        warmUpPolyLines(aircraft);

        window.fr24getEventBus().emit('map.flight.selected', data);
        if (multi_select_mode) {
            flight_data_service_cb_multi(data, true, aircraft);
        } else {
            flight_data_service_cb(data, isupdate);
        }

        executeFetchPlane();
        updateInterval = setTimeout(function () {
            query_flight_data(aircraft, true);
        }, 90 * 1000);
    }).catch(function (err) {
        console.error(err);
        waiting_for_data = false;
        if (!isupdate) {
            clearTimeout(planeInfoLoadingTimeout);
        }
    });
}

function draw_fake_polyline(aircraft, real) {
    remove_polylines_fake(aircraft);
    var _icons, _strokeOpacity, radar = (plane_list[aircraft] ? plane_list[aircraft][7] : '');

    if (real == 1 && polylines[aircraft] && polylines[aircraft].length > 0
        && selected_count[aircraft] == 3 && polylineInCoverage[aircraft] == true) {
        // If polylines have been drawn and it's the third iteration of show_aircraft_data,
        // add polyline to   array!

        selected_count[aircraft] = 0;
        if (typeof polylines[aircraft][polylines[aircraft].length - 1] !== 'undefined')
        {
            var last_path = polylines[aircraft][polylines[aircraft].length - 1].getPath().getAt(0);
            if (plane_list[aircraft][1] != last_path.lat() && plane_list[aircraft][2] != last_path.lng()) {
                // If current ac pos != last poly pos
                polyLineCoordinates = [new google.maps.LatLng(plane_list[aircraft][1], plane_list[aircraft][2]), last_path];

                var color = meter_to_color(plane_list[aircraft][4] * 0.3048);
                if (!radar.match(radarRegexp)) {
                    _icons = null;
                    _strokeOpacity = 0.6;

                    polyLine = new google.maps.Polyline({
                        path: polyLineCoordinates,
                        strokeColor: color,
                        strokeOpacity: _strokeOpacity,
                        strokeWeight: 3,
                        geodesic: true,
                        icons: _icons
                    });

                    pushPolyPoint(color, [plane_list[aircraft][1], plane_list[aircraft][2]], {time: plane_list[aircraft][10], speed: plane_list[aircraft][5], alt: plane_list[aircraft][4]});
                    drawPolyPoint();
                    polyLine.setMap(map);
                    polylines[aircraft].push(polyLine);
                    polylines_index[aircraft][plane_list[aircraft][1] + '/' + plane_list[aircraft][2]] = '1';
                }
            }
        }
    }

    if (real == 1) {
        selected_count[aircraft]++;
    }
    newCoordinate = new google.maps.LatLng(plane_list[aircraft][1], plane_list[aircraft][2]);
    if (polylines[aircraft] && polylines[aircraft].length > 0) {
        // If there are polylines, draw a fake one from the current position to the last
        if (typeof polylines[aircraft][polylines[aircraft].length - 1] !== 'undefined')
        {
            var last_path = polylines[aircraft][polylines[aircraft].length - 1].getPath().getAt(0);
            if (plane_list[aircraft][1] != last_path.lat() && plane_list[aircraft][2] != last_path.lng()) {
                // If current ac pos != last poly pos

                if (!polylines_fake[aircraft]) {
                    polylines_fake[aircraft] = [];
                    polylines_fake_index[aircraft] = [];
                }
                if (!radar.match(radarRegexp)) {
                    _icons = null;
                    _strokeOpacity = 0.9;
                    // If plane just flew into coverage
                    if (polylineInCoverage[aircraft] === false) {
                        selected_count[aircraft] = 0;
                        polyLineCoordinates = [newCoordinate, last_path];
                        polyLine = new google.maps.Polyline({
                            path: polyLineCoordinates,
                            strokeColor: color,
                            strokeOpacity: 0,
                            strokeWeight: 3,
                            geodesic: true,
                            icons: [{icon: {path: 'M 0,0 0,2', strokeColor: '#000', strokeOpacity: 0.5}, repeat: '10px'}]
                        });
                        pushPolyPoint(color, [plane_list[aircraft][1], plane_list[aircraft][2]], {time: plane_list[aircraft][10], speed: plane_list[aircraft][5], alt: plane_list[aircraft][4]});
                        drawPolyPoint();
                        polyLine.setMap(map);
                        polylines[aircraft].push(polyLine);
                        polylines_index[aircraft][plane_list[aircraft][1] + '/' + plane_list[aircraft][2]] = '1';
                        polylineInCoverage[aircraft] = true;
                        draw_fake_polyline(aircraft, real);
                        return;
                    }
                } else {
                    polylineInCoverage[aircraft] = false;
                    _icons = [{icon: {path: 'M 0,0 0,2', strokeColor: '#000', strokeOpacity: 0.5}, repeat: '10px'}];
                    _strokeOpacity = 0;
                }
                polyLineCoordinates = [newCoordinate, last_path];
                polyLine = new google.maps.Polyline({
                    path: polyLineCoordinates,
                    strokeColor: meter_to_color(plane_list[aircraft][4] * 0.3048),
                    strokeOpacity: _strokeOpacity,
                    strokeWeight: 3,
                    geodesic: true,
                    icons: _icons
                });
                polyLine.setMap(map);
                polylines_fake[aircraft].push(polyLine);
                polylines_fake_index[aircraft][plane_list[aircraft][1] + '/' + plane_list[aircraft][2]] = '1';

            }
        }

    }
    if (showRoute === 1 && showRouteEnabled === true) {
        var first_path = polylines[aircraft][0].getPath().getAt(1);
        var toPosCoordinate = new google.maps.LatLng(selected_data[aircraft]['to_pos'][0], selected_data[aircraft]['to_pos'][1]);
        var fromPosCoordinate = new google.maps.LatLng(selected_data[aircraft]['from_pos'][0], selected_data[aircraft]['from_pos'][1]);
        polyLineCoordinates = [toPosCoordinate, newCoordinate];
        polyLine = new google.maps.Polyline({
            path: polyLineCoordinates,
            strokeColor: meter_to_color(plane_list[aircraft][4] * 0.3048),
            strokeOpacity: 0.9,
            strokeWeight: 1,
            geodesic: true
        });
        polyLine.setMap(map);
        polylines_fake[aircraft].push(polyLine);

        polyLineCoordinates = [fromPosCoordinate, first_path];
        polyLine = new google.maps.Polyline({
            path: polyLineCoordinates,
            strokeColor: meter_to_color(plane_list[aircraft][4] * 0.3048),
            strokeOpacity: 0.6,
            strokeWeight: 1,
            geodesic: true
        });

        polyLine.setMap(map);
        polylines_fake[aircraft].push(polyLine);

        polylines_fake_index[aircraft][plane_list[aircraft][1] + '/' + plane_list[aircraft][2]] = '1';

        if (selected_data[aircraft]['old_pos']) {
            var oldPosCoordinate = new google.maps.LatLng(selected_data[aircraft]['old_pos'][0], selected_data[aircraft]['old_pos'][1]);

            var polyLine = new google.maps.Polyline({
                path: [fromPosCoordinate, oldPosCoordinate],
                strokeColor: '#400',
                strokeOpacity: 0,
                strokeWeight: 2,
                geodesic: true,
                icons: [{icon: {path: 'M 0,0 0,2', strokeColor: '#400', strokeOpacity: 0.4}, repeat: '10px'}]
            });

            polyLine.setMap(map);
            polylines_fake[aircraft].push(polyLine);
        }
    }
}

function aircraftIsSelected() {
    if (!selected_aircraft) return false
    if (selected_aircraft === null) return false
    return true
}


function close_aircraft_data(noAnim) {
    clearTimeout(updateInterval);

    labelHandler.deselect(selected_aircraft, show_labels);

    remove_polylines();

    if (planes_array[selected_aircraft]) {
        let ac = plane_details.get(planes_array[selected_aircraft]);

        planes_array[selected_aircraft].setIcon(
            get_sprite(
                ac.aircraft_type,
                ac.aircraft_track,
                false,
                ac.squawk,
                ac.radar
            )
        );
    }

    if(window.flightInfoHandler) {
        window.flightInfoHandler.resetAdReload();
        window.flightInfoHandler.reset();
    }
    window.fr24getEventBus().emit('fr24Components.panels.hidden', 'aircraft');
    if (typeof cockpitViewModel !== 'undefined') {
        cockpitViewModel.close(function () {
            if (settingsService.syncGetSetting(\"map.animate_aircraft\")) {
                init_anim = 1;
            }
            follow_aircraft = 0;
            $(\"a#follow-aircraft\").removeClass('active');
        });
    }

    follow_aircraft = 0;

    if (showRoute === 1) {
        hideSelectedRoute(false);
    }

    if (!(noAnim && noAnim === 1)) { // Do not slide out if a new plane is clicked
        aircraftInfoSlideOut();
    }

    $(\"#follow-aircraft\").removeClass(\"active\");

    hideShareBox();

    selectAircraft(null);

    const globalEventBus = window.fr24getEventBus();

    if(playback_mode && !multi_select_mode) {
        globalEventBus.emit('map.selection.clear');
    }

    historyReplaceState();
}

function select_random_aircraft(sec) {

    var interval = sec * 1000;
    var mapBounds = mapCanvasStub.getProjection().fromLatLngToDivPixel(new google.maps.LatLng(currentBounds.north, currentBounds.west));
    var cnt_showing = 0;
    var i;
    var visible_planes = [];

    for (i in planes_array) {

        divPos = mapCanvasStub.getProjection().fromLatLngToDivPixel(planes_array[i].position);
        xpos = divPos.x - mapBounds.x;

        if (xpos > 220) {
            visible_planes[i] = planes_array[i];
            cnt_showing++;
        }
    }

    if (cnt_showing == 0) {
        close_aircraft_data();
        randomAircraft = setTimeout(function () {
            select_random_aircraft(sec);
        }, interval);
        return;
    } else if (cnt_showing == 1) {
        plane_to_show = Math.floor((Math.random() * cnt_showing) + 1);
    } else {
        plane_to_show = Math.floor((Math.random() * cnt_showing) + 1);
    }

    if (cnt_showing == 0) {
        close_aircraft_data();
        randomAircraft = setTimeout(function () {
            select_random_aircraft(sec);
        }, interval);
        return;
    }

    cnt = 1;

    for (var i in visible_planes) {

        if (plane_to_show == cnt) {

            if (cnt_showing > 1 && i == selected_aircraft) {
                select_random_aircraft(sec);
                break;
            } else if (i == selected_aircraft) {
                randomAircraft = setTimeout(function () {
                    select_random_aircraft(sec);
                }, interval);
                break;
            }

            close_aircraft_data(1);
            show_aircraft_data(i);

            var ac = plane_details.get(visible_planes[i]);

            visible_planes[i].setIcon(
                get_sprite(
                    ac.aircraft_type,
                    ac.aircraft_track,
                    false,
                    ac.squawk,
                    ac.radar
                )
            );

            labelHandler.select(i);

            randomAircraft = setTimeout(function () {
                select_random_aircraft(sec);
            }, interval);
        }

        cnt++;
    }

}


function remove_polylines() {
    if (multi_select_mode) {
        return false;
    }
    Object.keys(polylines).forEach(function (aircraft) {
        for (i = 0; i <= polylines[aircraft].length - 1; i++) {
            polylines[aircraft][i].setMap(null);
        }
        delete polylines[aircraft];
        delete polylines_index[aircraft];
    });
    if (selected_aircraft != null) {
        polylines_index[selected_aircraft] = [];
        polylines[selected_aircraft] = [];
    }

    remove_polylines_fake();

    for (i = 0; i < polyPointCircles.length; i++) {
        polyPointCircles[i].setMap(null);
    }
    polyPointCircles = [];
    polyPointCirclesRaw = [];
    last_polycircle_time = null;
}

function remove_aircraft_polylines(aircraft)
{
    if (polylines.hasOwnProperty(aircraft)) {
        for (i = 0; i <= polylines[aircraft].length - 1; i++) {
            polylines[aircraft][i].setMap(null);
        }
    }
    polylines[aircraft] = [];
    polylines_index[aircraft] = [];

    if (polylines_fake.hasOwnProperty(aircraft)) {
        for (i = 0; i <= polylines_fake[aircraft].length - 1; i++) {
            polylines_fake[aircraft][i].setMap(null);
        }
    }
    polylines_fake[aircraft] = [];
    polylines_fake_index[aircraft] = [];

    labelHandler.remove(aircraft);

    if (window.multiViewPanels.queue.has(aircraft)) {
        if (planes_array[aircraft] && plane_list[aircraft]) {
            planes_array[aircraft].setIcon(get_sprite(
                plane_list[aircraft][8],
                plane_list[aircraft][3],
                false,
                plane_list[aircraft][6],
                ((plane_list[aircraft]) ? plane_list[aircraft][7] : '')
            ));
        }
    }

    if (playback_mode == 0 && !window.multiViewPanels.queue.hasFlights()) {
        selectAircraft(null);

        showMultiSelectRoute = false;
    }
    close_aircraft_data();
    update_planes();
}


function remove_polylines_fake(currAircraft) {
    Object.keys(polylines_fake).forEach(function (aircraft){
        if (!currAircraft || currAircraft === aircraft) {
            for (i = 0; i <= polylines_fake[aircraft].length - 1; i++) {
                polylines_fake[aircraft][i].setMap(null);
            }
            if (!multi_select_mode && selected_aircraft != aircraft) {
                delete polylines_fake[aircraft];
                delete polylines_fake_index[aircraft];
            }
        }
    });

}

function getQuerystring(key, default_)
{
    var check_url;
    (window.location.href.indexOf('#!/') == -1) ? check_url = window.location.href : check_url = window.location.href.split('#!/')[1];
    if (default_ == null)
        default_ = \"\";
    key = key.replace(/[\\[]/, \"\\\\\\[\").replace(/[\\]]/, \"\\\\\\]\");
    var regex = new RegExp(\"[\\\\?&]\" + key + \"=([^&#]*)\");
    var qs = regex.exec(check_url);
    if (qs == null)
        return default_;
    else
        return qs[1];
}

function exit_map() {
    if ($(\"#map_canvas\").length > 0) {
        //GA
        Analytics.trackAnalyticsEvent({
            eventType: Analytics.eventPageView,
            excludePlatforms: [Analytics.platformMixPanel],
            dynamicParams: [
                {
                    value: '/timeout-overlay',
                    googleAnalyticsFieldName: 'page'
                }
            ]
        });
        stopFetchPlane();
        clearTimeout(fetchInterval);
        clearTimeout(aInterval);
        aInterval = false;

        clearInterval(mediaFeedInterval);
        a_active = 0;

        clearTimeout(preFetchInterval);
        preFetchInterval = false;

        if (selected_aircraft != null) {
            close_aircraft_data();
        }

        $(\".modalContainer\").hide();

        blackoutMapForTimeout(function () {
            document.querySelector(\"#disable-page-text\").classList.add('visible');
        });

        const ctaPromoBtn = document.querySelector('.session-timeout-modal .cta-group .trial');

        if (ctaPromoBtn) {
            ctaPromoBtn.addEventListener('click', handlePromoCtaClick)
        }

        const ctaSeeAllSubs = document.querySelector('.session-timeout-modal .cta-group .see-all-subs')

        if (ctaSeeAllSubs) {
            ctaSeeAllSubs.addEventListener('click', handleShowAllSubsClick)
        }

        if (window.adManager) {
            window.adManager.exit();
        }
    }
}

function handlePromoCtaClick(e) {
    e.preventDefault();

    const featureName = 'Timeout Page Promo CTA';

    setCookie('subFeature', featureName);

    window.Analytics.trackAnalyticsEvent({
        eventType: window.Analytics.eventInitiateUpgrade,
        excludePlatforms: [window.Analytics.platformGoogleAnalytics],
        dynamicParams: [
            {
                value: 'Session timeout CTA',
                mixPanelFieldName: 'Entry Point',
            },
            {
                value: e.target.dataset.analyticsSubscription,
                mixPanelFieldName: 'Plan Type initiated',
            },
            {
                value: e.target.dataset.analyticsPeriod,
                mixPanelFieldName: 'Subscription duration initiated',
            },
        ],
    });

    window.location = e.target.href;
}

function handleShowAllSubsClick(e) {
    e.preventDefault();
    setCookie('subFeature', 'Timeout Page Subscriptions CTA');
    window.location = e.target.href;
}


function add_filter(type, min, max, flag) {
    if (!flag) {
        flag = 'standard';
    }

    if (window.filtersHandler.getFiltersCount() < max_filters) {
        window.filtersHandler.addFilter(type, [min, max], true);
    }

    if (flag == 'standard') {
        // Delete planes and reload
        delete_all_planes();
        executeFetchPlane();
    }
}

function getBoundsRequestValue() {
    if (!currentBounds) {
        updateBounds();
    }
    if (!currentBounds) {
        return null;
    }

    const floorBounds = function(number, decimals) {
        decimals = decimals || 3;
        const div = Math.pow(10, decimals)
        return Math.floor(number * div) / div;
    };

    const ceilBounds = function(number, decimals) {
        decimals = decimals || 3;
        const div = Math.pow(10, decimals)
        return Math.ceil(number * div) / div;
    };

    const roundBounds = function(number, decimals) {
        decimals = decimals || 3;
        //to avoid issues with rounding float by using numbers represented in exponential notation
        return Number(Math.round(number + 'e' + decimals)  + 'e-' + decimals);
    };

    let north = currentBounds.north;
    let south = currentBounds.south;
    let west = currentBounds.west;
    let east = currentBounds.east;

    // add/sub to ensure we don't have the same bounds, which results no planes
    if (north === south) {
        north += 0.001;
        south -= 0.001;
    }

    if (west === east) {
        west += 0.001;
        east -= 0.001;
    }

    return ceilBounds(north)
        + ',' + floorBounds(south)
        + ',' + ceilBounds(west)
        + ',' + floorBounds(east);
}


// this function kills kittens
function get_querystrings() {
    var check_url = window.location.pathname.substr(1).split('/'),
        urlView = ViewHandler.getViewTypeFromUrl(null),
        pb_query = 0,
        noUrlView = urlView === null ? true : false;

    var airportCodeRegex = /^[a-z]{3}$/i
    var airportIataRegex = /^[A-Za-z]{3}$/;

    // Check for View
    if (urlView !== null) {
        var val = urlView.replace(\"View\", \"\"),
            elem = $(\"#fr24_ViewsDropdown a[data-value='\" + val + \"']\");
        // Remove view from linnk
        check_url.splice(0, 1);
        if (val === \"airport\") {
            var regex = /^[a-z]{3}$/i;
            if (check_url[0] && regex.test(check_url[0])) {
                var val = check_url[0].toUpperCase();
                settingsService.setSetting(\"view.airport.selected\", val);
                check_url.splice(0, 1);
                map_left_menu_view = 'airportView';
                settingsService.setSetting('map.selected_view', map_left_menu_view);
            }
            ViewHandler.openView(\"airportView\", val);
        } else if (val === \"list\") {
            if (check_url[1] === 'airport' && airportCodeRegex.test(check_url[2])) {
                window.multiViewPanels.queue.add(check_url[2]);
            }
            ViewHandler.openView(\"listView\");
        } else if (val === \"delay\") {
            init_type = 'gray_style';
            ViewHandler.openView(\"delayView\");
        } else if (val === \"fleet\") {
            settingsService.setSetting(\"view.fleet.airline.recent\", settingsService.syncGetSetting(\"view.fleet.airline\"));
            var regex = /^[a-z]{3}$/i, fleetView = {airline: null, fleet: null};
            if (check_url[0] && regex.test(check_url[0])) {
                fleetView.airline = check_url[0].toUpperCase();
                settingsService.setSetting(\"view.fleet.airline\", fleetView);
                check_url.splice(0, 1);
                ViewHandler.openView(\"fleetViewAirline\", fleetView.airline);
            } else if (check_url[0] && check_url[0].indexOf(\"custom-\") === 0) {
                fleetView.fleet = check_url[0].substring(7);
                settingsService.setSetting(\"view.fleet.airline\", fleetView);
                check_url.splice(0, 1);
                ViewHandler.openView(\"fleetViewCustom\", fleetView.fleet);
            } else {
                var fleetView = settingsService.syncGetSetting(\"view.fleet.airline\");
                if (fleetView && fleetView.airline) {
                    ViewHandler.openView(\"fleetViewAirline\", fleetView.airline);
                } else if (fleetView && fleetView.fleet) {
                    ViewHandler.openView(\"fleetViewCustom\", fleetView.fleet);
                } else {
                    ViewHandler.openView('fleetViewAirline','SAS');
                }
            }
        } else if (urlView === 'mapview' || urlView === 'mapView') {
            ViewHandler.openView(\"mapView\");
        } else if (urlView === 'multiView') {
            var regex = /^[a-z0-9,.]+$/i;
            if (typeof check_url[0] !== 'undefined' && regex.test(check_url[0]) && !window.MapUtils.isCoordinate(check_url[0]) ) {
                var ids = check_url[0].split(',');
                ids.forEach(function (id) {
                    window.multiViewPanels.addToQueue(id);
                });
            }
            ViewHandler.openView(\"multiView\");
        }
        if (val === \"airport\" || val === \"fleet\") {
            angular.element($(\"#fr24_ViewsDropdownContainer\")).triggerHandler(\"click\");
        }
    }

    if (check_url[0] != \"\" && check_url[1] != \"\" && /^\\d{4}-\\d{2}-\\d{2}$/.test(check_url[0]) && /^\\d{2}:\\d{2}$/.test(check_url[1])) { // Starts with date/time for playback

        if (check_url[2] && /^\\d{2}x$/.test(check_url[2])) { // Has playback speed
            pb_query = 3;
        } else {
            pb_query = 2;
        }

    }

    if (check_url[0 + pb_query] && check_url[0 + pb_query] == \"filter\" && check_url[1 + pb_query] && airportIataRegex.test(check_url[1 + pb_query])) { // Has filter
        add_filter(\"callsign\", check_url[1 + pb_query].toUpperCase());
        init_filter_check = 1;
    } else if (check_url[0 + pb_query] && check_url[0 + pb_query] == \"airport\"
        && check_url[1 + pb_query]
        && (check_url[1 + pb_query] === 'delay' || airportIataRegex.test(check_url[1 + pb_query])))
    { // Has airport iata
        if (airportIataRegex.test(check_url[1 + pb_query])) {
            query_airport = check_url[1 + pb_query].toUpperCase();
            var mode = check_url[2 + pb_query];

            whenModuleLoaded('map', function(){
                show_airport_info(query_airport, mode);
            });

            if (check_url[2 + pb_query] && check_url[2 + pb_query] == \"info\")
            {
                query_airportInfo = 1;
            }

        }
    } else if (check_url[0 + pb_query] && check_url[0 + pb_query] == \"planes\") { // is Planes page


    }
    else if (check_url[0 + pb_query] && check_url[0 + pb_query] != \"\" && /^[0-9\\.-]+$/.test(check_url[0 + pb_query].split(',')[0]) && /^[0-9\\.-]+$/.test(check_url[0 + pb_query].split(',')[1])) { // Has position
        query_lat = check_url[0 + pb_query].split(',')[0];
        query_lon = check_url[0 + pb_query].split(',')[1];

        if (check_url[1 + pb_query] && check_url[1 + pb_query] != \"\" && /^\\d{1,2}$/.test(check_url[1 + pb_query])) { // Has zoom
            query_z = check_url[1 + pb_query];
        } else {
            query_z = 7;
        }

        if (check_url[2 + pb_query] && /^[A-Za-z0-9_-]{3,8}((\\/[a-fA-F0-9]+)|(,?.*))?$/.test(check_url[2 + pb_query])) {
            const flightIds = check_url[2 + pb_query].split(',');
            if(playback_mode && flightIds.length >= 1) {
                flightIds.forEach(function(id) {
                    window.multiViewPanels.addToQueue(id);
                });
                window.fr24getEventBus().emit('map.selection.add', {
                    flightId: flightIds
                });
            }
        }
    }
    else if (check_url[0 + pb_query] && check_url[0 + pb_query] != \"\" && (/^[A-Za-z0-9_-]{3,8}((\\/[a-fA-F0-9]+)|(,?.*))?$/.test(check_url[0 + pb_query]) || airportIataRegex.test(check_url[0 + pb_query]))) { // Has callsign
        query_callsign = check_url[0 + pb_query];

        if (check_url[1 + pb_query] == 'solo') {
            query_solo = 1;
            add_filter(\"callsign\", query_callsign.toUpperCase());
            init_filter_check = 1;
        } else if (check_url[1 + pb_query] == 'view') {
            query_view = 1;
        } else if (!window.multiViewPanels.queue.hasFlights() && check_url[1 + pb_query]) {
            query_callsign = check_url[1 + pb_query];
            selected_aircraft = query_callsign;
            if (noUrlView) {
                map_left_menu_view = 'mapView';
                $(\"#fr24_ViewsDropdown a[data-value='map']\").triggerHandler(\"click\");
            }
        }

        // Fix for flight/reg in url
        if (check_url[0 + pb_query] == 'flight' || check_url[0 + pb_query] == 'reg') {
            query_callsign = '';
            selectAircraft(null);

            map_left_menu_view = 'mapView';
            $(\"#fr24_ViewsDropdown a[data-value='map']\").triggerHandler(\"click\");
        }
        $query_callsign = query_callsign;

        if (check_url[check_url.length - 1].toLowerCase() === '3d') {
            load3dView = true;
        }

        if (check_url[0] && check_url[0] !== 'flight' && check_url[0] !== 'reg') {
            if (selected_aircraft !== null) {
                init_goto_aircraft = 'selected';
            } else {
                init_goto_aircraft = 'query_callsign';
            }
        }

    } else if (query_pb_date && query_pb_time && check_url[0 + pb_query] === \"\" && check_url[1 + pb_query] !== \"\" && /^[A-Za-z0-9_-]{3,8}(\\/[a-fA-F0-9]+)?$/.test(check_url[1 + pb_query])) { // is playback, has flightId without callsign
        map_left_menu_view = 'mapView';
        init_goto_aircraft = 'selected';
        selected_aircraft = check_url[1 + pb_query];
        playback_mode = 1;
    }
}

function get_querystrings_simple() {
    query_lat = getQuerystring('lat', '');
    query_lon = getQuerystring('lon', '');
    query_z = getQuerystring('z', '');
    query_type = getQuerystring('filter_type', '');
    query_filter_callsign = getQuerystring('filter_callsign', '');
    query_airports = getQuerystring('airports');
    query_pb_date_test = getQuerystring('pb_date');
    query_pb_time_test = getQuerystring('pb_time');
    query_callsign_test = getQuerystring('callsign');
    query_flight_id = getQuerystring('flight_id');
    query_solo = getQuerystring('solo');
    query_label1 = getQuerystring('label1');
    query_label2 = getQuerystring('label2');
    query_label3 = getQuerystring('label3');
    query_clouds = getQuerystring('clouds');
    query_weather = getQuerystring('weather');
    query_faa = getQuerystring('faa');
    query_ground = getQuerystring('ground');
    query_size = getQuerystring('size');
    query_color = getQuerystring('color');
    query_cycle_interval = getQuerystring('cycle');
    query_filter_airport = getQuerystring('airport_filter');
    query_single = getQuerystring('single');
    query_noinfo = getQuerystring('noinfo');
    query_maptype = getQuerystring('maptype');
    query_brightness = getQuerystring('brightness');
    query_trail = getQuerystring('trail');
    query_follow = getQuerystring('follow');
    query_flight = getQuerystring('flight');

    if (paramMinAlt > paramMaxAlt)
    {
        alert('Sorry, but minAlt param cannot be greater than maxAlt param');
    } else {
        window.filtersHandler.addFilter('altitude', [paramMinAlt, paramMaxAlt], true);
    }

    if (paramMinSpeed > paramMaxSpeed)
    {
        alert('Sorry, but minSpeed param cannot be greater than maxSpeed param');
    } else
    {
        window.filtersHandler.addFilter('speed', [paramMinSpeed, paramMaxSpeed], true);
    }

    if (parseInt(query_cycle_interval) > 0) {
        select_interval = parseInt(query_cycle_interval);

        randomAircraft = setTimeout(function () {
            select_random_aircraft(select_interval);
        }, 5000);
    }

    if (query_trail != '') {
        trail_color = query_trail;
    }

    if (query_follow != '') {
        init_follow = query_follow;
    }

    if (query_brightness != '') {

        query_brightness = parseInt(query_brightness);

        if (query_brightness > 100) {
            query_brightness = 100;
        }

        if (query_brightness < 0) {
            query_brightness = 0;
        }

        init_fade = 100 - query_brightness;
    }

    if (query_maptype != '') {
        mapTypes = {
            1: google.maps.MapTypeId.ROADMAP,
            2: google.maps.MapTypeId.TERRAIN,
            3: google.maps.MapTypeId.SATELLITE,
            4: google.maps.MapTypeId.HYBRID,
            5: 'simple_style',
            6: 'radar_style',
            7: 'radar_style2',
            8: 'gray_style',
            9: 'aubergine_style'
        };

        init_type = mapTypes[query_maptype];
    }

    if (query_label1 != '') {
        init_label_1 = query_label1;
        init_labels = 1;
    }
    if (query_label2 != '') {
        init_label_2 = query_label2;
        init_labels = 1;
    }
    if (query_label3 != '') {
        init_label_3 = query_label3;
        init_labels = 1;
    }
    if (query_faa != '') {
        faa_traffic = query_faa;
    }
    if (query_ground != '') {
        ground_traffic = query_ground;
    }
    if (query_size != '') {
        init_aircraft_size = query_size;
    }

    if (parseInt(query_airports) > 0) {
        init_airports = 1;

        if (parseInt(query_airports) > 1) {
            init_airport_density = query_airports;
        }
    }

    if (parseInt(query_clouds) > 0) {
        init_clouds = query_clouds;

        weather_tile_global_radar = 1;

        var w_cloud = new WeatherTileLayer('C09-0x0316-0', false);
        w_cloud.show();

        if (parseInt(query_clouds) > 1) {
            weather_tile_ir_satellite = 1;

            var w_precip = new WeatherTileLayer('C09-0x0374-0', false);
            w_precip.show();
        }
    }
    if (query_weather != '') {
        init_weather = query_weather;
    }

    if (query_type != '' && query_type !== null)
    {
        var arrFltrType = query_type.split(',');
        for (var item in arrFltrType)
        {
            window.filtersHandler.addFilter('aircraft', [arrFltrType[item].toUpperCase()], true);
        }
    }
    if (query_filter_callsign !== '' && query_filter_callsign !== null)
    {
        var arrFltrCallsign = query_filter_callsign.split(',');
        for (var item in arrFltrCallsign)
        {
            window.filtersHandler.addFilter('callsign', [arrFltrCallsign[item].toUpperCase()], true);
        }
    }
    if (query_filter_airport != \"\") {
        var airport_options = query_filter_airport.split(':');
        window.filtersHandler.addFilter('airport', [airport_options[1], airport_options[0].toUpperCase()], true);
    }
    if (parseFloat(query_lat) && parseFloat(query_lon) && query_lon > -180 && query_lon < 180) {
        init_lat = query_lat;
        init_lon = query_lon;
    }
    if (parseFloat(query_z) && query_z <= 15 && query_z > 1) {
        init_zoom = parseFloat(query_z);
    }

    query_reg = getQuerystring('reg', '');
    // Because of IE '&reg'  issue, both reg and _reg are supported in query string
    query_reg = (query_reg === '') ? getQuerystring('_reg', '') : query_reg;

    if (query_solo == '1') {
        if (query_reg != '') {
            window.filtersHandler.addFilter('reg', [query_reg.toUpperCase()], true);
            init_reg = query_reg;
            init_call = query_reg;

            geolocation_move = false;
        }
    }

    if (query_reg != '') {
        fetchAircraftByReg();
    }

    query_flight = getQuerystring('flight', '');

    if (query_flight != '') {
        if (query_solo == '1') {
            window.filtersHandler.addFilter('flight', [query_flight.toUpperCase()], true);

            geolocation_move = false;
        }
        init_call = query_flight;
    }

    if (query_callsign_test != \"\" && /^[A-Za-z0-9_-]{3,8}$/.test(query_callsign_test)) {

        if (query_flight_id) {
            query_callsign = query_flight_id;
        } else {
            query_callsign = query_callsign_test;
        }

        if (query_solo == '1') {
            if (query_flight_id) {
                window.filtersHandler.addFilter('flight_id', [query_flight_id], true);
            } else {
                window.filtersHandler.addFilter('callsign', [query_callsign.toUpperCase()], true);
            }

        }

        init_goto_aircraft = 'simple_callsign';
    }

    if (query_noinfo !== '' && query_noinfo === '1') {
        $(\"#leftColOverlay, #cnt-panel-clickhandler\").remove();
    }

}



function meter_to_color(meter) {

    if (typeof (trail_color) == 'undefined') {
        trail_color = 'rainbow';
    }

    if (trail_color == 'grayscale') {
        return MapUtils.grayscale(MapUtils.meter_to_color_data(meter));
    } else if (trail_color == 'rainbow') {
        return MapUtils.meter_to_color_data(meter);
    } else {
        return trail_color;
    }

}


function show_airport_info(airport, table, panTo, toggle) {
    const eventBus = window.fr24getEventBus();
    eventBus.emit('map.airportInfoSlideOut');
    airport = airport.toString().replace(/[^a-z0-9]/gi, \"\");
    increaseMapClickCounter();

    if (nav_list.airport.length === 0) {
        fetch_airport_list();
    }
    if (multi_select_mode) {
        window.multiViewPanels.add(airport, panTo, toggle);
        eventBus.emit('map.selection.add', { flightId: window.multiViewPanels.queue.getAll() });
        return;
    } else {
        return show_default_airport_info(airport, table, panTo)
    }
}

// Extended version (default)
function show_default_airport_info(airport, table, panTo) {
    if(!window.airportInfoHandler) {
        window.airportInfoHandler = new AirportInfoHandler();
    }

    switch(table)
    {
        case 'arr':
        case 'arrival':
        case 'arrivals':
            table = 'arrival';
            break;

        case 'dep':
        case 'departure':
        case 'departures':
            table = 'departure';
            break;

        case 'gro':
        case 'ground':
            table = 'ground';
            break;

    }

    if(window.airportInfoHandler.getIata() && (window.airportInfoHandler.getIata() === airport.toLowerCase() && window.airportInfoHandler.getMode() === table)) {
        return false;
    }

    resetLeftPanelAdIfNeeded(function () {
        window.airportInfoHandler.shouldReloadAd = true;
    });

    window.airportInfoHandler.open(airport, table, panTo);
    window.fr24getEventBus().emit('fr24Components.panels.shown');
    return true;
}


function createShowFunction(resourceUrl, customMapResourceId) {
    const mapResourceId = customMapResourceId || function (resourceId) {
        return resourceId;
    }
    const openInNewTab = function (href) {
        window.open(href);
    }
    const openInSameWindow = function (href) {
        window.location.href = href;
    }
    const open = function (inNewTab) {
        return inNewTab ? openInNewTab : openInSameWindow;
    }

    return function show(resourceId, newTab) {
        if (!resourceId) return false;

        const href = resourceUrl + mapResourceId(resourceId);

        open(newTab)(href);
    };
}

window.show_reg_info = createShowFunction('/data/aircraft/');
window.show_flight_info = createShowFunction('/data/flights/', function (resourceId) {
    return resourceId.toLowerCase();
});

function get_airport_flights(airport, type, first) {
    $(\"#modalContent .flightList\").hide(); // Hide flight lists
    $(\"#airportLoader\").show(); // Show loader

    $.getJSON(dispatcher.urls.site + '/AirportInfoService.php?airport=' + airport[1] + '&type=' + type + (first && first == 1 ? '&info' : ''), function (data) {
        $(\"#airportLoader\").hide(); // Hide loader
        var tbody_html = '';
        flight_list = sort_flight_list(airport, type, data['flights']); // Sort flight list

        if (type == 'in') { // If inbound list
            row_count = 0;
            for (var i in flight_list) { // Loop flights
                row_count++;
                var timeleft = minutesToHHMM((flight_list[i]['expected'].getTime() - timeLocal.getTime()) / 1000 / 60);
                tbody_html += '<tr class=\"' + (row_count % 2 == 0 ? 'dark' : '') + '\"><td class=\"first\">' + flight_list[i]['callsign'] + '</td><td>' + flight_list[i]['flight'] + '</td><td>' + flight_list[i]['name'] + '</td><td>' + flight_list[i]['type'] + '</td><td>' + addZero(flight_list[i]['expected'].getUTCHours()) + ':' + addZero(flight_list[i]['expected'].getUTCMinutes()) + ' <span class=\"small\">(' + timeleft + ')</span></td><td style=\"text-align: right;\"><button class=\"standardButton aircraftLink\" style=\"height: 1.6em;\" data-aircraft=\"' + flight_list[i]['callsign'] + '\">Go to</button></td></tr>';
            }
            if (row_count == 0) // No flights
                tbody_html = '<tr><td colspan=\"6\" style=\"text-align: center; padding: 20px; font-size: 2em; color: #aaa; font-weight: bold;\">No flights</td></tr>';

            $(\"#airportInboundList tbody\").html(tbody_html); // Add html to tbody
            $(\"#airportInboundList\").show(); // Show inbound table
        } else if (type == 'out') { // If outbound list
            row_count = 0;
            for (var i in flight_list) { // Loop flights
                row_count++;
                tbody_html += '<tr class=\"' + (row_count % 2 == 0 ? 'dark' : '') + '\"><td class=\"first\">' + flight_list[i]['callsign'] + '</td><td>' + flight_list[i]['flight'] + '</td><td>' + flight_list[i]['name'] + '</td><td>' + flight_list[i]['type'] + '</td><td style=\"text-align: right;\"><button class=\"standardButton aircraftLink\" style=\"height: 1.6em;\" data-aircraft=\"' + flight_list[i]['callsign'] + '\">Go to</button></td></tr>';
            }
            if (row_count == 0) // No flights
                tbody_html = '<tr><td colspan=\"5\" style=\"text-align: center; padding: 20px; font-size: 2em; color: #aaa; font-weight: bold;\">No flights</td></tr>';

            $(\"#airportOutboundList tbody\").html(tbody_html); // Add html to tbody
            $(\"#airportOutboundList\").show(); // Show outbound table
        }

        if (first && first == 1) { // If called from modal opener
            $(\"#airportRating a\").html('<img src=\"/static/images/ratings/black/' + data['rating'] + '.png\" alt=\"\" />'); // Set rating
            $(\"#airportComment\").html(data['comment']); // Set comment
            $(\"#modalBottom #bottomRight a\").attr(\"href\", data['url']); // Set links
            $(\"#weatherWidgetTemp img\").addClass('weather' + data['weather']['summary']['icon']).attr(\"title\", data['weather']['summary']['icon']);
            $(\"#weatherWidgetTemp span\").html('<h3>' + data['weather']['summary']['temp'] + '</h3>QNH ' + data['weather']['summary']['qnh']);
            $(\"#weatherWidgetWind img\").addClass('wind' + data['weather']['wind']['icon']).attr(\"title\", data['weather']['wind']['icon'] + ' winds');
            $(\"#weatherWidgetWind span\").html('<h3>' + data['weather']['wind']['speed'] + '</h3>' + data['weather']['wind']['direction']);
            var metar = data['weather']['metar'];
            var metar_title = metar;
            if (metar.length > 112)
                metar = metar.substring(0, 112) + \"...\";
            $(\"#modalBottom #bottomLeft p\").html(metar).attr(\"title\", metar_title);
        }

    });
}

function sort_flight_list(airport, type, flight_list) {
    // Loop flights in list
    for (var i in flight_list) {
        var dist = MapUtils.calculateDistanceBetween(airport[3], airport[4], flight_list[i]['lat'], flight_list[i]['lon']); // Distance in km between flight and airport
        // Add 3% to distance
        dist = ((dist * 1.03));
        // Save distance in object
        flight_list[i]['dist'] = dist;

        // If inbound list (only calculate ETA for inbound flights)
        if (type == 'in') {

            if (flight_list[i]['eta'] == 0 || flight_list[i]['eta'] < timeLocal.getTime() / 1000) {
                delete flight_list[i];
                continue;
            }

            flight_list[i]['expected'] = new Date(flight_list[i]['eta'] * 1000);

            continue;
        }
    }

    if (type == 'in') {
        // Sort by ETA if inbound
        flight_list.sort(sortByTime);
    } else {
        // Else on distance from airport
        flight_list.sort(sortByDistance);
    }
    // Return the flight list in order of ETA or distance
    return flight_list;
}

function sortByTime(a, b) {
    return (a['expected'].getTime() - b['expected'].getTime());
}

function sortByDistance(a, b) {
    return (a['dist'] - b['dist']);
}

function hide_airport_info() {
    window.airportInfoHandler.close();
    clearBlackout();
    $(\"#modalContainer\").hide();
}



function hideTopBar() {
    if (init_topbar === 1) {
        $(\"nav#navContainer\").animate({top: '-52px'}, 150);
        init_topbar = 0;
        viewToggleTopbar();
        settingsService.setSetting('map_topbar', 0, 365);
        $(\"body\").addClass(\"topBarHidden\");
        executeFetchPlane();
    }
}


function showTopBar() {
    if (init_topbar === 0) {
        $(\"nav#navContainer\").animate({top: '0'}, 150);
        init_topbar = 1;
        viewToggleTopbar();
        $(\"body\").removeClass(\"topBarHidden\");
        settingsService.setSetting('map_topbar', 1, 365);
    }
}

function moveMap(lat, lon, zoom) {
    if (map && geolocation_move === true) {
        map.setCenter(new google.maps.LatLng(lat, lon));
        map.setZoom(zoom);
    }
}

function showSideView(url) {
    append_html = '<div class=\"modalContainer\" id=\"sideviewContainer\"><div class=\"modalContent\" id=\"sideviewContent\"><a class=\"modalContentClose\" id=\"sideviewContentClose\" title=\"Close\"></a><div class=\"modalMainContainer\">'
            + '<img src=\"' + url + '\" /><span style=\"display: block; padding: 0 10px 10px 10px;\">&copy; Flightradar24</span>'
            + '</div></div></div>';
    $(\"body\").append(append_html);
    $(\"#sideviewContainer\").show();
    blackoutMap();
}

function hideSideView() {
    $(\"#sideviewContainer\").remove();
    clearBlackout();
}

function jumpToController(value) {
    follow_aircraft = 0;
    geolocation_move = false;
    switch (value) {
        case 'af':
            map.setCenter(new google.maps.LatLng(-1.399, 12.743));
            map.setZoom(4);
            break;
        case 'as':
            map.setCenter(new google.maps.LatLng(13.075, 79.803));
            map.setZoom(4);
            break;
        case 'eu':
            map.setCenter(new google.maps.LatLng(48.053, 9.798));
            map.setZoom(4);
            break;
        case 'na':
            map.setCenter(new google.maps.LatLng(40.518, -101.427));
            map.setZoom(4);
            break;
        case 'oc':
            map.setCenter(new google.maps.LatLng(-31.573, 143.787));
            map.setZoom(4);
            break;
        case 'sa':
            map.setCenter(new google.maps.LatLng(-22.506, 298.035));
            map.setZoom(4);
            break;
    }
}

function showSelectedRoute() {
    if (!plane_list[selected_aircraft]) {
        hideSelectedRoute();
        return false;
    }

    if (!selected_aircraft || selected_aircraft == null || !selected_data[selected_aircraft] || !selected_data[selected_aircraft]['from_pos'][0] || !selected_data[selected_aircraft]['from_pos'][1]) {
        return false;
    }

    if (!$(\"#fr24_ViewsDropdown a[data-value='list']\").parent().hasClass('disabled')) {
        $(\"#fr24_ViewsDropdown a[data-value='list'], #fr24_ViewsDropdown a[data-value='airport'], #fr24_ViewsDropdown a[data-value='fleet']\").parent().addClass('notAllowed');
    }

    showRoute = 1;
    showRoutePrevPos = [map.center.lat(), map.center.lng(), map.zoom];
    var routeBounds = new google.maps.LatLngBounds();
    var from_lat = parseFloat(selected_data[selected_aircraft]['from_pos'][0]);
    var from_lon = parseFloat(selected_data[selected_aircraft]['from_pos'][1]);

    var to_lat, to_lon;

    if (selected_data[selected_aircraft].airport.destination) {
        var to_lat = parseFloat(selected_data[selected_aircraft].airport.destination.position.latitude);
        var to_lon = parseFloat(selected_data[selected_aircraft].airport.destination.position.longitude);

        if (selected_data[selected_aircraft].airport.real && selected_data[selected_aircraft].airport.real.code.iata != selected_data[selected_aircraft].airport.destination.code.iata) {
            var real_lat = parseFloat(selected_data[selected_aircraft].airport.real.position.latitude);
            var real_lon = parseFloat(selected_data[selected_aircraft].airport.real.position.longitude);

            selected_data[selected_aircraft]['to_pos'] = [real_lat, real_lon];
            selected_data[selected_aircraft]['old_pos'] = [to_lat, to_lon];
        } else {
            selected_data[selected_aircraft]['to_pos'] = [to_lat, to_lon];
        }
        showRouteEnabled = true;
    } else if (selected_data[selected_aircraft].trail && selected_data[selected_aircraft].trail.length > 1) {
        var trailLength = selected_data[selected_aircraft].trail.length;
        showRouteEnabled = false;
        selected_data[selected_aircraft]['to_pos'] = [];
        selected_data[selected_aircraft]['to_pos'][0] = selected_data[selected_aircraft].trail[trailLength - 1].lat;
        selected_data[selected_aircraft]['to_pos'][1] = selected_data[selected_aircraft].trail[trailLength - 1].lng;
        to_lat = parseFloat(selected_data[selected_aircraft]['to_pos'][0]);
        to_lon = parseFloat(selected_data[selected_aircraft]['to_pos'][1]);
    }

    var routeDist = MapUtils.calculateDistanceBetween(from_lat, from_lon, to_lat, to_lon);
    delete_all_planes();

    update_planes();

    if ((from_lon < to_lon && (from_lon - to_lon) > -180) || (from_lon > to_lon && (from_lon - to_lon) > 180)) {
        west_lon = from_lon;
        west_lat = from_lat;
        east_lon = to_lon;
        east_lat = to_lat;
    } else {
        west_lon = to_lon;
        west_lat = to_lat;
        east_lon = from_lon;
        east_lat = from_lat;
    }

    if (routeDist > 7000) {
        west_lon = west_lon - 15;
        if (west_lat > east_lat) {
            west_lat += 5;
        } else {
            east_lat += 5;
        }
    } else if (routeDist > 2000) {
        west_lon = west_lon - 5;
        if (west_lat > east_lat) {
            west_lat += 1;
        } else {
            east_lat += 1;
        }
    } else {
        west_lon = west_lon - 2;
        if (west_lat > east_lat) {
            west_lat += 0.3;
        } else {
            east_lat += 0.3;
        }
    }

    if (west_lon < -180) {
        west_lon = 360 + west_lon;
    }

    routeBounds.extend(new google.maps.LatLng(west_lat, west_lon));
    routeBounds.extend(new google.maps.LatLng(east_lat, east_lon));
    routeBounds.extend(new google.maps.LatLng(plane_list[selected_aircraft][1], plane_list[selected_aircraft][2]));
    map.fitBounds(routeBounds);

    update_static_pins(currentBounds);
}

function hideSelectedRoute(restore) {
    showRoute = 0;
    $(\".showRouteLink\", \"#leftColOverlay, #cnt-panel-clickhandler\").removeClass(\"active\");
    $(\"#fr24_ViewsDropdown a[data-value='list'], #fr24_ViewsDropdown a[data-value='airport'], #fr24_ViewsDropdown a[data-value='fleet']\").parent().removeClass('notAllowed');

    clearMapPins('route');
    clearMapPins('airport');
    if (restore) {
        map.setCenter(new google.maps.LatLng(showRoutePrevPos[0], showRoutePrevPos[1]));
        map.setZoom(showRoutePrevPos[2]);
    }
    executeFetchPlane();
}



var left_overlay_first_load = 1;

function aircraftInfoSlideIn() {
    if (!showLeftOverlay) {
        return false;
    }

    $(\"#leftColOverlay, #cnt-panel-clickhandler\").show();

    $('body').addClass('show-left-overlay');

    const eventBus = window.fr24getEventBus();
    eventBus.emit('map.aircraftInfoSlideOut');

    // Slide in map controls
    getMapControl('logo').animate({marginLeft: '266px'}, 200);
    $(\"#overlayFlightDetails\").focus();

    $(\"#leftColOverlay, #cnt-panel-clickhandler\").height('auto');
}

function aircraftInfoSlideOut() {
    // Slide out map controls

    $('body').removeClass('show-left-overlay');

    var _cntChSmAd = document.getElementById(\"cnt-ch-sm-ad\");
    if(_cntChSmAd)
    {
        _cntChSmAd.classList.add(\"ad-hide\");
    }
    if (sidebar_closed == 0) {
        getMapControl('logo').animate({marginLeft: '212px'}, 400);
    } else {
        getMapControl('logo').animate({marginLeft: '6px'}, 200);
    }

    if (window.FR24Components && window.FR24Components.closePanel) {
        window.FR24Components.closePanel.resetStates();
    }

    if (window.FR24Components && window.FR24Components.altitudeChart) {
        if (window.FR24Components.altitudeChart.largeChart) {
            window.FR24Components.altitudeChart.minimizeChart();
        }
    }
}

function showShareBox(element) {
    var shareCallsign = $(element).attr(\"data-callsign\");
    var shareAircraft = $(element).attr(\"data-aircraft\");

    var share3D = '';

    if(typeof cockpitViewModel !== 'undefined') {
        share3D = '/3d';
    }

    var direct_link = link_url + '/' + (playback_mode == 1 ? playback_time.getFullYear() + '-' + addZero(playback_time.getMonth() + 1) + '-' + addZero(playback_time.getDate()) + '/' + addZero(playback_time.getHours()) + ':' + addZero(playback_time.getMinutes()) + '/' + playback_speed + 'x/' : '') + shareCallsign + '/' + shareAircraft + share3D;
    $(\".shareBoxWrapper\").remove();
    var shareBox = '<div class=\"shareBoxWrapper\"><div class=\"shareBoxContent\">';
    shareBox += '<input class=\"flightLink select-on-focus\" value=\"' + direct_link + '\" /><ul class=\"buttons\">';
    shareBox += '<li><a id=\"tw-share\" title=\"Share on Twitter\" class=\"button twitter\" href=\"https://twitter.com/share/?url=' + direct_link + '&text=' + shareCallsign + '+on+Flightradar24.com&hashtags=flightradar24\"></a></li>';
    shareBox += '<li><a id=\"fb-share\" title=\"Share on Facebook\" class=\"button facebook\" href=\"//www.facebook.com/sharer/sharer.php?s=100&p[title]=' + shareCallsign + '+on+Flightradar24.com&p[summary]=Flightradar24+is+the+best+live+flight+tracker+that+shows+air+traffic+in+real+time.+Best+coverage+and+cool+features!&p[url]=' + direct_link + '&p[images][0]=' + dispatcher.urls.static + '/images/fb_logo.png\"></a></li>';
    shareBox += '<li><a id=\"gp-share\" title=\"Share on Google Plus\" class=\"button gplus\" href=\"https://plus.google.com/share?url=' + direct_link + '\"></a></li>';
    shareBox += '<li class=\"last\"><a class=\"button email\" title=\"Share via email\" href=\"mailto:?&subject=' + shareCallsign + ' on Flightradar24&body=' + direct_link + '\"></a></li>';
    shareBox += '<br class=\"clear\" /></ul></div><span class=\"arrow\"></span>';
    $(\"body\").append(shareBox);
    $(\".shareBoxWrapper\").position({
        my: \"bottom+10\",
        at: \"top\",
        of: $(element)
    }).addClass(\"scale-start\");
    setTimeout('$(\".shareBoxWrapper\").addClass(\"scale-end\");', 10);
    setTimeout('$(\".shareBoxWrapper\").removeClass(\"scale-start\");', 10);
}

function hideShareBox() {
    $(\".shareBoxWrapper\").remove();
    $(\".shareFlightLink\").removeClass(\"active\");
}

function blackoutMap(showLoader) {
    var isBlack = false;
    if ($(\"#modalBlackout\").length > 0) {
        isBlack = true;
    }

    var innerHTML = '';

    if (showLoader) {
        innerHTML = '<img src=\"' + dispatcher.urls.static + '/images/loader_dark.gif\" class=\"loader\" />';
    }

    if (!isBlack) {
        var blackoutDiv = $('<div id=\"modalBlackout\"><div class=\"modalBlackout-logo\"></div>' + innerHTML + '</div>');
        $(blackoutDiv).appendTo(\"body\");
        setTimeout(function () {
            $(blackoutDiv).addClass(\"show\");
        }, 10);
    } else if (isBlack && showLoader) {
        $(\"#modalBlackout\").html(innerHTML);
    }
}

function blackoutMapForTimeout(callback) {
    var blackoutDiv = $('<div id=\"modalBlackout\"><div class=\"modalBlackout-logo\"></div></div>');

    $(blackoutDiv).addClass(\"show\");
    $(blackoutDiv).addClass(\"timeout\");

    $(blackoutDiv).appendTo(\"body\");

    if (typeof callback === 'undefined') {
        return;
    }

    var backgroundImage = new Image();
    backgroundImage.src = $('#modalBlackout').css('background-image').replace(/\"/g,\"\").replace(/url\\(|\\)$/ig, \"\");

    backgroundImage.onload = function() {
        callback();
    };
}

function clearBlackout() {

    var blackoutDiv = $(\"#modalBlackout\");
    $(\"#modalBlackout .loader\").remove();
    $(\"#modalBlackout .loadError\").remove();
    $(blackoutDiv).removeClass(\"show\");
    setTimeout(function () {
        $(blackoutDiv).remove();
    }, 300);
}

function clearBlackoutLoader() {
    $(\"#modalBlackout .loader\").remove();
}

function showBlackoutError() {
    clearBlackoutLoader();
    innerHTML = '<div class=\"loadError\"><img src=\"' + dispatcher.urls.static + '/images/loader_dark_error.png\" /><span><strong>Sorry, couldn\\'t load data.</strong><br />Please try again later.</span><input type=\"button\" value=\"Ok, close\" class=\"standardButton\" /></div>';
    $(\"#modalBlackout\").html(innerHTML);
}

function showDynamicOverlay(sectionName, url, source, overlayState) {
    if (typeof overlayState !== 'undefined' && overlayState === 'show') {
        return false;
    }
    var sectionDiv = $(\"#section-\" + sectionName);
    $(\"#mapDynamicOverlays div.dynamicOverlay\").removeClass(\"active\") // Hide all sections
    // If section has content
    if ($(sectionDiv).html().length > 0 && $(sectionDiv).attr(\"data-dynamic-url\") === url) {
        blackoutMap();
        $(sectionDiv).addClass(\"active\");
    } else { // Section is empty or does not match source url, load it
        blackoutMap(true);
        $.ajax({
            type: \"POST\",
            url: source,
            dataType: \"json\",
            timeout: 7000,
            data: {}
        }).done(function (data) {
            if (data.success === true && data.page && data.page.length > 10) {
                clearBlackoutLoader();
                $(sectionDiv).html(data.page).addClass(\"active\").attr(\"data-dynamic-url\", url);
            } else {
                showBlackoutError();
            }
        }).fail(function () {
            showBlackoutError();
        });
    }

}

function hideDynamicOverlay() {
    $(\"#mapDynamicOverlays div.dynamicOverlay\").removeClass(\"active\"); // Hide all sections
    clearBlackout();
}

function closeDynamicOverlay() {
    hideDynamicOverlay();
    setTimeout(function () {
        historyReplaceState();
    }, 500);
}

function supportsLocalStorage() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}

function getDataFromPlaneList(identification, useFlightId) {
    const keys = Object.keys(plane_list);
    if (!keys.length) {
        return null;
    }
    if (useFlightId && Boolean(plane_list[identification])) {
        return plane_list[identification];
    }

    const flightId = keys.filter(function(key) {
        const item = plane_list[key];
        return item[16] === identification;
    })[0];

    return flightId ? plane_list[flightId] : null;
}

let tries = 0;
function goToAircraft(identification, useFlightId, follow) {
    const flightsApi = window.flightsApi;
    const followAircraft = follow === undefined ? true : Boolean(follow);

    if (typeof useFlightId === 'undefined') {
        useFlightId = false;
    }

    // Cancel if callsign is empty
    if (identification === '') {
        return false;
    }

    if (map_left_menu_view == 'delayView') {
        map_left_menu_view = 'mapView';
        $(\"#fr24_ViewsDropdown a[data-value='map']\").triggerHandler(\"click\");
    }
    // Loop all planes in plane_list
    const planeData = getDataFromPlaneList(identification, useFlightId);
    if (planeData) {
        hideDynamicOverlay(); // Hide airport info
        // Select, pan to & follow the flight
        if (followAircraft && isMapPannable() && !isAirportView() && !isFleetView()) {
            follow_aircraft = (!multi_select_mode) ? 1 : 0;
            $(\"li#follow-aircraft\").addClass(\"active\");
            map.setZoom(8);
            var pos = new google.maps.LatLng(planeData[1], planeData[2]);

            map.panToOffsetted(pos);

        }
        if (multi_select_mode && !window.multiViewPanels.queue.has(identification)) {
            window.multiViewPanels.add(identification);
        } else {
            show_aircraft_data(identification);
        }
        return false;
    }

    // If flight wasn't found, reload full feed and search
    hideDynamicOverlay();
    init_call = identification;
    const buildFilterParams = build_filter_params();
    let endPointParams = {
        bounds: getBoundsRequestValue(),
        faa: faa_traffic === 1 ? 1 : 0,
        satellite: window.fsat_traffic === 1 ? 1 : 0,
        mlat: mlat_traffic === 1 ? 1 : 0,
        flarm: flarm_traffic === 1 ? 1 : 0,
        adsb: adsb_traffic === 1 ? 1 : 0,
        gnd: ground_traffic === 1 ? 1 : 0,
        air: airborn_traffic === 1 ? 1 : 0,
        vehicles: vehicular_traffic === 1 ? 1 : 0,
        estimated: estimated_traffic > 0 ? 1 : 0,
        maxage: estimated_traffic > 0 ? estimated_traffic * 60 : 0,
        gliders: glider_traffic === 1 ? 1 :0,
        time: new Date().getTime(),
        ems: 1,
        filterInfo: 1,
        selected: identification
    };
    endPointParams = Object.assign(endPointParams, {pk: getPublicKey() ? getPublicKey : null });

    const planeFeedApi = window.planeFeedApi;
    planeFeedApi.list(endPointParams, buildFilterParams, feed_request_method).then(function(response) {
        tries = 0;
        return response.json();
    }).then( function (data) {
        if(identification.includes(',')) {
            return
        }
        if (typeof data[identification] != 'undefined') {
            selected_aircraft = identification;

            if (multi_select_mode && !window.multiViewPanels.queue.has(identification)) {
                window.multiViewPanels.add(identification);
                return;
            }

            if (isMapPannable() && !isAirportView()) {
                var pos = new google.maps.LatLng(data[identification][1], data[identification][2]);
                map.setCenter(pos);
            }
            force_init_call = 1;

            if (data.selected
                && data.selected[identification]
                && data.selected[identification]['matched-filter'] === false) {

                window.filtersHandler.setShowAll(true);
                displayShowAllMsg();
            }

            if (!isAirportView() && !isListView() && !isFleetView()) {
                map.setZoom(8);
            }

            // Put this function call at the beginning of the next event loop iteration.
            // Without it, we sometimes end up with only the selected plane visible on
            // the map.
            setTimeout(function () {
                executeFetchPlane();
            });
        } else if (playback_mode == 0 && !window._requestExecuted) {
            window._requestExecuted = true;
            flightsApi.getAircraftByFlightId(identification).then(function (data) {
                var _modalAlert;
                if (data.aircraft && data.aircraft.identification && data.aircraft.identification.registration) {
                    var reg = data.aircraft.identification.registration;
                    var callsign = data.flight.identification.callsign;
                    _modalAlert = $('<div id=\"dialog-message\"  data-width=\"500\" style=\"display: none;\">' +
                        '<div class=\"modal-dialog\">' +
                        '<div class=\"modal-content\">' +
                        '<div class=\"modal-header\">' +
                        '<h1 class=\"modal-title\">Live flight not found</h1>' +
                        '</div>' +
                        '<div class=\"modal-body\">' +
                        ((callsign) ? 'The flight with callsign <strong>' + callsign + '</strong> is currently not tracked by Flightradar24. ' : 'The flight is currently not tracked by Flightradar24. ') +
                        'It\\'s either out of <a href=\"//www.flightradar24.com/how-it-works\">coverage</a> or has already landed. ' +
                        \"<br/><br/>\" + 'Do you want to see the flight history of this aircraft?' +
                        '</div>' +
                        '<div class=\"modal-footer\">' +
                        '<button type=\"button\" class=\"btn btn-blue\" style=\"cursor: pointer;float:left;\" onclick=\"$(this).closest(\\'#dialog-message\\').dialog(\\'close\\');\">No, close pop-up</button>' +
                        '<a style=\"margin-left:20px;\" href=\"/data/aircraft/' + reg.toLowerCase() + '/#' + identification + '\" class=\"btn btn-link-green\">Yes, show aircraft history</a>' +
                        '<div class=\"clear\"></div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>');
                } else {
                    _modalAlert = $('<div id=\"dialog-message\"  data-width=\"480\" style=\"display: none;\">' +
                        '<div class=\"modal-dialog modal-sm\">' +
                        '<div class=\"modal-content\">' +
                        '<div class=\"modal-header\">' +
                        '<h1 class=\"modal-title\">Live flight not found</h1>' +
                        '</div>' +
                        '<div class=\"modal-body\">' +
                        'Sorry, but we couldn\\'t find data about this flight.' +
                        '</div>' +
                        '<div class=\"modal-footer\">' +
                        '<button type=\"button\" class=\"btn btn-blue\" style=\"cursor: pointer;\" onclick=\"$(this).closest(\\'#dialog-message\\').dialog(\\'close\\');\">OK</button>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>'
                    );
                }

                if ($(\"#dialog-message:visible\").length === 0) {
                    $('body > div.bootstrap').append(_modalAlert);
                }
                load3dView  = false;
                if (!multi_select_mode) {
                    $(\"#dialog-message\").dialog({
                        modal: true,
                        draggable: false,
                        buttons: {
                            Ok: function () {
                                $(this).dialog(\"close\");
                            }
                        },
                        open: function (event, ui) {
                            $(this).dialog(\"adjustWidth\", ui);

                        },
                        close: function (event, ui) {
                            executeFetchPlane();
                        },
                        resizable: false,
                        width: 500
                    });
                }
                window._requestExecuted = false;
            });
        }
    }).catch(function(error) {
        feed_request_method = 'jsonp';
        tries++;
        if(tries >= 5) {
            const error = {
                title: 'Error.',
                description: 'Failed fetching flight data, please try again',
            };
            showModernError(error);
            return;
        }
        return goToAircraft(identification, useFlightId)
    }) ;
}



function login_check()
{
    userApi.session().then(function (data) {
        if (!data.identity) {
            let message = '<h1 class=\"loggedout\">You have been logged out from Flightradar24.</h1>';
            message += '<div class=\"login\"><a class=\"btn-link-white\" href=\"' + dispatcher.urls.site + '\">Log in again</a></div>';
            $(\"#disable-page-text .disable-page-content\").html(message);
            exit_map();
            clearInterval(loginCheckInterval);
        }
    });
}

function closeSidebar(aSpeed) {
    aSpeed = aSpeed || 200;
    sidebar_closed = 1;
    $(\".overlayBoxContainer\").hide();
    if (map_left_menu_view == \"delayView\")
    {
        $(\"#leftCol\").animate({left: '-280px'}, aSpeed, function () {});
    } else
    {
        $(\"#leftCol\").animate({left: '-280px'}, aSpeed, function () {});
    }
    map && executeFetchPlane();
}
function showSidebar() {
    sidebar_closed = 0;
    $(\"#leftCol\").animate({left: '0'}, 150, function () {});
}


function checkSidebarState() {
    if (isResizeForMobile) {
        if (typeof cookie_map_sidebar_closed == \"undefined\") {
            if (sidebar_closed === 0 && $(window).width() <= 550) {
                settingsService.setSetting(\"map_sidebar_closed\", 1, 365);
            }
        } else if (parseInt(cookie_map_sidebar_closed) === 1) {
            if (sidebar_closed === 0 && $(window).width() <= 550) {
                settingsService.setSetting(\"map_sidebar_closed\", 1, 365);
            } else if (sidebar_closed === 1 && $(window).width() > 550) {
                settingsService.setSetting(\"map_sidebar_closed\", 0, 365);
            }
        }
    }
}

function handleDelayStats() {
    setupDelayStatsTimer();
    setupDelayStatsHandlers();
}

function setupDelayStatsTimer() {
    const delayStatsRefreshRate = (5 * 60 * 1000);

    updateDelayStats();

    delayStatsInterval = setInterval(updateDelayStats, delayStatsRefreshRate);
}

function updateDelayStats() {
    const airportsApi = window.airportsApi;
    window.fr24getEventBus().emit('airport.stats.updating');
    airportsApi.delays().then(
        function(response) {
            response.json().then(function(data) {
                window.fr24getEventBus().emit('airport.stats.updated', data);
            });
        }
    );
}

function handleGeoIPLocation() {
    if(!window.geoLocationHandler && typeof window.GeoLocationHandler === \"function\") {
        window.geoLocationHandler = new GeoLocationHandler();
        if(!settingsService.syncGetSetting(\"map_lat\") || !settingsService.syncGetSetting(\"map_lon\")) {
            window.geoLocationHandler.getCoordinates().then(function(coords) {
                window.geoLocationHandler.setMapCoords();
                geolocation_move = true;
                update_map_position(coords.lat, coords.lon, init_zoom);
                moveMap(coords.lat, coords.lon, init_zoom)
                geolocation_move = false;
            });
        }
    }
}

$().ready(function () {

    $('#map_canvas').on('click', function() {
        window.fr24getEventBus().emit('map.canvas.click');
    })

    $('#fr24_SettingsDropdown').on('settings_changed', function(evt, aName, aValue) {
        switch (aName) {
            case \"unit_speed\":
            case \"unit_alt\":
                whenDomLoaded(initSettings);
                break;
        }
    });

    if(!dispatcher.isMobile) {
        whenModuleLoaded(\"widgetPanel\", setupDelayStatsTimer);
    }

    if ($('body.mobile').length) {
        isResizeForMobile = true;
    }
    setTimeout(checkSidebarState, 200);

    if (typeof window.get_navdata == 'function') {
        login_check();
        loginCheckInterval = setInterval(function () {
            login_check();
        }, 1000 * 60 * 15); // 15min

        $('.premum-contents', \"#leftColOverlay, #cnt-panel-clickhandler\").removeClass('premum-contents');
    } else {
        $('.premum-contents', \"#leftColOverlay, #cnt-panel-clickhandler\").next('.attrText').html('');
    }

    // Ajaxify fix
    if (location.hash.substr(0, 3) == '#!/') {
        window.location = dispatcher.urls.site + '/' + location.hash.substr(3, (location.hash.length - 3));
    }

    $(\".no-click\").click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    });

    // Aircraft data close button
    $(document.body).on(\"click\", \"#leftColOverlay .close, #cnt-panel-clickhandler .close\", function () {

        $(\".aircraft_marker.active .aircraft_label_container\").remove();
        if ($(\"#aircraft_\" + selected_aircraft + \" .temporary_label\").length > 0) {
            $(\"#aircraft_\" + selected_aircraft + \" .temporary_label\").removeClass(\"opacity_0\").show();
        }

        var aircraft = selected_aircraft;
        close_aircraft_data();
        remove_label(aircraft, true);
    });

    $(document.body).on(\"focus\", \"input.select-on-focus\", function () {
        $(this).select();
    }).on(\"mouseup\", \"input.select-on-focus\", function (e) {
        e.preventDefault();
    });

    $(document.body).on(\"click\", \"a#chat-link\", function () {
        window.open(\"//www.flightradar24.com/chat/index.php\", \"Chat\", \"menubar=no,width=550,height=600,toolbar=no\");
    });

    $(document.body).on(\"change\", \"#jump-to\", function () {
        jumpToController($(this).val());
        $(this).val(\"\");
    });

    $(\".overlayBoxClose\").click(function () {
        $(\".overlayBoxContainer\").hide();
    });

    if ($(\"#mac-overlay\").length > 0) {
        $(\"#mac-overlay-background\").css(\"opacity\", 0.7).show();
        $(\"#mac-overlay\").css(\"left\", (($(\"body\").width() - 800) / 2) + \"px\").css(\"top\", (($(\"body\").height() - 570) / 2) + \"px\").show();
    }

    $(\"#mac-overlay a\").click(function () {
        $(\"#mac-overlay-background\").remove();
        $(\"#mac-overlay\").remove();
    });

    $(\"#modalContentClose\").click(function () {
        hide_airport_info();
    });

    $(\"#airportListType\").change(function () {
        get_airport_flights(selected_airport, $(this).val());
    });

    $(document).on(\"click\", \".aircraftLink\", function () {
        goToAircraft($(this).attr(\"data-aircraft\"));
        return false;
    });

    if (simple_mode != true) {
        $('select#airportListType').selectmenu({appendTo: '#modalContent', maxHeight: 400});

        initializeSearchAutocomplete();
    }

    

    $(document.body).on(\"click\", \"#cockpitClose\", function () {
        $('.pilotViewLink').removeClass('active');
    });

    $(document.body).on(\"click\", \".pilotViewLink, #btn-aircraft-action-3d\", function () {
        show3DView();
    });

    $('#sessions-left-notification .promo-close').click(function() {
        $(this).parent().fadeOut();
    });

    $(document.body).on(\"click\", \"#satellite-form-dialog a.close\", function() {
        $(\"#satellite-form-dialog iframe\").removeAttr(\"src\");
        $(\".sat-backdrop\").hide();
        $(this).parent().hide();
    });

    $(document.body).on(\"click\", \".satInfo a\", function() {
        var radarId = $(this).parent().data(\"radarId\");
        if(radarId) {
            var formURL = dispatcher.urls.site + \"/contact-us/satellite-data?radar=\"+radarId+\"&mode=desktop\";
            $(\"#satellite-form-dialog iframe\").attr(\"src\", formURL);
            $(\".sat-backdrop\").show();
            $(\"#satellite-form-dialog\").show();
        }
    });

    $(document.body).on(\"click\", \"#fb-share\", function () {
        var centerWidth = (window.screen.width - 600) / 2;
        var centerHeight = (window.screen.height - 450) / 2;
        var href = $(this).attr(\"href\");
        window.open(href, 'sharer', 'resizable=0,toolbar=0,status=0,width=600,height=350,top=' + centerHeight + ',left=' + centerWidth);
        return false;
    });

    $(document.body).on(\"click\", \"#tw-share\", function () {
        var centerWidth = (window.screen.width - 600) / 2;
        var centerHeight = (window.screen.height - 450) / 2;
        var href = $(this).attr(\"href\");
        window.open(href, 'sharer', 'resizable=0,toolbar=0,status=0,width=600,height=250,top=' + centerHeight + ',left=' + centerWidth);
        return false;
    });

    $(document.body).on(\"click\", \"#gp-share\", function () {
        var centerWidth = (window.screen.width - 480) / 2;
        var centerHeight = (window.screen.height - 450) / 2;
        var href = $(this).attr(\"href\");
        window.open(href, 'sharer', 'resizable=0,toolbar=0,status=0,width=480,height=250,top=' + centerHeight + ',left=' + centerWidth);
        return false;
    });

    $(document.body).on(\"click\", \"img.sideView\", function () {
        showSideView($(this).attr(\"src\"));
    });

    $(document.body).on(\"click\", \"a#sideviewContentClose\", function () {
        hideSideView();
    });

    $(document.body).on(\"click\", \"a.shareFlightLink\", function () {
        if ($(this).hasClass(\"disabled\")) {
            return false;
        }

        if ($(this).hasClass(\"active\")) {
            hideShareBox();
        } else {
            $(this).addClass(\"active\");
            showShareBox($(this));
        }

    });

    if (!simple_mode) {
        History.Adapter.bind(window, 'statechange', function () {
            var State = History.getState();

            hide_tooltip();

            if (State) {
                if (State.data.currentSection && State.data.currentSection !== '') { // If state contains a section
                    if (State.data.currentCallback && State.data.currentCallback !== '') {
                        eval(State.data.currentCallback);
                    } else {
                        showDynamicOverlay(State.data.currentSection, State.data.currentUrl, State.data.currentSource, State.data.currentOverlayState); // Show it
                    }
                }
            }
        });
    }

    $(document.body).on(\"click\", \"div.dynamicOverlay a.close, #modalBlackout .loadError input\", function () {
        closeDynamicOverlay();
        executeFetchPlane();
    });

    $(document.body).on(\"click\", \"div.dynamicOverlay a.fa-map-marker\", function () {

        var lat = $(this).data('lat');
        var xlong = $(this).data('long');
        var pos;

        if (lat && xlong && isMapView()) {
            pos = new google.maps.LatLng(lat, xlong);

            map.setZoom(8);
            map.panTo(pos);
            closeDynamicOverlay();
            executeFetchPlane();

            return false;
        }
    });

    $(document.body).keydown(function (event) {
        if (event.which === 27 && $(\"#mapDynamicOverlays .dynamicOverlay.active\").length > 0) {
            closeDynamicOverlay();
        }
    });

    $(document.body).on(\"click\", \"ul.ui-autocomplete span.arrivals\", function () {
        show_airport_info($(this).attr(\"data-iata\"), 'arr', true, false);
    });

    $(document.body).on(\"click\", \"ul.ui-autocomplete span.departures\", function () {
        show_airport_info($(this).attr(\"data-iata\"), 'dep', true, false);
    });

    $(document.body).on(\"click\", \"ul.ui-autocomplete span.onground\", function () {
        show_airport_info($(this).attr(\"data-iata\"), 'gro', true, false);
    });


    $(\"#leftColOverlay\").on(\"click\", \".airportLink\", function () {
        var iata = $(this).attr(\"data-iata\").trim();
        if (iata !== '') {
            show_airport_info(['', $(this).attr(\"data-iata\")]);
        }
    });

    $(\"#airport-origin-link, #airport-destination-link\").on(\"click\", function (e)
    {
        e.preventDefault();
        var iata = $(this).attr(\"data-iata\").trim();
        if (iata !== '')
        {
            show_airport_info(['', $(this).attr(\"data-iata\")]);
        }
    });

    $(\"#leftColOverlay\").on(\"click\", \".regLink\", function () {
        show_reg_info($(this).attr(\"data-reg\"));
    });


    $(\"#leftColOverlay\").on(\"click\", \".btn-info-window\", function () {
        var id = $(this).data('class'),
                name = 'lo_' + id,
                value = 0;

        $('#leftColOverlay').toggleClass(id);

        if ($('#leftColOverlay').hasClass(id)) {
            value = 1;
        }

        settingsService.setSetting(name, value);
    });


    $(document.body).on(\"mouseenter\", \"ul.ui-autocomplete span.info\", function () {
        goToWasHovered = true;
    });
    $(document.body).on(\"mouseleave\", \"ul.ui-autocomplete span.info\", function () {
        goToWasHovered = false;
    });

    //Event handlers for toggling weather layers
    $('#layoutsettings .accordion').on('shown.bs.collapse', function (e) {
        $(\".other_layers_section\").hide();
    });

    $('#layoutsettings .accordion').on('hidden.bs.collapse', function (e) {
        $(\".other_layers_section\").show();
    });

    function resetWeatherToggle() {
        $(\"#layoutsettings .accordion\").trigger(\"hidden.bs.collapse\");
        $(\"#layoutsettings #weather_layers\").removeClass(\"in\");
        $(\"#layoutsettings .accordion-toggle\").addClass(\"collapsed\");
    }

    $('div[data-toggle=\"tab\"]').on('shown.bs.tab', function () {
        if ($(this).attr(\"href\") != \"#layoutsettings\") {
            resetWeatherToggle();
        }
    });

    $(window).resize(function () {
        checkSidebarState();
    });

    $(\"#fr24_ViewsDropdownContainer button\").click(function () {
        var _parent = $(\"#fr24_ViewsDropdownContainer\");
        if ($(_parent).hasClass('open')) {
            $('.view-search', _parent).show();
        } else {
            $('.view-search', _parent).hide();
        }
    });
    $(\"#fr24_ViewsDropdownContainer\").click(function (e) {
        if ($(e.target)[0].nodeName === 'INPUT') {
            return false;
        }

        if ($(this).hasClass('open')) {
            $('.view-search', this).show();
        } else if (map_left_menu_view !== 'multiView') {
            $('.view-search', this).hide();
        }
    });
    $(\"#fr24_ViewsDropdown li a\").click(function () {
        if ($(this).parent().hasClass('notAllowed')) {
            return false;
        }
        if (!$(this).parent().hasClass('disabled')) {
            changeViewTitleText($(this).data('value'));
            if (NavigationManager && NavigationManager.initNavState() == true) {
                settingsService.setSetting('map_left_menu_view', map_left_menu_view);
                if (NavigationManager && typeof NavigationManager.updateUserProfile === 'function') {
                    NavigationManager.updateUserProfile('put');
                }
            }
        }
    });

    setting_map_left_menu_view = settingsService.syncGetSetting(\"map.selected_view\");
    if (setting_map_left_menu_view) {
        changeViewTitleText(setting_map_left_menu_view);
    }
});

function calculateNewPlaybackPos(aircraft, plane_list_next, playback_speed, speedFactor) {

    if (!plane_list_next[aircraft]) {
        return false;
    }

    var ts_now = timeLocal.getTime(); // Current ts
    var ts_diff = 0;

    if (plane_list[aircraft]) {
        ts_diff = 5100;
    } else {
        ts_diff = 5100;
    }

    var ts_new = ts_now + ts_diff; // Ts in 10 seconds

    planes_array_fake[aircraft] = {};

    if (planes_array[aircraft]) {
        // speedFactor was 48 and I have NO idea what that means
        planes_array_fake[aircraft]['dist'] = MapUtils.calculateDistanceBetween(plane_list_next[aircraft][1], plane_list_next[aircraft][2], planes_array[aircraft].position.lat(), planes_array[aircraft].position.lng()) / speedFactor / 6371;
    }

    var lat2 = MapUtils.toRad(plane_list_next[aircraft][1]);
    var lon2 = MapUtils.toRad(plane_list_next[aircraft][2]);
    var lat1 = MapUtils.toRad(plane_list[aircraft][1]);
    var lon1 = MapUtils.toRad(plane_list[aircraft][2]);
    var dLon = (lon2 - lon1);
    var y = Math.sin(dLon) * Math.cos(lat2);
    var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    var brng = Math.atan2(y, x);
    brng = (MapUtils.toDeg(brng) + 360) % 360; // New bearing


    planes_array_fake[aircraft]['ts'] = ts_new;
    planes_array_fake[aircraft]['ms'] = 0;

    planes_array_fake[aircraft]['newlat'] = plane_list_next[aircraft][1];
    planes_array_fake[aircraft]['newlon'] = plane_list_next[aircraft][2];

    planes_array_fake[aircraft]['brng'] = brng; //plane_list_next[aircraft][3];
    planes_array_fake[aircraft]['speed'] = plane_list_next[aircraft][5] * 1.852 * playback_speed;
    var radar = ((plane_list[aircraft]) ? plane_list[aircraft][7] : '');
    if (polylines[aircraft] && polylines[aircraft].length > 0 && aircraft == selected_aircraft && !radar.match(radarRegexp)) {

        var last_path = polylines[aircraft][polylines[aircraft].length - 1].getPath().getAt(0);
        var polyLineCoordinates = [new google.maps.LatLng(plane_list[aircraft][1], plane_list[aircraft][2]), last_path];
        var polyLine = new google.maps.Polyline({
            path: polyLineCoordinates,
            strokeColor: meter_to_color(plane_list[aircraft][4] * 0.3048),
            strokeOpacity: 0.6,
            strokeWeight: 3,
            geodesic: true
        });
        polyLine.setMap(map);
        polylines[aircraft].push(polyLine);
        polylines_index[aircraft][plane_list[aircraft][1] + '/' + plane_list[aircraft][2]] = '1';
    }

    var newbrng = brng;

    if (planes_array[aircraft]) {
        var isActive = (aircraft === selected_aircraft || window.multiViewPanels.queue.has(aircraft));
        var radar = ((plane_list[aircraft]) ? plane_list[aircraft][7] : '')

        planes_array[aircraft].setIcon(get_sprite(plane_list[aircraft][8], newbrng, isActive, plane_list[aircraft][6], radar));
        plane_details.get(planes_array[aircraft]).aircraft_track = newbrng;
    }

}

function calculatePlaybackPos(aircraft) {

    if (planes_array[aircraft] && planes_array_fake[aircraft]) {
        if (planes_array_fake[aircraft]) {

            planes_array_fake[aircraft]['ms'] += playback_tick_ms_real;

            var lat1 = MapUtils.toRad(planes_array_fake[aircraft]['newlat']);
            var lon1 = MapUtils.toRad(planes_array_fake[aircraft]['newlon']);
            var dist = (MapUtils.calculateDistanceBetween(planes_array[aircraft].position.lat(), planes_array[aircraft].position.lng(), planes_array_fake[aircraft]['newlat'], planes_array_fake[aircraft]['newlon']) / 6371) - planes_array_fake[aircraft]['dist'];

            var brng = parseInt(planes_array_fake[aircraft]['brng']);
            if (brng >= 180)
                brng = brng - 180;
            else
                brng = brng + 180;
            brng = MapUtils.toRad(brng);
            var lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) + Math.cos(lat1) * Math.sin(dist) * Math.cos(brng));
            var lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist) * Math.cos(lat1), Math.cos(dist) - Math.sin(lat1) * Math.sin(lat2));
            lon2 = (lon2 + 3 * Math.PI) % (2 * Math.PI) - Math.PI;  // Normalise to -180..+180
            lat2 = MapUtils.toDeg(lat2);
            lon2 = MapUtils.toDeg(lon2);
            plane_list[aircraft][1] = lat2;
            plane_list[aircraft][2] = lon2;
            return new google.maps.LatLng(lat2, lon2);
        }

    }

}


planePositionsWorker.onmessage = function(e) {
    switch(e.data.cmd) {
        case 'calculateCurrentPos':
            updateMarker(e.data.aircraftID, e.data.result.longitude, e.data.result.latitude);
            break;
        case 'calculateNewPos':
            updateNewMarker(e.data.aircraftID, e.data.result.fakeAircraft, e.data.result.newBearing, e.data.result.newTimestamp);
            break;
    }
};

function updateNewMarker(aircraftID, fakeAircraft, newBearing, newTimestamp) {

    planes_array_fake[aircraftID] = fakeAircraft;

    if(newBearing !== null && plane_list[aircraftID] && planes_array[aircraftID] && plane_details.get(planes_array[aircraftID])) {
        plane_details.get(planes_array[aircraftID]).aircraft_track = newBearing;
    }

    if(newTimestamp !== null && plane_list[aircraftID]) {
        plane_list[aircraftID][10] = newTimestamp;
    }
}

function updateMarker(aircraftID, longitude, latitude) {
    if (!planes_array[aircraftID]) {
        return;
    }

    var pos = new google.maps.LatLng(latitude, longitude);
    var updatePosition = false;

    plane_list[aircraftID][1] = latitude;
    plane_list[aircraftID][2] = longitude;

    planes_array[aircraftID].setPosition(pos); // and set it

    if(planes_array[aircraftID].aircraft_type === \"SLEI\") {
        var selectedIcon = false;

        if (aircraftID === selected_aircraft || aircraftID === current_hover) { // If the plane is selected, or we are currently hovering it
            selectedIcon = true;
        }
    }

    labelHandler.move(aircraftID, pos);
    if (selected_aircraft === aircraftID || window.multiViewPanels.queue.has(aircraftID)) { // Draw fake polyline if plane is selected
        if (!showLeftOverlay && !isMapView() && !isFleetView()) {
            angular.element($('#aircraftInfoOverlay')).scope().updatePosition();
        }
        draw_fake_polyline(aircraftID);
        if (follow_aircraft === 1 && !plane_list[aircraftID]['followed'] && isMapPannable()) { // If follow aircraft
            plane_list[aircraftID]['followed'] = 1; // Remember that be already moved the map

            // Move the map
            if (!isAirportView()) {
                if(!screen.orientation || (screen.orientation && screen.orientation.type && screen.orientation.type.indexOf(\"primary\") === -1))
                {
                    screen.orientation = {
                        angle: window.orientation,
                        type: (window.orientation === 90 || window.orientation === -90) ? \"landscape\" : \"portrait\"
                    }
                }
                if(dispatcher.display.isMobile && (screen.orientation.type.indexOf(\"landscape\") >= 0) && document.body.classList.contains(\"show-left-overlay\"))
                {
                    var span = map.getBounds().toSpan();
                    pos = new google.maps.LatLng(pos.lat(), (pos.lng() + span.lng() * -0.25));
                }
                map.panToOffsetted(pos);
            }
        }
    }
}



function animate() {
    if (aInterval) {
        animationPause();
    }

    var ts_now = timeLocal.getTime(); // Current ts

    for (var i in planes_array) { // Loop planes
        if (plane_list_org && plane_list_org[i] && plane_list_org[i][5] > 0 && ts_now - (plane_list_org[i][10] * 1000) < 30000) { // If ts is newer than 30 seconds

            if (!planes_array_fake[i] && planes_array[i]) { // If first time since new feed
                planePositionsWorker.postMessage({
                    cmd: 'calculateNewPos',
                    aircraftID: i,
                    acInPlaneListOrg: plane_list_org[i],
                    acInPlaneList: plane_list[i],
                    acInPlaneListOld: plane_list_old[i],
                    markerCoordinates: {
                        latitude: planes_array[i].position.lat(),
                        longitude: planes_array[i].position.lng()
                    }
                });
            }
            if(planes_array[i] && planes_array_fake[i]) {
                planePositionsWorker.postMessage({
                    cmd: 'calculateCurrentPos',
                    aircraftID: i,
                    acInFakeArray:  planes_array_fake[i]
                });
            }
        }
    }

    if (window.init_anim || 0) {
        a_active = 1;
        var nextAnimation = getAnimationInterval(planes_showing, currentZoom);

        if (nextAnimation <= 16) {
            aInterval = requestAnimationFrame(animate); // Set timeout for next animation
        } else {
            aInterval = setTimeout(animate, nextAnimation); // Set timeout for next animation
        }
    }
}

function animationPause() {
    clearTimeout(aInterval);
}

function restartAnimation() {
    animationPause();
    init_anim = 1;
    animate();
}

function animationPlay() {
    // cache current map latitude for `getAnimationInterval` function
    currentMapLatitude = map.center.lat();

    animate();
}

function getAnimationInterval(planesVisible, zoomLevel) {
    var nextAnimationBasedOnPlanes = 100;
    var nextAnimationBasedOnZoom = 100;

    if (planesVisible <= 10) { // Decide fps
        nextAnimationBasedOnPlanes = 16;
    } else if (planesVisible <= 60) {
        nextAnimationBasedOnPlanes = 50;
    } else if (planesVisible <= 100) {
        nextAnimationBasedOnPlanes = 250;
    } else if (planesVisible <= 200) {
        nextAnimationBasedOnPlanes = 500;
    } else if (planesVisible <= 400) {
        nextAnimationBasedOnPlanes = 1000;
    } else if (planesVisible <= 600) {
        nextAnimationBasedOnPlanes = 2000;
    } else if (planesVisible <= 1000) {
        nextAnimationBasedOnPlanes = 3000;
    } else {
        nextAnimationBasedOnPlanes = 4000;
    }

    if (zoomLevel >= 0 && zoomLevel <= 12) {
        // We use currentMapLatitude here purposely, as a cached value of map.getCenter().lat()
        // We don't want to use settingsService (at least syncReadSetting), because it is blocking
        nextAnimationBasedOnZoom = zoomAnimationLookupTable[zoomLevel] * Math.cos(currentMapLatitude * (Math.PI / 180));
    }

    // choose longest interval, but not bigger that 8 seconds
    return Math.min(8000, Math.max(nextAnimationBasedOnPlanes, nextAnimationBasedOnZoom));
}



function calculateCurrentPos(aircraft) {
    if (planes_array[aircraft] && planes_array_fake[aircraft]) {
        var ts_now = timeLocal.getTime(); // Current ts
        if (planes_array_fake[aircraft]['ts'] > ts_now) {
            var lat1 = MapUtils.toRad(planes_array_fake[aircraft]['newlat']);
            var lon1 = MapUtils.toRad(planes_array_fake[aircraft]['newlon']);
            var distance = (planes_array_fake[aircraft]['speed'] / 60 / 60 * ((planes_array_fake[aircraft]['ts'] - ts_now) / 1000)); // Calculate distance with speed and time
            var dist = distance / 6371;
            var brng = parseInt(planes_array_fake[aircraft]['brng']);
            if (brng >= 180)
                brng = brng - 180;
            else
                brng = brng + 180;
            brng = MapUtils.toRad(brng);
            var lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) + Math.cos(lat1) * Math.sin(dist) * Math.cos(brng));
            var lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist) * Math.cos(lat1), Math.cos(dist) - Math.sin(lat1) * Math.sin(lat2));
            lon2 = (lon2 + 3 * Math.PI) % (2 * Math.PI) - Math.PI;  // Normalise to -180..+180
            lat2 = MapUtils.toDeg(lat2);
            lon2 = MapUtils.toDeg(lon2);
            plane_list[aircraft][1] = lat2;
            plane_list[aircraft][2] = lon2;
            return new google.maps.LatLng(lat2, lon2);
        } else {
            return new google.maps.LatLng(planes_array_fake[aircraft]['newlat'], planes_array_fake[aircraft]['newlon']);
        }
    }
}

function calculateFirstPos(aircraft) {
    if (plane_list[aircraft]) {
        var ts_now = timeLocal.getTime(); // Current ts
        var lat1 = MapUtils.toRad(plane_list_org[aircraft][1]);
        var lon1 = MapUtils.toRad(plane_list_org[aircraft][2]);
        var distance = (plane_list_org[aircraft][5] * 1.852 / 60 / 60 * ((ts_now - (plane_list_org[aircraft][10] * 1000)) / 1000)); // Calculate distance with speed and time
        var dist = distance / 6371;
        var brng = MapUtils.toRad(parseInt(plane_list_org[aircraft][3]));
        var lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) + Math.cos(lat1) * Math.sin(dist) * Math.cos(brng));
        var lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist) * Math.cos(lat1), Math.cos(dist) - Math.sin(lat1) * Math.sin(lat2));
        lon2 = (lon2 + 3 * Math.PI) % (2 * Math.PI) - Math.PI;  // Normalise to -180..+180
        lat2 = MapUtils.toDeg(lat2);
        lon2 = MapUtils.toDeg(lon2);
        plane_list[aircraft][1] = lat2;
        plane_list[aircraft][2] = lon2;
        return new google.maps.LatLng(lat2, lon2);
    }
}

function locateMapControls() {
    var Controls = {};
    var mapControlChildren = $(\"#map_canvas > div:first-child > div:first-child\").children(\":eq(1), div.gmnoprint\");

    Object.keys(g_MapControlPosition).forEach(function (sType) {
        var iPosition = g_MapControlPosition[sType];
        Controls[sType] = mapControlChildren.eq(iPosition);
    });

    return Controls;
}

function getMapControl(sControlId) {
    if (!g_MapControls.length) {
        g_MapControls = locateMapControls();
    }

    if (g_MapControls[sControlId]) {
        return g_MapControls[sControlId];
    } else {
        return $('<div>', {'id': 'map_control_' + sControlId});
    }
}

function getParam(searchParam, defaultValue)
{
    if (typeof defaultValue == 'undefined')
    {
        defaultValue = null;
    }

    var _returnVal = decodeURI(window.location.search.replace(new RegExp(\"^(?:.*[&\\\\?]\" + encodeURI(searchParam).replace(/[\\.\\+\\*]/g, \"\\\\$&\") + \"(?:\\\\=([^&]*))?)?.*$\", \"i\"), \"$1\"));
    if (_returnVal == '')
    {
        return defaultValue;
    }
    return _returnVal;
}

function pushPolyPoint(circleColor, latLng, customData)
{
    if (init_track_tooltip !== 1) {
        return;
    }
    if (typeof customData === 'undefined') {
        customData = {time: null, speed: null, alt: null};
    }

    var drawCircle = false;
    if (customData.time) {
        customData.time = customData.time * 1000;
        var _date = new Date(customData.time);

        if (last_polycircle_time === null) {
            last_polycircle_time = new Date(customData.time);
            drawCircle = true;
        } else {
            // interval
            var interval;
            if (customData.alt > 0 && customData.alt < 1000) {
                interval = 1000 * 60; // 1 min
            } else if (customData.alt > 1000 && customData.alt < 2000) {
                interval = 1000 * 60; // 1 min
            } else {
                interval = 1000 * 60 * 2; // 2 min
            }

            if ((_date.getTime() - last_polycircle_time.getTime()) > interval) {
                drawCircle = true;
                last_polycircle_time = new Date(customData.time);
            }
        }

        _hours = _date.getUTCHours().toString().fulfill(2, 0);
        _minutes = _date.getUTCMinutes().toString().fulfill(2, 0);

        customData.time = ['UTC ', _hours, ':', _minutes].join('');
    }
    if (customData.speed) {
        var units = {'kt': 1, 'kmh': 1.852, 'mph': 1.1508};
        var unitNames = {'kt': 'kt', 'kmh': 'km/h', 'mph': 'mph'};
        customData.speed = Math.round(customData.speed * units[init_unit_speed]) + ' ' + unitNames[init_unit_speed];
    }

    if (customData.alt) {
        var units = {'ft': 1, 'm': 0.3048};
        customData.alt = formatNumber(Math.round(customData.alt * units[init_unit_alt])) + ' ' + init_unit_alt;
    }

    if (drawCircle) {
        var polyPoint = {
            strokeColor: \"#FF0000\",
            strokeOpacity: 0,
            strokeWeight: 40,
            fillColor: circleColor,
            fillOpacity: 1,
            map: map,
            center: new google.maps.LatLng(latLng[0], latLng[1]),
            radius: tooltipRadius[map.getZoom()],
            customData: customData
        };

        polyPointCirclesRaw.push(polyPoint);

        // Workaround for InfoWindow overflowissue
        var contents = '<div class=\"selectedAircfratTooltip\">' +
                '<div><strong>Time:</strong> -</div>' +
                '<div><strong>Ground speed:</strong> -</div>' +
                '<div><strong>Altitude:</strong>  -</div>' +
                '</div>';
        infowindow.open(map);
        infowindow.setContent(contents);
        infowindow.close();
    }
}

function drawPolyPoint()
{
    if (polyPointCirclesRaw.length === 0) {
        return false;
    }
    for (i = 0; i < polyPointCircles.length; i++) {
        polyPointCircles[i].setMap(null);
    }
    polyPointCircles = [];
    // Remove last 5 min Tooltip points
    var len = polyPointCirclesRaw.length,
            numPoints = (polyPointCirclesRaw[len - 1].customData.alt < 2000) ? 1 : 2;
    var radius = tooltipRadius[map.getZoom()];

    for (var i = 0; i < (len - numPoints); i++) {
        var polypoint = polyPointCirclesRaw[i];
        var polyPointCircle = new google.maps.Circle(polypoint);
        polyPointCircle.setRadius(radius);
        polyPointCircles.push(polyPointCircle);
        var eventFunction = function (e) {
            clearTimeout(infowindowHide);
            follow_aircraft = 0;
            var contents = '<div class=\"selectedAircfratTooltip\">' +
                    '<div><strong>Time:</strong> ' + this.customData.time + '</div>' +
                    '<div><strong>Ground speed:</strong> ' + this.customData.speed + '</div>' +
                    '<div><strong>Altitude:</strong> ' + this.customData.alt + '</div>' +
                    '</div>';
            infowindow.open(map);
            infowindow.setContent(contents);
            infowindow.setPosition(new google.maps.LatLng(e.latLng.lat(), e.latLng.lng()));
        };

        google.maps.event.addListener(polyPointCircle, 'mouseover', eventFunction);
        google.maps.event.addListener(polyPointCircle, 'click', eventFunction);
        google.maps.event.addListener(polyPointCircle, 'mouseout', function () {
            infowindowHide = setTimeout(function () {
                infowindow.close();
            }, 200);
        });
    }
}

function HandleWeatherTileChange(dataSource, toggle, productId, urlProductId, tileValue) {
    if(!window.weatherHandler) {
        window.weatherHandler = new WeatherHandler();
    }


    if (!window.weatherHandler.playbackMode) {
        const playbackMode = playback_mode && toggle;
        window.weatherHandler.setPlaybackMode(playbackMode);
    }

    window.weatherHandler.toggle(dataSource, toggle, productId, urlProductId, tileValue);

    ToggleWeatherPerformanceMessage();
}

function ToggleWeatherPerformanceMessage() {
    if ($(\"#layoutsettings .toggle.on\").length >= 2) {
        $(\".weather-performance-msg\").show();
    } else {
        $(\".weather-performance-msg\").hide();
    }
}

function HandleSettingChange(DataSource, Value, skipRefresh) {
    var FullRefresh = false;
    var UpdateMap = false;
    if(typeof skipRefresh === 'undefined') {
        skipRefresh = false;
    }

    // When changing a setting in Weather panel, skipRefresh is false
    var showBaronErrorOnce = Boolean(skipRefresh);
    var showBaronErrorIfNeeded = function () {
        // For icing, \"disabled\" value is string \"0\"...
        var valueAsNumber = parseInt(Value, 10);
        // If valueAsNumber is NaN, then we are dealing with a real string value
        var shouldShowBaronError = Number.isNaN(valueAsNumber) ? Boolean(Value) : Boolean(valueAsNumber);

        if (!shouldShowBaronError) {
            // The layer has been disabled, so the next time it is enabled we do want to show the message
            baronErrorShownFor.delete(DataSource);
            return;
        }

        // We have already shown the error for this layer
        if (baronErrorShownFor.has(DataSource)) return;

        // Site just loaded and we have already displayed the error
        if (showBaronErrorOnce && baronErrorShown) return;

        showBaronError();
        baronErrorShown = true;

        // Even if we displayed the error at load, we do want to display it again
        // if user enables the layer
        if (!showBaronErrorOnce) {
            baronErrorShownFor.add(DataSource);
        }
    };

    window.whenModuleLoaded('map', function () {
        switch (DataSource) {
            case 'map_enable_filters':
                enable_filters = parseInt(Value);
                FullRefresh = true;
                break;
            case 'map_enable_unblock_filters':
                init_unblock_filters = parseInt(Value);
                FullRefresh = true;

                if (NavigationManager && typeof NavigationManager.renderFilterPopup === 'function') {
                    NavigationManager.renderFilterPopup();
                }
                window.fr24getEventBus().emit('filters.updated');
                break;
            case 'map_airports':
                init_airports = parseInt(Value);

                if (init_airports == 0) {
                    clearMapPins('airport');
                } else {
                    update_static_pins();
                }

                break;
            case 'map_airport_density':
                init_airport_density = parseInt(Value);

                if (init_airports !== 0) {
                    update_static_pins();
                }
                break;
            case 'show_ground_traffic':
                ground_traffic = parseInt(Value);
                FullRefresh = true;
                break;
            case 'show_gliders':
                glider_traffic = parseInt(Value);
                FullRefresh = true;
                break;
            case 'show_vehicles':
                vehicular_traffic = parseInt(Value);
                FullRefresh = true;
                break;
            case 'show_airborn_traffic':
                airborn_traffic = parseInt(Value);
                FullRefresh = true;
                break;
            case 'clock_local':
                if (fnParseBool(Value)) {
                    Value = 1;
                } else {
                    Value = 0;
                }
                init_clock_local = Value;
                break;
            case 'clock_12h':
                if (fnParseBool(Value)) {
                    Value = 1;
                } else {
                    Value = 0;
                }
                init_clock_12h = Value;
                break;
            case 'show_faa_traffic':
                faa_traffic = parseInt(Value);
                FullRefresh = true;
                break;
            case 'show_fsat_traffic':
                fsat_traffic = parseInt(Value);
                FullRefresh = true;
                break;
            case 'show_mlat_traffic':
                mlat_traffic = parseInt(Value);
                FullRefresh = true;
                break;
            case 'show_adsb_traffic':
                adsb_traffic = parseInt(Value);
                FullRefresh = true;
                break;
            case 'show_flarm_traffic':
                flarm_traffic = parseInt(Value);
                FullRefresh = true;
                break;
            case 'show_estimated_traffic':
                estimated_traffic = parseInt(Value);
                FullRefresh = true;
                break;
            case 'animate_aircraft':
                init_anim = parseInt(Value);
                a_active = init_anim;
                break;
            case 'map_weather_tile_ir_satellite':
                weather_tile_ir_satellite = parseInt(Value);

                if (typeof dispatcher.devFeatures !== 'undefined' && dispatcher.devFeatures.playback_weather) {
                    HandleWeatherTileChange(DataSource, weather_tile_ir_satellite);
                } else {
                    !playback_mode && HandleWeatherTileChange(DataSource, weather_tile_ir_satellite);
                }

                break;
            case 'map_weather_tile_global_radar':
                weather_tile_global_radar = parseInt(Value);

                if (typeof dispatcher.devFeatures !== 'undefined' && dispatcher.devFeatures.playback_weather) {
                    HandleWeatherTileChange(DataSource, weather_tile_global_radar);
                } else {
                    !playback_mode && HandleWeatherTileChange(DataSource, weather_tile_global_radar);
                }

                break;
            case 'map_weather_tile_air_sigmets':
                weather_tile_air_sigmets = parseInt(Value);
                !playback_mode && HandleWeatherTileChange(DataSource, weather_tile_air_sigmets);
                break;
            case 'map_weather_tile_volcanic_eruptions':
                weather_tile_volcanic_eruptions = parseInt(Value);
                !playback_mode && HandleWeatherTileChange(DataSource, weather_tile_volcanic_eruptions);
                break;
            case 'map_weather_tile_sigwx_high':
                weather_tile_sigwx_high = parseInt(Value, 10);
                !playback_mode && HandleWeatherTileChange(DataSource, weather_tile_sigwx_high, 'sigwx-high', 'sigwx-high', weather_tile_sigwx_high-1);
                break;
            case 'map_weather_tile_lightning_heat_map':
                weather_tile_lightning_heat_map = parseInt(Value);
                !playback_mode && HandleWeatherTileChange(DataSource, weather_tile_lightning_heat_map);
                break;
            case 'map_weather_tile_precipitation_rate_forecast':
                weather_tile_precipitation_rate_forcast = parseInt(Value);
                !playback_mode && HandleWeatherTileChange(DataSource, weather_tile_precipitation_rate_forcast);
                break;
            case 'map_weather_tile_icing':
                Value = castToStr(Value);
                weather_tile_icing_forecast = (Value.indexOf(\"wafs-icing\") !== -1 ? 1 : 0);
                !playback_mode && HandleWeatherTileChange(DataSource, weather_tile_icing_forecast, null, Value);
                break;
            case 'map_weather_tile_incloudturb':
                Value = castToStr(Value);
                weather_tile_incloudturb_forecast = (Value.indexOf(\"wafs-hires-turbulence\") !== -1 ? 1 : 0);
                !playback_mode && HandleWeatherTileChange(DataSource, weather_tile_incloudturb_forecast, null, Value);
                break;
            case 'map_weather_tile_clearairturb':
                Value = castToStr(Value);
                weather_tile_clearairturb_forecast = (Value.indexOf(\"wafs-clearairturb\") !== -1 ? 1 : 0);
                !playback_mode && HandleWeatherTileChange(DataSource, weather_tile_clearairturb_forecast, null, Value);
                break;
            case 'map_weather_tile_naradar':
                weather_tile_naradar = parseInt(Value);

                if (typeof dispatcher.devFeatures !== 'undefined' && dispatcher.devFeatures.playback_weather) {
                    HandleWeatherTileChange(DataSource, weather_tile_naradar);
                } else {
                    !playback_mode && HandleWeatherTileChange(DataSource, weather_tile_naradar);
                }

                break;
            case 'map_weather_tile_auradar':
                weather_tile_auradar = parseInt(Value);

                if (typeof dispatcher.devFeatures !== 'undefined' && dispatcher.devFeatures.playback_weather) {
                    HandleWeatherTileChange(DataSource, weather_tile_auradar);
                } else {
                    !playback_mode && HandleWeatherTileChange(DataSource, weather_tile_auradar);
                }

                break;
            case 'map_weather_tile_wind_speed':
                Value = castToStr(Value);
                weather_tile_wind_speed = (Value.indexOf(\"gfs\") !== -1 ? 1 : 0);

                let urlProductId = null;
                const intValue = parseInt(Value.replace(/[^0-9]/g, ''));
                if ( intValue > 1) {
                    urlProductId = Value;
                    Value = Value.replace(/(\\d+)/,1);
                } else if (intValue !== 0  && !Value) {
                    settingsService.clearSetting('weather.wind_speed');
                    break;
                }

                !playback_mode && HandleWeatherTileChange(DataSource, weather_tile_wind_speed, Value, urlProductId);
                break;
            case 'map_lightning':
                init_lightning = parseInt(Value);

                if (init_lightning == 1) {
                    lightningLayer = lightningLayer || new LightningLayer();
                    !playback_mode && lightningLayer.initializeLightning();
                } else if (lightningLayer) {
                    lightningLayer.hideLightning();
                }
                break;
            case 'map_weather':
                init_weather = parseInt(Value);

                if (init_weather === 1) {
                    weatherLayer = weatherLayer || new WeatherLayer();
                    !playback_mode && weatherLayer.initializeWeather(map);
                } else if (weatherLayer) {
                    weatherLayer.resetData();
                }
                break;
            case 'map_sidemenu_photo_hide':
                init_sidemenu_photo_hide = parseInt(Value);
                toggleAircraftPhoto();
                break;
            case 'unit_speed':
                init_unit_speed = Value;
                break;
            case 'unit_temp':
                init_unit_temp = Value;
                if (init_weather == 1) {
                    weatherLayer = weatherLayer || new WeatherLayer();
                    weatherLayer.initializeWeather();
                }
                break;
            case 'unit_alt':
                init_unit_alt = Value;
                // NavigationManager.setClientSetting('unit_alt', Value);

                //updateSliderUnits();
                break;
            case 'unit_wspeed':
                init_unit_wspeed = Value;
                break;
            case 'unit_dist':
                init_unit_dist = Value;
                break;
            case 'map_aircraft_size':
                init_aircraft_size = Value;
                UpdateMap = true;
                break;
            case 'map_labels':
                init_labels = parseInt(Value);

                if (init_labels === 0 || planes_showing > 250) {
                    labelHandler.removeAll();
                    show_labels = 0;
                } else if (init_labels) {
                    labelHandler.showAll();
                    show_labels = 1;
                }

                break;
            case 'map_label_1':
            case 'map_label_2':
            case 'map_label_3':
            case 'map_label_4':
                window[DataSource.replace('map_', 'init_')] = Value;
                if (init_labels) {
                    labelHandler.updateAll();
                }

                break;
            case 'map_label_bkg':
                const labelBackground = parseInt(Value);

                if (labelBackground === 0) {
                    $('body').addClass('hide-label-bkg');
                } else {
                    $('body').removeClass('hide-label-bkg');
                }
                settingsService.setSetting('map.label_background', labelBackground);
                break;
            case 'map_track_tooltip':
                init_track_tooltip = parseInt(Value);
                break;
            case 'map_tracks':
                init_tracks = parseInt(Value);
                if (init_tracks === 1) {
                    fr24Tracks.loadTracks();
                } else {
                    fr24Tracks.removeTracks();
                }
                break;
            case 'map_atc':
                if (Value === \"1\") {
                    Value = \"red\";
                }
                if (Value === \"0\") {
                    Value = \"none\";
                }
                if (Value !== atcLayerColor) {
                    atcLayerColor = Value;
                    if (atcLayerColor !== \"none\") {
                        removeATC();
                        loadATC(atcLayerColor);
                    } else {
                        removeATC();
                    }
                }
                break;
            case 'map_navdata':
                if (Value !== init_navcharts) {
                    init_navcharts = Value;
                    if (Value !== \"none\" && (typeof dispatcher.userFeatures['map.layer.atc'] !== 'undefined' && dispatcher.userFeatures['map.layer.atc'] === 'enabled')) {
                        // Init navdata layer
                        if (typeof navdataLayer === 'undefined') {
                            navdataLayer = new NavDataLayer();
                        }
                        navdataLayer.createLayer(Value)
                    } else {
                        if (typeof navdataLayer !== 'undefined') {
                            navdataLayer.removeLayer();
                        }
                    }
                }
                break;
            case 'map_type':
                if (init_type != Value && map_left_menu_view !== 'delayView') {
                    init_type = Value;
                    map.setMapTypeId(Value);
                }
                break;
            case 'map_fade':
                init_fade = parseInt(Value);

                window.brightnessControl.setBrightness(100 - init_fade);
                break;
            case 'map_night':
                if (typeof nite === 'object') {
                    if (Value == 1) {
                        if (nite_initialised == 0) {
                            nite.init(map);
                            nite_initialised = 1;
                        }

                        clearTimeout(niteInterval);

                        niteInterval = setInterval(function () {
                            nite.refresh();
                        }, 10000);

                        nite.show();
                    } else {
                        if (nite_initialised) {
                            clearTimeout(niteInterval);
                            nite.hide();
                        }
                    }
                }
                break;
            case 'map_sidebar_closed':
                setting_map_sidebar_closed = 0;
                showSidebar();
                break;
            case 'map_left_menu_view':
                map_left_menu_view = Value;
                showLeftOverlay = (Value === '' || Value === 'mapView');
                break;
        }

        if(!skipRefresh) {
            if (FullRefresh === true) {
                executeFetchPlane();
            } else if (UpdateMap === true) {
                // Make sure the map is loaded
                whenDomLoaded(function () {
                    update_planes(1);
                });
            }
        }
        if(DataSource && DataSource.indexOf('weather') !== -1) {
            ToggleWeatherPerformanceMessage();
        }
    });
}

function castToStr(value) {
    if (value === null || typeof value === 'undefined') {
        return \"\";
    }
    return typeof value !== 'string' ? String(value) : value;
}

function handleEstimatedTraffic() {
    if (dataSourcesTurnedOff()) {
        estimated_traffic = 0;
    } else {
        estimated_traffic = $(\"#fr24_showEstimated button\").val();
    }
    FullRefresh = true;
}

function dataSourcesTurnedOff() {
    return (adsb_traffic == 0 && flarm_traffic == 0 && mlat_traffic == 0 && faa_traffic == 0 && fsat_traffic == 0);
}

function updateSliderUnits() {
    if (simple_mode == true) {
        return;
    }

    var altSlider = $(\"#fr24_FilterAltitude\").slider('option');
    var speedSlider = $(\"#fr24_FilterSpeed\").slider('option');

    altSlider.slide(null, altSlider);
    speedSlider.slide(null, speedSlider);

    NavigationManager.renderFilterPopup();
}

function displayNotification(sType, sMessage, fCallback)
{
    if(notificationRegister.has(sType)) {
        return;
    }
    notificationRegister.add(sType);

    var html = '<div class=\"notify-msg ' + sType + '\">';
    html +=  '<div class=\"icon\"><svg><use xlink:href=\"#icon-fr24-info-boarder-grey\"/></svg></div>';
    html +=  '<div class=\"message\">' + sMessage + '</div>';
    html +=  '<div class=\"close\"><svg><use xlink:href=\"#icon-close\"/></svg></div>';
    html += '</div>';

    var note = $(html);
    $(\"#mapStaticOverlays #notifications\").prepend(note);
    if (typeof fCallback != \"undefined\") {
        var control = note.find('button');
        if (!control.get(0)) {
            control = note;
        }
        control.on('click', fCallback);
    }

    note.fadeIn('fast');
}

var notificationRegister = {
    register:[],
    has : function (type) {
        return this.register.indexOf(type) !== -1;
    },
    add : function (type) {
        this.register.push(type);
    },
    remove : function(type) {
        if(this.has(type)) {
            var index = this.register.indexOf(type);
            this.register.splice(index, 1);
        }
    }
}

function displayShowAllMsg()
{
    if (enabledShowMessageViews.indexOf(map_left_menu_view) === -1) {
        return false;
    }
    let separator = '<br />';
    if(dispatcher.display.isMobile) {
        separator = ' ';
    }
    var content = 'Your visibility settings have been temporarily disabled.' +
        separator + '<span>Press to restore your settings.</span>';

    displayNotification('showall-msg', content, function () {
        removeShowAllMsg();
        var context = $(this);
        context.fadeOut('fast', function () {
            context.remove();
        });
    });
}


function displayWeatherMsg()
{
    if ($(\".weather-msg\").length == 0) {
        var note = '' +
                'The weather data is provided by Baron \"as-is\" without any warranty. It should only be used for informational purposes and not for safety-of-life.' +
                'Flightradar24 or Baron will not be held responsible for injury, death, damage, loss, delay, cost, expense, or inconvenience arising from improper use of the data.' +
                ' <span>Got it</span>';

        displayNotification('weather-msg', note, function () {
            var context = $(this).closest('div');
            notificationRegister.remove('weather-msg');
            context.fadeOut('fast', function () {
                context.remove();
                setCookie('weather_data_consent', 1, 365);
            });
        });
    }
}

function show3DView() {
    animationPause();
    var $3DButton = get3DButton();
    if ($3DButton.hasClass(\"disabled\")) { // both 3d elements
        return false;
    }

    if (aircraft_type_assignments['grnd'].indexOf(plane_list_org[selected_aircraft][8]) !== -1) {
        return false;
    }

    if (typeof cockpitViewModel !== 'undefined' && typeof cockpitViewModel.close == 'function') {
        cockpitViewModel.close(function () {
            if (settingsService.syncGetSetting(\"map.animate_aircraft\")) {
                init_anim = 1;
            }
            follow_aircraft = 0;
            $(\"#follow-aircraft\").removeClass('active');
        });

        $3DButton.removeClass('active');

        return false;
    }

    $3DButton.addClass('active'); // current 3d button
    document.querySelector(\"body\").classList.add(\"view-3d\");
    map.setZoom(9);
    follow_aircraft = 1;
    $(\"a#follow-aircraft\").addClass('active');


    cockpitViewModel = new CesiumCockpitViewModel(function () {
        init_anim = 0;
    });

    if (dispatcher.display.isMobile) {
        window.scrollTo(0,1); // dirty hack to make fullscreen
    }

    window.WindowHelper.scaleCockpitView();


    // Set timeout
    if(dispatcher.isLoggedIn && dispatcher.userSubscription === 'basic') {
        setTimeout(function() {
            // Check if 3D view haven't crashed
            if (cockpitViewModel !== undefined) {
                $.post(dispatcher.urls.site + '/user/3dsession');
                dispatcher.threeDViewSessions.sessionsRemaining -= 1;
                update3DNotificationMessage(dispatcher.threeDViewSessions.sessionsRemaining);

                if (dispatcher.threeDViewSessions.sessionsRemaining <= 0) {
                    $3DButton.addClass('disabled');
                }
            }
        }, 3000)
    }

    if (window.location.href.indexOf('/3d') === -1) {
        History.pushState('', document.title, window.location.href + '/3d');
    }

    // google analytics action
    if(ga) {
        ga('send', 'event', '3d_view', dispatcher.userSubscription);
    }
}


function get3DButton() {
    var mobile3dButton = $('#btn-aircraft-action-3d');
    if (mobile3dButton.length) {
        return mobile3dButton;
    }
    var desktop3dButton = $('.pilotViewLink');
    return desktop3dButton;
}

function removeShowAllMsg()
{
    notificationRegister.remove('showall-msg');
    $(\"#mapStaticOverlays .showall-msg\").remove();
    window.filtersHandler.setShowAll(false);
    executeFetchPlane();
}


function updateNiteOverlay(date)
{
    if (init_nite == 1 && typeof nite === 'object') {
        var overlayTime = (typeof date === 'undefined') ? new Date() : date;
        nite.setDate(overlayTime);
    }
}

var aircraftByRegFetched = false;

function fetchAircraftByReg()
{
    if (query_reg == '') {
        clearTimeout(fetchByRegInterval);
        return false;
    }

    let endPointParams = {
        faa: 1,
        gnd: 1,
        mlat: 1,
        estimated: 1,
        flarm: 1,
        adsb: 1,
        vehicles: 1,
        gliders: 1,
        reg: query_reg,
    };

    const pk = getPublicKey();
    endPointParams = pk ? Object.assign(endPointParams, {pk: pk}) : endPointParams;
    const planeFeedApi = window.planeFeedApi;
    planeFeedApi.list(endPointParams, null, feed_request_method)
        .then(
            function (response) {
                response.json().then(function(data) {
                    if (typeof data === 'object') {
                    Object.keys(data).forEach(function (i) {
                        var val = data[i];
                        if (val[1] && val[2]) {
                            map.setZoom(10);
                            var pos = new google.maps.LatLng(val[1], val[2]);
                            if (!isAirportView()) {
                                map.panToOffsetted(pos);
                            }
                        }
                    });
                }
                });
            }
        ).catch(
            function (error) {
                feed_request_method = 'jsonp';
                fetchAircraftByReg();
            }
        );

    clearTimeout(fetchByRegInterval);
    fetchByRegInterval = setTimeout(function () {
        fetchAircraftByReg();
    }, 60 * 1000);
}


function toggleAircraftPhoto()
{
    if (init_sidemenu_photo_hide === 1) {
        $(\"body\").addClass(\"hide-aircraft-photo\");
    } else {
        $(\"body\").removeClass(\"hide-aircraft-photo\");
    }
}


function numberWithCommas(x) {
    return x.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, \",\");
}

if (typeof window.recordOutboundLink !== 'function') {
    function recordOutboundLink(link, category, action) {
        if (!category || category == '') {
            category = 'Outbound Links';
        }
        if (!action || action == '') {
            action = $(link).attr(\"href\");
        }
    }
}

function calcTextWidth($elem)
{
    var html_org = $elem.html();
    var html_calc = '<span>' + html_org + '</span>';
    $elem.html(html_calc);
    var width = $elem.find('span:first').width();
    $elem.html(html_org);
    return width;
}


function showAircarfInfoWindow() {
    if (!showLeftOverlay && !isMapView()) {
        if (typeof angular.element($('#aircraftInfoOverlay')).scope().showInfoBox === \"function\") {
            angular.element($('#aircraftInfoOverlay')).scope().showInfoBox();
        }
    }
}

function updateViewData() {
    var $viewObj = getCurrentView();

    var canRender = $viewObj &&
        map_left_menu_view === 'listView' &&
        typeof $viewObj.scope().renderListViewData === 'function'

    if (canRender) {
        $viewObj.scope().renderListViewData();
        $viewObj.scope().$apply();
    }
}

function adjustViewHeight() {
    var $viewObj = getCurrentView();

    if ($viewObj && $viewObj.scope()) {
        if (typeof $viewObj.scope().adjustHeight === 'function') {
            var phase = $viewObj.scope().$root.$$phase;
            $viewObj.scope().initTopbarLocal = init_topbar;
            $viewObj.scope().adjustHeight();
            if (phase !== '$apply' && phase !== '$digest') {
                $viewObj.scope().$apply();
            }
        }
    }
}

function viewToggleTopbar() {
    var $viewObj = getCurrentView();
    if ($viewObj) {
        var phase = $viewObj.scope().$root.$$phase;
        $viewObj.scope().initTopbarLocal = init_topbar;
        if (phase !== '$apply' && phase !== '$digest') {
            $viewObj.scope().$apply();
        }
    }
}

function getCurrentView()
{
    var element = null
    if (map_left_menu_view) {
        var $viewObj = $('#' + map_left_menu_view);
        if (typeof angular !== 'undefined') {
            element = angular.element($viewObj);
        }
    }

    return element;
}

function isMapView()
{
    return (map_left_menu_view === '' || map_left_menu_view === 'mapView' || map_left_menu_view === 'fullscreenView' || map_left_menu_view === 'multiView');
}

function isFleetView()
{
    return ['fleetView','fleetViewCustom','fleetViewAirline'].indexOf(map_left_menu_view) !== -1;
}

function isListView()
{
    return map_left_menu_view === 'listView';
}

function isAirportView()
{
    return map_left_menu_view === 'airportView';
}

function updateUserFeatures()
{
    if (pauseFeed === true) {
        return false;
    }
    userApi.getFeatures().then(function (data) {
        dispatcher.userFeatures = data;
    });
}

function getFetchAtcTileFunction(color) {
    var baseUrl;
    var tileFileName = \"/tile.png\";
    if (window.devicePixelRatio > 1) {
        tileFileName = \"/tile@2x.png\";
    }

    if (!window.navdataLayer) {
        window.navdataLayer = new NavDataLayer();
    }

    if (color === \"green\") {
        baseUrl = \"/atc_boundaries_green/\";
    } else if (color === \"blue\") {
        baseUrl = \"/atc_boundaries_blue/\";
    } else {
        baseUrl = \"/atc_boundaries/\"; // red by default
    }

    var fetchFunction =  function(coord, zoom) {
        var normalizedCoord = MapUtils.getNormalizedCoord(coord, zoom);
        if (!normalizedCoord) {
            return null;
        }
        return window.navdataLayer.getTileServer() + baseUrl + zoom + \"/\" + normalizedCoord.x + \"/\" + (normalizedCoord.y) + tileFileName;
    }

    return fetchFunction.bind(this);
}

function loadATC(color) {
    if (typeof dispatcher.userFeatures['map.layer.atc'] === 'undefined' || dispatcher.userFeatures['map.layer.atc'] !== 'enabled') {
        return false;
    }

    var mapClickLocation;

    if (mapAtcLayer === null) {

        mapAtcLayer = new google.maps.ImageMapType({
            getTileUrl: getFetchAtcTileFunction(color),
            tileSize: new google.maps.Size(256, 256)
        });

        atcMapEventPositionHandler = google.maps.event.addListener(map, 'click', function (e) {
            mapClickLocation = {
                lat: e.latLng.lat(),
                lon: e.latLng.lng()
            };
        });

        atcMapEventClickHandler = google.maps.event.addDomListener(map.getDiv(), 'click', function(e) {
            if (e.metaKey || e.ctrlKey) {
                $.getJSON(dispatcher.urls.site + '/geodata/atc_name', mapClickLocation, function (data) {
                    var zone = data.map(function (zone) {
                        return zone.name
                    }).join(' / ');
                    if (zone in atcPopups) {
                        atcPopups[zone].close();
                        delete atcPopups[zone];
                    }

                    var textInfo = \"<div class='googft-info-window atc-popup'>\" +
                            \"<a class='atc-tower-icon'></a>\" +
                            \"<span class='atc-tower-text'>\" + zone + \"</span></div>\";
                    var popup = new google.maps.InfoWindow({
                        content: textInfo,
                        position: {
                            lat: mapClickLocation.lat,
                            lng: mapClickLocation.lon
                        }
                    });
                    popup.open(map);
                    atcPopups[zone] = popup;
                });
            }
        });
    }

    if (mapAtcLayer !== null) {
        map.overlayMapTypes.push(null);
        if (mapAtcLayerIdx == -1) {
            mapAtcLayerIdx = map.overlayMapTypes.length - 1;
        }
        map.overlayMapTypes.setAt(mapAtcLayerIdx, mapAtcLayer);
    }
}
function removeATC() {
    if (mapAtcLayer !== null) {
        google.maps.event.removeListener(atcMapEventPositionHandler);
        google.maps.event.removeListener(atcMapEventClickHandler);
        map.overlayMapTypes.setAt(mapAtcLayerIdx, null);
        mapAtcLayer = null;
        for (var key in atcPopups) {
            if (!atcPopups.hasOwnProperty(key))
                continue;
            var popup = atcPopups[key];
            popup.close();
            delete atcPopups[key];
        }
    }
}
function createVisibilityHandler() {
    let cachedInitAnim = init_anim || 0;
    return function (params) {
        if (map_delays_mode) {
            return false;
        }
        if (document.hidden) {
            pauseFeed = true;
            cachedInitAnim = typeof init_anim == 'undefined' ? 0 : init_anim;
            init_anim = 0;
            a_active = 0;
            clearTimeout(aInterval);
            aInterval = false;

            if (playback_play == 1) {
                $(this).removeClass(\"pause\").addClass(\"play\");
            }
        } else {
            if (window.weatherHandler) {
                weatherHandler.setRefresh(true);
            }
            if (typeof renewPublicKey === 'function') {
                renewPublicKey();
            }

            pauseFeed = false;
            planes_snap_position = 1;

            init_anim = cachedInitAnim;

            fetch_plane_list(currentBounds);

            if (multi_select_mode && !playback_mode) {
                window.multiViewPanels.refresh();
            } else if (selected_aircraft !== null) {
                remove_polylines();
                query_flight_data(selected_aircraft);
            }
        }
    }
}

var handleVisibilityChange = createVisibilityHandler()

document.addEventListener(\"visibilitychange\", handleVisibilityChange, false);

function changeViewTitleText(view)
{
    view = view.replace(\"View\", \"\");
    var viewElem = $('#fr24_ViewsDropdown li a[data-value=\"' + view + '\"]');
    if (viewElem.length > 0) {
        var selText = viewElem.text(),
                icon = viewElem.data('icon');
        $(\"#fr24_ViewsDropdown a\").removeClass('selected');

        viewElem.addClass('selected');
        viewElem.parents('.dropdown').find('.dropdown-toggle').html(
                '<svg class=\"view-icon\"><use xlink:href=\"#icon-fr24-' + icon + '\" /></svg>' +
                '<span class=\"view\">' + selText + '</span>' +
                ' <svg><use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"#icon-fr24-arrow-down\"></use></svg>'
                );
    }
}

function historyReplaceState(trackChange) {
    const playbackUrl = /\\/[\\d]{4}-[\\d]{2}-[\\d]{2}\\/[\\d]{2}:[\\d]{2}/.test(window.location.pathname);

    if (playback_mode || playbackUrl) {
        return;
    }

    if (simple_mode) {
        return;
    }

    if (isset(window, \"airportInfoHandler\") && window.airportInfoHandler.isOpen())
    {
        return false;
    }

    if ((!map || map.constructor !== google.maps.Map) || $(\"#modalBlackout\").length > 0) {
        return false;
    }

    var newUrl = '/';
    if (simple_mode == true) {
        map_left_menu_view = 'mapView';
        newUrl += 'simple/';
    }
    const mapSelectedView = settingsService.syncGetSetting(\"map.selected_view\") || 'mapView';

    // listView handles URLs using its own logic
    if (mapSelectedView === 'listView') {
        ViewHandler.refreshListViewUrl();
        return;
    }

    if (mapSelectedView !== 'mapView') {
        if (mapSelectedView.toLowerCase() === 'radarview') {
            window.location = '/radarview';
        }
        newUrl += mapSelectedView.toLowerCase() + '/';
    }

    if (mapSelectedView === 'airportView') {
        var airport = settingsService.syncGetSetting(\"view.airport.selected\");
        newUrl += ((typeof airport === 'string') ? airport.toLowerCase() + '/' : '');

    } else if (mapSelectedView === 'fleetView') {
        var fleetView = settingsService.syncGetSetting(\"view.fleet.airline\"), airline = '';
        if (fleetView && fleetView.fleet) {
            airline = 'custom-' + fleetView.fleet;
        } else if (fleetView && fleetView.airline) {
            airline = fleetView.airline;
        }
        newUrl += ((airline) ? airline.toLowerCase() + '/' : '');
    }

    if (selected_aircraft != null && plane_list && selected_aircraft in plane_list && plane_list[selected_aircraft].length > 2) {
        var callsign = plane_list[selected_aircraft][16].replace('#', '');
        callsign = callsign.replace('*', '');
        if (!multi_select_mode) {
            if (load3dView || typeof cockpitViewModel  !== 'undefined') {
                newUrl += callsign + '/' + selected_aircraft + '/3d';
            } else {
                newUrl += callsign + '/' + selected_aircraft;
            }
        } else if (multi_select_mode) {
            if (callsign) {
                newUrl += callsign + '/';
            }
            newUrl += window.multiViewPanels.queue.toString();
        }
    } else {
        // multiview
        if (window.multiViewPanels.hasPanels()) {
            newUrl += window.multiViewPanels.queue.toString();
        } else if (map.center != undefined){
            newUrl += Math.round(map.center.lat() * 100) / 100 + ',' + Math.round(map.center.lng() * 100) / 100 + '/' + map.zoom;
        }
    }

    if (trackChange) {
        Analytics.trackAnalyticsEvent({
            eventType: Analytics.eventPageView,
            excludePlatforms: [Analytics.platformMixPanel],
            dynamicParams: [
                {
                value: newUrl,
                mixPanelFieldName: null,
                googleAnalyticsFieldName: 'page',
                }
            ]
        })
    }
    History.replaceState({currentSection: ''}, document.title, newUrl);
}


function getPublicKey()
{
    let result = '';
    if (cookie_pubkey) {
        let frPubKey = cookie_pubkey;
        if (settingsService.syncGetSetting('clearKey') === 1) {
            frPubKey = '!' + settingsService.syncGetSetting('_frPubKey');
            settingsService.setSetting('clearKey', 0);
        }
        result = frPubKey;
    }

    return result;
}

function update3DNotificationMessage(sessionsLeft) {

    var $notification = $('#sessions-left-notification');
    $notification.fadeIn();

    $notification.find('.header').text(sessionsLeft);
    var sessionsLeftText = ' SESSIONS REMAINING';
    if (sessionsLeft === 1) {
        sessionsLeftText = ' SESSION REMAINING';
    }
    $notification.find('.subheader').text(sessionsLeftText);

    var bars = $notification.find('.bar').removeClass('active');

    bars.each(function(index) {
        if (index < sessionsLeft) {
            $(this).addClass('active');
        }
    })
}

var isNumeric = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

window.whenModuleLoaded('searchInput', function() {
    initializeSearchAutocomplete();
})

if (window.moduleLoaded) {
    moduleLoaded('js_new');
} else {
    console.error('Could not mark js_new module as loaded');
}
