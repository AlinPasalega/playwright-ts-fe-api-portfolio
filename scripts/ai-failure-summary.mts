import fs from 'node:fs';

type Result = { status: string; error?: { message?: string } };
type Test = { results: Result[] };
type Spec = { title: string; file: string; tests: Test[] };
type Suite = { specs?: Spec[]; suites?: Suite[] };

const DEFAULT_MODEL = 'grok-4.3';

const out = process.env.GITHUB_STEP_SUMMARY;
const write = (md: string) => {
  try {
    if (out) fs.appendFileSync(out, md);
    else console.log(md);
  } catch (err) {
    console.log(md);
    console.error(err);
  }
};

try {
  if (!fs.existsSync('results.json')) {
    write('## 🤖 AI triage\nSkipped: results.json was not found.\n');
    process.exit(0);
  }

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
  report.suites?.forEach(walk);

  if (!failures.length) {
    write('## 🤖 AI triage\nAll tests passed, nothing to analyze.\n');
    process.exit(0);
  }

  if (!process.env.XAI_API_KEY) {
    write('## 🤖 AI triage\nSkipped: XAI_API_KEY is not set.\n');
    process.exit(0);
  }

  const res = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.XAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.XAI_MODEL || DEFAULT_MODEL,
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
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  write(`## 🤖 AI triage\nSkipped: ${message}\n`);
}
process.exit(0);
