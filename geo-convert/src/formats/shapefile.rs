use geozero::shp::ShpReader;

fn parse(data: &[u8]) -> Result<(), Box<dyn std::error::Error>> {
    let reader = ShpReader::from_path(path).unwrap();
    
    while let Some(record) = reader.next()? {
        // Process each record
        println!("{:?}", record);
    }
    
    Ok(())
}
