use crate::ConvertError;
use geojson::{Error, FeatureCollection};

pub fn parse(data: &[u8]) -> Result<FeatureCollection, ConvertError> {
    let string_data = std::str::from_utf8(data).map_err(|e| ConvertError::Parse(e.to_string()))?;
    let fc: FeatureCollection = string_data
        .parse()
        .map_err(|e: Error| ConvertError::Parse(e.to_string()))?;
    Ok(fc)
}
