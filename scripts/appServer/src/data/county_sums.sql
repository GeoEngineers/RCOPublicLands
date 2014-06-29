Select * from 
(
--SELECT OUT OWNERS  
SELECT Sum(a.acres) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.name10 as areaname, 'DFW' as agency
  FROM vw_rco_publiclands_wdfw a Join publiclands_county_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.name10
Union
SELECT Sum(a.acres) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.name10 as areaname, 'STATE' as agency
  FROM vw_rco_publiclands_state a Join publiclands_county_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.name10
Union
SELECT Sum(a.acres) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.name10 as areaname, 'DNR AQUATIC' as agency
  FROM vw_rco_publiclands_dnr_aquatic a Join publiclands_county_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.name10
Union
SELECT Sum(a.acres) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.name10 as areaname, 'DNR UPLANDS' as agency
  FROM vw_rco_publiclands_dnr_uplands a Join publiclands_county_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.name10
Union
SELECT Sum(a.acres) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.name10 as areaname, 'FEDERAL' as agency
  FROM vw_rco_publiclands_federal a Join publiclands_county_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.name10
Union
SELECT Sum(a.acres) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.name10 as areaname, 'PARKS' as agency
  FROM vw_rco_publiclands_parks a Join publiclands_county_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.name10
Union
SELECT Sum(a.acres) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.name10 as areaname, 'CITY/COUNTY' as agency
  FROM vw_rco_publiclands_citycounty a Join publiclands_county_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.name10
Union
SELECT Sum(a.acres) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.name10 as areaname, 'OTHER' as agency
  FROM vw_rco_publiclands_other a Join publiclands_county_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.name10
Union
SELECT Sum(a.acres) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.name10 as areaname, 'STATE' as agency
  FROM vw_rco_publiclands_state a Join publiclands_county_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.name10
Union
--SELECT OUT BY ACQUITION COST
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
--SELECT OUT BY PRINCIPLE USE
SELECT Sum(a.acres) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.name10 as areaname, 'HABITAT AND PASSIVE RECREATION' as agency
  FROM vw_rco_publiclands_habitat_passive_recreation a Join publiclands_county_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.name10
Union
SELECT Sum(a.acres) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.name10 as areaname, 'DEVELOPED RECREATION' as agency
  FROM vw_rco_publiclands_developed_recreation a Join publiclands_county_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.name10
Union
SELECT Sum(a.acres) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.name10 as areaname, 'CONSERVATION' as agency
  FROM vw_rco_publiclands_conservation a Join publiclands_county_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.name10
Union
SELECT Sum(a.acres) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.name10 as areaname, 'UNKNOWN' as agency
  FROM vw_rco_publiclands_unknown a Join publiclands_county_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.name10
Union
SELECT Sum(a.acres) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.name10 as areaname, 'OTHER PUBLIC' as agency
  FROM vw_rco_publiclands_otherlanduse a Join publiclands_county_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.name10
Union
SELECT Sum(a.acres) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.name10 as areaname, 'REVENUE' as agency
  FROM vw_rco_publiclands_revenue a Join publiclands_county_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.name10
) as Agencies Order by agency, areaname
