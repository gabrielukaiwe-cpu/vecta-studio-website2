import { useEffect, useRef, useState } from 'react';
import DotField from '../components/DotField.jsx';
import TypedTitle from '../components/TypedTitle.jsx';
import FinalCta from '../components/FinalCta.jsx';
import useReveal, { usePrefersReducedMotion } from '../hooks/useReveal.js';
import useTheme from '../hooks/useTheme.js';
import useTypewriter from '../hooks/useTypewriter.js';

const APP = 'https://app.vectastudio.ai/';
const SERVER = 'https://avs-prod-backend-937508501188.us-central1.run.app/mcp/';

/* ---------------- content ---------------- */

const SNIPPETS = [
  {
    id: 'claude-code',
    label: 'Claude Code',
    code: `claude mcp add --transport http vecta ${SERVER} \\
  --header "Authorization: Bearer vecta_pat_…"`,
  },
  {
    id: 'cursor',
    label: 'Cursor',
    note: '~/.cursor/mcp.json',
    code: `{
  "mcpServers": {
    "vecta": {
      "url": "${SERVER}",
      "headers": { "Authorization": "Bearer vecta_pat_…" }
    }
  }
}`,
  },
  {
    id: 'api',
    label: 'Claude API',
    note: 'Python',
    code: `import anthropic

client = anthropic.Anthropic()
response = client.beta.messages.create(
    model="claude-opus-5-5",
    max_tokens=4096,
    betas=["mcp-client-2025-11-20"],
    mcp_servers=[{
        "type": "url",
        "url": "${SERVER}",
        "name": "vecta",
        "authorization_token": "vecta_pat_…",
    }],
    tools=[{"type": "mcp_toolset", "mcp_server_name": "vecta"}],
    messages=[{"role": "user", "content": "List my Vecta Studio projects."}],
)`,
  },
  {
    id: 'desktop',
    label: 'Claude Desktop',
    note: 'claude_desktop_config.json, via mcp-remote',
    code: `{
  "mcpServers": {
    "vecta": {
      "command": "npx",
      "args": ["mcp-remote", "${SERVER}",
               "--header", "Authorization:\${AUTH_HEADER}"],
      "env": { "AUTH_HEADER": "Bearer vecta_pat_…" }
    }
  }
}`,
  },
];

const TOKEN_STEPS = [
  ['Name it', 'After the agent that will use it, like “Claude Code”.'],
  ['Choose who it acts as', 'Yourself, a teammate, or a new agent member.'],
  ['Set a monthly limit', 'Paid steps that would go past it are refused.'],
  ['Copy the token', 'It is shown once, so keep it safe.'],
];

const FLOW = [
  { n: '01', tool: 'capabilities', tag: 'Read', text: 'Learn the styles, lengths, voices and models, and what Vecta Studio can’t do yet.' },
  { n: '02', tool: 'create_project', tag: 'Free', text: 'Describe the idea. Pick style, aspect ratio, length and voices.' },
  { n: '03', tool: 'write_script', tag: 'Paid', text: 'Writes the script and plans every shot, in about a minute.' },
  { n: '04', tool: 'create_looks', tag: 'Paid', text: 'Creates the cast and places so faces stay consistent shot to shot.' },
  { n: '05', tool: 'film', tag: 'Paid', text: 'Films every shot and assembles the video. Usually 5–15 minutes.' },
  { n: '06', tool: 'publish_video', tag: 'Paid', text: 'Get the MP4, or publish to YouTube or Instagram once a person approves.' },
];

const TOOLS = [
  ['capabilities', 'Read', 'What Vecta Studio can make, and what it can’t yet. Call it first.'],
  ['get_credits', 'Read', 'Workspace balance and what this token used this month.'],
  ['list_projects', 'Read', 'Recent video projects, newest first.'],
  ['create_project', 'Free', 'Start a project from an idea: style, type, ratio, length, voices.'],
  ['update_plan', 'Free', 'Change a project’s idea, style, length, voices, model or title.'],
  ['get_project', 'Read', 'Everything about a project now, including the next step.'],
  ['quote', 'Read', 'Estimated credits for any paid step, before you spend.'],
  ['write_script', 'Paid', 'Write the script and plan the shots. Add notes to rewrite.'],
  ['create_looks', 'Paid', 'Cast and place images that keep faces consistent.'],
  ['film', 'Paid', 'Film every shot, then assemble with transitions and narration.'],
  ['edit_shot', 'Free', 'Change one shot’s description, narration, length or sound.'],
  ['refilm_shot', 'Paid', 'Film one shot again from its current description.'],
  ['edit_take', 'Paid', 'Change one thing in a filmed shot and keep the rest.'],
  ['reassemble', 'Paid', 'Put the shots back together after an edit. Small cost.'],
  ['ask_vecta', 'Read', 'Ask Vecta Studio’s assistant what went wrong in a shot.'],
  ['get_video', 'Read', 'The finished MP4 link, length and every version.'],
  ['list_channels', 'Read', 'Connected YouTube and Instagram channels.'],
  ['publish_video', 'Paid', 'Publish with title, caption, tags and privacy, after approval.'],
  ['publish_status', 'Read', 'Where it was published, with links and any errors.'],
  ['request_feature', 'Free', 'Tell the Vecta Studio team what a video needs that Vecta Studio can’t do yet.'],
];

const LIMITS = [
  ['Workspace credits', 'Paid steps use the same credits and prices as the app.'],
  ['Quote first', 'Ask for a quote, then pass max_credits. Anything pricier is refused and nothing starts.'],
  ['Monthly token limit', 'Each token can have its own limit. It resets on the 1st (UTC).'],
  ['A token is a member', 'It acts as one member of one workspace, with that member’s permissions.'],
  ['Shown once, stored hashed', 'Vecta Studio keeps only a hash. Use a secret manager, never your code.'],
  ['Revoke anytime', 'Revoking a token in the workspace stops it immediately.'],
];

const ERRORS = [
  ['401 Unauthorized', 'The Authorization header is missing, or the token is wrong, revoked or expired. Create a new token.'],
  ['Over the token’s monthly limit', 'The paid step would pass the token’s limit. Nothing was started. Raise the limit or wait for the next month.'],
  ['Over max_credits', 'The quote is above the max_credits you passed. Nothing was started.'],
  ['Out of credits', 'The workspace has no credits left for this step. Add credits in Vecta Studio and try again.'],
  ['Step out of order', 'For example “Write the script first”. Errors say what to do next, so follow get_project’s next_step.'],
];

const PROMPTS = [
  'Make a 30-second vertical realistic video about the last lighthouse keeper in Cornwall. Quote filming first and don’t spend more than 3,000 credits.',
  'Show me my last three Vecta Studio projects and tell me which ones still need filming.',
  'In my latest project, shot 3 has an extra person. Fix it the cheapest way and reassemble the video.',
  'Write a title and description for my finished video and publish it to YouTube as unlisted after I say yes.',
];
const PROMPT_TABS = ['Make a video', 'Check projects', 'Fix a shot', 'Publish'];

/* ---------------- small helpers ---------------- */

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function CopyButton({ text, label = 'Copy' }) {
  const [done, setDone] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 1600);
    } catch (e) {
      /* clipboard may be blocked: the text stays selectable */
    }
  }
  return (
    <button type="button" className={done ? 'dev-copy is-done' : 'dev-copy'} onClick={copy}>
      {done ? 'Copied' : label}
    </button>
  );
}

// light or dark section with the same grow-from-a-box and typed title as the home page
export function DevSection({ id, tone, eyebrow, lines, sub, children }) {
  const { reduce, ref, seen, onDone, on } = useReveal();
  const dark = tone === 'dark';
  const p = dark ? 'studio' : 'problem';
  return (
    <section className={dark ? 'studio dev-section' : 'problem dev-section'} id={id} ref={ref}>
      <div className={`${p}-glow`} aria-hidden="true" />
      <div className={`${p}-inner`}>
        <div className={`${p}-head`}>
          <span className={dark ? 'eyebrow eyebrow-dark' : 'eyebrow'}>{eyebrow}</span>
          {seen ? (
            <TypedTitle lines={lines} className={`${p}-title`} reduce={reduce} onDone={onDone} />
          ) : (
            <h2 className={`${p}-title ${p === 'studio' ? 'studio-ghost' : 'problem-ghost'}`} aria-hidden="true">
              {lines.map((l) => <span className="typed-line" key={l}>{l}</span>)}
            </h2>
          )}
          <p className={dark ? `studio-sub rise ${on(1)}` : `problem-sub rise ${on(1)}`}>{sub}</p>
        </div>
        <div className={`dev-body rise ${on(2)}`}>{children}</div>
      </div>
    </section>
  );
}

/* ---------------- hero ---------------- */

const HERO_LINES = ['Let your agent', 'make videos.'];

function DevHero() {
  const reduce = usePrefersReducedMotion();
  const [theme] = useTheme();
  const contentRef = useRef(null);
  const [stage, setStage] = useState(reduce ? 3 : 0);
  const onDone = useRef(() => {
    setTimeout(() => setStage((s) => Math.max(s, 1)), 80);
    setTimeout(() => setStage((s) => Math.max(s, 2)), 450);
    setTimeout(() => setStage((s) => Math.max(s, 3)), 900);
  });
  return (
    <section className="hero hero-dev" id="top">
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-glow-light" aria-hidden="true" />
      <DotField avoidRef={contentRef} show reduceMotion={reduce} light={theme === 'light'} />
      <div className="hero-content" ref={contentRef}>
        <span className="eyebrow eyebrow-dark dev-eyebrow">Developers</span>
        <TypedTitle lines={HERO_LINES} className="hero-title" reduce={reduce} speed={42} startDelay={900} onDone={onDone.current} />
        <p className={stage >= 1 ? 'hero-sub is-in' : 'hero-sub'}>
          Connect Claude, Cursor or your own agent to Vecta Studio. It can plan, script, film, fix and publish, using your workspace&rsquo;s credits and approvals.
        </p>
        <div className={stage >= 2 ? 'hero-actions is-in' : 'hero-actions'}>
          <a className="btn btn-primary btn-large" href={APP} target="_blank" rel="noopener">Get an API token</a>
          <button type="button" className="btn btn-glass btn-large" onClick={() => scrollToId('connect')}>Connect your agent</button>
        </div>
        <div className={stage >= 3 ? 'dev-chips is-in' : 'dev-chips'}>
          <span>MCP server</span><span>Streamable HTTP</span><span>Bearer token</span>
        </div>
      </div>
    </section>
  );
}

/* ---------------- sections ---------------- */

function highlight(code) {
  // tint the token placeholder and the server address
  return code.split(/(vecta_pat_…|https:\/\/[^\s"\\]+)/g).map((part, i) => {
    if (part === 'vecta_pat_…') return <span className="tok-secret" key={i}>{part}</span>;
    if (part.startsWith('https://')) return <span className="tok-url" key={i}>{part}</span>;
    return part;
  });
}

function Connect() {
  const [tab, setTab] = useState(0);
  const s = SNIPPETS[tab];
  return (
    <DevSection id="connect" tone="light" eyebrow="Quick start" lines={['Connect in', 'a minute.']}
      sub="One server, one token. It works with Claude Code, Cursor, Claude Desktop and the Claude API.">
      <div className="dev-connect">
        <div className="dev-card dev-server">
          <div>
            <span className="dev-label">Server URL</span>
            <code className="dev-url">{SERVER}</code>
          </div>
          <div>
            <span className="dev-label">Authentication</span>
            <code className="dev-url">Authorization: Bearer vecta_pat_…</code>
          </div>
          <CopyButton text={SERVER} label="Copy URL" />
        </div>

        <ol className="dev-steps">
          {TOKEN_STEPS.map(([t, d], i) => (
            <li key={t}>
              <span className="dev-num">{i + 1}</span>
              <strong>{t}</strong>
              <p>{d}</p>
            </li>
          ))}
        </ol>

        <div className="dev-code">
          <div className="dev-code-top">
            <div className="dev-tabs" role="tablist">
              {SNIPPETS.map((x, i) => (
                <button type="button" role="tab" aria-selected={tab === i} className={tab === i ? 'is-active' : ''} key={x.id} onClick={() => setTab(i)}>
                  {x.label}
                </button>
              ))}
            </div>
            <CopyButton text={s.code} />
          </div>
          {s.note && <div className="dev-code-note">{s.note}</div>}
          <pre><code>{highlight(s.code)}</code></pre>
        </div>

        <p className="dev-aside">
          <strong>claude.ai custom connectors</strong> sign in with OAuth, which the Vecta Studio MCP server doesn&rsquo;t support yet. Use one of the options above for now.
        </p>
      </div>
    </DevSection>
  );
}

function Flow() {
  return (
    <DevSection id="flow" tone="dark" eyebrow="How a video is made" lines={['From idea', 'to video.']}
      sub="Paid steps start straight away and keep running in Vecta Studio. Your agent checks get_project instead of waiting.">
      <div className="dev-flow">
        {FLOW.map((f, i) => (
          <article className="dev-flow-card" style={{ '--d': `${i * 70}ms` }} key={f.tool}>
            <div className="dev-flow-top">
              <span className="dev-flow-n">{f.n}</span>
              <span className={`dev-tag dev-tag-${f.tag.toLowerCase()}`}>{f.tag}</span>
            </div>
            <code>{f.tool}</code>
            <p>{f.text}</p>
          </article>
        ))}
      </div>
      <div className="dev-fix">
        <div>
          <span className="dev-label dev-label-dark">Fixing a finished video</span>
          <p>Small visual change? <code>edit_take</code>. New action, framing or words? <code>edit_shot</code> then <code>refilm_shot</code>. Then <code>reassemble</code> puts the new take in. <code>ask_vecta</code> explains what went wrong, for free.</p>
        </div>
      </div>
    </DevSection>
  );
}

function Tools() {
  const [filter, setFilter] = useState('All');
  const shown = TOOLS.filter((t) => filter === 'All' || t[1] === filter);
  return (
    <DevSection id="tools" tone="light" eyebrow={`${TOOLS.length} tools`} lines={['Every tool,', 'at a glance.']}
      sub="Read tools only look. Free tools change things without spending credits. Paid tools spend credits and accept max_credits.">
      <div className="dev-filter" role="tablist">
        {['All', 'Read', 'Free', 'Paid'].map((f) => (
          <button type="button" role="tab" aria-selected={filter === f} className={filter === f ? 'is-active' : ''} key={f} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      <div className="dev-tools">
        {shown.map(([name, tag, text]) => (
          <article className="dev-tool" key={name}>
            <div className="dev-tool-top">
              <code>{name}</code>
              <span className={`dev-tag dev-tag-${tag.toLowerCase()} dev-tag-light`}>{tag}</span>
            </div>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </DevSection>
  );
}

function Control() {
  return (
    <DevSection id="limits" tone="dark" eyebrow="Credits, limits and security" lines={['You stay', 'in control.']}
      sub="Same prices and checks as the app, with a hard ceiling you set for every token.">
      <div className="dev-limits">
        {LIMITS.map(([t, d], i) => (
          <article className="dev-limit" style={{ '--d': `${i * 60}ms` }} key={t}>
            <h3>{t}</h3>
            <p>{d}</p>
          </article>
        ))}
      </div>
    </DevSection>
  );
}

function Errors() {
  const [open, setOpen] = useState(0);
  return (
    <DevSection id="errors" tone="light" eyebrow="Errors" lines={['When things', 'go wrong.']}
      sub="Problems come back as plain-language tool errors that say what to do next.">
      <div className="faq-list dev-errors">
        {ERRORS.map(([q, a], i) => (
          <div className={`faq-item ${open === i ? 'is-open' : ''}`} key={q}>
            <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
              <span>{q}</span>
              <i aria-hidden="true" />
            </button>
            <div className="faq-body"><div><p>{a}</p></div></div>
          </div>
        ))}
      </div>
    </DevSection>
  );
}

// remounted for every prompt so it types again from the start
function TypedPrompt({ text, reduce }) {
  const { count, done } = useTypewriter(text, { startDelay: 250, speed: 22, skip: reduce });
  return (
    <p className="dev-prompt-text" aria-label={text}>
      <span aria-hidden="true">
        {text.slice(0, count)}
        <span className={done ? 'caret caret-idle' : 'caret'} />
        <span className="hero-title-rest">{text.slice(count)}</span>
      </span>
    </p>
  );
}

function Prompts() {
  const reduce = usePrefersReducedMotion();
  const [i, setI] = useState(0);
  const [manual, setManual] = useState(false);
  useEffect(() => {
    if (manual || reduce) return undefined;
    const t = setInterval(() => setI((n) => (n + 1) % PROMPTS.length), 7500);
    return () => clearInterval(t);
  }, [manual, reduce]);
  return (
    <DevSection id="prompts" tone="dark" eyebrow="Example prompts" lines={['Just ask', 'in plain words.']}
      sub="Once connected, talk to your agent the way you would to a teammate.">
      <div className="dev-chat">
        <div className="dev-chat-tabs">
          {PROMPT_TABS.map((t, n) => (
            <button type="button" className={n === i ? 'is-active' : ''} key={t} onClick={() => { setI(n); setManual(true); }}>{t}</button>
          ))}
        </div>
        <div className="dev-chat-window">
          <span className="dev-chat-who">You</span>
          <TypedPrompt key={i} text={PROMPTS[i]} reduce={reduce} />
        </div>
      </div>
    </DevSection>
  );
}

/* ---------------- page ---------------- */

export default function Developer() {
  return (
    <main>
      <DevHero />
      <Connect />
      <Flow />
      <Tools />
      <Control />
      <Errors />
      <Prompts />
      <FinalCta
        lines={['Give your agent', 'a studio.']}
        sub="Create a token and let it make its first video today."
        cta="Get an API token"
        href={APP}
        note="Turning creativity to reality."
      />
    </main>
  );
}
