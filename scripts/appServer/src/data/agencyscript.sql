Select * from 
(
SELECT Sum(a.acres) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.name10 as areaname, 'DFW' as agency
  FROM vw_rco_publiclands_wdfw a Join publiclands_county_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.name10
Union
SELECT Sum(a.acres) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.name10 as areaname, 'PARKS' as agency
  FROM vw_rco_publiclands_stateparks a Join publiclands_county_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.name10
Union
SELECT Sum(a.acres) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.name10 as areaname, 'DNR' as agency
  FROM vw_rco_publiclands_dnr a Join publiclands_county_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.name10
Union
SELECT Sum(a.acres) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.name10 as areaname, 'FEDERAL' as agency
  FROM vw_rco_publiclands_federal a Join publiclands_county_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.name10
Union
SELECT Sum(a.acres) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.name10 as areaname, 'AQ-DFW' as agency
  FROM vw_rco_publiclands_acq_wdfw a Join publiclands_county_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.name10
Union
SELECT Sum(a.acres) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.name10 as areaname, 'AQ-PARKS' as agency
  FROM vw_rco_publiclands_acq_parks a Join publiclands_county_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.name10
Union
SELECT Sum(a.acres) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.name10 as areaname, 'AQ-DNR' as agency
  FROM vw_rco_publiclands_acq_dnr a Join publiclands_county_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.name10
Union
SELECT Sum(a.acres) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.name10 as areaname, 'RECREATION' as agency
  FROM vw_rco_publiclands_recreation a Join publiclands_county_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.name10
Union
SELECT Sum(a.acres) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.name10 as areaname, 'CONSERVATION' as agency
  FROM vw_rco_publiclands_conservation a Join publiclands_county_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.name10
Union
SELECT Sum(a.acres) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.name10 as areaname, 'HABITAT' as agency
  FROM vw_rco_publiclands_habitat a Join publiclands_county_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.name10
Union
SELECT Sum(a.acres) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.name10 as areaname, 'REVENUE' as agency
  FROM vw_rco_publiclands_revenue a Join publiclands_county_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.name10
) as Agencies Order by agency, areaname