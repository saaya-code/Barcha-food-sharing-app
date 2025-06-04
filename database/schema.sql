-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    whatsapp_number TEXT,
    total_donations INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create food_items table
CREATE TABLE public.food_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    food_type TEXT NOT NULL,
    quantity TEXT NOT NULL,
    image_url TEXT,
    location TEXT NOT NULL,
    expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
    pickup_instructions TEXT,
    donor_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    donor_name TEXT NOT NULL,
    donor_contact TEXT NOT NULL,
    contact_method TEXT DEFAULT 'whatsapp',
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create food_requests table
CREATE TABLE public.food_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    food_item_id UUID REFERENCES public.food_items(id) ON DELETE CASCADE NOT NULL,
    requester_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    requester_name TEXT NOT NULL,
    requester_contact TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create indexes for better performance
CREATE INDEX idx_food_items_donor_id ON public.food_items(donor_id);
CREATE INDEX idx_food_items_expiry_date ON public.food_items(expiry_date);
CREATE INDEX idx_food_items_food_type ON public.food_items(food_type);
CREATE INDEX idx_food_items_location ON public.food_items(location);
CREATE INDEX idx_food_items_is_available ON public.food_items(is_available);
CREATE INDEX idx_food_requests_food_item_id ON public.food_requests(food_item_id);
CREATE INDEX idx_food_requests_requester_id ON public.food_requests(requester_id);
CREATE INDEX idx_food_requests_status ON public.food_requests(status);

-- Set up Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for food_items table
CREATE POLICY "Anyone can view available food items" ON public.food_items
    FOR SELECT USING (is_available = true);

CREATE POLICY "Donors can view own food items" ON public.food_items
    FOR SELECT USING (auth.uid() = donor_id);

CREATE POLICY "Donors can insert food items" ON public.food_items
    FOR INSERT WITH CHECK (auth.uid() = donor_id);

CREATE POLICY "Donors can update own food items" ON public.food_items
    FOR UPDATE USING (auth.uid() = donor_id);

CREATE POLICY "Donors can delete own food items" ON public.food_items
    FOR DELETE USING (auth.uid() = donor_id);

-- Create policies for food_requests table
CREATE POLICY "Anyone can view food requests for their items" ON public.food_requests
    FOR SELECT USING (
        auth.uid() = requester_id OR 
        auth.uid() IN (
            SELECT donor_id FROM public.food_items WHERE id = food_item_id
        )
    );

CREATE POLICY "Authenticated users can create requests" ON public.food_requests
    FOR INSERT WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Requesters can update own requests" ON public.food_requests
    FOR UPDATE USING (auth.uid() = requester_id);

CREATE POLICY "Donors can update requests for their items" ON public.food_requests
    FOR UPDATE USING (
        auth.uid() IN (
            SELECT donor_id FROM public.food_items WHERE id = food_item_id
        )
    );

-- Create function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name, whatsapp_number)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'whatsapp_number'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update total_donations when food item is marked as unavailable
CREATE OR REPLACE FUNCTION public.update_donor_donations()
RETURNS TRIGGER AS $$
BEGIN
    -- If food item was marked as unavailable (donated)
    IF OLD.is_available = true AND NEW.is_available = false THEN
        UPDATE public.users 
        SET total_donations = total_donations + 1,
            updated_at = NOW()
        WHERE id = NEW.donor_id;
    END IF;
    
    -- If food item was marked as available again (donation cancelled)
    IF OLD.is_available = false AND NEW.is_available = true THEN
        UPDATE public.users 
        SET total_donations = GREATEST(total_donations - 1, 0),
            updated_at = NOW()
        WHERE id = NEW.donor_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update donation count
CREATE TRIGGER on_food_item_status_changed
    AFTER UPDATE ON public.food_items
    FOR EACH ROW EXECUTE FUNCTION public.update_donor_donations();

-- Create function to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_food_items_updated_at BEFORE UPDATE ON public.food_items
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_food_requests_updated_at BEFORE UPDATE ON public.food_requests
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();