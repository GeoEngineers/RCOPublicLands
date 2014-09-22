Map {

}

#wdfw_acq_centroid[zoom<=8]{
  marker-width:11;
  marker-fill:#fff;
  marker-opacity:.35;
  marker-line-opacity:0;
  marker-comp-op:color-burn;
   marker-allow-overlap:false;
}
#wdfw_acq_centroid[zoom<=8]{
  marker-width:10;
  marker-fill:#E69800;
  marker-opacity:.7;
  marker-line-opacity:0;
  marker-allow-overlap:false;
}

#washington_acq_dfw[zoom<=9]{
  polygon-fill:#FF7F7F;
  line-color:#6E6E6E;
  line-opacity:0.0;
  line-dasharray: 10, 4;
  polygon-opacity:0.0;
}

#washington_acq_dfw[zoom>=9]{
  polygon-fill:#E69800;
  line-color:#6E6E6E;
  line-width:0.8;
  polygon-opacity:0.7;
}

#washington_acq_dfw [zoom>=9]{
  polygon-fill:#E69800;
  line-color:#6E6E6E;
  line-width:1.2;
  line-opacity:0.6;
  polygon-opacity:0.7;
  line-join: round;
  line-cap: round;
}
