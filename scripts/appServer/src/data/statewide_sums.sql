Select * from 
(
SELECT SUM(st_area(a.geom) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost,'DFW' as agency
  FROM vw_rco_publiclands_wdfw a 
Union
SELECT SUM(st_area(a.geom) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost,'STATE' as agency
  FROM vw_rco_publiclands_state a 
Union
SELECT SUM(st_area(a.geom) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost,'DNR AQUATIC' as agency
  FROM vw_rco_publiclands_dnr_aquatic a 
Union
SELECT SUM(st_area(a.geom) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost,'DNR UPLANDS' as agency
  FROM vw_rco_publiclands_dnr_uplands a 
Union
SELECT SUM(st_area(a.geom) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost,'FEDERAL' as agency
  FROM vw_rco_publiclands_federal a 
Union
SELECT SUM(st_area(a.geom) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost,'PARKS' as agency
  FROM vw_rco_publiclands_parks a 
Union
SELECT SUM(st_area(a.geom) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost,'CITY-COUNTY' as agency
  FROM vw_rco_publiclands_citycounty a 
Union
SELECT SUM(st_area(a.geom) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost,'AQ-DFW' as agency
  FROM vw_rco_publiclands_acq_wdfw a 
Union
SELECT SUM(st_area(a.geom) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost,'AQ-PARKS' as agency
  FROM vw_rco_publiclands_acq_parks a 
Union
SELECT SUM(st_area(a.geom) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost,'AQ-DNR' as agency
  FROM vw_rco_publiclands_acq_dnr a 
Union
SELECT SUM(st_area(a.geom) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost,'HABITAT AND PASSIVE RECREATION' as agency
  FROM vw_rco_publiclands_habitat_passive_recreation a 
Union
SELECT SUM(st_area(a.geom) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost,'DEVELOPED RECREATION' as agency
  FROM vw_rco_publiclands_developed_recreation a 
Union
SELECT SUM(st_area(a.geom) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost,'CONSERVATION' as agency
  FROM vw_rco_publiclands_conservation a 
Union
SELECT SUM(st_area(a.geom) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost,'UNKNOWN' as agency
  FROM vw_rco_publiclands_unknown a 
Union
SELECT SUM(st_area(a.geom) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost,'OTHER PUBLIC' as agency
  FROM vw_rco_publiclands_otherlanduse a 
Union
SELECT SUM(st_area(a.geom) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost,'REVENUE' as agency
  FROM vw_rco_publiclands_revenue a 
Union
 SELECT SUM(st_area(a.geom) / 43560) as Acres, 0 as AcquisitionCost, 'PROPOSED PARKS' as agency
  FROM vw_rco_publiclands_parks_proposed a 
Union
SELECT SUM(st_area(a.geom) / 43560) as Acres, 0 as AcquisitionCost,  'PROPOSED DFW' as agency
FROM vw_rco_publiclands_dfw_proposed a 
Union
SELECT SUM(st_area(a.geom) / 43560) as Acres, 0 as AcquisitionCost,  'PROPOSED DNR' as agency
FROM vw_rco_publiclands_dnr_proposed a
) as Agencies Order by agency