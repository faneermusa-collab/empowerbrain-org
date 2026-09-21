import { useState } from 'react';
import { Mail, Phone, Globe, MapPin, Send, CheckCircle2, Clock } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative gradient-mesh border-b border-ink-100">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1.5 text-sm font-medium text-brand-700">
              <Mail className="h-4 w-4" />
              Get In Touch
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
              Contact Us
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-600">
              Have questions about our programs, enrollment, or franchise opportunities? We'd love to hear
              from you. Reach out and we'll get back to you shortly.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Mail, title: 'Email', value: 'info@empowerbrain.org', href: 'mailto:info@empowerbrain.org' },
              { icon: Phone, title: 'Phone', value: '(810) 295-4712', href: 'tel:+18102954712' },
              { icon: Globe, title: 'Website', value: 'empowerbrain.org', href: 'https://empowerbrain.org' },
              { icon: Clock, title: 'Response Time', value: 'Within 24 hours', href: null },
            ].map((item, i) => (
              <div key={i} className="card p-6 text-center transition-all hover:shadow-lg hover:-translate-y-0.5">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-ink-900">{item.title}</h3>
                {item.href ? (
                  <a href={item.href} className="mt-1 block text-sm text-brand-600 hover:text-brand-700 transition-colors">
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-1 text-sm text-ink-600">{item.value}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form + Map */}
      <section className="bg-ink-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Form */}
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-ink-900">Send Us a Message</h2>
              <p className="mt-2 text-sm text-ink-500">
                Fill out the form below and we'll contact you shortly.
              </p>

              {submitted ? (
                <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-accent-200 bg-accent-50 p-12 text-center">
                  <CheckCircle2 className="h-14 w-14 text-accent-600" />
                  <h3 className="mt-4 text-lg font-bold text-ink-900">Message Sent!</h3>
                  <p className="mt-2 text-sm text-ink-600">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: '', email: '', phone: '', message: '' });
                    }}
                    className="mt-6 btn-secondary"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink-700">Full Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input-field"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink-700">Email Address</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="input-field"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink-700">Phone Number</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="input-field"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink-700">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="input-field resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full">
                    Send Message <Send className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>

            {/* Info Side Panel */}
            <div className="flex flex-col gap-6">
              <div className="card p-8">
                <h3 className="text-lg font-bold text-ink-900">Empower Brain LLC</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  A leading training and development company specializing in mathematics and language
                  education. We are committed to transforming traditional learning methods through
                  innovative, patented methodologies.
                </p>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
                      <Mail className="h-5 w-5 text-brand-600" />
                    </div>
                    <div>
                      <div className="text-xs text-ink-400">Email</div>
                      <a href="mailto:info@empowerbrain.org" className="text-sm font-medium text-ink-700 hover:text-brand-600 transition-colors">
                        info@empowerbrain.org
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
                      <Phone className="h-5 w-5 text-brand-600" />
                    </div>
                    <div>
                      <div className="text-xs text-ink-400">Phone</div>
                      <a href="tel:+18102954712" className="text-sm font-medium text-ink-700 hover:text-brand-600 transition-colors">
                        (810) 295-4712
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
                      <Globe className="h-5 w-5 text-brand-600" />
                    </div>
                    <div>
                      <div className="text-xs text-ink-400">Website</div>
                      <a href="https://empowerbrain.org" className="text-sm font-medium text-ink-700 hover:text-brand-600 transition-colors">
                        empowerbrain.org
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-50">
                    <MapPin className="h-6 w-6 text-accent-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-ink-900">Serving Learners Worldwide</h3>
                    <p className="text-sm text-ink-500">Online & in-person programs</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-ink-600">
                  Our programs are available both online and offline, reaching students, teachers,
                  professionals, and parents across the globe. Whether you prefer in-person workshops or
                  online learning, we have a program that fits your needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
