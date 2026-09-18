// Renders a "last 31 days" contribution line graph as a static SVG.
// Replaces the public github-readme-activity-graph.vercel.app instance,
// which was taken down (HTTP 402 DEPLOYMENT_DISABLED).
//
// Usage: GITHUB_TOKEN=... node activity-graph.mjs <user> <out.svg>
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const DAYS = 31;

// tokyo-night palette, same as the original widget theme
const THEME = {
  bg: "#1a1b27",
  title: "#70a5fd",
  line: "#bf91f3",
  point: "#38bdae",
  area: "#bf91f3",
  axis: "#a9b1d6",
  grid: "#2e3248",
};

export async function fetchDays(user, token) {
  const to = new Date();
  const from = new Date(to.getTime() - (DAYS + 1) * 864e5);
  const query = `query($user:String!,$from:DateTime!,$to:DateTime!){
    user(login:$user){ contributionsCollection(from:$from,to:$to){
      contributionCalendar{ weeks{ contributionDays{ date contributionCount }}}}}}`;
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { user, from: from.toISOString(), to: to.toISOString() } }),
  });
  const json = await res.json();
  if (!res.ok || json.errors) throw new Error(`GraphQL failed: ${res.status} ${JSON.stringify(json.errors ?? json)}`);
  const days = json.data.user.contributionsCollection.contributionCalendar.weeks
    .flatMap((w) => w.contributionDays)
    .map((d) => ({ date: d.date, count: d.contributionCount }));
  return days.slice(-DAYS);
}

export function renderSvg(user, days) {
  const W = 1200, H = 420;
  const pad = { top: 70, right: 40, bottom: 60, left: 70 };
  const cw = W - pad.left - pad.right;
  const ch = H - pad.top - pad.bottom;

  const max = Math.max(4, ...days.map((d) => d.count));
  const step = Math.ceil(max / 4);
  const yMax = step * 4;

  const x = (i) => pad.left + (days.length === 1 ? cw / 2 : (i * cw) / (days.length - 1));
  const y = (v) => pad.top + ch - (v / yMax) * ch;

  const pts = days.map((d, i) => [x(i), y(d.count)]);
  const line = pts.map(([px, py], i) => `${i ? "L" : "M"}${px.toFixed(1)},${py.toFixed(1)}`).join(" ");
  const area = `${line} L${x(days.length - 1).toFixed(1)},${y(0)} L${x(0).toFixed(1)},${y(0)} Z`;

  const grid = [0, 1, 2, 3, 4]
    .map((k) => {
      const v = k * step, gy = y(v).toFixed(1);
      return `<line x1="${pad.left}" x2="${W - pad.right}" y1="${gy}" y2="${gy}" stroke="${THEME.grid}" stroke-dasharray="4 4"/>` +
        `<text x="${pad.left - 12}" y="${gy}" dy="4" text-anchor="end">${v}</text>`;
    })
    .join("");

  const xLabels = days
    .map((d, i) => `<text x="${x(i).toFixed(1)}" y="${H - pad.bottom + 22}" text-anchor="middle">${Number(d.date.slice(8))}</text>`)
    .join("");

  const dots = pts
    .map(([px, py], i) => `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="4" fill="${THEME.point}"><title>${days[i].date}: ${days[i].count}</title></circle>`)
    .join("");

  const total = days.reduce((s, d) => s + d.count, 0);
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(user)}'s contribution graph">
<rect width="${W}" height="${H}" rx="6" fill="${THEME.bg}"/>
<text x="${W / 2}" y="40" text-anchor="middle" fill="${THEME.title}" font-family="Segoe UI, Ubuntu, sans-serif" font-size="22" font-weight="600">${esc(user)}'s Contribution Graph</text>
<text x="${W - pad.right}" y="40" text-anchor="end" fill="${THEME.axis}" font-family="Segoe UI, Ubuntu, sans-serif" font-size="13">${total} contributions · last ${days.length} days</text>
<g fill="${THEME.axis}" font-family="Segoe UI, Ubuntu, sans-serif" font-size="12">${grid}${xLabels}</g>
<text x="${W / 2}" y="${H - 12}" text-anchor="middle" fill="${THEME.axis}" font-family="Segoe UI, Ubuntu, sans-serif" font-size="13">Days</text>
<text transform="translate(20 ${pad.top + ch / 2}) rotate(-90)" text-anchor="middle" fill="${THEME.axis}" font-family="Segoe UI, Ubuntu, sans-serif" font-size="13">Contributions</text>
<path d="${area}" fill="${THEME.area}" fill-opacity="0.15"/>
<path d="${line}" fill="none" stroke="${THEME.line}" stroke-width="2.5" stroke-linejoin="round"/>
${dots}
</svg>
`;
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith("activity-graph.mjs")) {
  const [user, out] = process.argv.slice(2);
  const token = process.env.GITHUB_TOKEN;
  if (!user || !out || !token) {
    console.error("usage: GITHUB_TOKEN=... node activity-graph.mjs <user> <out.svg>");
    process.exit(1);
  }
  const days = await fetchDays(user, token);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, renderSvg(user, days));
  console.log(`wrote ${out} (${days.length} days)`);
}
