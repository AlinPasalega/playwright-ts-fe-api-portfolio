import fs from 'node:fs';

type Result = { status: string; error?: { message?: string } };
type Test = { results: Result[] };
type Spec = { title: string; file: string; tests: Test[] };
type Suite = { specs?: Spec[]; suites?: Suite[] };

const report = JSON.parse(fs.readFileSync('results.json', 'utf8'));

const failures: string[] = [];
const walk = (s: Suite) => {
  s.specs?.forEach((spec) =>
    spec.tests.forEach((t) => {
      const last = t.results.at(-1);
      if (last && last.status !== 'passed' && last.status !== 'skipped') {
        failures.push(
          `${spec.file} > ${spec.title}\n${(last.error?.message ?? '').slice(0, 1500)}`,
        );
      }
    }),
  );
  s.suites?.forEach(walk);
};
report.suites.forEach(walk);

const out = process.env.GITHUB_STEP_SUMMARY;
const write = (md: string) => (out ? fs.appendFileSync(out, md) : console.log(md));

if (!failures.length) {
  write('## 🤖 AI triage\nAll tests passed, nothing to analyze.\n');
  process.exit(0);
}

const res = await fetch('https://api.x.ai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.XAI_API_KEY}`,
  },
  body: JSON.stringify({
    model: process.env.XAI_MODEL,
    temperature: 0,
    messages: [
      {
        role: 'system',
        content:
          'You are a senior QA engineer. For each failed Playwright test give: likely cause (product bug / test bug / flaky / env), one-line reason, suggested fix. Be brief, use markdown.',
      },
      { role: 'user', content: failures.join('\n\n---\n\n') },
    ],
  }),
});

if (!res.ok) {
  write(`## 🤖 AI triage\nSkipped: xAI API returned ${res.status}.\n`);
  process.exit(0);
}
const data = await res.json();
write(`## 🤖 AI triage (Grok)\n${data.choices[0].message.content}\n`);
