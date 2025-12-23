-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  has_golden_ticket BOOLEAN DEFAULT FALSE,
  golden_ticket_purchased_at TIMESTAMP WITH TIME ZONE,
  stripe_customer_id TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create golden_tickets table
CREATE TABLE IF NOT EXISTS public.golden_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  purchaser_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  stripe_payment_intent_id TEXT NOT NULL,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_gift BOOLEAN DEFAULT FALSE,
  gift_recipient_email TEXT,
  gift_recipient_name TEXT,
  gift_token TEXT UNIQUE,
  gift_sent_at TIMESTAMP WITH TIME ZONE,
  gift_redeemed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notion_connections table
CREATE TABLE IF NOT EXISTS public.notion_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  notion_access_token TEXT NOT NULL,
  notion_workspace_id TEXT NOT NULL,
  notion_database_id TEXT,
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create groups table
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  is_private BOOLEAN DEFAULT TRUE,
  invite_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create group_members table
CREATE TABLE IF NOT EXISTS public.group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  UNIQUE(group_id, user_id)
);

-- Create wins table
CREATE TABLE IF NOT EXISTS public.wins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sticker_orders table
CREATE TABLE IF NOT EXISTS public.sticker_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'completed')),
  shipping_address JSONB NOT NULL,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  shipped_at TIMESTAMP WITH TIME ZONE,
  tracking_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_golden_tickets_purchaser ON public.golden_tickets(purchaser_id);
CREATE INDEX IF NOT EXISTS idx_golden_tickets_recipient ON public.golden_tickets(recipient_id);
CREATE INDEX IF NOT EXISTS idx_golden_tickets_token ON public.golden_tickets(gift_token);
CREATE INDEX IF NOT EXISTS idx_notion_connections_user ON public.notion_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group ON public.group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user ON public.group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_wins_user ON public.wins(user_id);
CREATE INDEX IF NOT EXISTS idx_wins_group ON public.wins(group_id);
CREATE INDEX IF NOT EXISTS idx_sticker_orders_user ON public.sticker_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_sticker_orders_status ON public.sticker_orders(status);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.golden_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notion_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sticker_orders ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Golden tickets policies
CREATE POLICY "Users can view their own golden tickets"
  ON public.golden_tickets FOR SELECT
  USING (auth.uid() = purchaser_id OR auth.uid() = recipient_id);

CREATE POLICY "Admins can view all golden tickets"
  ON public.golden_tickets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.is_admin = TRUE
    )
  );

-- Notion connections policies
CREATE POLICY "Users can manage their own notion connections"
  ON public.notion_connections FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Groups policies
CREATE POLICY "Users can view groups they are members of"
  ON public.groups FOR SELECT
  USING (
    is_private = FALSE OR
    EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_members.group_id = groups.id
      AND group_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create groups"
  ON public.groups FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Group creators can update their groups"
  ON public.groups FOR UPDATE
  USING (auth.uid() = created_by);

-- Group members policies
CREATE POLICY "Users can view members of groups they belong to"
  ON public.group_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.group_members gm
      WHERE gm.group_id = group_members.group_id
      AND gm.user_id = auth.uid()
    )
  );

CREATE POLICY "Group admins can manage members"
  ON public.group_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.group_members gm
      WHERE gm.group_id = group_members.group_id
      AND gm.user_id = auth.uid()
      AND gm.role = 'admin'
    )
  );

-- Wins policies
CREATE POLICY "Users can view wins in their groups"
  ON public.wins FOR SELECT
  USING (
    group_id IS NULL OR
    EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_members.group_id = wins.group_id
      AND group_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create wins"
  ON public.wins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wins"
  ON public.wins FOR UPDATE
  USING (auth.uid() = user_id);

-- Sticker orders policies
CREATE POLICY "Users can view their own orders"
  ON public.sticker_orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
  ON public.sticker_orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON public.sticker_orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.is_admin = TRUE
    )
  );

CREATE POLICY "Admins can update orders"
  ON public.sticker_orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.is_admin = TRUE
    )
  );

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

