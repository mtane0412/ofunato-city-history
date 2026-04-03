/**
 * network.js
 * テーマ: 大船渡市市政史
 * 生成日: 2026-04-03
 * 元データ: data/ofunato-city-history/processed/entities.ndjson + events.ndjson
 *
 * アクターネットワークビュー用データ。
 * - orgNodes: 組織・主体ノード（D3 force layout 用）
 * - orgEdges: 組織間の共起エッジ（イベント共起数を weight で表現）
 * - eventNodes: タイムラインノード（graph.js の nodes と同一形式のサブセット）
 * - orgNameMap: 組織 entity_id → 表示名
 */
import graphData from './graph.js';

/** @type {Array<{id: string, name: string, entity_type: string, description: string, event_count: number, group: string}>} */
const orgNodes = [
  { id: "ent-ofunato-city",       name: "大船渡市",               entity_type: "organization", description: "岩手県南部三陸沿岸に位置する市。1952年4月1日に2町5村が合併して市制施行。2001年に三陸町を編入合併。", event_count: 42, group: "自治体" },
  { id: "ent-mlitt",              name: "国土交通省",             entity_type: "organization", description: "大船渡港整備・三陸縦貫自動車道・復興まちづくり事業等を所掌する国の行政機関（旧運輸省・建設省含む）。", event_count: 18, group: "国" },
  { id: "ent-iwate-prefecture",   name: "岩手県",                 entity_type: "organization", description: "大船渡市を管轄する都道府県。県立大船渡病院・大船渡港管理等を所掌。", event_count: 17, group: "都道府県" },
  { id: "ent-reconstruction-agency", name: "復興庁",              entity_type: "organization", description: "東日本大震災からの復興を推進するために2012年2月設置された政府機関。復興交付金配分等を所掌。", event_count: 3, group: "国" },
  { id: "ent-cao-disaster",       name: "内閣府（防災担当）",     entity_type: "organization", description: "チリ地震津波・東日本大震災・大船渡山林火災等の災害対応・教訓継承を所掌する政府機関。", event_count: 3, group: "国" },
  { id: "ent-sanriku-railway",    name: "三陸鉄道",               entity_type: "organization", description: "旧国鉄盛線を引き継ぎ1984年4月1日に設立・開業。南リアス線（盛〜釜石）を運行。", event_count: 3, group: "地域企業・団体" },
  { id: "ent-sanriku-cho",        name: "三陸町",                 entity_type: "organization", description: "岩手県気仙郡の旧町。2001年11月15日に大船渡市へ編入合併。", event_count: 2, group: "自治体" },
  { id: "ent-jr-east",            name: "JR東日本",               entity_type: "organization", description: "大船渡線の運行事業者。東日本大震災後に大船渡線のBRT転換を主導した。", event_count: 1, group: "地域企業・団体" },
  { id: "ent-ofunato-fishery-coop", name: "大船渡市漁業協同組合", entity_type: "organization", description: "大船渡市の主要漁業協同組合。水産業復興・魚市場整備において重要な役割を担う。", event_count: 1, group: "地域企業・団体" },
  { id: "ent-kyassen",            name: "株式会社キャッセン大船渡", entity_type: "organization", description: "2015年12月設立。官民出資によるエリアマネジメント型復興まちなか再生を実践。", event_count: 1, group: "地域企業・団体" },
  { id: "ent-pacific-cement",     name: "太平洋セメント大船渡工場", entity_type: "organization", description: "1936年設立（旧東北セメント）。大船渡市の基幹産業の一つとして港湾利用を担う。", event_count: 0, group: "地域企業・団体" }
];

/** @type {Array<{source: string, target: string, weight: number, label: string}>} */
const orgEdges = [
  { source: "ent-mlitt",            target: "ent-ofunato-city",     weight: 14, label: "港湾・道路・復興事業で協働" },
  { source: "ent-iwate-prefecture", target: "ent-mlitt",            weight: 12, label: "港湾整備・道路整備で協働" },
  { source: "ent-iwate-prefecture", target: "ent-ofunato-city",     weight: 12, label: "県管理事業・県立施設で連携" },
  { source: "ent-cao-disaster",     target: "ent-mlitt",            weight: 2,  label: "災害対応で連携" },
  { source: "ent-ofunato-city",     target: "ent-sanriku-cho",      weight: 2,  label: "合併・広域行政" },
  { source: "ent-cao-disaster",     target: "ent-ofunato-city",     weight: 2,  label: "災害対応・激甚指定" },
  { source: "ent-iwate-prefecture", target: "ent-sanriku-cho",      weight: 1,  label: "合併協議" },
  { source: "ent-jr-east",          target: "ent-mlitt",            weight: 1,  label: "鉄道復旧・BRT転換調整" },
  { source: "ent-jr-east",          target: "ent-ofunato-city",     weight: 1,  label: "大船渡線BRT転換" },
  { source: "ent-ofunato-city",     target: "ent-ofunato-fishery-coop", weight: 1, label: "水産業復興・魚市場整備" },
  { source: "ent-kyassen",          target: "ent-ofunato-city",     weight: 1,  label: "復興まちなか再生" },
  { source: "ent-cao-disaster",     target: "ent-iwate-prefecture", weight: 1,  label: "災害対応" },
  { source: "ent-ofunato-city",     target: "ent-sanriku-railway",  weight: 1,  label: "三陸鉄道復旧支援" },
  { source: "ent-mlitt",            target: "ent-sanriku-railway",  weight: 1,  label: "鉄道復旧事業" },
  { source: "ent-iwate-prefecture", target: "ent-sanriku-railway",  weight: 1,  label: "三陸鉄道移管・復旧" }
];

/**
 * 人物ノード（タイムライン上のピボット探索用）
 * @type {Array<{id: string, name: string, entity_type: string, description: string, affiliated_org: string}>}
 */
const personNodes = [
  { id: "ent-moritako-yoshio",  name: "森田子之助",  entity_type: "person", description: "大船渡市初代市長（1952年5月20日就任）。臨海工業都市構想の発足期を担った。",       affiliated_org: "ent-ofunato-city" },
  { id: "ent-usui-katsuzo",     name: "臼井勝三",    entity_type: "person", description: "大船渡市第6代市長（1976〜1986年、3期）。高度成長期終焉〜安定成長期の市政を担当。",  affiliated_org: "ent-ofunato-city" },
  { id: "ent-amachiku-katsuro", name: "甘竹勝郎",    entity_type: "person", description: "大船渡市第8代市長（1994〜2010年、4期）。三陸町合併（2001年）を推進した。",         affiliated_org: "ent-ofunato-city" },
  { id: "ent-toda-kimiaki",     name: "戸田公明",    entity_type: "person", description: "大船渡市第9代市長（2010年12月3日就任）。東日本大震災時の市長として復興を主導。",     affiliated_org: "ent-ofunato-city" }
];

/**
 * 組織 entity_id → 表示名のマッピング
 * DetailPanel や OrgNetwork のラベル表示に使用する。
 * @type {Record<string, string>}
 */
const orgNameMap = {
  "ent-ofunato-city":        "大船渡市",
  "ent-mlitt":               "国土交通省",
  "ent-iwate-prefecture":    "岩手県",
  "ent-reconstruction-agency": "復興庁",
  "ent-cao-disaster":        "内閣府（防災担当）",
  "ent-sanriku-railway":     "三陸鉄道",
  "ent-sanriku-cho":         "三陸町",
  "ent-jr-east":             "JR東日本",
  "ent-ofunato-fishery-coop": "大船渡市漁業協同組合",
  "ent-kyassen":             "株式会社キャッセン大船渡",
  "ent-pacific-cement":      "太平洋セメント大船渡工場",
  "ent-moritako-yoshio":     "森田子之助",
  "ent-usui-katsuzo":        "臼井勝三",
  "ent-amachiku-katsuro":    "甘竹勝郎",
  "ent-toda-kimiaki":        "戸田公明"
};

const eventNodes = graphData.nodes;

const networkData = { orgNodes, orgEdges, personNodes, orgNameMap, eventNodes };

export default networkData;
