import { type FormEvent } from 'react';

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
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const name = data.get('name') as string;
    const org = data.get('organization') as string;
    const email = data.get('email') as string;
    const domain = data.get('domain') as string;
    const message = data.get('message') as string;

    const subject = `[SpeedFlow] Cerere demo — ${name}${org ? ` (${org})` : ''}`;
    const body = [
      `Nume: ${name}`,
      org ? `Organizatie: ${org}` : '',
      `Email: ${email}`,
      domain ? `Domeniu / tip proces: ${domain}` : '',
      '',
      message || '(fara mesaj)',
    ].filter(Boolean).join('\n');

    window.location.href = `mailto:office@bid-management.ro?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
      <button type="submit"
        className="w-full sm:w-auto px-8 py-3.5 bg-[#0D7377] text-white font-semibold rounded-lg hover:bg-[#14919B] transition-colors">
        {labels.send}
      </button>
    </form>
  );
}
