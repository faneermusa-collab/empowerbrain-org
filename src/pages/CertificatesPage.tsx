import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, Download, Calendar, User, BookOpen, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import type { CertificateWithCourse } from '@/types/database';

export default function CertificatesPage() {
  const { profile } = useAuth();
  const [certificates, setCertificates] = useState<CertificateWithCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    supabase
      .from('certificates')
      .select(`
        id, user_id, course_id, enrollment_id, certificate_number, issued_at,
        courses ( title, slug, instructor_name )
      `)
      .eq('user_id', profile.id)
      .order('issued_at', { ascending: false })
      .then(({ data }) => {
        setCertificates((data as unknown as CertificateWithCourse[]) ?? []);
        setLoading(false);
      });
  }, [profile]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-8 w-48 animate-shimmer shimmer-bg rounded-lg" />
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {[0, 1].map((i) => <div key={i} className="h-64 animate-shimmer shimmer-bg rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50">
          <Award className="h-6 w-6 text-amber-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-ink-900">My Certificates</h1>
          <p className="text-sm text-ink-500">Certificates earned by completing courses</p>
        </div>
      </div>

      {certificates.length === 0 ? (
        <div className="mt-8 card p-12 text-center">
          <Award className="mx-auto h-12 w-12 text-ink-300" />
          <h3 className="mt-4 text-lg font-semibold text-ink-700">No certificates yet</h3>
          <p className="mt-1 text-sm text-ink-500">
            Complete a course to earn your first certificate. Certificates are issued automatically
            when you finish all lessons.
          </p>
          <Link to="/courses" className="btn-primary mt-4">
            <BookOpen className="h-4 w-4" /> Browse Courses
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {certificates.map((cert) => (
            <div key={cert.id} className="card relative overflow-hidden p-8">
              {/* Decorative gradient */}
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-brand-100 to-accent-100 opacity-50" />
              <div className="absolute -left-8 -bottom-8 h-24 w-24 rounded-full bg-gradient-to-br from-amber-50 to-brand-50 opacity-50" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white">
                    <Award className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-medium text-ink-400">
                    {cert.courses.instructor_name}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-bold text-ink-900">{cert.courses.title}</h3>

                <div className="mt-4 space-y-2 border-t border-ink-100 pt-4">
                  <div className="flex items-center gap-2 text-sm text-ink-600">
                    <User className="h-4 w-4 text-ink-400" />
                    <span className="font-medium">{profile?.full_name || 'Student'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-ink-600">
                    <Calendar className="h-4 w-4 text-ink-400" />
                    <span>Issued on {new Date(cert.issued_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-ink-600">
                    <Award className="h-4 w-4 text-ink-400" />
                    <span className="font-mono text-xs">{cert.certificate_number}</span>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <Link to={`/courses/${cert.courses.slug}`} className="btn-secondary flex-1">
                    View Course <ArrowRight className="h-4 w-4 rtl-flip" />
                  </Link>
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm font-semibold text-ink-600 transition-all hover:border-brand-300 hover:text-brand-700"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
