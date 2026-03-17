import { createClient } from '@supabase/supabase-js';

// Re-using the environment variables you defined
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://queaghffgldbriglmxke.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1ZWFnaGZmZ2xkYnJpZ2xteGtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzODc4MDcsImV4cCI6MjA4ODk2MzgwN30.Dnk5GKk70j3cJbq9Lhzpq4oOtBFuuZVPiTv8ROee4kg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  console.log('Starting seed process...');

  // 1. Create Admin User
  const { data: adminData, error: adminError } = await supabase.auth.signUp({
    email: 'admin@pertama.com',
    password: 'password123',
    options: {
      data: {
        full_name: 'Super Admin',
      }
    }
  });

  if (adminError) {
    console.error('Error creating admin:', adminError.message);
  } else {
    console.log('Admin user created successfully:', adminData.user?.email);
    // Note: The handle_new_user trigger creates a profile with role 'owner' by default.
    // Let's update it to 'admin' using regular Supabase update (requires temporarily relaxing policies or if RLS allows. RLS doesn't allow user to update their own role if policies don't permit).
    // Actually, users can update their own profile in our policy, so we can authenticate as the admin and update it!
    await supabase.from('profiles').update({ role: 'admin' }).eq('id', adminData.user?.id);
    console.log('Admin profile updated with role: admin');
  }

  // 2. Create Owner User
  const { data: ownerData, error: ownerError } = await supabase.auth.signUp({
    email: 'owner@pertama.com',
    password: 'password123',
    options: {
      data: {
        full_name: 'John Doe',
      }
    }
  });

  if (ownerError) {
    console.error('Error creating owner:', ownerError.message);
  } else {
    console.log('Owner user created successfully:', ownerData.user?.email);

    // Create a property for this owner
    if (ownerData.user) {
      const { data: propData, error: propError } = await supabase.from('properties').insert([
        {
          name: 'Gravity StayFlow Villa',
          location: 'Bali, Indonesia',
          image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop',
        }
      ]).select().single();

      if (propError) {
        console.error('Error creating property:', propError.message);
      } else if (propData) {
        // Link owner to property
        const { error: linkError } = await supabase.from('property_owners').insert([
          { property_id: propData.id, profile_id: ownerData.user.id }
        ]);
        if (linkError) {
          console.error('Error linking property owner:', linkError.message);
        } else {
          console.log('Created and linked property for owner:', propData.name);
        }
      }
    }
  }

  console.log('Seed completed. You can log in with:');
  console.log('- Admin: admin@pertama.com / password123');
  console.log('- Owner: owner@pertama.com / password123');
}

seed();
