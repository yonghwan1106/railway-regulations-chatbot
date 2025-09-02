-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" = 'your-jwt-secret-here';

-- Create users table extension
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  organization TEXT,
  role TEXT CHECK (role IN ('engineer', 'government_official', 'contractor', 'admin')) DEFAULT 'engineer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create regulations table
CREATE TABLE IF NOT EXISTS regulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  article_number TEXT NOT NULL,
  source_document TEXT NOT NULL,
  priority_level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on regulations
ALTER TABLE regulations ENABLE ROW LEVEL SECURITY;

-- Create policy for regulations (readable by all authenticated users)
CREATE POLICY "Authenticated users can read regulations" ON regulations
  FOR SELECT TO authenticated USING (true);

-- Create search_history table
CREATE TABLE IF NOT EXISTS search_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  results_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on search_history
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

-- Create policy for search_history
CREATE POLICY "Users can view own search history" ON search_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own search history" ON search_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  regulation_id UUID REFERENCES regulations(id) ON DELETE CASCADE,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, regulation_id)
);

-- Enable RLS on bookmarks
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policies for bookmarks
CREATE POLICY "Users can manage own bookmarks" ON bookmarks
  FOR ALL USING (auth.uid() = user_id);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  favorite_regulations UUID[] DEFAULT '{}',
  search_history_enabled BOOLEAN DEFAULT true,
  notification_regulation_updates BOOLEAN DEFAULT true,
  notification_system_announcements BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on user_preferences
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for user_preferences
CREATE POLICY "Users can manage own preferences" ON user_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', 'New User'));
  
  INSERT INTO user_preferences (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_regulations_category ON regulations(category);
CREATE INDEX IF NOT EXISTS idx_regulations_content ON regulations USING GIN(to_tsvector('korean', content));
CREATE INDEX IF NOT EXISTS idx_search_history_user_id ON search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);

-- Insert sample regulations data
INSERT INTO regulations (title, content, category, article_number, source_document) VALUES
('고속철도 최소 곡선반지름', '고속철도의 최소 곡선반지름은 설계속도 250km/h에서 3500m 이상이어야 한다.', '선로설계', 'Article 3.2.1', '철도건설규칙'),
('교량 최대 경간장', '철도교량의 최대 경간장은 콘크리트교의 경우 40m, 강교의 경우 100m를 초과하지 않는 것을 원칙으로 한다.', '교량설계', 'Article 4.1.2', '철도건설규칙'),
('터널 내공단면적', '복선터널의 최소 내공단면적은 100㎡ 이상이어야 하며, 단선터널은 70㎡ 이상이어야 한다.', '터널설계', 'Article 5.3.1', '철도건설규칙'),
('역사 승강장 폭', '승강장의 최소 유효폭은 승객 대기인원을 고려하여 3.5m 이상으로 한다.', '역사설계', 'Article 6.2.3', '철도건설규칙'),
('전철주 간격', '전철주의 표준 간격은 직선부에서 50m, 곡선부에서는 40m를 원칙으로 한다.', '전기설비', 'Article 7.1.4', '철도전기설비기준');