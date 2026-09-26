# -*- coding: utf-8 -*-
import json
import os

target_dir = r"e:\WorkSpace-study\learning\src\data"

# 读取现有文件中的 JSON 数据进行追加
def load_data(filepath, varname):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    json_str = content.split(f"export const {varname} = ")[1].rstrip(";\n ")
    return json.loads(json_str)

chinese = load_data(os.path.join(target_dir, "chineseGrades.js"), "CHINESE_UNITS")
english = load_data(os.path.join(target_dir, "englishGrades.js"), "ENGLISH_UNITS")
science = load_data(os.path.join(target_dir, "scienceGrades.js"), "SCIENCE_UNITS")

# 1. 拓展语文
chinese["grade3"].append({
  "id": "unit_2",
  "number": 2,
  "name": "传统文化与千年赵州桥",
  "theme": "洨河金石古桥坛",
  "icon": "🌉",
  "color": "#0284C7",
  "bgColor": "linear-gradient(135deg, #38bdf8 0%, #0369a1 100%)",
  "summary": "精读《赵州桥》，学习围绕一个中心句展开描写的构段方法，领悟古代劳动人民智慧结晶",
  "knowledge": {
    "concept": "赵州桥又称安济桥，建于隋朝，由著名工匠李春设计建造，距今已有一千四百多年。赵州桥不仅雄伟坚固，而且极其美观。它的拱形大桥洞两端各有两个小桥洞，平时减轻桥身重量，发大水时减轻流水对桥身的冲击力，这是建桥史上的创举。",
    "tips": "既坚固又美观，桥下四个小桥洞；李春巧思传千古，民族智慧耀神州！",
    "formula": "结构特点：大拱两肩各设两小拱（敞肩圆弧拱桥）",
    "examples": ["赵州桥非常雄伟。", "这座桥不但坚固，而且美观。"]
  },
  "labType": "literature",
  "challenges": [
    {
      "id": "cn_g3_u2_q1",
      "difficulty": "easy",
      "question": "河北省赵县洨河上的赵州桥，设计建造的著名工匠是（ ）。",
      "options": ["李春", "鲁班", "张衡", "沈括"],
      "answer": 0,
      "explanation": "赵州桥由隋代著名工匠李春设计建造。"
    },
    {
      "id": "cn_g3_u2_q2",
      "difficulty": "easy",
      "question": "“这座桥不但坚固，而且美观。”句中的关联词“不但……而且……”表示（ ）。",
      "options": ["递进关系", "转折关系", "因果关系", "假设关系"],
      "answer": 0,
      "explanation": "表示在坚固的基础上，审美价值更进一步。"
    },
    {
      "id": "cn_g3_u2_q3",
      "difficulty": "medium",
      "question": "赵州桥大桥洞两肩各有两个小桥洞，这种设计的最大科学妙用是（ ）。",
      "options": ["发大水时分流排洪，平时减轻桥身自重，防止桥面下沉", "为了美观好看", "为了让小鸟做窝", "放置石料方便"],
      "answer": 0,
      "explanation": "这是敞肩拱设计，减轻自重且利于泄洪，举世首创。"
    },
    {
      "id": "cn_g3_u2_q4",
      "difficulty": "medium",
      "question": "栏板上雕刻的龙“相互缠绕，嘴里吐出美丽的水花”，表现了赵州桥的（ ）。",
      "options": ["美观生动", "长久不倒", "结构简单", "造价高昂"],
      "answer": 0,
      "explanation": "浮雕生动活泼，传神体现美观特性。"
    },
    {
      "id": "cn_g3_u2_q5",
      "difficulty": "hard",
      "question": "（思维拔高）我国“文房四宝”指的是（ ）。",
      "options": ["笔、墨、纸、砚", "琴、棋、书、画", "诗、词、曲、赋", "望、闻、问、切"],
      "answer": 0,
      "explanation": "文房四宝为湖笔、徽墨、宣纸、端砚。"
    },
    {
      "id": "cn_g3_u2_q6",
      "difficulty": "hard",
      "question": "（变种题）名画《清明上河图》描绘的是北宋都城（ ）汴河两岸的繁华市井景象。",
      "options": ["汴京（今河南开封）", "长安（今西安）", "洛阳", "金陵（今南京）"],
      "answer": 0,
      "explanation": "张择端《清明上河图》生动记录北宋都城汴京繁华。"
    }
  ],
  "boss": {
    "name": "隋代天工·李春",
    "avatar": "🏛️",
    "title": "赵州古桥鼻祖",
    "hp": 3,
    "badge": { "id": "badge_cn_g3_u2", "name": "安济石拱印", "icon": "🌉", "desc": "融汇古代桥梁建筑科学，感怀千年中华文明造化" },
    "questions": [
      {
        "question": "赵州桥距今已有（ ）多年的历史。",
        "options": ["1400", "500", "2000", "300"],
        "answer": 0,
        "explanation": "建于隋大业年间（公元605年左右），距今1400余年。"
      },
      {
        "question": "《一幅名扬中外的画》中的画指的是（ ）。",
        "options": ["《清明上河图》", "《富春山居图》", "《千里江山图》", "《洛神赋图》"],
        "answer": 0,
        "explanation": "北宋张择端所画的《清明上河图》。"
      },
      {
        "question": "文言成语“画蛇添足”告诉我们的道理是（ ）。",
        "options": ["做多余的事情反而弄巧成拙，把原本好的事情办糟", "画画一定要画快", "蛇应该有脚", "酒很好喝"],
        "answer": 0,
        "explanation": "比喻做了多余无用的事，反遭失败。"
      }
    ]
  }
})

chinese["grade4"].append({
  "id": "unit_2",
  "number": 2,
  "name": "文言启蒙与智慧辨析",
  "theme": "道旁李树琅嬛台",
  "icon": "🎋",
  "color": "#15803D",
  "bgColor": "linear-gradient(135deg, #15803d 0%, #14532d 100%)",
  "summary": "精读文言文《王戎不取道旁李》《西门豹治邺》，学习文言文断句与因果逻辑推断",
  "knowledge": {
    "concept": "《王戎不取道旁李》出自《世说新语》：王戎七岁，尝与诸小儿游。看道边李树多子折枝，诸儿竞走取之，唯戎不动。人问之，答曰：“树在道边而多子，此必苦李。”取之，信然。展现其超凡的细致观察与缜密逻辑判断。",
    "tips": "树在道边多子折枝，若甜早被路人摘尽；善于留心观察生活，逻辑思考破谜题！",
    "formula": "推理论证：李树在路旁 + 结满果实无人采 = 果实必定是苦的",
    "examples": ["诸儿竞走取之，唯戎不动。", "人问之，答曰：树在道边而多子，此必苦李。"]
  },
  "labType": "literature",
  "challenges": [
    {
      "id": "cn_g4_u2_q1",
      "difficulty": "easy",
      "question": "文言文《王戎不取道旁李》选自南朝宋刘义庆组织编写的（ ）。",
      "options": ["《世说新语》", "《史记》", "《三国志》", "《汉书》"],
      "answer": 0,
      "explanation": "《世说新语》是记录魏晋名士言行风貌的志人小说集。"
    },
    {
      "id": "cn_g4_u2_q2",
      "difficulty": "easy",
      "question": "“诸儿竞走取之”中的“竞走”在古汉语中的意思是（ ）。",
      "options": ["争着跑过去", "一种奥运会田径比赛项目", "慢慢散步", "站着不动"],
      "answer": 0,
      "explanation": "古代“走”指奔跑，“竞走”即争先恐后地跑过去。"
    },
    {
      "id": "cn_g4_u2_q3",
      "difficulty": "medium",
      "question": "王戎断定道旁的李子“必苦李”的充分根据是（ ）。",
      "options": ["李树长在路边人来人往处，果实压弯树枝却没人摘，说明肯定是苦的", "王戎以前尝过", "树主人告诉他的", "李子颜色发黑"],
      "answer": 0,
      "explanation": "树在道边人人都看得见，若是甜李早已被过路人摘光。"
    },
    {
      "id": "cn_g4_u2_q4",
      "difficulty": "medium",
      "question": "“取之，信然。”中“信然”的意思是（ ）。",
      "options": ["确实如此（果然是这样）", "令人难以置信", "相信朋友", "写了一封信"],
      "answer": 0,
      "explanation": "信然即果然如此，证明王戎推断完全正确。"
    },
    {
      "id": "cn_g4_u2_q5",
      "difficulty": "hard",
      "question": "（思维拔高）《西门豹治邺》中，西门豹将巫婆和官绅头子扔进漳河，其精妙智慧在于（ ）。",
      "options": ["以其人之道还治其人之身，用事实彻底戳穿“河伯娶媳妇”的骗局并教育百姓", "展示自己力气大", "为了给河伯送礼", "发泄个人愤怒"],
      "answer": 0,
      "explanation": "借让巫婆去问河伯，不仅严惩首恶，更打破迷信思想。"
    },
    {
      "id": "cn_g4_u2_q6",
      "difficulty": "hard",
      "question": "（变种题）下列文言句子断句完全正确的一项是（ ）。",
      "options": ["树在道边 / 而多子，此 / 必苦李", "树在 / 道边而多 / 子此必苦李", "树 / 在道边而多子此 / 必苦李", "树在道 / 边而多子此必 / 苦李"],
      "answer": 0,
      "explanation": "树在道边（主谓）而多子（并列），此（主语）必苦李。"
    }
  ],
  "boss": {
    "name": "竹林贤士·王戎",
    "avatar": "🎋",
    "title": "魏晋神童睿圣",
    "hp": 3,
    "badge": { "id": "badge_cn_g4_u2", "name": "道旁明镜印", "icon": "📜", "desc": "善于逻辑推理辨析，遇事冷静从容断假真" },
    "questions": [
      {
        "question": "王戎是魏晋时期著名的“（ ）”之一。",
        "options": ["竹林七贤", "初唐四杰", "江南四大才子", "唐宋八大家"],
        "answer": 0,
        "explanation": "王戎是竹林七贤中最年轻的一位。"
      },
      {
        "question": "“为中华之崛起而读书”是（ ）十二岁时立下的宏伟志向。",
        "options": ["周恩来", "毛泽东", "鲁迅", "钱学森"],
        "answer": 0,
        "explanation": "周恩来少年时立下为国为民读书图强的凌云壮志。"
      },
      {
        "question": "《爬山虎的脚》作者叶圣陶观察极其细致，爬山虎巴在墙上的小脚像（ ）。",
        "options": ["蜗牛的触角", "猫爪", "小木棍", "铁钩"],
        "answer": 0,
        "explanation": "细丝头上长出小圆片，巴住墙壁像蜗牛触角。"
      }
    ]
  }
})

chinese["grade5"].append({
  "id": "unit_2",
  "number": 2,
  "name": "古典名著与草船借箭",
  "theme": "赤壁大雾连环阵",
  "icon": "🏹",
  "color": "#4F46E5",
  "bgColor": "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
  "summary": "研读《草船借箭》，理清故事起因经过结果，剖析诸葛亮的神机妙算与知天文晓地理识人心",
  "knowledge": {
    "concept": "《草船借箭》改编自古典名著《三国演义》。周瑜因妒忌诸葛亮才干，设下“三天造十万支箭”的军令状陷阱。诸葛亮上知天文（算准三天后江上必起漫天大雾）、下晓地理（顺风顺水进退自如）、深识人心（深知鲁肃仁厚守密，算定曹操生性多疑不敢出兵），最终兵不血刃满载十万支箭而归。",
    "tips": "草船借箭显神机，借东风大雾弥天；曹操多疑乱放箭，万箭齐发载满船！",
    "formula": "神机妙算三重奏：懂天象（雾） + 懂地理（水流） + 识人心（曹多疑、鲁肃忠）",
    "examples": ["诸葛亮神机妙算，我真比不上他！", "曹操生性多疑，大雾之中必不敢派兵出战。"]
  },
  "labType": "literature",
  "challenges": [
    {
      "id": "cn_g5_u2_q1",
      "difficulty": "easy",
      "question": "《草船借箭》选自中国四大古典名著之一的（ ）。",
      "options": ["《三国演义》（罗贯中著）", "《水浒传》", "《西游记》", "《红楼梦》"],
      "answer": 0,
      "explanation": "《三国演义》是我国第一部章回体长篇历史演义小说。"
    },
    {
      "id": "cn_g5_u2_q2",
      "difficulty": "easy",
      "question": "周瑜让诸葛亮在十天内赶造十万支箭，其真正险恶目的是（ ）。",
      "options": ["嫉妒诸葛亮才智，妄图以军法延误罪陷害诸葛亮", "真的缺箭打仗", "考验工匠技术", "开玩笑"],
      "answer": 0,
      "explanation": "文章开篇第一句即说“周瑜看到诸葛亮挺有才干，心里很妒忌”。"
    },
    {
      "id": "cn_g5_u2_q3",
      "difficulty": "medium",
      "question": "诸葛亮算定曹操面对大雾战鼓只敢下令弓弩手射箭而绝不敢出战，利用的是曹操（ ）的性格弱点。",
      "options": ["多疑谨慎，生怕中埋伏", "贪睡懒惰", "兵力太少", "喜欢浪费箭矢"],
      "answer": 0,
      "explanation": "深知曹操性格多疑，雾大看不清虚实，必定只敢放箭自守。"
    },
    {
      "id": "cn_g5_u2_q4",
      "difficulty": "medium",
      "question": "二十条草船掉头受箭，船两边都受满箭支后，军士们齐声大喊（ ），气得曹操无可奈何。",
      "options": ["“谢谢曹丞相赠箭！”", "“我们赢了！”", "“快快投降！”", "“再放多一点箭！”"],
      "answer": 0,
      "explanation": "船轻水急顺流而下二十余里，曹操追之不及。"
    },
    {
      "id": "cn_g5_u2_q5",
      "difficulty": "hard",
      "question": "（思维拔高）诸葛亮吩咐把二十只草船“用绳索连接起来，一字排开”，这样做的目的是（ ）。",
      "options": ["增大受箭面积，便于行动协调且防止个别船只被江水冲散", "看起来像一条大龙", "船长得太小", "方便士兵聊天"],
      "answer": 0,
      "explanation": "一字排开且相连不仅便于横向受箭，且操纵统一更安全稳固。"
    },
    {
      "id": "cn_g5_u2_q6",
      "difficulty": "hard",
      "question": "（变种题）小说结尾周瑜长叹一声：“诸葛亮神机妙算，我真比不上他！”与开头周瑜妒忌形成了（ ）。",
      "options": ["首尾呼应，反衬出诸葛亮才智超凡与周瑜的心悦诚服（认输）", "互相矛盾", "毫无关系", "讽刺诸葛亮"],
      "answer": 0,
      "explanation": "结构上首尾圆合，以对手的自叹不如升华诸葛亮的大将之风。"
    }
  ],
  "boss": {
    "name": "卧龙诸葛孔明",
    "avatar": "🪶",
    "title": "神机妙算军师",
    "hp": 3,
    "badge": { "id": "badge_cn_g5_u2", "name": "八阵羽扇令", "icon": "🏹", "desc": "通晓天文地理奇门遁甲，谈笑间借箭十万退曹兵" },
    "questions": [
      {
        "question": "下列《三国演义》经典歇后语配对正确的是（ ）。",
        "options": ["草船借箭 —— 满载而归", "周瑜打黄盖 —— 不打自招", "关公进曹营 —— 单刀直入", "诸葛亮弹琴 —— 乱了方寸"],
        "answer": 0,
        "explanation": "草船借箭——满载而归；周瑜打黄盖——一个愿打一个愿挨。"
      },
      {
        "question": "《景阳冈》中武松趁着酒劲赤手空拳打死猛虎，体现了武松（ ）的性格。",
        "options": ["豪爽勇武、无所畏惧、沉着冷静", "鲁莽愚蠢", "嗜酒误事", "胆小退缩"],
        "answer": 0,
        "explanation": "古典文学名著中塑造的武艺高强、英武不凡的打虎好汉形象。"
      },
      {
        "question": "“三顾茅庐”中刘备三次拜访诸葛亮，表现了刘备（ ）的美德。",
        "options": ["求贤若渴、礼贤下士的诚挚之心", "喜欢旅游", "打发时间", "不会带兵"],
        "answer": 0,
        "explanation": "刘备放下身段精诚所至，终成君臣际会千古美谈。"
      }
    ]
  }
})

# 2. 拓展英语
english["grade2"].append({
  "id": "unit_2",
  "number": 2,
  "name": "Food & Drinks: Delicious Meals! (快乐小美食家)",
  "theme": "Gourmet Garden Cafe",
  "icon": "🍔",
  "color": "#E11D48",
  "bgColor": "linear-gradient(135deg, #fb7185 0%, #e11d48 100%)",
  "summary": "掌握 rice, noodles, bread, milk, juice, apple 等日常饮食单词，学会表达就餐喜好",
  "knowledge": {
    "concept": "We eat delicious and healthy food every day. Ask what someone likes: 'What would you like?' — 'I'd like some noodles, please.' Say thanks: 'Here you are.' — 'Thank you!'",
    "tips": "面包 bread 牛奶 milk，大米 rice 香喷喷；面条 noodles 长又长，健康饮食身体棒！",
    "formula": "Pattern: What would you like? — I'd like some [Food].",
    "examples": ["I like apples and bananas.", "Can I have some water, please?", "Here you are."]
  },
  "labType": "phonics",
  "challenges": [
    {
      "id": "en_g2_u2_q1",
      "difficulty": "easy",
      "question": "What is the traditional Chinese food made of long flour dough? (长长的中国传统面食在英语中是：)",
      "options": ["Noodles (面条)", "Bread (面包)", "Rice (米饭)", "Milk (牛奶)"],
      "answer": 0,
      "explanation": "noodles 表示面条。"
    },
    {
      "id": "en_g2_u2_q2",
      "difficulty": "easy",
      "question": "\"I am thirsty.\" What should you drink? (感到口渴时，你应该喝什么？)",
      "options": ["Water (水) / Juice (果汁)", "Bread", "Rice", "Fish"],
      "answer": 0,
      "explanation": "thirsty (口渴) 需要喝饮料液体如 water 或 juice。"
    },
    {
      "id": "en_g2_u2_q3",
      "difficulty": "medium",
      "question": "— Can I have some juice, please? — ( ), here you are.",
      "options": ["Sure", "No", "Goodbye", "I don't know"],
      "answer": 0,
      "explanation": "礼貌应答：Sure, here you are. (当然可以，给你。)"
    },
    {
      "id": "en_g2_u2_q4",
      "difficulty": "medium",
      "question": "Which of the following foods is healthy FRUIT? (下列哪样是健康水果？)",
      "options": ["An orange (橙子)", "An ice cream (冰淇淋)", "A hamburger (汉堡)", "French fries (薯条)"],
      "answer": 0,
      "explanation": "orange 属于富含维生素的水果。"
    },
    {
      "id": "en_g2_u2_q5",
      "difficulty": "hard",
      "question": "(思维拔高) An apple a day keeps the ( ) away. (西方著名健康谚语：一日一苹果，什么远离我？)",
      "options": ["doctor (医生)", "teacher (老师)", "cat", "dog"],
      "answer": 0,
      "explanation": "经典谚语：An apple a day keeps the doctor away."
    },
    {
      "id": "en_g2_u2_q6",
      "difficulty": "hard",
      "question": "(变种题) Milk and water are UNCOUNTABLE nouns (不可数名词), so we say: (对于不可数名词，正确表述是：)",
      "options": ["some milk (一些牛奶)", "a milk", "two milks", "many milks"],
      "answer": 0,
      "explanation": "不可数名词不能直接加 a 或变复数，常加 some 修饰。"
    }
  ],
  "boss": {
    "name": "Master Chef Panda",
    "avatar": "🐼",
    "title": "Supreme Culinary Master",
    "hp": 3,
    "badge": { "id": "badge_en_g2_u2", "name": "Golden Spoon Star", "icon": "🍽️", "desc": "Master all food and restaurant conversational English" },
    "questions": [
      {
        "question": "\"Here you are.\" 的中文礼貌意思是（ ）。",
        "options": ["给你。", "你在哪里？", "再见。", "不用谢。"],
        "answer": 0,
        "explanation": "递东西给别人时说“Here you are.” (给你)。"
      },
      {
        "question": "What do rabbits love to eat most? (兔子最喜欢的蔬菜是：)",
        "options": ["Carrots (胡萝卜)", "Meat", "Fish", "Rice"],
        "answer": 0,
        "explanation": "胡萝卜是 carrot。"
      },
      {
        "question": "Translate: “你喜欢喝茶还是喝牛奶？”",
        "options": ["Do you like tea or milk?", "I like tea.", "Tea is hot.", "You like water."],
        "answer": 0,
        "explanation": "选择疑问句：Do you like tea or milk?"
      }
    ]
  }
})

# 3. 拓展科学
science["grade2"].append({
  "id": "unit_2",
  "number": 2,
  "name": "太阳、月相变化与我们的地球",
  "theme": "日月中天观星台",
  "icon": "🌙",
  "color": "#F59E0B",
  "bgColor": "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)",
  "summary": "观察记录月相从新月（初一）到满月（十五）的周期规律，探究太阳升落与影子变化",
  "knowledge": {
    "concept": "太阳是太阳系的中心恒星，给地球带来光和热。太阳东升西落，阳光下物体的影子早晚长、中午短。月球本身不发光，反射太阳光。随着月球绕地球公转，我们看到的月球发光部分的形状不断变化，叫做【月相】。农历初一是新月（朔），农历十五前后是满月（望）。",
    "tips": "初一看不见，初三四如弯钩；十五圆如盘，廿二又半残！",
    "formula": "月相周期约 29.5 天：新月 -> 上弦月 -> 满月 -> 下弦月 -> 残月",
    "examples": ["中秋节夜晚的月相是圆圆的满月。", "中午12点时，人在阳光下的影子最短且朝向正北方向（北半球）。"]
  },
  "labType": "skyLab",
  "challenges": [
    {
      "id": "sci_g2_u2_q1",
      "difficulty": "easy",
      "question": "在我国大部分地区，一天中太阳光下物体的影子最短的时刻是（ ）。",
      "options": ["正午（中午12点左右）", "清晨日出", "下午五点", "半夜"],
      "answer": 0,
      "explanation": "正午太阳高度角最大，直射或接近直射，影子最短。"
    },
    {
      "id": "sci_g2_u2_q2",
      "difficulty": "easy",
      "question": "每年农历八月十五中秋节夜晚，我们看到的月相通常是（ ）。",
      "options": ["圆圆的满月", "像弯钩的蛾眉月", "半圆的上弦月", "全黑看不到月亮"],
      "answer": 0,
      "explanation": "农历十五日月地处于相望位置，面向地球的一面全被照亮，称为满月（望）。"
    },
    {
      "id": "sci_g2_u2_q3",
      "difficulty": "medium",
      "question": "月球本身（ ）发光，我们在夜空中看到的明亮月光实际上是（ ）。",
      "options": ["不能；月球反射的太阳光", "能够自己；月亮内部核聚变", "能够自己；月光灯", "星星照亮的"],
      "answer": 0,
      "explanation": "月球是不发光不透明的球体，靠反射太阳光照亮。"
    },
    {
      "id": "sci_g2_u2_q4",
      "difficulty": "medium",
      "question": "古人发明的利用太阳光下晷针投射在石盘上的影子位置来测量时间的古代计时仪器叫做（ ）。",
      "options": ["日晷", "指南针", "地动仪", "漏壶水钟"],
      "answer": 0,
      "explanation": "日晷利用阳光下影子的移动规律来指示时辰。"
    },
    {
      "id": "sci_g2_u2_q5",
      "difficulty": "hard",
      "question": "（思维拔高）早晨小明面向太阳站立，此时他的前方是东方，他的后方是西方，那么他的右手方向是（ ）。",
      "options": ["南方", "北方", "东方", "西方"],
      "answer": 0,
      "explanation": "面东背西，左北右南。右手指向南方。"
    },
    {
      "id": "sci_g2_u2_q6",
      "difficulty": "hard",
      "question": "（变种题）月相变化的一个完整周期大约是（ ）。",
      "options": ["一个月（约29.5天，农历一个月）", "一年（365天）", "一天（24小时）", "一星期（7天）"],
      "answer": 0,
      "explanation": "月相朔望月周期平均约为 29.53 天。"
    }
  ],
  "boss": {
    "name": "月宫太阴星君·嫦娥",
    "avatar": "🌙",
    "title": "星汉轮转仙主",
    "hp": 3,
    "badge": { "id": "badge_sci_g2_u2", "name": "金乌玉兔令", "icon": "🌕", "desc": "融会日月升落经纬之律，明察月相阴晴圆缺之变" },
    "questions": [
      {
        "question": "发生日食时，太阳、地球、月球三者的空间位置关系是（ ）。",
        "options": ["月球在中间，挡住了太阳射向地球的光线", "地球在中间", "太阳在中间", "月球在火星后面"],
        "answer": 0,
        "explanation": "月球运动到日地之间发生遮挡形成日食。"
      },
      {
        "question": "太阳从（ ）方升起，从（ ）方落下。",
        "options": ["东方，西方", "西方，东方", "南方，北方", "北方，南方"],
        "answer": 0,
        "explanation": "地球自西向东自转，造成日月星辰东升西落的视觉现象。"
      },
      {
        "question": "月球表面布满的大大小小的圆形坑洞叫做（ ）。",
        "options": ["环形山（陨石撞击坑）", "火山口", "水井", "洞穴"],
        "answer": 0,
        "explanation": "月球无大气层保护，亿万年来受到流星陨石剧烈撞击留下环形山。"
      }
    ]
  }
})

# 保存文件
def save_data(filepath, varname, data, comment):
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(comment + "\n\n")
        f.write(f"export const {varname} = ")
        f.write(json.dumps(data, ensure_ascii=False, indent=2))
        f.write(";\n")

save_data(os.path.join(target_dir, "chineseGrades.js"), "CHINESE_UNITS", chinese, "// 人民教育出版社（统编部编版）小学一至六年级语文全知识点核心库")
save_data(os.path.join(target_dir, "englishGrades.js"), "ENGLISH_UNITS", english, "// 北京师范大学出版社（北师大版）小学一至六年级英语全学段核心知识库")
save_data(os.path.join(target_dir, "scienceGrades.js"), "SCIENCE_UNITS", science, "// 教科版小学一至六年级科学全学段探究实验知识库")

print("Expanded all units successfully!")
