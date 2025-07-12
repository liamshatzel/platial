use geo_convert::geojson;
use std::fs;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let file_bytes = fs::read("test.geojson")?;

    let fs = geojson::parse(&file_bytes)?;
    println!("{fs}");
    Ok(())
}
