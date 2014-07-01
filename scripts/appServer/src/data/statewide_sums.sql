Select * from 
(
SELECT SUM(st_area(st_intersection(a.geom, b.geom)) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost, 'DFW' as agency
  FROM vw_rco_publiclands_wdfw a 
  
Union
SELECT SUM(st_area(st_intersection(a.geom, b.geom)) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost, 'STATE' as agency
  FROM vw_rco_publiclands_state a 
  
Union
SELECT SUM(st_area(st_intersection(a.geom, b.geom)) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost, 'DNR AQUATIC' as agency
  FROM vw_rco_publiclands_dnr_aquatic a 
  
Union
SELECT SUM(st_area(st_intersection(a.geom, b.geom)) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost, 'DNR UPLANDS' as agency
  FROM vw_rco_publiclands_dnr_uplands a 
  
Union
SELECT SUM(st_area(st_intersection(a.geom, b.geom)) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost, 'FEDERAL' as agency
  FROM vw_rco_publiclands_federal a 
  
Union
SELECT SUM(st_area(st_intersection(a.geom, b.geom)) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost, 'AQ-DFW' as agency
  FROM vw_rco_publiclands_acq_wdfw a 
  
Union
SELECT SUM(st_area(st_intersection(a.geom, b.geom)) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost, 'AQ-STATE' as agency
  FROM vw_rco_publiclands_acq_state a 
  
Union
SELECT SUM(st_area(st_intersection(a.geom, b.geom)) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost, 'AQ-DNR-UPLANDS' as agency
  FROM vw_rco_publiclands_dnr_uplands a 
  
Union
SELECT SUM(st_area(st_intersection(a.geom, b.geom)) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost, 'AQ-DNR-AQUATIC' as agency
  FROM vw_rco_publiclands_dnr_aquatic a 
  
Union
SELECT SUM(st_area(st_intersection(a.geom, b.geom)) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost, 'AQ-PARKS' as agency
  FROM vw_rco_publiclands_acq_parks a 
  
Union
SELECT SUM(st_area(st_intersection(a.geom, b.geom)) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost, 'HABITAT AND PASSIVE RECREATION' as agency
  FROM vw_rco_publiclands_habitat_passive_recreation a 
  
Union
SELECT SUM(st_area(st_intersection(a.geom, b.geom)) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost, 'DEVELOPED RECREATION' as agency
  FROM vw_rco_publiclands_developed_recreation a 
  
Union
SELECT SUM(st_area(st_intersection(a.geom, b.geom)) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost, 'CONSERVATION' as agency
  FROM vw_rco_publiclands_conservation a 
  
Union

SELECT SUM(st_area(st_intersection(a.geom, b.geom)) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost, 'REVENUE' as agency
  FROM vw_rco_publiclands_revenue a 
  
) as Agencies Order by agency

Union

SELECT SUM(st_area(st_intersection(a.geom, b.geom)) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost, 'PARK' as agency
  FROM vw_rco_publiclands_park a 
  
) as Agencies Order by agency