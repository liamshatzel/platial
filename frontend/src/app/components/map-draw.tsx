"use client"
// Inspired by https://openlayers.org/en/latest/examples/draw-and-modify-features.html
import React, { useEffect, useRef } from 'react';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import Draw from 'ol/interaction/Draw.js';
import Modify from 'ol/interaction/Modify.js';
import Snap from 'ol/interaction/Snap.js';
import TileLayer from 'ol/layer/Tile.js';
import VectorLayer from 'ol/layer/Vector.js';
import { get } from 'ol/proj.js';
import OSM from 'ol/source/OSM.js';
import VectorSource from 'ol/source/Vector.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import { Style, Fill, Stroke, Circle } from 'ol/style.js';

interface MapDrawProps {
    drawType: string;
    isHomeActive: boolean;
    onHomeReset?: () => void;
    geojsonData?: any;
}

const MapDraw: React.FC<MapDrawProps> = ({ drawType, isHomeActive, onHomeReset, geojsonData }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<Map | null>(null);
    const drawRef = useRef<Draw | null>(null);
    const snapRef = useRef<Snap | null>(null);

    useEffect(() => {
        if (!mapRef.current) return;

        // Create raster layer
        const raster = new TileLayer({
            source: new OSM(),
        });

        // Create vector source and layer for drawing
        const source = new VectorSource();
        const vector = new VectorLayer({
            source: source,
            style: {
                'fill-color': 'rgba(255, 255, 255, 0.2)',
                'stroke-color': '#ffcc33',
                'stroke-width': 2,
                'circle-radius': 7,
                'circle-fill-color': '#ffcc33',
            },
        });

        // Create GeoJSON source and layer for uploaded data
        const geojsonSource = new VectorSource();
        const geojsonLayer = new VectorLayer({
            source: geojsonSource,
            style: new Style({
                fill: new Fill({
                    color: 'rgba(255, 0, 0, 0.3)',
                }),
                stroke: new Stroke({
                    color: '#ff0000',
                    width: 2,
                }),
                image: new Circle({
                    radius: 7,
                    fill: new Fill({
                        color: '#ff0000',
                    }),
                }),
            }),
        });

        // Limit multi-world panning to one world east and west of the real world.
        // Geometry coordinates have to be within that range.
        const projection = get('EPSG:3857');
        if (!projection) {
            console.error('Projection EPSG:3857 not found');
            return;
        }

        const extent = projection.getExtent().slice();
        extent[0] += extent[0];
        extent[2] += extent[2];

        // Create map instance
        const map = new Map({
            layers: [raster, geojsonLayer, vector],
            target: mapRef.current,
            controls: [], // Remove all default controls
            view: new View({
                center: [-11000000, 4600000],
                zoom: 4,
                extent,
            }),
        });

        // Add modify interaction
        const modify = new Modify({ source: source });
        map.addInteraction(modify);

        // Store map instance
        mapInstanceRef.current = map;

        // Add initial interactions
        addInteractions(map, source, drawType);

        // Cleanup function
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.setTarget(undefined);
                mapInstanceRef.current = null;
            }
        };
    }, []);

    // Update interactions when drawType changes
    useEffect(() => {
        if (mapInstanceRef.current) {
            const layers = mapInstanceRef.current.getLayers();
            const vectorLayer = layers.getArray()[2] as VectorLayer<VectorSource>;
            const source = vectorLayer.getSource();
            if (source) {
                addInteractions(mapInstanceRef.current, source, drawType);
            }
        }
    }, [drawType]);

    // Handle GeoJSON data changes
    useEffect(() => {
        if (mapInstanceRef.current && geojsonData) {
            const layers = mapInstanceRef.current.getLayers();
            const geojsonLayer = layers.getArray()[1] as VectorLayer<VectorSource>;
            const geojsonSource = geojsonLayer.getSource();

            if (geojsonSource) {
                // Clear existing features
                geojsonSource.clear();

                // Parse and add new GeoJSON features
                const format = new GeoJSON();
                const features = format.readFeatures(geojsonData, {
                    featureProjection: 'EPSG:3857'
                });

                geojsonSource.addFeatures(features);

                // Fit the map view to show all features
                if (features.length > 0) {
                    const extent = geojsonSource.getExtent();
                    mapInstanceRef.current.getView().fit(extent, {
                        padding: [50, 50, 50, 50],
                        duration: 1000
                    });
                }
            }
        }
    }, [geojsonData]);

    const addInteractions = (map: Map, source: VectorSource, type: string) => {
        // Remove existing interactions
        if (drawRef.current) {
            map.removeInteraction(drawRef.current);
        }
        if (snapRef.current) {
            map.removeInteraction(snapRef.current);
        }

        // Add new draw interaction
        const draw = new Draw({
            source: source,
            type: type as any,
        });
        map.addInteraction(draw);
        drawRef.current = draw;

        // Add snap interaction
        const snap = new Snap({ source: source });
        map.addInteraction(snap);
        snapRef.current = snap;
    };

    useEffect(() => {
        if (mapInstanceRef.current && isHomeActive) {
            const view = mapInstanceRef.current.getView();
            view.setCenter([0, 0]);
            view.setZoom(0);
            const layers = mapInstanceRef.current.getLayers();

            // Clear drawing layer
            const vectorLayer = layers.getArray()[2] as VectorLayer<VectorSource>;
            const source = vectorLayer.getSource();
            if (source) {
                source.clear();
            }

            // Clear GeoJSON layer
            const geojsonLayer = layers.getArray()[1] as VectorLayer<VectorSource>;
            const geojsonSource = geojsonLayer.getSource();
            if (geojsonSource) {
                geojsonSource.clear();
            }

            // Call the callback to reset the home state in parent
            onHomeReset?.();
        }
    }, [isHomeActive, onHomeReset]);

    return (
        <div className="w-full h-full">
            <div
                ref={mapRef}
                className="w-full h-full border border-gray-300 rounded-md"
                style={{ minHeight: '400px' }}
            />
        </div>
    );
};

export default MapDraw;
