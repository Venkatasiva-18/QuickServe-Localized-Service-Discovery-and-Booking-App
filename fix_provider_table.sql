-- Check current provider table structure
DESCRIBE provider;

-- If password column doesn't exist or is corrupted, run these:

-- 1. Drop old pwd column if it exists
ALTER TABLE provider DROP COLUMN IF EXISTS pwd;

-- 2. Add password column if it doesn't exist
ALTER TABLE provider ADD COLUMN IF NOT EXISTS password VARCHAR(255) NOT NULL DEFAULT 'temp';

-- 2. Update role column if needed
ALTER TABLE provider MODIFY COLUMN role VARCHAR(50) DEFAULT 'PROVIDER';

-- 3. Add profileImage column if it doesn't exist  
ALTER TABLE provider ADD COLUMN IF NOT EXISTS profileImage LONGBLOB;

-- 4. Fix timestamps if they're missing defaults
ALTER TABLE provider MODIFY COLUMN createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE provider MODIFY COLUMN updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- 5. Check the result
DESCRIBE provider;

-- 6. Verify data
SELECT id, name, email, password FROM provider LIMIT 5;
