Map {

}


#dnr_aquatic [AQUATIC = 0][PROV1 = 640][zoom<=9]{
  polygon-fill:#FF7F7F;
  line-color:#6E6E6E;
  line-width:0.1;
  polygon-opacity:0.7;
}

#dnr_aquatic [AQUATIC = 0][PROV1 = 640][zoom>=9]{
  polygon-fill:#FF7F7F;
  line-color:#6E6E6E;
  line-width:0.3;
  line-opacity:0.6;
  polygon-opacity:0.7;
  line-join: round;
  line-cap: round;
}