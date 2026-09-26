// 全国小学生全学科课程数据库（人教版数学/语文、北师大版英语、教科版科学）
// 完整集成一至六年级全学段全套可玩关卡库

import { MATH_GRADE1_UNITS } from './mathGrade1.js';
import { MATH_GRADE2_UNITS } from './mathGrade2.js';
import { MATH_GRADE4_UNITS, MATH_GRADE5_UNITS, MATH_GRADE6_UNITS } from './mathUpperGrades.js';
import { CHINESE_UNITS } from './chineseGrades.js';
import { ENGLISH_UNITS } from './englishGrades.js';
import { SCIENCE_UNITS } from './scienceGrades.js';

export const SUBJECTS = [
  { id: 'math', name: '数学', icon: '📐', edition: '人教版', desc: '数理逻辑、几何图形与算术大冒险', active: true },
  { id: 'chinese', name: '语文', icon: '📖', edition: '部编人教版', desc: '字词拼音、古诗文诵读与文学素养', active: true },
  { id: 'english', name: '英语', icon: '🔤', edition: '北师大版', desc: '趣味自然拼读、原声听力与情景会话', active: true },
  { id: 'science', name: '科学', icon: '🔬', edition: '教科版', desc: '万物探究、三态实验与宇宙奥秘', active: true }
];

export const GRADES = [
  { id: 1, name: '一年级', desc: '数数加减、拼音启蒙、自然观察', active: true },
  { id: 2, name: '二年级', desc: '乘法口诀、传统古诗、磁铁探秘', active: true },
  { id: 3, name: '三年级', desc: '时分秒分数、词句分析、水的三态', active: true },
  { id: 4, name: '四年级', desc: '大数定律、文言初探、电路能量', active: true },
  { id: 5, name: '五年级', desc: '多边形面积、名著阅读、生态平衡', active: true },
  { id: 6, name: '六年级', desc: '圆与百分数、诗歌鉴赏、地球微观', active: true }
];

// 核心：根据年级和学科动态获取专属单元列表（覆盖1-6全学段）
export const getCurriculumUnits = (subject = 'math', grade = 3) => {
  const gNum = parseInt(grade, 10);

  if (subject === 'math') {
    if (gNum === 1) return MATH_GRADE1_UNITS;
    if (gNum === 2) return MATH_GRADE2_UNITS;
    if (gNum === 3) return MATH_GRADE3_UNITS;
    if (gNum === 4) return MATH_GRADE4_UNITS;
    if (gNum === 5) return MATH_GRADE5_UNITS;
    if (gNum === 6) return MATH_GRADE6_UNITS;
    return MATH_GRADE3_UNITS;
  }

  if (subject === 'chinese') {
    const key = `grade${gNum}`;
    return CHINESE_UNITS[key] || CHINESE_UNITS.grade3 || [];
  }

  if (subject === 'english') {
    const key = `grade${gNum}`;
    return ENGLISH_UNITS[key] || ENGLISH_UNITS.grade3 || [];
  }

  if (subject === 'science') {
    const key = `grade${gNum}`;
    return SCIENCE_UNITS[key] || SCIENCE_UNITS.grade3 || [];
  }

  return MATH_GRADE3_UNITS;
};

// 保留各年级数学引用以便向下兼容
export { MATH_GRADE1_UNITS, MATH_GRADE2_UNITS, MATH_GRADE4_UNITS, MATH_GRADE5_UNITS, MATH_GRADE6_UNITS };

// 人教版三年级数学全册17个单元 (完全保留)
export const MATH_GRADE3_UNITS = [
  // ============ 上册 (Units 1 - 9) ============
  {
    id: 'unit_1',
    semester: 'upper',
    number: 1,
    name: '时、分、秒',
    theme: '时间齿轮神庙',
    icon: '⏰',
    color: '#FF6B6B',
    bgColor: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
    summary: '认识时间单位秒，掌握1分=60秒，学会计算经过的时间',
    knowledge: {
      concept: '钟面上有12个大格，60个小格。最长最细跑得最快的是【秒针】。秒针走1小格是1秒，走1大格是5秒，走一圈是60秒，此时分针正好走1小格（60秒 = 1分）。',
      tips: '秒针走得最欢快，一格一秒嘀嗒响；走完一圈六十秒，分针挪动一小格！',
      formula: '1时 = 60分 | 1分 = 60秒 | 经过时间 = 结束时间 - 开始时间',
      examples: [
        '小明跑50米大约用了10秒。',
        '眨一次眼睛大约1秒。',
        '做一次眼保健操大约5分钟。',
        '上午8:00开始上课，8:40下课，一节课的时间是40分钟。'
      ]
    },
    labType: 'clock',
    labData: {
      defaultHour: 8,
      defaultMinute: 15,
      targetTime: { hour: 9, minute: 30 },
      hint: '拖动时针或分针，或者点击按钮，调整表盘至 9点30分'
    },
    challenges: [
      {
        id: 'u1_q1',
        question: '跑50米，小刚用了10秒，小亮用了11秒，谁跑得更快？',
        options: ['小刚更快', '小亮更快', '两人一样快', '无法比较'],
        answer: 0,
        explanation: '在跑步比赛中，路程相同，用时越短的速度越快。10秒 < 11秒，所以小刚更快。'
      },
      {
        id: 'u1_q2',
        question: '分针走一圈，时针走（ ）。',
        options: ['1小格', '1大格', '一圈', '半圈'],
        answer: 1,
        explanation: '分针走一圈是60分，时针正好走1大格，也就是1小时。'
      },
      {
        id: 'u1_q3',
        question: '电影《奇幻森林》从下午 2:10 开始放映，经过 1小时30分钟 结束，结束时间是（ ）。',
        options: ['3:10', '3:40', '4:00', '3:30'],
        answer: 1,
        explanation: '结束时间 = 开始时间 + 经过时间。2时10分 + 1小时30分 = 3时40分。'
      },
      {
        id: 'u1_q4',
        question: '2分 = （ ）秒。',
        options: ['20', '120', '60', '200'],
        answer: 1,
        explanation: '因为 1分 = 60秒，所以 2分 = 60 × 2 = 120秒。'
      }
    ],
    boss: {
      name: '时光领主·克罗诺斯',
      avatar: '⏳',
      title: '时间神庙镇守者',
      hp: 3,
      badge: { id: 'badge_math_g3_u1', name: '时光之匙', icon: '⏱️', desc: '精准掌握时分秒换算与时间计算' },
      questions: [
        {
          question: '计算经过时间：早上 7:35 从家出发，8:10 到达学校，路上用了多长时间？',
          options: ['25分钟', '35分钟', '45分钟', '30分钟'],
          answer: 1,
          explanation: '从7:35到8:00经过25分钟，8:00到8:10经过10分钟，合计 25+10 = 35分钟。'
        },
        {
          question: '比较大小：3分 ○ 180秒',
          options: ['>', '<', '=', '无法确定'],
          answer: 2,
          explanation: '3分 = 3 × 60秒 = 180秒，所以两者相等（=）。'
        },
        {
          question: '钟面上时针走过数字“3”到数字“6”，经过了（ ）小时。',
          options: ['15小时', '3小时', '30分钟', '3秒'],
          answer: 1,
          explanation: '时针走1大格是1小时，从3到6走了3大格，所以是 6 - 3 = 3小时。'
        }
      ]
    }
  },

  {
    id: 'unit_2',
    semester: 'upper',
    number: 2,
    name: '万以内的加法和减法（一）',
    theme: '云端飞艇要塞',
    icon: '➕',
    color: '#4FACFE',
    bgColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    summary: '掌握两位数加减两位数口算、几百几十加减几百几十笔算及估算',
    knowledge: {
      concept: '口算两位数加减法时，通常先把其中一个数拆成整十数和一位数，分别相加减。例如计算 35 + 28，可以先算 35 + 20 = 55，再算 55 + 8 = 63。',
      tips: '几百几十加减法，数位对齐莫慌张；进位加点要记牢，退位减点不忘掉！',
      formula: '估算技巧：看成最接近的整十数或整百数再计算',
      examples: [
        '380 + 240 = 620（38个十 + 24个十 = 62个十）',
        '540 - 260 = 280（54个十 - 26个十 = 28个十）',
        '一顶帽子48元，一条围巾32元，大约需要带 50 + 30 = 80元。'
      ]
    },
    labType: 'addition',
    labData: {
      targetNumA: 340,
      targetNumB: 280,
      operation: '+'
    },
    challenges: [
      {
        id: 'u2_q1',
        question: '口算 47 + 36 时，下面哪种口算拆分思路最正确？',
        options: ['先算 47+30=77，再算 77+6=83', '先算 40+30=70，再算 7+6=13，70+13=83', '两种都可以', '先算 47+6=53，再算 53+3=56'],
        answer: 2,
        explanation: '拆十位加个位，或者十位相加个位相加再汇总，都是极佳的口算策略。'
      },
      {
        id: 'u2_q2',
        question: '计算 710 - 450 的结果是（ ）。',
        options: ['260', '360', '250', '350'],
        answer: 0,
        explanation: '71个十减去45个十等于26个十，即260。'
      },
      {
        id: 'u2_q3',
        question: '妈妈带了 500 元买电饭煲（298元）和热水壶（189元），钱够吗？',
        options: ['够了，大约需要490元', '不够，大约需要520元', '正好500元', '无法估算'],
        answer: 0,
        explanation: '298 ≈ 300，189 ≈ 190，300 + 190 = 490元。490 < 500，估算偏大都小于500，所以足够。'
      }
    ],
    boss: {
      name: '云端机甲兽·雷诺',
      avatar: '🤖',
      title: '要塞守备长',
      hp: 3,
      badge: { id: 'badge_math_g3_u2', name: '破云徽记', icon: '⚡', desc: '熟练口算与几百几十速算神技' },
      questions: [
        {
          question: '430 加上一个数得 720，这个数是（ ）。',
          options: ['290', '310', '280', '190'],
          answer: 0,
          explanation: '720 - 430 = 290。'
        },
        {
          question: '比 560 少 280 的数是（ ）。',
          options: ['280', '380', '260', '840'],
          answer: 0,
          explanation: '560 - 280 = 280。'
        },
        {
          question: '一辆客车原有乘客 54 人，到站后下去 27 人，又上来 19 人，现在车上有多少人？',
          options: ['46人', '48人', '44人', '42人'],
          answer: 0,
          explanation: '54 - 27 + 19 = 27 + 19 = 46人。'
        }
      ]
    }
  },

  {
    id: 'unit_3',
    semester: 'upper',
    number: 3,
    name: '测量',
    theme: '重力巨石岛',
    icon: '📏',
    color: '#43E97B',
    bgColor: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    summary: '认识毫米(mm)、分米(dm)、千米(km)及质量单位吨(t)，掌握单位进率',
    knowledge: {
      concept: '测量较短物体用毫米（1枚1分硬币厚度约1毫米）；长一些用厘米、分米；操场跑道和城市距离用千米（公里）。称较轻物体用克、千克，计量大型货物（如卡车、鲸鱼）用【吨】。',
      tips: '米、分米、厘米、毫米手拉手，相邻进率都是十；千米长、吨量重，千字当头进一千！',
      formula: '1米 = 10分米 | 1分米 = 10厘米 | 1厘米 = 10毫米 | 1千米 = 1000米 | 1吨 = 1000千克',
      examples: [
        '一本数学书厚度约 6 毫米。',
        '一把小学生尺子长约 2 分米（20厘米）。',
        '马拉松长跑全长约 42 千米。',
        '一头大象的体重大约 4 吨。'
      ]
    },
    labType: 'scale',
    challenges: [
      {
        id: 'u3_q1',
        question: '7米 = （ ）分米 = （ ）厘米。',
        options: ['70, 700', '700, 70', '7, 70', '70, 7000'],
        answer: 0,
        explanation: '1米=10分米=100厘米，因此7米=70分米=700厘米。'
      },
      {
        id: 'u3_q2',
        question: '一辆载重 3 吨的卡车，装了 3200 千克的货物，超载了吗？',
        options: ['超载了', '没有超载', '正好满载', '无法判断'],
        answer: 0,
        explanation: '3吨 = 3000千克。3200千克 > 3000千克，超过了额定载重200千克，所以超载了。'
      },
      {
        id: 'u3_q3',
        question: '测量长江全长时，最适合使用的长度单位是（ ）。',
        options: ['米', '分米', '千米', '毫米'],
        answer: 2,
        explanation: '长江属于长距离地理跨度，应使用千米（公里）作为计量单位。'
      }
    ],
    boss: {
      name: '巨石泰坦·格罗姆',
      avatar: '🗿',
      title: '重力守护者',
      hp: 3,
      badge: { id: 'badge_math_g3_u3', name: '万钧之尺', icon: '⚖️', desc: '精准度量天地万物的尺寸与重量' },
      questions: [
        {
          question: '把 40 毫米、4 分米、4 千米、4 米按从短到长的顺序排列，正确的是（ ）。',
          options: [
            '40毫米 < 4分米 < 4米 < 4千米',
            '40毫米 < 4米 < 4分米 < 4千米',
            '4分米 < 40毫米 < 4米 < 4千米',
            '4千米 < 4米 < 4分米 < 40毫米'
          ],
          answer: 0,
          explanation: '40毫米 = 4厘米；4分米 = 40厘米；4米 = 400厘米；4千米 = 4000米。'
        },
        {
          question: '一根绳子长 2 米，剪去 8 分米，还剩多少？',
          options: ['12分米', '10分米', '14分米', '6分米'],
          answer: 0,
          explanation: '2米 = 20分米，20分米 - 8分米 = 12分米（即1米2分米）。'
        },
        {
          question: '5 吨 - 2000 千克 = （ ）吨。',
          options: ['3', '3000', '2', '4'],
          answer: 0,
          explanation: '2000千克 = 2吨，5吨 - 2吨 = 3吨。'
        }
      ]
    }
  },

  {
    id: 'unit_4',
    semester: 'upper',
    number: 4,
    name: '万以内的加法和减法（二）',
    theme: '水晶晶石矿洞',
    icon: '💎',
    color: '#FA709A',
    bgColor: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    summary: '掌握三位数加减三位数的竖式笔算、连续进位与退位，学会验算',
    knowledge: {
      concept: '三位数加三位数笔算：相同数位对齐，从个位加起，哪一位上的数相加满十，就要向前一位进1。连续退位减法：哪一位上的数不够减，就要从前一位退1当10继续减。特别注意：中间有0的连续退位减法！',
      tips: '竖式列得齐齐整，个位算起最聪明；哪位相加满十进，哪位不够借一顶十别忘清！',
      formula: '加法验算：交换加数位置，或 和 - 一个加数 = 另一个加数 | 减法验算：被减数 = 差 + 减数',
      examples: [
        '271 + 149 = 420（个位1+9满十进一，十位7+4+1=12满十进一）',
        '503 - 267 = 236（0借不到向5借，0变9，个位13-7=6）'
      ]
    },
    labType: 'subtraction',
    challenges: [
      {
        id: 'u4_q1',
        question: '计算 458 + 274，个位相加满十向十位进（ ），十位相加结果是（ ）。',
        options: ['1，3', '1，13', '2，3', '1，2'],
        answer: 0,
        explanation: '8+4=12进1写2；十位5+7+1(进位)=13，写3向百位进1。'
      },
      {
        id: 'u4_q2',
        question: '在计算 600 - 247 时，差是（ ）。',
        options: ['353', '453', '363', '463'],
        answer: 0,
        explanation: '被减数中间有0，连续退位：个位10-7=3，十位9-4=5，百位5-2=3，得353。'
      },
      {
        id: 'u4_q3',
        question: '验证减法算式 724 - 386 = 338 是否正确，下列哪种验算方法不对？',
        options: ['用 338 + 386 看看是否等于 724', '用 724 - 338 看看是否等于 386', '用 724 + 338 看看是否等于 386', '重新列竖式计算一遍'],
        answer: 2,
        explanation: '减法验算可用差加减数看是否等于被减数，或用被减数减差，绝对不能用被减数加差。'
      }
    ],
    boss: {
      name: '水晶石巨人·克里斯塔',
      avatar: '💠',
      title: '矿脉主宰',
      hp: 3,
      badge: { id: 'badge_math_g3_u4', name: '无瑕水晶盾', icon: '🛡️', desc: '精准完成连续进位退位笔算绝技' },
      questions: [
        {
          question: '一个加数是 375，和是 800，另一个加数是多少？',
          options: ['425', '435', '525', '1175'],
          answer: 0,
          explanation: '800 - 375 = 425。'
        },
        {
          question: '最大的三位数与最大的两位数的差是（ ）。',
          options: ['900', '899', '990', '90'],
          answer: 0,
          explanation: '最大三位数是999，最大两位数是99，999 - 99 = 900。'
        },
        {
          question: '滑冰场上午有观众 415 人，中午走了 187 人，下午又来了 265 人。全天一共有多少人？',
          options: ['680人', '493人', '593人', '867人'],
          answer: 0,
          explanation: '全天一共有的观众人数是上午人数加上下午又来的人数：415 + 265 = 680人。'
        }
      ]
    }
  },

  {
    id: 'unit_5',
    semester: 'upper',
    number: 5,
    name: '倍的认识',
    theme: '魔镜回廊',
    icon: '🪞',
    color: '#667EEA',
    bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    summary: '建构“倍”的概念，掌握“求一个数是另一个数的几倍”与“求几倍是多少”',
    knowledge: {
      concept: '把较小的数看作“1份”，较大的数里面有几个这样的一份，大数就是小数的几倍。倍不是单位名称，得数后面不要写“倍”字。',
      tips: '圈一圈、看一看，谁是标准作一份；求几倍用除法，求几倍是多少用乘法！',
      formula: '求一个数是另一个数的几倍：大数 ÷ 小数 = 倍数 | 求一个数的几倍是多少：一个数 × 倍数 = 几倍的数',
      examples: [
        '红花有3朵，黄花有6朵。把红花看作1份，黄花有2个3朵，黄花是红花的 6 ÷ 3 = 2 倍。',
        '小明有4支铅笔，小红的铅笔是小明的3倍，小红有 4 × 3 = 12 支。'
      ]
    },
    labType: 'multiple',
    challenges: [
      {
        id: 'u5_q1',
        question: '第一行摆了 4 根小棒，第二行摆了 16 根小棒。第二行的小棒是第一行的（ ）倍。',
        options: ['4', '12', '20', '64'],
        answer: 0,
        explanation: '求一个数是另一个数的几倍用除法：16 ÷ 4 = 4。'
      },
      {
        id: 'u5_q2',
        question: '小兔子拔了 6 个胡萝卜，大兔子拔的胡萝卜是小兔子的 5 倍。大兔子拔了多少个？',
        options: ['30个', '11个', '1个', '35个'],
        answer: 0,
        explanation: '求一个数的几倍是多少用乘法：6 × 5 = 30个。'
      },
      {
        id: 'u5_q3',
        question: '操场上有男生 24 人，女生 8 人。下面叙述正确的是（ ）。',
        options: ['男生人数是女生的 3 倍', '女生人数是男生的 3 倍', '男生比女生多 3 倍', '男生是女生的 16 倍'],
        answer: 0,
        explanation: '24 ÷ 8 = 3，所以男生人数是女生的3倍。'
      }
    ],
    boss: {
      name: '魔镜幻灵·艾普希隆',
      avatar: '🔮',
      title: '多重视界之主',
      hp: 3,
      badge: { id: 'badge_math_g3_u5', name: '真视之镜', icon: '🔍', desc: '洞悉倍数奥秘，分清乘除关系' },
      questions: [
        {
          question: '公园里有杨树 7 棵，柳树的棵数比杨树的 4 倍多 3 棵，柳树有多少棵？',
          options: ['31棵', '28棵', '35棵', '25棵'],
          answer: 0,
          explanation: '7 × 4 + 3 = 28 + 3 = 31棵。'
        },
        {
          question: '小红今年 6 岁，妈妈今年 36 岁。去年妈妈的年龄是小红的（ ）倍。',
          options: ['7', '6', '5', '8'],
          answer: 0,
          explanation: '去年小红 6-1=5 岁，妈妈 36-1=35 岁，35 ÷ 5 = 7 倍。'
        },
        {
          question: '两组同学折纸鹤，甲组折了 18 只，乙组折了 9 只。要使甲组折的是乙组的 3 倍，甲组还需要再折几只？',
          options: ['9只', '6只', '3只', '27只'],
          answer: 0,
          explanation: '乙组折了9只，它的3倍是 9 × 3 = 27只。甲组现有18只，还需 27 - 18 = 9只。'
        }
      ]
    }
  },

  {
    id: 'unit_6',
    semester: 'upper',
    number: 6,
    name: '多位数乘一位数',
    theme: '蒸汽齿轮工坊',
    icon: '⚙️',
    color: '#FFB199',
    bgColor: 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)',
    summary: '口算整十整百乘一位数，掌握两三位数乘一位数笔算及中间/末尾有0的乘法',
    knowledge: {
      concept: '笔算乘法时，相同数位对齐，从个位乘起。用一位数依次去乘多位数的每一位，哪一位上乘得的积满几十，就向前一位进几。特别注意：0和任何数相乘都得0！',
      tips: '从个位起依次乘，积满几十向前进；因数中间若有零，莫忘进位添上去！0乘任何数都是0！',
      formula: '0 × 任何数 = 0 | 估算：把多位数看作最接近的整百/整十数',
      examples: [
        '200 × 3 = 600',
        '24 × 3 = 72',
        '105 × 3 = 315',
        '250 × 4 = 1000'
      ]
    },
    labType: 'multiplication',
    challenges: [
      {
        id: 'u6_q1',
        question: '0 × 99 和 0 + 99 的比较，结果是（ ）。',
        options: ['0 + 99 更大', '0 × 99 更大', '一样大', '无法比较'],
        answer: 0,
        explanation: '0 × 99 = 0，而 0 + 99 = 99。'
      },
      {
        id: 'u6_q2',
        question: '计算 208 × 4，积的百位上是（ ），积是（ ）。',
        options: ['8，832', '8，802', '10，1032', '8，816'],
        answer: 0,
        explanation: '8×4=32写2进3，0×4+3=3，2×4=8，积是832。'
      },
      {
        id: 'u6_q3',
        question: '每个足球 68 元，王老师要买 5 个，带 350 元够吗？',
        options: ['够了，总价约340元', '不够，需要400元', '正好350元', '无法计算'],
        answer: 0,
        explanation: '68 × 5 = 340元。340 < 350，够了。'
      }
    ],
    boss: {
      name: '发条巨械·伏尔甘',
      avatar: '🦾',
      title: '工坊铸造之神',
      hp: 3,
      badge: { id: 'badge_math_g3_u6', name: '黄金齿轮', icon: '⚙️', desc: '精准驾驭多位数乘法与零的法则' },
      questions: [
        {
          question: '一个三位数乘一位数，积可能是（ ）。',
          options: ['三位数或四位数', '一定是三位数', '一定是四位数', '五位数'],
          answer: 0,
          explanation: '如 100 × 2 = 200（三位数）；999 × 9 = 8991（四位数）。'
        },
        {
          question: '250 × 8 的积的末尾一共有（ ）个 0。',
          options: ['3个', '2个', '1个', '4个'],
          answer: 0,
          explanation: '250 × 8 = 2000，末尾共有 3 个 0。'
        },
        {
          question: '买 3 盒彩笔用了 36 元，照这样计算，买 7 盒同样的彩笔需要多少元？',
          options: ['84元', '72元', '96元', '42元'],
          answer: 0,
          explanation: '36 ÷ 3 = 12元，12 × 7 = 84元。'
        }
      ]
    }
  },

  {
    id: 'unit_7',
    semester: 'upper',
    number: 7,
    name: '长方形和正方形',
    theme: '几何拼图城堡',
    icon: '🟦',
    color: '#FEE140',
    bgColor: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    summary: '掌握长方形正方形边角特征，熟记并灵活运用周长计算公式',
    knowledge: {
      concept: '长方形对边相等，4个角都是直角；正方形4条边都相等，4个角都是直角。封闭图形一周的长度就是它的【周长】。',
      tips: '长宽加合再乘二，长方形周长算得出；正方形更简单，边长乘四周长完！',
      formula: '长方形周长 = (长 + 宽) × 2 | 正方形周长 = 边长 × 4',
      examples: [
        '一个长方形花坛长6米，宽4米，周长是 (6 + 4) × 2 = 20米。',
        '一块正方形手帕边长2分米，周长是 2 × 4 = 8分米。'
      ]
    },
    labType: 'geo',
    challenges: [
      {
        id: 'u7_q1',
        question: '一个长方形长 8 厘米，宽 5 厘米，它的周长是多少？',
        options: ['26厘米', '13厘米', '40厘米', '21厘米'],
        answer: 0,
        explanation: '(8 + 5) × 2 = 26厘米。'
      },
      {
        id: 'u7_q2',
        question: '用一根长 20 厘米的铁丝围成一个正方形，这个正方形的边长是（ ）。',
        options: ['5厘米', '80厘米', '10厘米', '4厘米'],
        answer: 0,
        explanation: '20 ÷ 4 = 5厘米。'
      },
      {
        id: 'u7_q3',
        question: '把两个边长为 3 厘米的正方形拼成一个长方形，这个长方形的周长是（ ）。',
        options: ['18厘米', '24厘米', '12厘米', '15厘米'],
        answer: 0,
        explanation: '拼成长方形长6厘米宽3厘米，周长 (6+3)×2 = 18厘米。'
      }
    ],
    boss: {
      name: '方圆守护使·欧几里得',
      avatar: '📐',
      title: '城堡建筑宗师',
      hp: 3,
      badge: { id: 'badge_math_g3_u7', name: '几何神印', icon: '🏛️', desc: '融会贯通四边形与周长求法' },
      questions: [
        {
          question: '一个长方形的长是 10 厘米，长是宽的 2 倍，它的周长是（ ）。',
          options: ['30厘米', '20厘米', '25厘米', '60厘米'],
          answer: 0,
          explanation: '宽是 5厘米，周长 (10+5)×2 = 30厘米。'
        },
        {
          question: '一面靠墙围一个长 12 米，宽 8 米的长方形鸡舍，最少需要多长的篱笆？',
          options: ['28米', '32米', '40米', '20米'],
          answer: 0,
          explanation: '12 + 8 × 2 = 28米。'
        },
        {
          question: '一个正方形边长增加 2 厘米，它的周长增加（ ）厘米。',
          options: ['8厘米', '4厘米', '2厘米', '16厘米'],
          answer: 0,
          explanation: '周长增加 2 × 4 = 8厘米。'
        }
      ]
    }
  },

  {
    id: 'unit_8',
    semester: 'upper',
    number: 8,
    name: '分数的初步认识',
    theme: '彩虹烘焙坊',
    icon: '🍕',
    color: '#FF758C',
    bgColor: 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)',
    summary: '理解分数的意义，认识几分之一与几分之几，比较大小及同分母加减',
    knowledge: {
      concept: '把一个物体或图形【平均分】成几份，每份就是它的几分之一；取其中的几份，就是它的几分之几。同分母分数加减法：分母不变，分子相加减。',
      tips: '平均分是前提，分母在下分子起；同母比大分子大，分子为一母大值反小！',
      formula: '同分母分数加减：分母不变，分子相加减',
      examples: [
        '比较 1/4 和 1/8：平均分的份数越多，每一份反而越小，所以 1/4 > 1/8。',
        '2/5 + 1/5 = 3/5'
      ]
    },
    labType: 'fraction',
    challenges: [
      {
        id: 'u8_q1',
        question: '把一个苹果切成4块，小华吃了1块，小华吃了一定是这个苹果的 1/4 吗？',
        options: ['不一定，必须是“平均分”', '一定是 1/4', '是 1/3', '不是'],
        answer: 0,
        explanation: '只有在“平均分”的前提下才是 1/4。'
      },
      {
        id: 'u8_q2',
        question: '比较大小：1/5 ○ 1/3，○里应填（ ）。',
        options: ['<', '>', '=', '无法比较'],
        answer: 0,
        explanation: '分子都是1，分母越大分数越小，1/5 < 1/3。'
      },
      {
        id: 'u8_q3',
        question: '计算 3/8 + 2/8 的结果是（ ）。',
        options: ['5/8', '5/16', '1/8', '5/4'],
        answer: 0,
        explanation: '同分母分数相加：分母不变分子加，结果 5/8。'
      }
    ],
    boss: {
      name: '甜点魔厨·贝可利',
      avatar: '🧁',
      title: '彩虹厨房大师',
      hp: 3,
      badge: { id: 'badge_math_g3_u8', name: '彩虹糖霜勺', icon: '🍰', desc: '精通分数切分与同分母运算' },
      questions: [
        {
          question: '1 - 3/7 的计算结果是（ ）。',
          options: ['4/7', '2/7', '7/4', '1/7'],
          answer: 0,
          explanation: '7/7 - 3/7 = 4/7。'
        },
        {
          question: '一瓶果汁，弟弟喝了 2/9，姐姐喝了 4/9，两人一共喝了这瓶果汁的几分之几？',
          options: ['6/9（即2/3）', '6/18', '2/9', '8/9'],
          answer: 0,
          explanation: '2/9 + 4/9 = 6/9。'
        },
        {
          question: '有 12 个蘑菇，小兔采了这些蘑菇的 3/4，小兔采了多少个？',
          options: ['9个', '3个', '4个', '6个'],
          answer: 0,
          explanation: '12 ÷ 4 × 3 = 9个。'
        }
      ]
    }
  },

  {
    id: 'unit_9',
    semester: 'upper',
    number: 9,
    name: '数学广角——集合',
    theme: '智慧迷阵双环岛',
    icon: '⭕',
    color: '#A18CD1',
    bgColor: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    summary: '运用韦恩图（集合思想）解决重叠问题，学会不重不漏',
    knowledge: {
      concept: '计算总人数时，如果把两部分人数直接相加，重叠的人就被多算了一次，所以必须减去重复的人数。',
      tips: '左圈加右圈，中间重叠减一遍；两项全统计，不重不漏算得清！',
      formula: '总人数 = A + B - 重叠部分',
      examples: [
        '参加合唱10人，跳舞8人，两样都参加3人。总人数 10 + 8 - 3 = 15人。'
      ]
    },
    labType: 'venn',
    challenges: [
      {
        id: 'u9_q1',
        question: '明明排队买票，从前往后数明明排在第 6 个，从后往前数明明排在第 8 个，这队一共有多少人？',
        options: ['13人', '14人', '15人', '12人'],
        answer: 0,
        explanation: '6 + 8 - 1 = 13人。'
      },
      {
        id: 'u9_q2',
        question: '喜欢苹果20人，喜欢香蕉18人，两种都喜欢7人。喜欢这两种水果的共有（ ）人。',
        options: ['31人', '38人', '25人', '45人'],
        answer: 0,
        explanation: '20 + 18 - 7 = 31人。'
      },
      {
        id: 'u9_q3',
        question: '全班40人，25人跳绳，20人踢毽子，每人至少参加一项，两项都参加的有（ ）人。',
        options: ['5人', '15人', '10人', '8人'],
        answer: 0,
        explanation: '25 + 20 - 40 = 5人。'
      }
    ],
    boss: {
      name: '迷阵智者·双子星',
      avatar: '🧙‍♂️',
      title: '迷宫高阶导师',
      hp: 3,
      badge: { id: 'badge_math_g3_u9', name: '同心双环印', icon: '💫', desc: '熟练掌握集合思想与重叠计算' },
      questions: [
        {
          question: '昨天进货5种文具，今天进货6种，有2种相同。一共进了多少种文具？',
          options: ['9种', '11种', '7种', '8种'],
          answer: 0,
          explanation: '5 + 6 - 2 = 9种。'
        },
        {
          question: '8 个人站成一排报数，报双数的同学出列，队伍中还剩几人？',
          options: ['4人', '6人', '5人', '3人'],
          answer: 0,
          explanation: '双数4人，剩下 8 - 4 = 4人。'
        },
        {
          question: '两块长各 10 厘米的木板钉在一起，重合部分长 2 厘米。钉好后木板总长是多少？',
          options: ['18厘米', '20厘米', '16厘米', '19厘米'],
          answer: 0,
          explanation: '10 + 10 - 2 = 18厘米。'
        }
      ]
    }
  },

  // ============ 下册 (Units 10 - 17) ============
  {
    id: 'unit_10',
    semester: 'lower',
    number: 10,
    name: '位置与方向（一）',
    theme: '罗盘领航岛',
    icon: '🧭',
    color: '#00C6FF',
    bgColor: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
    summary: '辨认东、南、西、北与东南、东北、西南、西北八个方向，学会看路线图',
    knowledge: {
      concept: '早晨起来面向太阳，前面是东，后面是西，左面是北，右面是南。地图通常是按【上北下南，左西右东】绘制的。',
      tips: '面朝朝阳站定身，前东后西左右分；地图绘得上北下南，左西右东八方安！',
      formula: '东与西相对，南与北相对 | 东北对西南，西北对东南',
      examples: ['指南针红色指针通常指向北面。']
    },
    labType: 'compass',
    challenges: [
      {
        id: 'u10_q1',
        question: '在地图上看位置，通常规定的方向标准是（ ）。',
        options: ['上北下南，左西右东', '上南下北，左东右西', '上东下西，左北右南', '上西下东，左南右北'],
        answer: 0,
        explanation: '上北下南，左西右东。'
      },
      {
        id: 'u10_q2',
        question: '小树林在学校的西北方向，那么学校在小树林的（ ）方向。',
        options: ['东南', '东北', '西南', '正南'],
        answer: 0,
        explanation: '西北相对东南。'
      },
      {
        id: 'u10_q3',
        question: '傍晚放学回家，面向落下的夕阳，你的左面是（ ）。',
        options: ['南面', '北面', '东面', '西面'],
        answer: 0,
        explanation: '面向西，左面是南面。'
      }
    ],
    boss: {
      name: '风暴舵手·麦哲伦',
      avatar: '⚓',
      title: '无尽之海领航者',
      hp: 3,
      badge: { id: 'badge_math_g3_u10', name: '八方星罗盘', icon: '🧭', desc: '精准辨别八大方位与航线规划' },
      questions: [
        {
          question: '刮东南风时，彩旗会向（ ）方向飘扬。',
          options: ['西北', '东南', '东北', '西南'],
          answer: 0,
          explanation: '旗子向风吹向的方向（西北）飘扬。'
        },
        {
          question: '小明家在小红家的东北面，那么小红家在小明家的（ ）面。',
          options: ['西南', '西北', '东南', '正南'],
          answer: 0,
          explanation: '东北对西南。'
        },
        {
          question: '小明先向东走 50 米，再向南走 30 米，他现在在出发点的（ ）方向。',
          options: ['东南', '东北', '西南', '西北'],
          answer: 0,
          explanation: '向东又向南是东南方向。'
        }
      ]
    }
  },

  {
    id: 'unit_11',
    semester: 'lower',
    number: 11,
    name: '除数是一位数的除法',
    theme: '冰霜晶核峡谷',
    icon: '➗',
    color: '#7028E4',
    bgColor: 'linear-gradient(135deg, #e5b2ca 0%, #7028e4 100%)',
    summary: '口算除法，掌握两三位数除以一位数笔算、商中间/末尾有0及验算',
    knowledge: {
      concept: '从最高位除起。除到哪一位商写在那一位上面；每次除得的余数必须比除数小。不够商1商0占位。',
      tips: '除法从高算到底，余数一定要比除数小；不够商一商写零，验算乘加被除数找！',
      formula: '被除数 = 商 × 除数 + 余数',
      examples: ['612 ÷ 3 = 204（中间有0）']
    },
    labType: 'division',
    challenges: [
      {
        id: 'u11_q1',
        question: '计算 840 ÷ 4，商是（ ）。',
        options: ['210', '21', '201', '240'],
        answer: 0,
        explanation: '840 ÷ 4 = 210。'
      },
      {
        id: 'u11_q2',
        question: '□ ÷ 7 = 12 …… △，△ 最大可以是（ ）。',
        options: ['6', '7', '8', '5'],
        answer: 0,
        explanation: '余数小于除数，最大为6。'
      },
      {
        id: 'u11_q3',
        question: '636 ÷ 6 的商中间有（ ）个 0。',
        options: ['1个', '2个', '0个', '3个'],
        answer: 0,
        explanation: '商为106，中间有1个0。'
      }
    ],
    boss: {
      name: '冰霜龙王·萨菲罗斯',
      avatar: '🐉',
      title: '绝对零度主宰',
      hp: 3,
      badge: { id: 'badge_math_g3_u11', name: '寒霜晶锥', icon: '❄️', desc: '通晓除法笔算与商零之秘' },
      questions: [
        {
          question: '三位数除以一位数，商可能是（ ）。',
          options: ['两位数或三位数', '一定是三位数', '一定是两位数', '四位数'],
          answer: 0,
          explanation: '如 100÷5=20（两位数），600÷2=300（三位数）。'
        },
        {
          question: '验算有余数的除法 85 ÷ 6 = 14 …… 1，正确的算式是（ ）。',
          options: ['14 × 6 + 1 = 85', '14 × 6 - 1 = 85', '(14 + 1) × 6 = 85', '85 × 6 + 1'],
          answer: 0,
          explanation: '商 × 除数 + 余数 = 被除数。'
        },
        {
          question: '学校运来 248 袋大米，平均每个星期吃 8 袋，够吃几个星期？',
          options: ['31个', '32个', '30个', '28个'],
          answer: 0,
          explanation: '248 ÷ 8 = 31个星期。'
        }
      ]
    }
  },

  {
    id: 'unit_12',
    semester: 'lower',
    number: 12,
    name: '复式统计表',
    theme: '星图数据观察站',
    icon: '📊',
    color: '#3023AE',
    bgColor: 'linear-gradient(135deg, #c86dd7 0%, #3023ae 100%)',
    summary: '理解复式统计表的结构与优势，会读取、合并与分析多元数据',
    knowledge: {
      concept: '把两个或多个单式统计表合并在一起的表格叫【复式统计表】。便于进行多维度对照分析。',
      tips: '单表变复表，看清表头三项标；横比竖比一目了然，对比分析少不了！',
      formula: '数据合计 = 各分项数据之和',
      examples: ['男女生喜欢的兴趣小组汇总表。']
    },
    labType: 'chart',
    challenges: [
      {
        id: 'u12_q1',
        question: '相比于多个单式统计表，复式统计表最大的优点是（ ）。',
        options: ['便于比较两组或多组相关数据', '表格画起来更好看', '数据写得更少', '不需要算合计'],
        answer: 0,
        explanation: '便于横向与纵向对照分析。'
      },
      {
        id: 'u12_q2',
        question: '某班男生正常18人近视6人；女生正常16人近视8人。全班共有多少人？',
        options: ['48人', '34人', '14人', '50人'],
        answer: 0,
        explanation: '18 + 6 + 16 + 8 = 48人。'
      },
      {
        id: 'u12_q3',
        question: '该班近视的同学一共有（ ）人。',
        options: ['14人', '6人', '8人', '12人'],
        answer: 0,
        explanation: '6 + 8 = 14人。'
      }
    ],
    boss: {
      name: '星图领主·天璇',
      avatar: '🔭',
      title: '观测站大总管',
      hp: 3,
      badge: { id: 'badge_math_g3_u12', name: '全知星盘', icon: '🌌', desc: '洞悉数据规律，精准统计分析' },
      questions: [
        {
          question: '在复式统计表的表头中，“斜线”通常把表头格分成三个部分，分别对应（ ）。',
          options: ['横栏名称、竖栏名称、数据类别', '姓名、年龄、班级', '第一名、第二名、第三名', '年份、月份、天数'],
          answer: 0,
          explanation: '横栏、竖栏和数据三项。'
        },
        {
          question: '图书角有故事书45本，科普书32本，漫画书28本。借出15本故事书后还剩多少本？',
          options: ['90本', '105本', '75本', '85本'],
          answer: 0,
          explanation: '45 + 32 + 28 - 15 = 90本。'
        },
        {
          question: '如果要统计全校各年级男、女生人数，最适合选用（ ）。',
          options: ['复式统计表', '单式统计表', '条形图', '算盘'],
          answer: 0,
          explanation: '涉及年级和性别多维度，复式统计表最适宜。'
        }
      ]
    }
  },

  {
    id: 'unit_13',
    semester: 'lower',
    number: 13,
    name: '两位数乘两位数',
    theme: '黄金丰收果园',
    icon: '🍎',
    color: '#F857A6',
    bgColor: 'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)',
    summary: '口算整十数乘两位数，熟练掌握不进位与进位竖式笔算、解决乘除综合问题',
    knowledge: {
      concept: '用第二个乘数个位去乘，末尾对齐个位；用十位去乘，末尾对齐十位。两次积相加。',
      tips: '个位乘完十位乘，乘到十位数末位对十位；两次乘积相加拢，进位细心加进来！',
      formula: '竖式注意：第二步乘十位积的末尾必须对准十位',
      examples: ['14 × 12 = 168', '25 × 40 = 1000']
    },
    labType: 'multiplication',
    challenges: [
      {
        id: 'u13_q1',
        question: '计算 12 × 30，可以先算 12 × 3 = 36，再在得数末尾添上（ ）个 0。',
        options: ['1', '2', '0', '3'],
        answer: 0,
        explanation: '添1个0得 360。'
      },
      {
        id: 'u13_q2',
        question: '在竖式计算 23 × 14 时，用 14 十位上的 1 去乘 23，得到的是（ ）。',
        options: ['23个十（即230）', '23个一', '92个一', '14个十'],
        answer: 0,
        explanation: '表示 10 × 23 = 230，即23个十。'
      },
      {
        id: 'u13_q3',
        question: '一箱苹果 24 个，果园摘了 15 箱，一共有多少个苹果？',
        options: ['360个', '340个', '240个', '390个'],
        answer: 0,
        explanation: '24 × 15 = 360个。'
      }
    ],
    boss: {
      name: '果园巨熊·巴鲁',
      avatar: '🐻',
      title: '丰收大看守',
      hp: 3,
      badge: { id: 'badge_math_g3_u13', name: '丰收金苹果', icon: '🍏', desc: '神速解决两位数连乘进位高阶题' },
      questions: [
        {
          question: '两位数乘两位数，积可能是（ ）。',
          options: ['三位数或四位数', '一定是三位数', '一定是四位数', '五位数'],
          answer: 0,
          explanation: '最小 10×10=100，最大 99×99=9801。'
        },
        {
          question: '计算 45 × 60，积的末尾一共有（ ）个 0。',
          options: ['2个', '1个', '3个', '0个'],
          answer: 0,
          explanation: '45 × 60 = 2700，末尾有2个0。'
        },
        {
          question: '3 只燕子 4 天一共吃了 600 只害虫，平均 1 只燕子 1 天吃多少只害虫？',
          options: ['50只', '150只', '200只', '40只'],
          answer: 0,
          explanation: '600 ÷ 3 ÷ 4 = 50只。'
        }
      ]
    }
  },

  {
    id: 'unit_14',
    semester: 'lower',
    number: 14,
    name: '面积',
    theme: '领地开拓军营',
    icon: '🗺️',
    color: '#0BA360',
    bgColor: 'linear-gradient(135deg, #0ba360 0%, #3cba92 100%)',
    summary: '理解面积意义与常用单位，掌握长方形正方形面积计算及进率换算',
    knowledge: {
      concept: '长方形面积 = 长 × 宽；正方形面积 = 边长 × 边长。相邻面积单位进率是 100。',
      tips: '长乘宽算面积，边长乘边长正方形记；米与分米平方换，进率是一百别写乱！',
      formula: '长方形面积 = 长 × 宽 | 正方形面积 = 边长 × 边长 | 1平方米 = 100平方分米',
      examples: ['长6米宽4米的长方形，面积是 6 × 4 = 24平方米。']
    },
    labType: 'area',
    challenges: [
      {
        id: 'u14_q1',
        question: '一个长方形长 6 米，宽 4 米，它的周长是（ ），面积是（ ）。',
        options: ['20米，24平方米', '24米，20平方米', '20米，24米', '24平方米，20平方米'],
        answer: 0,
        explanation: '周长 (6+4)×2=20米；面积 6×4=24平方米。'
      },
      {
        id: 'u14_q2',
        question: '5 平方米 = （ ）平方分米。',
        options: ['500', '50', '5000', '5'],
        answer: 0,
        explanation: '5 × 100 = 500平方分米。'
      },
      {
        id: 'u14_q3',
        question: '边长是 4 厘米的正方形，它的周长和面积（ ）。',
        options: ['数值相等，但意义和单位不同', '完全相等', '周长大', '面积大'],
        answer: 0,
        explanation: '周长16厘米，面积16平方厘米，单位不同无法比大小。'
      }
    ],
    boss: {
      name: '开拓大元帅·阿瑞斯',
      avatar: '🛡️',
      title: '疆域领主',
      hp: 3,
      badge: { id: 'badge_math_g3_u14', name: '开拓者地契', icon: '📜', desc: '精准测量土地面积与进率换算' },
      questions: [
        {
          question: '长 8 米宽 5 米的菜地，围篱笆长多少？每平方米收菜 4 千克，共收菜多少？',
          options: ['26米，160千克', '40米，160千克', '26米，40千克', '13米，80千克'],
          answer: 0,
          explanation: '篱笆周长 26米；收菜 8×5×4 = 160千克。'
        },
        {
          question: '把 800 平方分米化成平方米是（ ）。',
          options: ['8平方米', '80平方米', '80000平方米', '0.8平方米'],
          answer: 0,
          explanation: '800 ÷ 100 = 8平方米。'
        },
        {
          question: '边长 8 米的正方形水池周围修 1 米宽小路，小路的面积是（ ）。',
          options: ['36平方米', '64平方米', '100平方米', '40平方米'],
          answer: 0,
          explanation: '10×10 - 8×8 = 36平方米。'
        }
      ]
    }
  },

  {
    id: 'unit_15',
    semester: 'lower',
    number: 15,
    name: '年、月、日',
    theme: '时光回转神殿',
    icon: '📅',
    color: '#E14FAD',
    bgColor: 'linear-gradient(135deg, #f77062 0%, #fe5196 100%)',
    summary: '掌握大月小月、平年闰年判断规则，熟练转换24时计时法与经过时间',
    knowledge: {
      concept: '大月（31天）：1、3、5、7、8、10、12月；小月（30天）：4、6、9、11月。平年2月28天，闰年2月29天。整百年必须是400的倍数才是闰年。',
      tips: '一三五七八十腊，三十一天永不差；四六九冬三十整，平年二月二十八！',
      formula: '下午/晚上时间 + 12 = 24时计时法',
      examples: ['晚上8时 = 20:00']
    },
    labType: 'calendar',
    challenges: [
      {
        id: 'u15_q1',
        question: '下列年份中，属于闰年的是（ ）。',
        options: ['2024年', '2023年', '1900年', '2021年'],
        answer: 0,
        explanation: '2024能被4整除，是闰年。'
      },
      {
        id: 'u15_q2',
        question: '晚上 9 时 30 分用 24 时计时法表示为（ ）。',
        options: ['21:30', '9:30', '19:30', '22:30'],
        answer: 0,
        explanation: '9 + 12 = 21时，即 21:30。'
      },
      {
        id: 'u15_q3',
        question: '7月和8月两个月一共有（ ）天。',
        options: ['62天', '61天', '60天', '59天'],
        answer: 0,
        explanation: '31 + 31 = 62天。'
      }
    ],
    boss: {
      name: '时光长老·柯罗诺',
      avatar: '⏳',
      title: '历法星象官',
      hp: 3,
      badge: { id: 'badge_math_g3_u15', name: '永恒日历', icon: '📆', desc: '精通日月星辰交替与跨天计时' },
      questions: [
        {
          question: '小明的生日是 2 月 29 日，他要（ ）年才能过一次真正的生日。',
          options: ['4年', '1年', '2年', '3年'],
          answer: 0,
          explanation: '闰年每4年一次。'
        },
        {
          question: '一场球赛从 19:40 开始，进行了 1 小时 45 分钟，结束时间是（ ）。',
          options: ['21:25', '21:15', '20:25', '22:25'],
          answer: 0,
          explanation: '19:40 + 1:45 = 21:25。'
        },
        {
          question: '8 月 1 日的前一天是（ ）。',
          options: ['7月31日', '7月30日', '8月0日', '6月30日'],
          answer: 0,
          explanation: '7月有31天，前一天是7月31日。'
        }
      ]
    }
  },

  {
    id: 'unit_16',
    semester: 'lower',
    number: 16,
    name: '小数的初步认识',
    theme: '百宝集市小吃街',
    icon: '🪙',
    color: '#F9D423',
    bgColor: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    summary: '理解小数意义（元角分、米与分米），学会一位小数比大小与加减计算',
    knowledge: {
      concept: '1角 = 0.1元，1分米 = 0.1米。竖式计算小数加减时，关键是要把【小数点对齐】！',
      tips: '小数点点正中央，左边整数右小数；加减对齐小数点，相同数位相加减！',
      formula: '1元 = 10角，1角 = 0.1元 | 1米 = 10分米，1分米 = 0.1米',
      examples: ['2.4 + 1.5 = 3.9', '0.9 > 0.6']
    },
    labType: 'decimal',
    challenges: [
      {
        id: 'u16_q1',
        question: '3 元 6 角用小数表示是（ ）元。',
        options: ['3.6', '0.36', '36', '3.06'],
        answer: 0,
        explanation: '3.6元。'
      },
      {
        id: 'u16_q2',
        question: '比较大小：0.7 米 ○ 7 分米，○里填（ ）。',
        options: ['=', '>', '<', '无法比较'],
        answer: 0,
        explanation: '7分米就是 0.7米，完全相等。'
      },
      {
        id: 'u16_q3',
        question: '计算 4.5 - 2.8 的结果是（ ）。',
        options: ['1.7', '2.3', '1.3', '2.7'],
        answer: 0,
        explanation: '4.5 - 2.8 = 1.7。'
      }
    ],
    boss: {
      name: '集市首富·金多多',
      avatar: '💰',
      title: '商贸大财阀',
      hp: 3,
      badge: { id: 'badge_math_g3_u16', name: '招财金算子', icon: '💎', desc: '秒懂小数化金，买卖计算零失误' },
      questions: [
        {
          question: '笔记本 3.5 元，水彩笔 8.8 元，带 15 元够吗？',
          options: ['够了，共花费12.3元', '不够，共需要15.3元', '正好15元', '无法计算'],
          answer: 0,
          explanation: '3.5 + 8.8 = 12.3元 < 15元。'
        },
        {
          question: '在 0.4、0.9、1.1、0.7 中，最大的是（ ），最小的是（ ）。',
          options: ['1.1，0.4', '0.9，0.4', '1.1，0.7', '0.9，0.7'],
          answer: 0,
          explanation: '1.1最大，0.4最小。'
        },
        {
          question: '小华身高 1.4 米，小明 1.2 米，小华比小明高（ ）米。',
          options: ['0.2米', '0.4米', '2.6米', '0.1米'],
          answer: 0,
          explanation: '1.4 - 1.2 = 0.2米。'
        }
      ]
    }
  },

  {
    id: 'unit_17',
    semester: 'lower',
    number: 17,
    name: '数学广角——搭配（二）',
    theme: '密室密码神殿',
    icon: '🔐',
    color: '#8E2DE2',
    bgColor: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)',
    summary: '运用有序思维解决排列与组合问题，做到不重复、不遗漏',
    knowledge: {
      concept: '做事情有多种搭配时，要按照一定顺序有条理地进行思考，画连线图是最好的办法。',
      tips: '排列组合有门道，有序思考不乱套；定位连线按步走，不重不漏把数找！',
      formula: '乘法原理：搭配种数 = m × n',
      examples: ['2件上衣搭配3条裤子，共 2 × 3 = 6 种。']
    },
    labType: 'perm',
    challenges: [
      {
        id: 'u17_q1',
        question: '有 2 件不同的上衣和 3 条不同的裙子，一共有（ ）种不同的穿法。',
        options: ['6种', '5种', '8种', '4种'],
        answer: 0,
        explanation: '2 × 3 = 6种。'
      },
      {
        id: 'u17_q2',
        question: '用数字 0、2、5 可以组成（ ）个没有重复数字的两位数。',
        options: ['4个', '6个', '5个', '3个'],
        answer: 0,
        explanation: '20, 25, 50, 52 共4个。'
      },
      {
        id: 'u17_q3',
        question: '4 位好朋友见面，如果每两人握一次手，一共要握（ ）次手。',
        options: ['6次', '8次', '12次', '4次'],
        answer: 0,
        explanation: '3 + 2 + 1 = 6次。'
      }
    ],
    boss: {
      name: '密码领主·达芬奇',
      avatar: '🗝️',
      title: '神殿终极守卫',
      hp: 3,
      badge: { id: 'badge_math_g3_u17', name: '万象解构匙', icon: '👑', desc: '全通关！集齐三年级全部数学徽章的至尊勇者' },
      questions: [
        {
          question: '从 4 种主食和 3 种饮料中各选 1 种，一共有多少种搭配？',
          options: ['12种', '7种', '10种', '15种'],
          answer: 0,
          explanation: '4 × 3 = 12 种。'
        },
        {
          question: '小明、小红、小芳 3 人排成一排照相，有（ ）种不同排法。',
          options: ['6种', '3种', '9种', '4种'],
          answer: 0,
          explanation: '3 × 2 × 1 = 6种。'
        },
        {
          question: '用 1、2、3 三个数字可以组成多少个没有重复数字的三位数？',
          options: ['6个', '3个', '9个', '8个'],
          answer: 0,
          explanation: '3 × 2 × 1 = 6个。'
        }
      ]
    }
  }
];

// 4-6年级进阶规划与高学段大纲速查
export const OTHER_SUBJECTS_SYLLABUS = {
  math: {
    grade3: [
      { unit: 1, title: '大数的认识与十进制计数法', keypoints: ['亿以内数的读写', '数位顺序表', '用计算器计算'] },
      { unit: 2, title: '公顷与平方千米', keypoints: ['土地面积单位', '单位换算', '实际面积估算'] },
      { unit: 3, title: '角的度量与平行四边形', keypoints: ['线段直线射线', '量角器使用', '平行与相交'] }
    ]
  },
  chinese: {
    grade3: [
      { unit: 1, title: '大自然的四季与自然奇观', keypoints: ['观察日记', '优美句段积累', '写景抒情'] },
      { unit: 2, title: '中华传统文化与民间寓言', keypoints: ['寓言故事', '人物性格剖析', '道理启迪'] },
      { unit: 3, title: '经典文学阅读与想象天地', keypoints: ['童话故事续写', '情节梳理', '想象力拓展'] }
    ]
  },
  english: {
    grade3: [
      { unit: 1, title: 'Daily Life and Daily Routine', keypoints: ['Time Expressions', 'Daily Activities', 'Present Simple'] },
      { unit: 2, title: 'My Community and Neighborhood', keypoints: ['Places in Town', 'Asking Directions', 'Prepositions'] },
      { unit: 3, title: 'The Natural World and Animals', keypoints: ['Animal Habitats', 'Comparative Adjectives', 'Nature Protection'] }
    ]
  },
  science: {
    grade3: [
      { unit: 1, title: '声音与空气的奥秘', keypoints: ['声音的产生与传播', '音调与音量', '空气的性质与流动'] },
      { unit: 2, title: '电路与能量的转换', keypoints: ['简单电路组装', '导体与绝缘体', '安全用电守则'] },
      { unit: 3, title: '地表变迁与岩石土壤', keypoints: ['岩石与矿物识别', '风化侵蚀', '土壤成分探究'] }
    ]
  }
};

