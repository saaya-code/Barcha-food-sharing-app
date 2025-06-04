-- Mock data for Barcha food sharing application
-- Run these queries after creating the schema to populate the database with sample data

-- Insert mock users (you'll need to replace these UUIDs with actual auth user IDs from Supabase Auth)
-- Note: In a real scenario, these users would be created through the authentication system

-- Insert mock food items
INSERT INTO public.food_items (
  title, 
  description, 
  food_type, 
  quantity, 
  image_url, 
  location, 
  expiry_date, 
  pickup_instructions, 
  donor_id, 
  donor_name, 
  donor_contact, 
  contact_method, 
  is_available, 
  created_at
) VALUES
  (
    'Fresh Vegetables Bundle',
    'Assorted fresh vegetables including carrots, broccoli, spinach, and bell peppers. All organic and locally sourced.',
    'vegetables',
    '5 kg',
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500',
    'Downtown Community Center, 123 Main St',
    NOW() + INTERVAL '2 days',
    'Available for pickup between 9 AM - 6 PM. Ring the bell at the main entrance.',
    'a76bd21b-d91b-4b8c-89b2-f00292354d80',
    'John Baker',
    '+1234567890',
    'whatsapp',
    true,
    NOW() - INTERVAL '2 hours'
  ),
  (
    'Homemade Whole Wheat Bread',
    'Freshly baked whole wheat bread, perfect for sandwiches. Made with organic flour and no preservatives.',
    'bread',
    '3 loaves',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500',
    'City Park Entrance, near Oak Street',
    NOW() + INTERVAL '1 day',
    'Look for the red backpack on the park bench. Please take only what you need.',
    'a76bd21b-d91b-4b8c-89b2-f00292354d80',
    'John Baker',
    '+1234567890',
    'whatsapp',
    true,
    NOW() - INTERVAL '4 hours'
  ),
  (
    'Vegetarian Rice and Curry',
    'Freshly prepared vegetarian meal with basmati rice, mixed vegetable curry, and dal. Serves 10 people.',
    'cooked-meals',
    '10 servings',
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500',
    'University Campus, Student Center',
    NOW() + INTERVAL '8 hours',
    'Available at the student center kitchen. Ask for Maria at the front desk.',
    'a76bd21b-d91b-4b8c-89b2-f00292354d80',
    'Maria Chef',
    '+1234567891',
    'whatsapp',
    true,
    NOW() - INTERVAL '1 hour'
  ),
  (
    'Fresh Fruits Basket',
    'Mixed seasonal fruits including apples, bananas, oranges, and grapes. All ripe and ready to eat.',
    'fruits',
    '3 kg',
    'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=500',
    'Green Valley Mosque, 456 Elm Street',
    NOW() + INTERVAL '3 days',
    'Available after Friday prayers (1 PM onwards). Contact Ahmed for coordination.',
    'a76bd21b-d91b-4b8c-89b2-f00292354d80',
    'Ahmed Restaurant',
    '+1234567892',
    'whatsapp',
    true,
    NOW() - INTERVAL '30 minutes'
  ),
  (
    'Dairy Products Bundle',
    'Fresh milk (2L), yogurt (500g), and cheese (300g). All products are within expiry and properly refrigerated.',
    'dairy',
    '1 bundle',
    'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500',
    'Sunrise Café, 789 Pine Avenue',
    NOW() + INTERVAL '2 days',
    'Available during café hours (7 AM - 8 PM). Please bring a cooler bag if possible.',
    'a76bd21b-d91b-4b8c-89b2-f00292354d80',
    'David Café Owner',
    '+1234567894',
    'whatsapp',
    true,
    NOW() - INTERVAL '6 hours'
  ),
  (
    'Pasta and Sauce',
    'Various types of pasta (spaghetti, penne, fusilli) with homemade tomato and pesto sauces.',
    'other',
    '2 kg pasta + 4 jars sauce',
    'https://images.unsplash.com/photo-1621996346565-e3dbc353d946?w=500',
    'Little Italy District, Mario''s Kitchen',
    NOW() + INTERVAL '5 days',
    'Contact Maria 2 hours before pickup. Available weekdays 10 AM - 4 PM.',
    'a76bd21b-d91b-4b8c-89b2-f00292354d80',
    'Maria Chef',
    '+1234567891',
    'whatsapp',
    true,
    NOW() - INTERVAL '8 hours'
  ),
  (
    'Fresh Desserts',
    'Assorted homemade desserts including chocolate cake slices, fruit tarts, and cookies.',
    'desserts',
    '15 pieces',
    'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500',
    'Sweet Dreams Bakery, 321 Sugar Lane',
    NOW() + INTERVAL '1 day',
    'Perfect for events or sharing. Pickup available until 9 PM today.',
    'a76bd21b-d91b-4b8c-89b2-f00292354d80',
    'John Baker',
    '+1234567890',
    'whatsapp',
    true,
    NOW() - INTERVAL '3 hours'
  ),
  (
    'Beverages Variety Pack',
    'Assorted beverages including fruit juices, soft drinks, and bottled water. All unopened and fresh.',
    'beverages',
    '20 bottles/cans',
    'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500',
    'Community Center Event Hall',
    NOW() + INTERVAL '7 days',
    'Left over from community event. Available for pickup anytime this week.',
    'a76bd21b-d91b-4b8c-89b2-f00292354d80',
    'Sarah Community Helper',
    '+1234567893',
    'whatsapp',
    true,
    NOW() - INTERVAL '12 hours'
  );

-- Insert mock food requests
INSERT INTO public.food_requests (
  food_item_id,
  requester_id,
  requester_name,
  requester_contact,
  message,
  status,
  created_at
) VALUES
  (
    (SELECT id FROM public.food_items WHERE title = 'Fresh Vegetables Bundle' LIMIT 1),
    'a76bd21b-d91b-4b8c-89b2-f00292354d80',
    'Sarah Community Helper',
    '+1234567893',
    'This would be perfect for our weekend community meal preparation! We''re cooking for 30 families.',
    'pending',
    NOW() - INTERVAL '1 hour'
  ),
  (
    (SELECT id FROM public.food_items WHERE title = 'Vegetarian Rice and Curry' LIMIT 1),
    'a76bd21b-d91b-4b8c-89b2-f00292354d80',
    'Sarah Community Helper',
    '+1234567893',
    'Our community kitchen could really use this for tonight''s dinner service.',
    'approved',
    NOW() - INTERVAL '3 hours'
  ),
  (
    (SELECT id FROM public.food_items WHERE title = 'Homemade Whole Wheat Bread' LIMIT 1),
    'a76bd21b-d91b-4b8c-89b2-f00292354d80',
    'Ahmed Restaurant',
    '+1234567892',
    'Would love to use this bread for our soup kitchen program tomorrow.',
    'pending',
    NOW() - INTERVAL '2 hours'
  ),
  (
    (SELECT id FROM public.food_items WHERE title = 'Fresh Fruits Basket' LIMIT 1),
    'a76bd21b-d91b-4b8c-89b2-f00292354d80',
    'Maria Chef',
    '+1234567891',
    'These fruits would be great for our after-school program snacks.',
    'pending',
    NOW() - INTERVAL '30 minutes'
  ),
  (
    (SELECT id FROM public.food_items WHERE title = 'Fresh Desserts' LIMIT 1),
    'a76bd21b-d91b-4b8c-89b2-f00292354d80',
    'David Café Owner',
    '+1234567894',
    'We have a birthday celebration at our café tomorrow. These would be perfect!',
    'declined',
    NOW() - INTERVAL '4 hours'
  );

-- Update user donation counts based on their food items
UPDATE public.users SET total_donations = (
  SELECT COUNT(*) FROM public.food_items WHERE donor_id = users.id
) WHERE id IN (
  'a76bd21b-d91b-4b8c-89b2-f00292354d80',
  'a76bd21b-d91b-4b8c-89b2-f00292354d80',
  'a76bd21b-d91b-4b8c-89b2-f00292354d80',
  'a76bd21b-d91b-4b8c-89b2-f00292354d80',
  'a76bd21b-d91b-4b8c-89b2-f00292354d805'
);

-- Insert mock favorites
INSERT INTO public.favorites (user_id, food_item_id, created_at) VALUES
  (
    'a76bd21b-d91b-4b8c-89b2-f00292354d80',
    (SELECT id FROM public.food_items WHERE title = 'Fresh Vegetables Bundle' LIMIT 1),
    NOW() - INTERVAL '1 hour'
  ),
  (
    'a76bd21b-d91b-4b8c-89b2-f00292354d80',
    (SELECT id FROM public.food_items WHERE title = 'Homemade Whole Wheat Bread' LIMIT 1),
    NOW() - INTERVAL '2 hours'
  ),
  (
    'a76bd21b-d91b-4b8c-89b2-f00292354d80',
    (SELECT id FROM public.food_items WHERE title = 'Fresh Fruits Basket' LIMIT 1),
    NOW() - INTERVAL '30 minutes'
  ),
  (
    'a76bd21b-d91b-4b8c-89b2-f00292354d80',
    (SELECT id FROM public.food_items WHERE title = 'Dairy Products Bundle' LIMIT 1),
    NOW() - INTERVAL '3 hours'
  );

-- Insert mock notifications
INSERT INTO public.notifications (user_id, title, message, type, related_id, related_type, is_read, created_at) VALUES
  (
    'a76bd21b-d91b-4b8c-89b2-f00292354d80',
    'New Request for Your Item',
    'Sarah Community Helper has requested your "Fresh Vegetables Bundle". Check your requests to approve or decline.',
    'info',
    (SELECT id FROM public.food_requests WHERE requester_name = 'Sarah Community Helper' AND food_item_id = (SELECT id FROM public.food_items WHERE title = 'Fresh Vegetables Bundle' LIMIT 1) LIMIT 1),
    'request',
    false,
    NOW() - INTERVAL '30 minutes'
  ),
  (
    'a76bd21b-d91b-4b8c-89b2-f00292354d80',
    'Request Approved',
    'Your request for "Vegetarian Rice and Curry" has been approved! Contact the donor to arrange pickup.',
    'success',
    (SELECT id FROM public.food_requests WHERE requester_name = 'Sarah Community Helper' AND food_item_id = (SELECT id FROM public.food_items WHERE title = 'Vegetarian Rice and Curry' LIMIT 1) LIMIT 1),
    'request',
    false,
    NOW() - INTERVAL '2 hours'
  ),
  (
    'a76bd21b-d91b-4b8c-89b2-f00292354d80',
    'Request Declined',
    'Unfortunately, your request for "Fresh Desserts" was declined. The item may no longer be available.',
    'warning',
    (SELECT id FROM public.food_requests WHERE requester_name = 'David Café Owner' LIMIT 1),
    'request',
    true,
    NOW() - INTERVAL '4 hours'
  ),
  (
    'a76bd21b-d91b-4b8c-89b2-f00292354d80',
    'Welcome to Barcha!',
    'Thank you for joining our food sharing community! Start by browsing available items or adding your own.',
    'info',
    null,
    null,
    true,
    NOW() - INTERVAL '1 day'
  ),
  (
    'a76bd21b-d91b-4b8c-89b2-f00292354d80',
    'New Item Available Nearby',
    'A new food item "Fresh Desserts" has been posted near your location. Check it out!',
    'info',
    (SELECT id FROM public.food_items WHERE title = 'Fresh Desserts' LIMIT 1),
    'food_item',
    false,
    NOW() - INTERVAL '3 hours'
  );

-- Display inserted data for verification
SELECT 'Users created:' as info, COUNT(*) as count FROM public.users;
SELECT 'Food items created:' as info, COUNT(*) as count FROM public.food_items;
SELECT 'Food requests created:' as info, COUNT(*) as count FROM public.food_requests;
SELECT 'Favorites created:' as info, COUNT(*) as count FROM public.favorites;
SELECT 'Notifications created:' as info, COUNT(*) as count FROM public.notifications;

-- Show sample data
SELECT 'Sample Food Items:' as info;
SELECT title, food_type, location, donor_name, is_available 
FROM public.food_items 
ORDER BY created_at DESC 
LIMIT 5;

SELECT 'Sample Food Requests:' as info;
SELECT fr.requester_name, fi.title, fr.status, fr.created_at
FROM public.food_requests fr
JOIN public.food_items fi ON fr.food_item_id = fi.id
ORDER BY fr.created_at DESC;

SELECT 'Sample Favorites:' as info;
SELECT u.name as user_name, fi.title as food_item, f.created_at
FROM public.favorites f
JOIN public.users u ON f.user_id = u.id
JOIN public.food_items fi ON f.food_item_id = fi.id
ORDER BY f.created_at DESC;

SELECT 'Sample Notifications:' as info;
SELECT u.name as user_name, n.title, n.type, n.is_read, n.created_at
FROM public.notifications n
JOIN public.users u ON n.user_id = u.id
ORDER BY n.created_at DESC;
