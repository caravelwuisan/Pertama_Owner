import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://queaghffgldbriglmxke.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1ZWFnaGZmZ2xkYnJpZ2xteGtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzODc4MDcsImV4cCI6MjA4ODk2MzgwN30.Dnk5GKk70j3cJbq9Lhzpq4oOtBFuuZVPiTv8ROee4kg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testFetch() {
  const { data, error } = await supabase.from('properties').select('*, property_owners(profiles(*))').order('created_at', { ascending: false });
  fs.writeFileSync('scripts/error.json', JSON.stringify({ error, data }, null, 2), 'utf8');
}

testFetch();
