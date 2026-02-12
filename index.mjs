import fs from 'node:fs';
import path from 'node:path';

// ============================================================
// 随机 Tag 库（移植自 koishi-plugin-ai-tag 的 zh.json）
// ============================================================
const TAG_POOL = [
    "[(Transparent background:1.5)::5]，(((standing)))，full body，(((masterpiece))),(((best quality))),(((extremely detailed))),illustration,1girl,mysterious,vivid color,shiny,chromatic aberration abuse,pastel color,large aquarium,Lens effects，Selfie，delight ,red hat",
    "extreme wide shot, (3d:1.2), lens flare, overexposure, (chroma:1.3), detailed beautiful lake and (flowerfield:1.2) below, reflecting water surface, (water ripples:1.2), (bluesky), sunset, sun, (cute girl floating in air:1.4), disheveled long (blue hair:1.2), flower headband, (detailed gradient shining eyes:1.2), detailed beautiful face, large breasts, detailed dress, detailed (long white kneehighs:1.2), brown shoes",
    "masterpiece, best quality, intense angle,{{{ultra details colored water pastel+airbrush}}},{{{{{ultra Details}}}}},{{{ultra intricate highres}}},{{{ultra delicately Details}}},detailed background,{extremely detailed illustrated CG},solo,Fairy queen maid (fairy wings,baby face,glass,sleepy eyes, light green eyes,silver hair,braid ponytail,big breasts, black+classic maid dress,Katyusha,18 years old),shopping window,working street , holding tote bag",
    "extreme wide shot, (3d:1.2), lens flare, overexposure, (chroma:1.3), detailed beautiful lake and (flowerfield:1.2) below, reflecting water surface, (water ripples:1.2), (bluesky), sunset, sun, (cute girl floating in air:1.4), disheveled long (blue hair:1.2), flower headband, (detailed gradient shining eyes:1.2), detailed beautiful face, large breasts, detailed dress, detailed (long white kneehighs:1.2), brown shoes",
    "ultra detailed eyes, blue eyes, navel, white shirt, Beautiful detailed gemological eyes,open shirt, bra, upper body, looking away, from above, standing, (partially undressed :1.4)",
    "1girl, solo, lying, on side, from below, pink hair, blue eyes, angry, long hair, overalls, sandals, neckerchief, watch, (cherry blossoms)+++",
    "flat color+,masterpiece, best quality, masterpiece, highres, original,sunset sky background ,extremely detailed wallpaper, looking at viewer,solo girl, celestial sphere , celestial sphere ,blue theme color,flower,artist,smile, smiling face,water surface,",
    "(vivid)+++++,radiant+++,cowboy shot,side view,looking at away, the girl,short hair, wavy hair, black hair, shiny hair,(small breasts), blue eyes,smile, white gothic empire waist dress,walking, row of cherry trees",
    "(masterpiece, best quality), 1girl,(character focus:1.1),(High chroma:1.4),(half closed eyes:0.8),shine skin,shine hair, miniskirt, smirk,Shine skin,frill,(High chroma:1.2),(loli:1.2),Light brown hair,blue eyes, grey hair, hair flower, hair ornament, medium hair, bangs, small breasts, bare shoulders, breasts, collar, dress, ribbon, black dress, elbow gloves, gloves,, architecture, flower, gothic, gothic architecture, gothic lolita, grabbing own arm, head tilt, indoors, lolita fashion, looking at viewer, shy, upper body, window,",
    "(best quality:1.3),(extremely detailed CG unity 8k:1.0),(detailed illustration detailed:1.0),(flatcolor:1.0)(dynamic angle:1.0),(full body:1.0),(1girl),(chibi:1.3),//(melting face:0.7),(drooling:1.1),//,(maid), (pink twin tail hair1.3),(Complex mathematical formulas:1.3),vector illustration,,guruguru,(data:1.3),(figure:1.3),matrix,universe,galaxy,whirlpool,icon,study,digital,",
    "(masterpiece:1.3), (miniscape:1.3), miniature model, quarterview, (standing on mini base1.3), (kawaii), (flat color:1.3), (RGB Splitting:1.3), (1girl:1.3), solo, chibi, pink hair, long hair, red chinese dress, long hair, frilled dress, horn, closed eyes, smile, lo-fi hiphop, chillhop, fantasy, (east asian architecture:1.2), ryugujo, (aquarium:1.1), water bubble, pixel game, many fireflies, lotus,",
    "masterpiece, (miniscape:1.3), from above, quarterview, (standing on mini base1.3), standing on cliff, (kawaii), (flat color:1.3), (colorful_ink_cloud:1.0), (RGB Splitting:1.3), (1girl:1.3), solo, chibi, sitting, pink hair, long hair, blue eyes, red chinese dress, frilled dress, hair bun, :), lo-fi hiphop, chillhop, fantasy, (east asian architecture:1.3), ryugujo, (aquarium:1.1), water bubble, pixel game, lotus,",
    "(kawaii), (flat color:1.3), (RGB Splitting:1.3), (1girl:1.3), solo, chibi, standing, pink hair, long hair, chinese dress, hair bun, :d, lo-fi hiphop, chillhop, fantasy, (east asian architecture:1.2), dragon palace castle, ryugujo, (aquarium:1.1), water bubble, fish, outdoor,",
    "(mini_scape:1.2), quarterview, (standing on mini base:1.3), standing on cliff, (kawaii), (flat color:1.3), (1girl:1.1), (blue eyes:1.2), lo-fi hiphop, chillhop, fantasy, (tyndall effect:1.1), (cinematic Lighting, dynamic shadow:1.3), white hair, long hair, boots, (big breasts:1.1), (blue frilled skirt:1.2), belt, (bare shoulders:1.1), adventurer, intricate background, (fantasy:1.3)",
    "character profile,(title,character name,:1.9),movie poster",
    "(masterpiece)1.3,(best quality,ultra-detailed,illustration)1.2,(disheveled hair,beautiful detailed eyes)1.1,(extremely detailed cg,8k,high resolution),brave(jrpg), short hair,cowboy shot, head diadem on blue jewelry,blue glowing sword,black hair,purple cloak,blue tunic,yellow pants,meadow,distant moutain,river,blue lovely slime,",
    "(masterpiece, best quality:1.5), illustration, (extream detailed), (one girl:1.2),school sailor suit, thinking, background is library, study on the desk, Textbooks and pens on the desk, studying, holding a pencil, piled up books, (smile),",
    "masterpiece, best quality, ultra-detailed, illustration, 1girl, solo, sitting, medieval european fantasy world, noble girl, luxurious dress, high status, office of a ruler, desk, chair, bookshelf, window, candlestick, quill pen and inkwell on desk long hair with curls and braids blue eyes smiling large breasts white lace gloves pearl necklace and earrings gold crown with jewels red velvet dress with gold embroidery and fur trim black leather boots with heels holding a scroll in one hand and a seal in the other hand",
    "(best quality)+,(masterpiece)++,(ultra detailed)++,cute little girl,in a messy room,pale-blonde hair,closed eyes,long twintails,blush,grin,oversized jacket,(Peace sign with both hands)+,cargo pants",
];

// 特殊回复（非 prompt 的趣味条目）
const SPECIAL_REPLIES = [
    "你可以适当修改下原有的tag",
    "你抽到了再来一次",
    "试试自己写tag",
];

// ============================================================
// 配置管理
// ============================================================
const DEFAULT_CONFIG = {
    prefix: "生图",
    keyword: "随机tag",
};

let currentConfig = { ...DEFAULT_CONFIG };

function loadConfig(ctx) {
    const configFilePath = ctx.configPath;
    try {
        if (fs.existsSync(configFilePath)) {
            const raw = fs.readFileSync(configFilePath, "utf-8");
            const loaded = JSON.parse(raw);
            currentConfig = { ...DEFAULT_CONFIG, ...loaded };
            ctx.logger.info("[AI-Tag] 配置已加载");
        } else {
            saveConfig(ctx, DEFAULT_CONFIG);
        }
    } catch (e) {
        ctx.logger.error("[AI-Tag] 加载配置失败", e);
    }
}

function saveConfig(ctx, newConfig) {
    const configFilePath = ctx.configPath;
    try {
        currentConfig = { ...currentConfig, ...newConfig };
        const dir = path.dirname(configFilePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(configFilePath, JSON.stringify(currentConfig, null, 2), "utf-8");
        ctx.logger.info("[AI-Tag] 配置已保存");
    } catch (e) {
        ctx.logger.error("[AI-Tag] 保存配置失败", e);
    }
}

// ============================================================
// 配置 UI
// ============================================================
function buildConfigUI(ctx) {
    const { NapCatConfig } = ctx;
    return NapCatConfig.combine(
        NapCatConfig.html('<div style="padding:10px; border-bottom:1px solid #ccc;"><h3>随机Tag 插件</h3><br>原作者：wochenlong<br>在群聊中发送 "tag" 或自定义触发词，随机获取一条绘画 prompt 并拼接跑图前缀。<br>可在下方修改触发词和前缀。</div>'),
        NapCatConfig.text("prefix", "跑图前缀", DEFAULT_CONFIG.prefix, "拼接在随机tag前的跑图指令前缀（如 rr）"),
        NapCatConfig.text("keyword", "触发词别名", DEFAULT_CONFIG.keyword, "除 tag 外的额外触发词（如 随机tag）")
    );
}

// ============================================================
// OB11 调用辅助
// ============================================================
async function callOB11(ctx, action, params) {
    try {
        return await ctx.actions.call(action, params, ctx.adapterName, ctx.pluginManager.config);
    } catch (e) {
        ctx.logger.error(`[AI-Tag] Call OB11 ${action} failed:`, e);
    }
}

function textSegment(text) {
    return { type: 'text', data: { text } };
}

async function sendGroupMsg(ctx, groupId, message) {
    return callOB11(ctx, 'send_msg', {
        message_type: 'group',
        group_id: String(groupId),
        message: typeof message === 'string' ? [textSegment(message)] : message,
    });
}

// ============================================================
// 随机选取
// ============================================================
function getRandomTag() {
    // 合并正式 tag 和特殊回复，与原 Koishi 版一致
    const allItems = [...TAG_POOL, ...SPECIAL_REPLIES];
    const index = Math.floor(Math.random() * allItems.length);
    return allItems[index];
}

// ============================================================
// 消息处理
// ============================================================
async function onMessage(ctx, event) {
    if (event.message_type !== "group") return;

    const msg = event.raw_message?.trim() || "";

    // 匹配触发词："tag" 或用户自定义的 keyword
    const triggers = ["tag"];
    if (currentConfig.keyword && currentConfig.keyword !== "tag") {
        triggers.push(currentConfig.keyword);
    }

    // 精确匹配（整条消息就是触发词）
    if (!triggers.includes(msg)) return;

    const groupId = event.group_id;
    const randomTag = getRandomTag();

    // 如果是特殊回复，直接发送不加前缀
    if (SPECIAL_REPLIES.includes(randomTag)) {
        await sendGroupMsg(ctx, groupId, randomTag);
        return;
    }

    // 正常 tag：前缀 + 空格 + tag
    const reply = `${currentConfig.prefix} ${randomTag}`;
    await sendGroupMsg(ctx, groupId, reply);
}

// ============================================================
// 插件生命周期导出
// ============================================================
export let plugin_config_ui = [];

export async function plugin_init(ctx) {
    ctx.logger.info("[AI-Tag] 插件加载中...");
    loadConfig(ctx);
    plugin_config_ui = buildConfigUI(ctx);
}

export async function plugin_onmessage(ctx, event) {
    if (event.post_type !== 'message') return;
    await onMessage(ctx, event);
}

export async function plugin_cleanup(ctx) {
    ctx.logger.info("[AI-Tag] 插件已卸载");
}

export async function plugin_get_config(ctx) {
    return currentConfig;
}

export async function plugin_set_config(ctx, config) {
    currentConfig = { ...DEFAULT_CONFIG, ...config };
    saveConfig(ctx, currentConfig);
    ctx.logger.info("[AI-Tag] 配置已通过 WebUI 更新");
}

export async function plugin_on_config_change(ctx, _, key, value) {
    saveConfig(ctx, { [key]: value });
}
