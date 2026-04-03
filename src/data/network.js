/**
 * network.js
 * テーマ: 大船渡市市政史
 * 生成日: 2026-04-03
 * 元データ: data/ofunato-city-history/processed/entities.ndjson + events.ndjson
 *
 * アクターネットワークビュー用データ。
 * - orgNodes: 組織・主体ノード（D3 force layout 用）
 *   ※ label, event_ids フィールドが必須
 * - orgEdges: 組織間の共起エッジ
 *   ※ shared_events フィールドが必須
 * - personNodes: 人物ノード
 * - orgNameMap: 組織 entity_id → 表示名
 * - sourceLinks: event_id → 資料リンク配列（OrgNetwork パネル用）
 */
import graphData from './graph.js';
import sourceLinksData from './sourceLinks.js';

/* ── 組織ノード定義 ────────────────────────────────────────────── */
const orgNodeDefs = [
  { id: "ent-ofunato-city",          label: "大船渡市",               entity_type: "organization", description: "岩手県南部三陸沿岸に位置する市。1952年4月1日に2町5村が合併して市制施行。2001年に三陸町を編入合併。", group: "自治体" },
  { id: "ent-mlitt",                 label: "国土交通省",             entity_type: "organization", description: "大船渡港整備・三陸縦貫自動車道・復興まちづくり事業等を所掌する国の行政機関（旧運輸省・建設省含む）。", group: "国" },
  { id: "ent-iwate-prefecture",      label: "岩手県",                 entity_type: "organization", description: "大船渡市を管轄する都道府県。県立大船渡病院・大船渡港管理等を所掌。", group: "都道府県" },
  { id: "ent-reconstruction-agency", label: "復興庁",                 entity_type: "organization", description: "東日本大震災からの復興を推進するために2012年2月設置された政府機関。復興交付金配分等を所掌。", group: "国" },
  { id: "ent-cao-disaster",          label: "内閣府（防災担当）",     entity_type: "organization", description: "チリ地震津波・東日本大震災・大船渡山林火災等の災害対応・教訓継承を所掌する政府機関。", group: "国" },
  { id: "ent-sanriku-railway",       label: "三陸鉄道",               entity_type: "organization", description: "旧国鉄盛線を引き継ぎ1984年4月1日に設立・開業。南リアス線（盛〜釜石）を運行。", group: "地域企業・団体" },
  { id: "ent-sanriku-cho",           label: "三陸町",                 entity_type: "organization", description: "岩手県気仙郡の旧町。2001年11月15日に大船渡市へ編入合併。", group: "自治体" },
  { id: "ent-jr-east",               label: "JR東日本",               entity_type: "organization", description: "大船渡線の運行事業者。東日本大震災後に大船渡線のBRT転換を主導した。", group: "地域企業・団体" },
  { id: "ent-ofunato-fishery-coop",  label: "大船渡市漁業協同組合",   entity_type: "organization", description: "大船渡市の主要漁業協同組合。水産業復興・魚市場整備において重要な役割を担う。", group: "地域企業・団体" },
  { id: "ent-kyassen",               label: "株式会社キャッセン大船渡", entity_type: "organization", description: "2015年12月設立。官民出資によるエリアマネジメント型復興まちなか再生を実践。", group: "地域企業・団体" },
  { id: "ent-pacific-cement",        label: "太平洋セメント大船渡工場", entity_type: "organization", description: "1936年設立（旧東北セメント）。大船渡市の基幹産業の一つとして港湾利用を担う。", group: "地域企業・団体" },
];

/* ── 組織ノードに event_ids を付与 ────────────────────────────── */
// graph.js のノード organizations 配列をスキャンして各組織の関与イベントIDを収集する。
// orgNameMap の逆引きで org entity_id → 表示名 を照合する。
const orgNameMap = {
  "ent-ofunato-city":          "大船渡市",
  "ent-mlitt":                 "国土交通省",
  "ent-iwate-prefecture":      "岩手県",
  "ent-reconstruction-agency": "復興庁",
  "ent-cao-disaster":          "内閣府（防災担当）",
  "ent-sanriku-railway":       "三陸鉄道",
  "ent-sanriku-cho":           "三陸町",
  "ent-jr-east":               "JR東日本",
  "ent-ofunato-fishery-coop":  "大船渡市漁業協同組合",
  "ent-kyassen":               "株式会社キャッセン大船渡",
  "ent-pacific-cement":        "太平洋セメント大船渡工場",
  "ent-moritako-yoshio":       "森田子之助",
  "ent-usui-katsuzo":          "臼井勝三",
  "ent-amachiku-katsuro":      "甘竹勝郎",
  "ent-toda-kimiaki":          "戸田公明",
};

// 表示名 → entity_id の逆引きマップ
const nameToId = Object.fromEntries(
  Object.entries(orgNameMap).map(([id, name]) => [name, id])
);

// 各 entity_id に紐づくイベント ID リストを構築
const eventIdsByOrg = {};
orgNodeDefs.forEach(n => { eventIdsByOrg[n.id] = []; });

graphData.nodes.forEach(ev => {
  (ev.organizations || []).forEach(orgName => {
    const entityId = nameToId[orgName];
    if (entityId && eventIdsByOrg[entityId]) {
      eventIdsByOrg[entityId].push(ev.id);
    }
  });
});

/** @type {Array<{id, label, entity_type, description, event_count, event_ids, group}>} */
const orgNodes = orgNodeDefs.map(n => ({
  ...n,
  event_ids: eventIdsByOrg[n.id] || [],
  event_count: (eventIdsByOrg[n.id] || []).length,
}));

/* ── 組織間エッジに shared_events を付与 ──────────────────────── */
const orgEdgeDefs = [
  { source: "ent-mlitt",            target: "ent-ofunato-city",          label: "港湾・道路・復興事業で協働" },
  { source: "ent-iwate-prefecture", target: "ent-mlitt",                  label: "港湾整備・道路整備で協働" },
  { source: "ent-iwate-prefecture", target: "ent-ofunato-city",           label: "県管理事業・県立施設で連携" },
  { source: "ent-cao-disaster",     target: "ent-mlitt",                  label: "災害対応で連携" },
  { source: "ent-ofunato-city",     target: "ent-sanriku-cho",            label: "合併・広域行政" },
  { source: "ent-cao-disaster",     target: "ent-ofunato-city",           label: "災害対応・激甚指定" },
  { source: "ent-iwate-prefecture", target: "ent-sanriku-cho",            label: "合併協議" },
  { source: "ent-jr-east",          target: "ent-mlitt",                  label: "鉄道復旧・BRT転換調整" },
  { source: "ent-jr-east",          target: "ent-ofunato-city",           label: "大船渡線BRT転換" },
  { source: "ent-ofunato-city",     target: "ent-ofunato-fishery-coop",   label: "水産業復興・魚市場整備" },
  { source: "ent-kyassen",          target: "ent-ofunato-city",           label: "復興まちなか再生" },
  { source: "ent-cao-disaster",     target: "ent-iwate-prefecture",       label: "災害対応" },
  { source: "ent-ofunato-city",     target: "ent-sanriku-railway",        label: "三陸鉄道復旧支援" },
  { source: "ent-mlitt",            target: "ent-sanriku-railway",        label: "鉄道復旧事業" },
  { source: "ent-iwate-prefecture", target: "ent-sanriku-railway",        label: "三陸鉄道移管・復旧" },
];

/** @type {Array<{source, target, weight, shared_events, label}>} */
const orgEdges = orgEdgeDefs.map(edge => {
  const srcIds = new Set(eventIdsByOrg[edge.source] || []);
  const tgtIds = new Set(eventIdsByOrg[edge.target] || []);
  const shared = [...srcIds].filter(id => tgtIds.has(id));
  return {
    ...edge,
    weight: shared.length || 1,
    shared_events: shared,
  };
});

/* ── 人物ノード ───────────────────────────────────────────────── */
const personNodes = [
  { id: "ent-moritako-yoshio",  label: "森田子之助",  entity_type: "person", description: "大船渡市初代市長（1952年5月20日就任）。臨海工業都市構想の発足期を担った。",       affiliated_org: "ent-ofunato-city" },
  { id: "ent-usui-katsuzo",     label: "臼井勝三",    entity_type: "person", description: "大船渡市第6代市長（1976〜1986年、3期）。高度成長期終焉〜安定成長期の市政を担当。",  affiliated_org: "ent-ofunato-city" },
  { id: "ent-amachiku-katsuro", label: "甘竹勝郎",    entity_type: "person", description: "大船渡市第8代市長（1994〜2010年、4期）。三陸町合併（2001年）を推進した。",         affiliated_org: "ent-ofunato-city" },
  { id: "ent-toda-kimiaki",     label: "戸田公明",    entity_type: "person", description: "大船渡市第9代市長（2010年12月3日就任）。東日本大震災時の市長として復興を主導。",     affiliated_org: "ent-ofunato-city" },
];

const eventNodes = graphData.nodes;

const networkData = {
  orgNodes,
  orgEdges,
  personNodes,
  orgNameMap,
  eventNodes,
  sourceLinks: sourceLinksData,
};

export default networkData;
