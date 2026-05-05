-- Fix Admin Password to 'Admin@1234'
UPDATE users SET password = '$2a$10$S2ckxlFxx/7svo11vB0K3.BCmj1rQOhkER9/NH6aT3fBEi8zmFicS' WHERE email = 'admin@example.com';

-- Fix Member Passwords to 'Member@1234'
UPDATE users SET password = '$2a$10$tyWWJcUBHayQn4UKgRt.wO9D/XbFcHMJQdmfcKYKIuTktVV7bA4fi' WHERE email LIKE '%@example.com' AND email != 'admin@example.com';
