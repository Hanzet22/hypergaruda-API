#![forbid(unsafe_code)]

//! Native service foundation only.
//! No network listener, process execution, or user-supplied code execution is
//! implemented in this crate.

/// Identifies this crate as a non-production scaffold.
pub const COMPONENT_STAGE: &str = "foundation-only";
