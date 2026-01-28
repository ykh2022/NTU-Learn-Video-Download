const PAGE_ORIGIN = "https://ntulearn.ntu.edu.sg";
const TARGET_HOST = "cfvod.sgp2.ovp.kaltura.com";

const ONLY_HLS = true;

const MAX_LOG = 200;

function isFromNtulearn(details) {
  const refs = [
    details.initiator,
    details.documentUrl,
    details.frameUrl,
    details.originUrl
  ].filter(Boolean);

  return refs.some((u) => {
    try {
      return new URL(u).origin === PAGE_ORIGIN;
    } catch {
      return String(u).startsWith(PAGE_ORIGIN);
    }
  });
}

function isTarget(urlStr) {
  try {
    const u = new URL(urlStr);
    if (u.hostname !== TARGET_HOST) return false;

    if (!ONLY_HLS) return true;
    const p = u.pathname.toLowerCase();
    return p.endsWith(".ts") || p.endsWith(".m3u8");
  } catch {
    return false;
  }
}

function nowIso() {
  return new Date().toISOString();
}

async function addHit(record) {
  const data = await chrome.storage.local.get({ hits: [], count: 0 });
  const hits = data.hits || [];
  hits.unshift(record);
  if (hits.length > MAX_LOG) hits.length = MAX_LOG;

  const count = (data.count || 0) + 1;
  await chrome.storage.local.set({ hits, count });

  chrome.action.setBadgeText({ text: String(count) });
  chrome.action.setBadgeBackgroundColor({ color: "#d93025" });

  chrome.notifications.create({
    type: "basic",
    iconUrl: "icon128.png",
    title: "NTULearn → Kaltura detected",
    message: record.url.length > 180 ? record.url.slice(0, 180) + "..." : record.url,
    priority: 2
  });
}

chrome.webRequest.onBeforeRequest.addListener(
  async (details) => {
    if (!details?.url) return;

    if (!isTarget(details.url)) return;

    if (!isFromNtulearn(details)) return;

    const record = {
      time: nowIso(),
      url: details.url,
      method: details.method || "",
      type: details.type || "",
      initiator: details.initiator || details.documentUrl || details.frameUrl || ""
    };

    await addHit(record);
  },
  { urls: ["https://cfvod.sgp2.ovp.kaltura.com/hls/*"] }
);
