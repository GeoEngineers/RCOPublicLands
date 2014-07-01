Select * from 
(
SELECT SUM(st_area(st_intersection(a.geom, b.geom)) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.wria_nm as areaname, 'DFW' as agency
  FROM vw_rco_publiclands_wdfw a Join publiclands_wira_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.wria_nm
Union
SELECT SUM(st_area(st_intersection(a.geom, b.geom)) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.wria_nm as areaname, 'STATE' as agency
  FROM vw_rco_publiclands_state a Join publiclands_wira_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.wria_nm
Union
SELECT SUM(st_area(st_intersection(a.geom, b.geom)) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.wria_nm as areaname, 'DNR AQUATIC' as agency
  FROM vw_rco_publiclands_dnr_aquatic a Join publiclands_wira_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.wria_nm
Union
SELECT SUM(st_area(st_intersection(a.geom, b.geom)) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.wria_nm as areaname, 'DNR UPLANDS' as agency
  FROM vw_rco_publiclands_dnr_uplands a Join publiclands_wira_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.wria_nm
Union
SELECT SUM(st_area(st_intersection(a.geom, b.geom)) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.wria_nm as areaname, 'FEDERAL' as agency
  FROM vw_rco_publiclands_federal a Join publiclands_wira_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.wria_nm
Union
SELECT SUM(st_area(st_intersection(a.geom, b.geom)) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.wria_nm as areaname, 'PARKS' as agency
  FROM vw_rco_publiclands_parks a Join publiclands_wira_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.wria_nm
Union
SELECT SUM(st_area(st_intersection(a.geom, b.geom)) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.wria_nm as areaname, 'CITY-COUNTY' as agency
  FROM vw_rco_publiclands_citycounty a Join publiclands_wira_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.wria_nm
Union
----ACQUISITIONS
SELECT SUM(st_area(st_intersection(a.geom, b.geom)) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.wria_nm as areaname, 'AQ-DFW' as agency
  FROM vw_rco_publiclands_acq_wdfw a Join publiclands_wira_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.wria_nm
Union
SELECT SUM(st_area(st_intersection(a.geom, b.geom)) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.wria_nm as areaname, 'AQ-DNR' as agency
  FROM vw_rco_publiclands_acq_dnr a Join publiclands_wira_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.wria_nm
Union
SELECT SUM(st_area(st_intersection(a.geom, b.geom)) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.wria_nm as areaname, 'AQ-PARKS' as agency
  FROM vw_rco_publiclands_acq_parks a Join publiclands_wira_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.wria_nm
Union
--PRINCIPAL USE
SELECT SUM(st_area(st_intersection(a.geom, b.geom)) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.wria_nm as areaname, 'HABITAT AND PASSIVE RECREATION' as agency
  FROM vw_rco_publiclands_habitat_passive_recreation a Join publiclands_wira_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.wria_nm
Union
SELECT SUM(st_area(st_intersection(a.geom, b.geom)) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.wria_nm as areaname, 'DEVELOPED RECREATION' as agency
  FROM vw_rco_publiclands_developed_recreation a Join publiclands_wira_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.wria_nm
Union
SELECT SUM(st_area(st_intersection(a.geom, b.geom)) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.wria_nm as areaname, 'CONSERVATION' as agency
  FROM vw_rco_publiclands_conservation a Join publiclands_wira_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.wria_nm
Union
SELECT SUM(st_area(st_intersection(a.geom, b.geom)) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.wria_nm as areaname, 'UNKNOWN' as agency
  FROM vw_rco_publiclands_unknown a Join publiclands_wira_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.wria_nm
Union
SELECT SUM(st_area(st_intersection(a.geom, b.geom)) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.wria_nm as areaname, 'OTHER PUBLIC' as agency
  FROM vw_rco_publiclands_otherlanduse a Join publiclands_wira_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.wria_nm
Union
SELECT SUM(st_area(st_intersection(a.geom, b.geom)) / 43560) as Acres, sum(a.acquisition_cost) as AcquisitionCost, b.wria_nm as areaname, 'REVENUE' as agency
  FROM vw_rco_publiclands_revenue a Join publiclands_wira_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.wria_nm
  -----
  Union
SELECT SUM(st_area(st_intersection(a.geom, b.geom)) / 43560) as Acres, 0 as AcquisitionCost, b.wria_nm as areaname, 'PROPOSED PARKS' as agency
  FROM vw_rco_publiclands_parks_proposed a Join publiclands_wira_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.wria_nm
Union
SELECT SUM(st_area(st_intersection(a.geom, b.geom)) / 43560) as Acres, 0 as AcquisitionCost, b.wria_nm as areaname, 'PROPOSED DFW' as agency
  FROM vw_rco_publiclands_dfw_proposed a Join publiclands_wira_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.wria_nm
Union
SELECT SUM(st_area(st_intersection(a.geom, b.geom)) / 43560) as Acres, 0 as AcquisitionCost, b.wria_nm as areaname, 'PROPOSED DNR' as agency
  FROM vw_rco_publiclands_dnr_proposed a Join publiclands_wira_bnd b on
  ST_Intersects(a.geom, b.geom) Group by b.wria_nm) as Agencies Order by agency, areaname
