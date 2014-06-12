Select * from 
(
SELECT Sum(a.acres) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.wria_nm as areaname, 'DFW' as agency
  FROM vw_rco_publiclands_wdfw a Join publiclands_wira_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.wria_nm
Union
SELECT Sum(a.acres) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.wria_nm as areaname, 'STATE' as agency
  FROM vw_rco_publiclands_state a Join publiclands_wira_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.wria_nm
Union
SELECT Sum(a.acres) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.wria_nm as areaname, 'DNR AQUATIC' as agency
  FROM vw_rco_publiclands_dnr_aquatic a Join publiclands_wira_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.wria_nm
Union
SELECT Sum(a.acres) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.wria_nm as areaname, 'DNR UPLANDS' as agency
  FROM vw_rco_publiclands_dnr_uplands a Join publiclands_wira_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.wria_nm
Union
SELECT Sum(a.acres) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.wria_nm as areaname, 'FEDERAL' as agency
  FROM vw_rco_publiclands_federal a Join publiclands_wira_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.wria_nm
Union
SELECT Sum(a.acres) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.wria_nm as areaname, 'AQ-DFW' as agency
  FROM vw_rco_publiclands_acq_wdfw a Join publiclands_wira_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.wria_nm
Union
SELECT Sum(a.acres) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.wria_nm as areaname, 'AQ-STATE' as agency
  FROM vw_rco_publiclands_acq_state a Join publiclands_wira_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.wria_nm
Union
SELECT Sum(a.acres) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.wria_nm as areaname, 'AQ-DNR-UPLANDS' as agency
  FROM vw_rco_publiclands_dnr_uplands a Join publiclands_wira_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.wria_nm
Union
SELECT Sum(a.acres) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.wria_nm as areaname, 'AQ-DNR-AQUATIC' as agency
  FROM vw_rco_publiclands_dnr_aquatic a Join publiclands_wira_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.wria_nm
Union
SELECT Sum(a.acres) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.wria_nm as areaname, 'AQ-PARKS' as agency
  FROM vw_rco_publiclands_acq_parks a Join publiclands_wira_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.wria_nm
Union
SELECT Sum(a.acres) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.wria_nm as areaname, 'HABITAT AND PASSIVE RECREATION' as agency
  FROM vw_rco_publiclands_habitat_passive_recreation a Join publiclands_wira_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.wria_nm
Union
SELECT Sum(a.acres) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.wria_nm as areaname, 'DEVELOPED RECREATION' as agency
  FROM vw_rco_publiclands_developed_recreation a Join publiclands_wira_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.wria_nm
Union
SELECT Sum(a.acres) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.wria_nm as areaname, 'CONSERVATION' as agency
  FROM vw_rco_publiclands_conservation a Join publiclands_wira_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.wria_nm
Union

SELECT Sum(a.acres) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.wria_nm as areaname, 'REVENUE' as agency
  FROM vw_rco_publiclands_revenue a Join publiclands_wira_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.wria_nm
) as Agencies Order by agency, areaname