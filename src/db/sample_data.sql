-- Insert sample units
INSERT INTO units (name, level, parent_id, specialty, location_lat, location_lon) VALUES
('1st Army', 'Field Army', NULL, NULL, 38.9072, -77.0369),
('1st Corps', 'Corps', 1, NULL, 39.9526, -75.1652),
('1st Division', 'Division', 2, 'Infantry', 40.7128, -74.0060),
('1st Brigade', 'Brigade', 3, 'Infantry', 41.8781, -87.6298),
('1st Battalion', 'Battalion', 4, 'Infantry', 42.3601, -71.0589),
('Alpha Company', 'Company', 5, 'Infantry', 42.3601, -71.0589),
('1st Platoon', 'Platoon', 6, 'Infantry', 42.3601, -71.0589),
('1st Squad', 'Squad', 7, 'Infantry', 42.3601, -71.0589),
('2nd Division', 'Division', 2, 'Armor', 34.0522, -118.2437),
('1st Armor Brigade', 'Brigade', 9, 'Armor', 33.7490, -84.3880);

-- Insert sample readiness scores
INSERT INTO readiness_scores (unit_id, date, personnel_readiness, equipment_readiness, training_readiness, supplies_readiness, overall_readiness) VALUES
(1, CURRENT_DATE, 0.95, 0.92, 0.90, 0.98, 0.94),
(2, CURRENT_DATE, 0.93, 0.90, 0.88, 0.95, 0.92),
(3, CURRENT_DATE, 0.88, 0.85, 0.87, 0.92, 0.88),
(4, CURRENT_DATE, 0.85, 0.82, 0.80, 0.88, 0.84),
(5, CURRENT_DATE, 0.82, 0.80, 0.78, 0.85, 0.81),
(6, CURRENT_DATE, 0.80, 0.78, 0.75, 0.82, 0.79),
(7, CURRENT_DATE, 0.78, 0.75, 0.72, 0.80, 0.76),
(8, CURRENT_DATE, 0.75, 0.72, 0.70, 0.78, 0.74),
(9, CURRENT_DATE, 0.90, 0.88, 0.85, 0.93, 0.89),
(10, CURRENT_DATE, 0.87, 0.85, 0.82, 0.90, 0.86);

-- Insert sample alerts
INSERT INTO alerts (unit_id, date, message, severity) VALUES
(5, CURRENT_DATE, 'Low ammunition supplies', 'Medium'),
(7, CURRENT_DATE, 'Equipment maintenance overdue', 'High'),
(3, CURRENT_DATE, 'Training exercise scheduled next week', 'Low'),
(9, CURRENT_DATE, 'New personnel assignments pending', 'Medium'),
(1, CURRENT_DATE, 'Strategic planning meeting tomorrow', 'Low');
