Map {

}


#washington_federal [PROVTYPE = 8][zoom<=9]{
  polygon-fill:rgba(68,221,68,0.5);
  line-color:#006400;
  line-width:0.1;
  polygon-opacity:0.7;
}

#washington_federal [PROVTYPE = 8][zoom>=9]{
  polygon-fill:rgba(68,221,68,0.5);
  line-color:#006400;
  line-width:0.3;
  line-opacity:0.6;
  polygon-opacity:0.7;
  line-join: round;
  line-cap: round;
}