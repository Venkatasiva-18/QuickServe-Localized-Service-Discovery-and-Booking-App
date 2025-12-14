-- Check for admin records across all tables
SELECT 'admin table' as source, id, email, role FROM admin
UNION ALL
SELECT 'customer table' as source, id, email, role FROM customer WHERE role = 'ADMIN'
UNION ALL
SELECT 'provider table' as source, id, email, role FROM provider WHERE role = 'ADMIN';
