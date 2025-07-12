use thiserror::Error;

#[derive(Error, Debug)]
pub enum ConvertError {
    #[error("Unsupported format")]
    UnsupportedFormat,

    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),

    #[error("Parse error: {0}")]
    Parse(String),
}
