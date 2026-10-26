import assert from 'node:assert/strict';
import { test } from 'node:test';
import { contactItems } from '../../src/lib/contact.ts';
import type { SiteConfig } from '../../src/types/index.ts';

const base: SiteConfig = {
  url: '',
  person: { name: 'Test' },
  contact: { email: '', whatsapp: '' },
  links: { github: '', linkedin: '' },
  resume: { path: '/resume/resume.pdf', available: false },
};

test('omits empty values', () => {
  assert.deepEqual(contactItems(base), []);
});

test('placeholder email is shown without a link', () => {
  const [item] = contactItems({ ...base, contact: { email: '[CONFIRM: email]', whatsapp: '' } });
  assert.equal(item?.kind, 'email');
  assert.equal(item?.href, undefined);
});

test('real email becomes a mailto link', () => {
  const [item] = contactItems({ ...base, contact: { email: 'me@example.com', whatsapp: '' } });
  assert.equal(item?.href, 'mailto:me@example.com');
});

test('email subject is encoded into the mailto link', () => {
  const [item] = contactItems(
    { ...base, contact: { email: 'me@example.com', whatsapp: '' } },
    { emailSubject: 'Website project enquiry' },
  );
  assert.equal(item?.href, 'mailto:me@example.com?subject=Website%20project%20enquiry');
});

test('WhatsApp needs digits only, and encodes a prefilled message', () => {
  const ok = contactItems({ ...base, contact: { email: '', whatsapp: '919876543210' } }, {
    whatsappMessage: 'Hi — a project?',
  });
  assert.equal(ok[0]?.href, 'https://wa.me/919876543210?text=Hi%20%E2%80%94%20a%20project%3F');
  assert.equal(ok[0]?.display, '+919876543210');

  const bad = contactItems({ ...base, contact: { email: '', whatsapp: '+91 98765 43210' } });
  assert.equal(bad[0]?.href, undefined, 'formatted numbers are not linked until cleaned up');
});

test('profile links must be https', () => {
  const items = contactItems({
    ...base,
    links: { github: 'https://github.com/someone/', linkedin: 'http://linkedin.com/in/x' },
  });
  assert.equal(items[0]?.href, 'https://github.com/someone/');
  assert.equal(items[0]?.display, 'github.com/someone');
  assert.equal(items[1]?.href, undefined);
});
