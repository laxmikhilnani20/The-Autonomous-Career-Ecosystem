#!/usr/bin/env node

import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function testAndInitializeDB() {
  console.log('🔄 Testing database connection...\n');
  
  try {
    // Test connection
    const client = await pool.connect();
    console.log('✅ Successfully connected to PostgreSQL database');
    console.log(`📊 Database: ${process.env.DATABASE_URL.split('@')[1].split('/')[0]}\n`);
    
    // Read schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('🔄 Initializing database schema...\n');
    
    // Execute schema
    await client.query(schema);
    console.log('✅ Database schema created successfully!\n');
    
    // Check tables
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('📋 Tables created:');
    result.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
    
    console.log('\n🎉 Database is ready to use!\n');
    console.log('Next steps:');
    console.log('  1. Run: npm run dev');
    console.log('  2. Open: http://localhost:3000');
    console.log('  3. Create an account and start using AURA!\n');
    
    client.release();
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database error:', error.message);
    console.error('\nPlease check:');
    console.error('  1. DATABASE_URL in .env.local is correct');
    console.error('  2. Database server is accessible');
    console.error('  3. Credentials are valid\n');
    await pool.end();
    process.exit(1);
  }
}

testAndInitializeDB();
