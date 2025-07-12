pub mod geojson;
// pub mod kml;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Format {
    GeoJson,
    Kml,
    Shapefile,
}
