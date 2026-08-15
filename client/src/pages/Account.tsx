import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, User, ShieldCheck, LogOut, Save, PencilLine, X } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';
import { supabase } from '@/lib/supabase';

type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
};

const emptyProfileForm = (profile: Profile | null = null) => ({
  full_name: profile?.full_name || '',
  phone: profile?.phone || '',
  email: profile?.email || '',
});

export default function AccountPage() {
  const [, navigate] = useLocation();
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileForm, setProfileForm] = useState({ full_name: '', phone: '', email: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      const currentSession = data.session;

      if (!currentSession) {
        navigate('/login');
        return;
      }

      if (isMounted) {
        setSession(currentSession);
      }

      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentSession.user.id)
        .maybeSingle();

      if (error) {
        console.error('Profile fetch error:', error);
      }

      const fallbackProfile: Profile = {
        id: currentSession.user.id,
        full_name:
          currentSession.user.user_metadata?.full_name ||
          currentSession.user.email?.split('@')[0] ||
          'Customer',
        phone: currentSession.user.user_metadata?.phone || null,
        email: currentSession.user.email || null,
      };

      const resolvedProfile = profileData ?? fallbackProfile;

      if (isMounted) {
        setProfile(resolvedProfile);
        setProfileForm(emptyProfileForm(resolvedProfile));
        setLoading(false);
      }

      if (!profileData) {
        const { error: upsertError } = await supabase.from('profiles').upsert({
          id: currentSession.user.id,
          full_name: fallbackProfile.full_name,
          phone: fallbackProfile.phone,
          email: fallbackProfile.email,
        });

        if (upsertError) {
          toast.error(upsertError.message);
        }
      }
    };

    loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!nextSession) {
        navigate('/login');
        return;
      }

      setSession(nextSession);
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!session || !profile) return;

    const nextProfile = {
      id: session.user.id,
      full_name: profileForm.full_name || profile.full_name || session.user.user_metadata?.full_name || 'Customer',
      phone: profileForm.phone || profile.phone || session.user.user_metadata?.phone || null,
      email: profileForm.email || profile.email || session.user.email || null,
    };

    const { error } = await supabase.from('profiles').upsert(nextProfile, { onConflict: 'id' });

    if (error) {
      toast.error(error.message);
      return;
    }

    setProfile({ ...profile, ...nextProfile });
    setProfileForm(emptyProfileForm(nextProfile));
    setIsEditing(false);
    toast.success('Profile updated successfully.');
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Signed out successfully.');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-happi-cream">
        <div className="text-lg font-semibold text-happi-charcoal">Loading your account...</div>
      </div>
    );
  }

  if (!session || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-happi-cream rounded-3xl border border-happi-pink/10 p-8 md:p-12"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-happi-pink">My account</p>
              <h1 className="mt-3 text-3xl md:text-4xl font-black text-happi-charcoal">
                {profile.full_name || 'Welcome back'}
              </h1>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="btn-outline inline-flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            <div className="min-w-0 rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 text-happi-pink">
                <User className="w-5 h-5" />
                <span className="font-semibold">Name</span>
              </div>
              <p className="mt-4 break-words text-lg font-medium text-happi-charcoal">
                {profile.full_name || 'Not provided'}
              </p>
            </div>

            <div className="min-w-0 rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 text-happi-pink">
                <Mail className="w-5 h-5" />
                <span className="font-semibold">Email</span>
              </div>
              <p className="mt-4 break-all text-lg font-medium text-happi-charcoal">
                {profile.email || session.user.email || 'Not provided'}
              </p>
            </div>

            <div className="min-w-0 rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 text-happi-pink">
                <Phone className="w-5 h-5" />
                <span className="font-semibold">Phone</span>
              </div>
              <p className="mt-4 break-words text-lg font-medium text-happi-charcoal">
                {profile.phone || 'Not provided'}
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-2xl bg-white border border-gray-200 p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3 text-happi-green">
                <ShieldCheck className="h-5 w-5 shrink-0" />
                <span className="font-semibold">Account status</span>
              </div>

              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-happi-pink hover:text-happi-charcoal"
                >
                  <PencilLine className="w-4 h-4" />
                  Edit profile
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-gray-600 hover:text-happi-charcoal"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              )}
            </div>

            <p className="mt-4 text-gray-700">
              Your account is active and connected to your Supabase profile. You can continue shopping, manage your address details, and complete your order securely.
            </p>

            {isEditing && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-happi-charcoal mb-2">Full name</label>
                  <input
                    type="text"
                    name="full_name"
                    value={profileForm.full_name}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-happi-pink"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-happi-charcoal mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-happi-pink"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-happi-charcoal mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-happi-pink"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="inline-flex items-center gap-2 btn-primary"
                >
                  <Save className="w-4 h-4" />
                  Save changes
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
