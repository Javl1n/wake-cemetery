<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cemetery Map Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains the configuration for the cemetery map feature.
    | You can adjust the center coordinates and default zoom level to match
    | your cemetery's location.
    |
    */

    'center' => [
        'latitude' => (float) env('CEMETERY_CENTER_LAT', 14.5995),
        'longitude' => (float) env('CEMETERY_CENTER_LNG', 120.9842),
    ],

    'entrance' => [
        'latitude' => (float) env('CEMETERY_ENTRANCE_LAT', env('CEMETERY_CENTER_LAT', 14.5995)),
        'longitude' => (float) env('CEMETERY_ENTRANCE_LNG', env('CEMETERY_CENTER_LNG', 120.9842)),
    ],

    'zoom' => (int) env('CEMETERY_ZOOM', 16),

];
