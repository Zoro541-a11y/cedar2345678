import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, ADMIN_ROLES } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  adminAuthed: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signInAsAdmin: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  exitAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminAuthed, setAdminAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;
      if (error) console.error('getSession error:', error.message);
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        checkRole(data.session.user.id);
      } else {
        setLoading(false);
      }
    }).catch((err) => {
      console.error('getSession threw:', err);
      if (mounted) setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        checkRole(newSession.user.id);
      } else {
        setIsAdmin(false);
        setAdminAuthed(false);
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const checkRole = async (uid: string) => {
    const { data } = await supabase.from('profiles').select('role').eq('id', uid).maybeSingle();
    setIsAdmin(ADMIN_ROLES.includes(data?.role ?? ''));
    setLoading(false);
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error?.message ?? null };
    } catch (err: any) {
      return { error: err?.message ?? 'Network error' };
    }
  };

  const signInAsAdmin = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      if (data.user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).maybeSingle();
        if (!ADMIN_ROLES.includes(profile?.role ?? '')) {
          await supabase.auth.signOut();
          return { error: 'This account does not have admin access' };
        }
        setAdminAuthed(true);
      }
      return { error: null };
    } catch (err: any) {
      return { error: err?.message ?? 'Network error' };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: fullName } },
      });
      if (error) return { error: error.message };
      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id, full_name: fullName, role: 'customer',
        });
      }
      return { error: null };
    } catch (err: any) {
      return { error: err?.message ?? 'Network error' };
    }
  };

  const signOut = async () => {
    try { await supabase.auth.signOut(); } catch (err) { console.error('signOut error:', err); }
    setAdminAuthed(false);
  };

  const exitAdmin = () => {
    setAdminAuthed(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, adminAuthed, signIn, signInAsAdmin, signUp, signOut, exitAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
