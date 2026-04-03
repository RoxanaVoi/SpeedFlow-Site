import { useState, type FormEvent } from 'react';

interface ContactFormProps {
  labels: {
    name: string;
    org: string;
    email: string;
    domain: string;
    message: string;
    send: string;
    success: string;
  };
}

export default function ContactForm({ labels }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      await fetch('https://formspree.io/f/xnjodjnb', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="p-8 bg-emerald-50 rounded-2xl text-center">
        <svg className="w-12 h-12 text-emerald-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-lg font-medium text-emerald-800">{labels.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">{labels.name}</label>
          <input type="text" id="name" name="name" required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0D7377]/20 focus:border-[#0D7377] outline-none transition-colors" />
        </div>
        <div>
          <label htmlFor="org" className="block text-sm font-medium text-gray-700 mb-1.5">{labels.org}</label>
          <input type="text" id="org" name="organization"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0D7377]/20 focus:border-[#0D7377] outline-none transition-colors" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">{labels.email}</label>
          <input type="email" id="email" name="email" required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0D7377]/20 focus:border-[#0D7377] outline-none transition-colors" />
        </div>
        <div>
          <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-1.5">{labels.domain}</label>
          <input type="text" id="domain" name="domain"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0D7377]/20 focus:border-[#0D7377] outline-none transition-colors" />
        </div>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">{labels.message}</label>
        <textarea id="message" name="message" rows={4}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0D7377]/20 focus:border-[#0D7377] outline-none transition-colors resize-none" />
      </div>
      <button type="submit" disabled={loading}
        className="w-full sm:w-auto px-8 py-3.5 bg-[#0D7377] text-white font-semibold rounded-lg hover:bg-[#14919B] transition-colors disabled:opacity-50">
        {loading ? '...' : labels.send}
      </button>
    </form>
  );
}
