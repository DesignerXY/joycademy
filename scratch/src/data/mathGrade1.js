// 人教版小学一年级数学全册（上册8单元 + 下册7单元共15单元）

export const MATH_GRADE1_UNITS = [
  // ============ 一年级上册 ============
  {
    id: 'unit_1',
    semester: 'upper',
    number: 1,
    name: '准备课（数一数与比多少）',
    theme: '萌趣森林童话村',
    icon: '🐰',
    color: '#10B981',
    bgColor: 'linear-gradient(135deg, #a8ff78 0%, #78ffd6 100%)',
    summary: '学会按顺序手口一致数数，通过“一一对应”比较物体的多少',
    knowledge: {
      concept: '数数时，要按照从左到右或从上到下的顺序，数一个点一个，手口一致，最后一个数是几，物体的总数就是几。比较两种物体多少时，用一条线连一连（一一对应），没有剩余的就同样多，有剩余的就“多”。',
      tips: '伸出小手指，一个挨一个；从一数到十，仔细不放过！连线一对一，谁多谁少看得清！',
      formula: '一一对应法：无剩余即“同样多”，多出的部分就是“多几个”',
      examples: [
        '3只小兔分3个胡萝卜，每只小兔1个，小兔和胡萝卜【同样多】。',
        '4个小朋友分3把椅子，小朋友比椅子【多1个】。'
      ]
    },
    labType: 'count',
    challenges: [
      {
        id: 'g1_u1_q1',
        question: '数一数，图中有 5 朵小花，再采来 1 朵，现在一共有几朵花？',
        options: ['6朵', '4朵', '7朵', '5朵'],
        answer: 0,
        explanation: '5往后接着数一个数就是6，所以一共有6朵花。'
      },
      {
        id: 'g1_u1_q2',
        question: '小猫有4条鱼，小狗有5根骨头。谁的数量更多？',
        options: ['小狗的骨头多', '小猫的鱼多', '一样多', '无法比较'],
        answer: 0,
        explanation: '5比4大，所以小狗的骨头更多。'
      },
      {
        id: 'g1_u1_q3',
        question: '（变种题）操场上有 3 只白兔和 3 只灰兔，白兔和灰兔的数量（ ）。',
        options: ['同样多', '白兔多', '灰兔多', '多1只'],
        answer: 0,
        explanation: '两边都是3只，一一对应正好分完，所以同样多。'
      }
    ],
    boss: {
      name: '森林守护兔·皮皮',
      avatar: '🐇',
      title: '数字萌村村长',
      hp: 3,
      badge: { id: 'badge_math_g1_u1', name: '敏锐数数镜', icon: '🥕', desc: '手口一致数数无差错，火眼金睛比多少' },
      questions: [
        {
          question: '比一比：比 7 大且比 9 小的数是（ ）。',
          options: ['8', '6', '10', '7'],
          answer: 0,
          explanation: '按顺序数：7、8、9，中间的数是8。'
        },
        {
          question: '小明排队，从前往后数小明排第3，排在小明前面的有（ ）人。',
          options: ['2人', '3人', '1人', '4人'],
          answer: 0,
          explanation: '小明自己是第3个，前面有第1个和第2个，共2人。'
        },
        {
          question: '（变种题）把5个苹果分给小红和小兰，每人分到的苹果一样多，能做到吗？',
          options: ['不能，5是单数会多出1个', '能，每人2个', '能，每人3个', '能分完'],
          answer: 0,
          explanation: '5不能平分成两个一样的整数，2+2=4剩1个，3+3=6不够。'
        }
      ]
    }
  },

  {
    id: 'unit_2',
    semester: 'upper',
    number: 2,
    name: '位置（上下前后左右）',
    theme: '迷宫寻宝屋',
    icon: '🧭',
    color: '#3B82F6',
    bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    summary: '辨认上、下、前、后、左、右相对位置，分清自己与参照物',
    knowledge: {
      concept: '上和下是一对好朋友，前和后是一对好朋友，左和右也是一对好朋友。通常我们拿筷子、写字的手是【右手】，另一只手是【左手】。确定物体位置时，先看以谁为标准。',
      tips: '写字握笔是右手，拿碗扶本是左手；面对面时左右反，看清标准再判断！',
      formula: '相对性原则：描述位置必须明确参照物',
      examples: [
        '红旗在黑板的【上面】。',
        '小明面对老师站立，小明的前面是老师，小明的后面是黑板。'
      ]
    },
    labType: 'position',
    challenges: [
      {
        id: 'g1_u2_q1',
        question: '我们平时写字、举手发言常用的是（ ）。',
        options: ['右手', '左手', '双手', '脚'],
        answer: 0,
        explanation: '习惯上大家写字、举手常用右手。'
      },
      {
        id: 'g1_u2_q2',
        question: '小汽车在卡车的后面，那么卡车在小汽车的（ ）。',
        options: ['前面', '后面', '上面', '下面'],
        answer: 0,
        explanation: '前和后是相对的，小车在卡车后，卡车就在小车前。'
      },
      {
        id: 'g1_u2_q3',
        question: '（变种题）伸出你的右手，摸摸你的左耳朵，你的右手手臂要向（ ）方伸。',
        options: ['左', '右', '上', '前'],
        answer: 0,
        explanation: '左耳朵在左侧，右手从右侧伸向左侧。'
      }
    ],
    boss: {
      name: '方位领路喵·米诺',
      avatar: '🐱',
      title: '空间罗盘使',
      hp: 3,
      badge: { id: 'badge_math_g1_u2', name: '方位之铃', icon: '🔔', desc: '上下前后左右分得清清爽爽' },
      questions: [
        {
          question: '在马路上行走时，车辆和行人都必须靠（ ）侧通行。',
          options: ['右', '左', '中间', '随意'],
          answer: 0,
          explanation: '我国交通法规规定：靠右侧通行。'
        },
        {
          question: '小鸟在树枝上，小狗在树底下。小狗在小鸟的（ ）面。',
          options: ['下', '上', '左', '前'],
          answer: 0,
          explanation: '小狗在树底，因此在小鸟的下面。'
        },
        {
          question: '（变种题）4个人排成一队，小刚的前面有1人，小刚的后面有（ ）人。',
          options: ['2人', '1人', '3人', '0人'],
          answer: 0,
          explanation: '总共4人，前面1人，小刚自己1人，后面还剩 4 - 1 - 1 = 2人。'
        }
      ]
    }
  },

  {
    id: 'unit_3',
    semester: 'upper',
    number: 3,
    name: '1~5的认识和加减法',
    theme: '魔法苹果树',
    icon: '🍎',
    color: '#EF4444',
    bgColor: 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)',
    summary: '理解分与合，掌握5以内加法和减法口算，理解0的意义',
    knowledge: {
      concept: '加法表示合起来：把两部分合在一起求一共是多少用加法（+）。减法表示去掉：从总数里去掉一部分求还剩多少用减法（-）。0表示一个也没有，也可以表示起点。任何数加0都得它本身，任何数减0也得它本身。',
      tips: '加号像十字，合起来算一共；减号一横切，去掉算还剩；一个都没有，圆圆写个0！',
      formula: '分与合：5可以分成2和3，2和3合成5 | a + 0 = a | a - 0 = a | a - a = 0',
      examples: [
        '树上有3只鸟，又飞来2只，合起来是 3 + 2 = 5 只。',
        '盘子里有4个苹果，吃掉了1个，还剩 4 - 1 = 3 个。',
        '鸟窝里有2只小鸟，都飞走了，还剩 2 - 2 = 0 只。'
      ]
    },
    labType: 'arithmetic',
    challenges: [
      {
        id: 'g1_u3_q1',
        question: '计算 2 + 3 的结果是（ ）。',
        options: ['5', '4', '3', '6'],
        answer: 0,
        explanation: '2和3合成5，所以 2 + 3 = 5。'
      },
      {
        id: 'g1_u3_q2',
        question: '5 - 0 的结果是（ ）。',
        options: ['5', '0', '4', '1'],
        answer: 0,
        explanation: '从5个里面去掉0个（一个都没去掉），还是5个。'
      },
      {
        id: 'g1_u3_q3',
        question: '（变种题）妈妈买了4块蛋糕，小明吃了4块，还剩几块？',
        options: ['0块', '1块', '4块', '8块'],
        answer: 0,
        explanation: '4 - 4 = 0，全部吃完了表示一个也没有，用0表示。'
      }
    ],
    boss: {
      name: '苹果树精灵·果果',
      avatar: '🍏',
      title: '果实园艺长',
      hp: 3,
      badge: { id: 'badge_math_g1_u3', name: '五星萌芽枝', icon: '🌱', desc: '熟练5以内分与合及零的真谛' },
      questions: [
        {
          question: '算式 5 - 2 = 3 中，减号是（ ）。',
          options: ['-', '+', '=', '5'],
          answer: 0,
          explanation: '“-”是减号。'
        },
        {
          question: '哪两个数合起来是 4？',
          options: ['1 和 3', '2 和 3', '1 和 4', '0 和 5'],
          answer: 0,
          explanation: '1 + 3 = 4。'
        },
        {
          question: '（变种题）原有 3 瓶牛奶，喝了 1 瓶，又买来 2 瓶，现在有（ ）瓶。',
          options: ['4瓶', '3瓶', '2瓶', '5瓶'],
          answer: 0,
          explanation: '3 - 1 + 2 = 2 + 2 = 4瓶。'
        }
      ]
    }
  },

  {
    id: 'unit_4',
    semester: 'upper',
    number: 4,
    name: '认识图形（一）',
    theme: '积木奇幻城堡',
    icon: '🧊',
    color: '#8B5CF6',
    bgColor: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    summary: '直观认识长方体、正方体、圆柱和球四种立体图形的特征',
    knowledge: {
      concept: '长方体：长长方方的，有6个平平的面，面有大有小；正方体：四四方方的，6个面都是一样大小的正方形；圆柱：直直的，上下一样粗，上下两个面是圆圆的平平的面，放倒可以骨碌碌滚动；球：圆圆润润的，没有棱角，随便怎么推都能滚动。',
      tips: '长方体长长方，正方体四方方；圆柱上下两个圆，圆溜溜小球滚得欢！',
      formula: '长方体/正方体面平不能滚，圆柱能立能滚，球任意方向滚动',
      examples: [
        '牙膏盒、文具盒是【长方体】。',
        '魔方、骰子是【正方体】。',
        '易拉罐、茶叶筒是【圆柱】。',
        '足球、乒乓球是【球】。'
      ]
    },
    labType: 'shapes3d',
    challenges: [
      {
        id: 'g1_u4_q1',
        question: '踢足球的“足球”属于哪种立体图形？',
        options: ['球', '圆柱', '正方体', '长方体'],
        answer: 0,
        explanation: '足球圆溜溜的，能向任意方向滚动，是球。'
      },
      {
        id: 'g1_u4_q2',
        question: '用来玩游戏的骰子（色子）形状通常是（ ）。',
        options: ['正方体', '长方体', '圆柱', '球'],
        answer: 0,
        explanation: '骰子每个面都一样大，四四方方，是正方体。'
      },
      {
        id: 'g1_u4_q3',
        question: '（变种题）要想搭得最高且最稳，最底下应该放（ ）。',
        options: ['长方体或正方体', '球', '倒放的圆柱', '都可以'],
        answer: 0,
        explanation: '长方体和正方体面平平的，不容易滚落，最平稳。'
      }
    ],
    boss: {
      name: '积木大师·洛克',
      avatar: '🧱',
      title: '积木王国总工程师',
      hp: 3,
      badge: { id: 'badge_math_g1_u4', name: '几何七宝石', icon: '💎', desc: '一眼识破四种立体图形特征' },
      questions: [
        {
          question: '可乐易拉罐横着放，轻轻一推就能（ ）。',
          options: ['滚动', '滑动', '立住', '飞起来'],
          answer: 0,
          explanation: '圆柱侧面是弯曲的曲面，放倒可以骨碌碌滚动。'
        },
        {
          question: '正方体一共有几个面？',
          options: ['6个面', '4个面', '8个面', '12个面'],
          answer: 0,
          explanation: '正方体有6个平平的正方形面。'
        },
        {
          question: '（变种题）把两个完全一样的正方体拼在一起，拼成的新图形是（ ）。',
          options: ['长方体', '正方体', '圆柱', '球'],
          answer: 0,
          explanation: '两个正方体拼在一起变长了，成为长方体。'
        }
      ]
    }
  },

  {
    id: 'unit_5',
    semester: 'upper',
    number: 5,
    name: '6~10的认识和加减法',
    theme: '彩虹阶梯塔',
    icon: '🌈',
    color: '#F59E0B',
    bgColor: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    summary: '掌握10以内数的分与合，熟练口算连加、连减与加减混合',
    knowledge: {
      concept: '10是两个数字组成的两位数，它是由1个十组成的。连加连减的计算顺序：按照从左到右的顺序一步一步算。先算出前两个数的得数，再把得数与第三个数相加或相减。',
      tips: '从左往右依次算，前俩得数先记心；再加再减第三个，步步清楚字端正！',
      formula: '凑十好朋友歌：一九一九好朋友，二八二八手拉手，三七三七真亲密，四六四六一起走，五五凑成一双手！',
      examples: [
        '3 + 2 + 4 = 5 + 4 = 9',
        '8 - 2 - 3 = 6 - 3 = 3',
        '5 + 3 - 2 = 8 - 2 = 6'
      ]
    },
    labType: 'arithmetic',
    challenges: [
      {
        id: 'g1_u5_q1',
        question: '计算 4 + 3 + 2 的结果是（ ）。',
        options: ['9', '8', '10', '7'],
        answer: 0,
        explanation: '从左往右：4+3=7，7+2=9。'
      },
      {
        id: 'g1_u5_q2',
        question: '哪两个数能凑成 10？',
        options: ['3 和 7', '4 和 5', '2 和 7', '1 和 8'],
        answer: 0,
        explanation: '3 + 7 = 10，三七凑十。'
      },
      {
        id: 'g1_u5_q3',
        question: '（变种题）公交车上原来有 9 个人，先下去了 3 人，又上来了 2 人，现在车上有（ ）人。',
        options: ['8人', '7人', '9人', '6人'],
        answer: 0,
        explanation: '9 - 3 + 2 = 6 + 2 = 8人。'
      }
    ],
    boss: {
      name: '十色彩虹仙子·爱丽丝',
      avatar: '🧚‍♀️',
      title: '彩虹阶梯守护神',
      hp: 3,
      badge: { id: 'badge_math_g1_u5', name: '十全大圆满', icon: '🌟', desc: '精通凑十好朋友与连加连减运算' },
      questions: [
        {
          question: '10 - 4 - 3 的结果是（ ）。',
          options: ['3', '4', '2', '5'],
          answer: 0,
          explanation: '10 - 4 = 6，6 - 3 = 3。'
        },
        {
          question: '比 6 多 3 的数是（ ）。',
          options: ['9', '3', '8', '10'],
          answer: 0,
          explanation: '6 + 3 = 9。'
        },
        {
          question: '（变种题）花丛中有 8 只蝴蝶，先飞走了 2 只，又飞走了 3 只，一共飞走了（ ）只蝴蝶。',
          options: ['5只', '3只', '6只', '4只'],
          answer: 0,
          explanation: '问的是“一共飞走了多少”，两次飞走合起来：2 + 3 = 5只。（注意不是问剩下多少）'
        }
      ]
    }
  },

  {
    id: 'unit_6',
    semester: 'upper',
    number: 6,
    name: '11~20各数的认识',
    theme: '水晶计数岛',
    icon: '🔟',
    color: '#0284C7',
    bgColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    summary: '认识十位与个位，理解数的组成，掌握十加几及相应的减法',
    knowledge: {
      concept: '10个一是1个十。计数器从右边起，第一位是【个位】，第二位是【十位】。个位上有一颗珠子表示1个一，十位上有一颗珠子表示1个十。例如 15 里面有 1个十 和 5个一。',
      tips: '从右数起第一位是个位，第二位是十位；十个一是十，十几就是十和几！',
      formula: '十几的组成：10 + 几 = 十几 | 十几 - 几 = 10 | 十几 - 10 = 几',
      examples: [
        '1捆小棒是10根（1个十），旁边放3根（3个一），合起来是 13。',
        '10 + 4 = 14，14 - 4 = 10，14 - 10 = 4'
      ]
    },
    labType: 'placeValue',
    challenges: [
      {
        id: 'g1_u6_q1',
        question: '1 个十和 6 个一合起来是（ ）。',
        options: ['16', '61', '7', '106'],
        answer: 0,
        explanation: '1个十在十位写1，6个一在个位写6，合起来是16。'
      },
      {
        id: 'g1_u6_q2',
        question: '计数器十位上拨 1 颗珠子，个位上拨 8 颗珠子，这个数是（ ）。',
        options: ['18', '81', '9', '19'],
        answer: 0,
        explanation: '十位是1，个位是8，表示18。'
      },
      {
        id: 'g1_u6_q3',
        question: '（变种题）13 和 15 中间的一个数是（ ）。',
        options: ['14', '12', '16', '13'],
        answer: 0,
        explanation: '按从小到大数：13、14、15，中间是14。'
      }
    ],
    boss: {
      name: '数位法老·安德鲁',
      avatar: '🧙‍♂️',
      title: '水晶计数塔尊师',
      hp: 3,
      badge: { id: 'badge_math_g1_u6', name: '十位天平杖', icon: '🪄', desc: '分清个位与十位，玩转十几组成' },
      questions: [
        {
          question: '10 里面有（ ）个一。',
          options: ['10', '1', '100', '0'],
          answer: 0,
          explanation: '10个一就是1个十。'
        },
        {
          question: '计算 13 + 4 的结果是（ ）。',
          options: ['17', '18', '16', '15'],
          answer: 0,
          explanation: '个位上 3 + 4 = 7，加上1个十得 17。'
        },
        {
          question: '（变种题）比 19 多 1 的数是（ ），它由（ ）个十组成。',
          options: ['20，2个十', '18，1个十', '20，1个十', '21，2个十'],
          answer: 0,
          explanation: '19+1=20，20由2个十组成。'
        }
      ]
    }
  },

  {
    id: 'unit_7',
    semester: 'upper',
    number: 7,
    name: '认识钟表（整时）',
    theme: '咕咕布谷鸟钟楼',
    icon: '🕰️',
    color: '#EC4899',
    bgColor: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    summary: '认识钟面的分针与时针，学会认读整时和电子表时间',
    knowledge: {
      concept: '钟面上有短又粗的【时针】，有长又细的【分针】。当【分针长长指着12】时，时针指着几就是【几时整】！在电子表上，冒号右边是两个00，左边是几就是几时。',
      tips: '分针长长指着12，时针指几就几时；电子表上看冒号，后面双零正整时！',
      formula: '整时特征：分针永远指在数字 12 上 | 电子表示：7:00 读作 7时',
      examples: [
        '分针指着12，时针指着8，是 8时整（8:00）。',
        '分针指着12，时针指着12，两针重合在一起，是 12时整。'
      ]
    },
    labType: 'clock1',
    challenges: [
      {
        id: 'g1_u7_q1',
        question: '钟面上分针指着 12，时针指着 3，此时是（ ）。',
        options: ['3时', '12时', '3时半', '15分'],
        answer: 0,
        explanation: '分针指12是整时，时针指3就是3时。'
      },
      {
        id: 'g1_u7_q2',
        question: '电子表上显示“10:00”，表示的时间是（ ）。',
        options: ['10时整', '1时', '12时', '10分'],
        answer: 0,
        explanation: '冒号左边是时数10，右边是00，表示10时整。'
      },
      {
        id: 'g1_u7_q3',
        question: '（变种题）现在是 4时整，再过 1小时 是（ ）时。',
        options: ['5时', '3时', '6时', '4时'],
        answer: 0,
        explanation: '4 + 1 = 5时。'
      }
    ],
    boss: {
      name: '时间布谷鸟·咕咕',
      avatar: '🦉',
      title: '钟楼打更报时官',
      hp: 3,
      badge: { id: 'badge_math_g1_u7', name: '金羽报时钟', icon: '⏱️', desc: '一眼秒认时针分针与整时时间' },
      questions: [
        {
          question: '钟面上又短又粗的针叫做（ ）。',
          options: ['时针', '分针', '秒针', '齿轮'],
          answer: 0,
          explanation: '短粗的是时针，细长的是分针。'
        },
        {
          question: '时针和分针重合在数字 12 处时，是（ ）。',
          options: ['12时', '6时', '1时', '0时'],
          answer: 0,
          explanation: '分针指12，时针也指12，正是12时整。'
        },
        {
          question: '（变种题）妈妈每天早上 7:00 起床，小明比妈妈晚 1小时 起床，小明起床的时间是（ ）。',
          options: ['8:00', '6:00', '9:00', '7:30'],
          answer: 0,
          explanation: '7:00 往后推1小时是 8:00。'
        }
      ]
    }
  },

  {
    id: 'unit_8',
    semester: 'upper',
    number: 8,
    name: '20以内的进位加法（凑十法）',
    theme: '黄金凑十矿谷',
    icon: '⚡',
    color: '#D97706',
    bgColor: 'linear-gradient(135deg, #f7ba2c 0%, #ea5455 100%)',
    summary: '熟练掌握“凑十法”，神速口算9加几、8加几、7/6/5加几',
    knowledge: {
      concept: '“凑十法”是进位加法的神技：看大数，分小数，凑成十，加剩数。例如计算 9 + 4：把 4 分成 1 和 3，9 加上 1 凑成 10，10 再加上剩下的 3 得 13！',
      tips: '看大数，分小数，凑成十，加剩数！九加一，八加二，七加三，六加四，五加五凑整十！',
      formula: '9 + 几 = 10 + (几 - 1) | 8 + 几 = 10 + (几 - 2) | 7 + 几 = 10 + (几 - 3)',
      examples: [
        '9 + 5：把5分成1和4，9+1=10，10+4=14。',
        '8 + 6：把6分成2和4，8+2=10，10+4=14。',
        '7 + 5：把5分成3和2，7+3=10，10+2=12。'
      ]
    },
    labType: 'makeTen',
    challenges: [
      {
        id: 'g1_u8_q1',
        question: '用凑十法计算 9 + 6，应该把 6 分成（ ）和 5。',
        options: ['1', '2', '3', '4'],
        answer: 0,
        explanation: '9需要1凑成10，所以把6分成1和5。'
      },
      {
        id: 'g1_u8_q2',
        question: '计算 8 + 7 的结果是（ ）。',
        options: ['15', '14', '16', '13'],
        answer: 0,
        explanation: '把7分成2和5，8+2=10，10+5=15。'
      },
      {
        id: 'g1_u8_q3',
        question: '（变种题）操场上有 7 个男生，8 个女生，一共有多少人？下面算式正确的是（ ）。',
        options: ['7 + 8 = 15', '8 - 7 = 1', '7 + 7 = 14', '8 + 8 = 16'],
        answer: 0,
        explanation: '求一共的人数用加法：7 + 8 = 15。'
      }
    ],
    boss: {
      name: '黄金熔炼师·赫菲斯',
      avatar: '🌋',
      title: '凑十炼金大宗师',
      hp: 3,
      badge: { id: 'badge_math_g1_u8', name: '凑十炼金石', icon: '🪙', desc: '神速凑十，进位加法百发百中' },
      questions: [
        {
          question: '计算 9 + 8 的得数是（ ）。',
          options: ['17', '16', '18', '19'],
          answer: 0,
          explanation: '9 + 1 = 10，10 + 7 = 17。'
        },
        {
          question: '两个最大的加数都是 9，它们的和是（ ）。',
          options: ['18', '19', '17', '81'],
          answer: 0,
          explanation: '9 + 9 = 18。'
        },
        {
          question: '（变种题）原有 6 支彩笔，妈妈又买了 7 支，送给同桌 3 支，还剩（ ）支。',
          options: ['10支', '13支', '9支', '11支'],
          answer: 0,
          explanation: '6 + 7 - 3 = 13 - 3 = 10支。'
        }
      ]
    }
  },

  // ============ 一年级下册 ============
  {
    id: 'unit_9',
    semester: 'lower',
    number: 9,
    name: '认识图形（二）与七巧板',
    theme: '七巧七彩幻境',
    icon: '🧩',
    color: '#6366F1',
    bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    summary: '认识平面图形（长方形、正方形、平行四边形、三角形、圆），探索七巧板拼图',
    knowledge: {
      concept: '“面在体上”：用长方体的面可以画出长方形；用正方体的面可以画出正方形；用圆柱的底面可以画出圆。一套七巧板有 7 块：包含 5 个三角形（2个大三角、1个中三角、2个小三角）、1 个正方形和 1 个平行四边形。',
      tips: '长方体上拓长方形，正方体上拓正方形；七巧板真奇妙，五块三角一正一方形！',
      formula: '两个完全相同的三角形可以拼成一个平行四边形或长方形或正方形',
      examples: [
        '红领巾的表面是【三角形】。',
        '一元硬币的面是【圆】。',
        '国旗的面是【长方形】。'
      ]
    },
    labType: 'shapes2d',
    challenges: [
      {
        id: 'g1_u9_q1',
        question: '一套七巧板一共有（ ）块板。',
        options: ['7块', '5块', '8块', '6块'],
        answer: 0,
        explanation: '七巧板顾名思义有7块。'
      },
      {
        id: 'g1_u9_q2',
        question: '用两个完全一样的正方形，可以拼成一个（ ）。',
        options: ['长方形', '正方形', '圆', '三角形'],
        answer: 0,
        explanation: '两个正方形拼在一起变长，成为长方形。'
      },
      {
        id: 'g1_u9_q3',
        question: '（变种题）在七巧板中，数量最多的一种图形是（ ）。',
        options: ['三角形（有5块）', '正方形', '平行四边形', '圆'],
        answer: 0,
        explanation: '七巧板中有5块三角形（2大、1中、2小）。'
      }
    ],
    boss: {
      name: '七巧神工·鲁班',
      avatar: '📐',
      title: '拼图机关师',
      hp: 3,
      badge: { id: 'badge_math_g1_u9', name: '巧夺天工板', icon: '🪚', desc: '随心拼组千变万化的平面图形' },
      questions: [
        {
          question: '硬币可以在白纸上印出（ ）形。',
          options: ['圆', '正方形', '长方形', '三角形'],
          answer: 0,
          explanation: '硬币上下表面是圆形。'
        },
        {
          question: '红领巾有几个角？',
          options: ['3个角', '4个角', '2个角', '5个角'],
          answer: 0,
          explanation: '红领巾是三角形，有3个角和3条边。'
        },
        {
          question: '（变种题）用至少（ ）个完全相同的小正方形，才能拼成一个更大的正方形。',
          options: ['4个', '2个', '3个', '6个'],
          answer: 0,
          explanation: '2×2 = 4个小正方形才能拼成一个大正方形（2个只能拼成长方形）。'
        }
      ]
    }
  },

  {
    id: 'unit_10',
    semester: 'lower',
    number: 10,
    name: '20以内的退位减法（破十法）',
    theme: '冰晶破壁谷',
    icon: '🧊',
    color: '#06B6D4',
    bgColor: 'linear-gradient(135deg, #22e1ff 0%, #1d8fe1 100%)',
    summary: '掌握“破十法”与“想加算减法”，熟练计算十几减9、8、7、6、5',
    knowledge: {
      concept: '“破十法”是退位减法利器：十几的个位不够减，就把十几拆成 10 和几。先用 10 减去减数，剩下的差再加上个位的几！例如 13 - 9：把 13 分成 10 和 3，10 - 9 = 1，1 + 3 = 4！也可以想加算减：想 9 + (4) = 13，所以 13 - 9 = 4。',
      tips: '退位减法不用愁，破十秘诀显神通；十几拆成十和几，十减去减数加剩零！',
      formula: '十几 - 9 = 几 + 1 | 十几 - 8 = 几 + 2 | 十几 - 7 = 几 + 3 | 十几 - 6 = 几 + 4',
      examples: [
        '15 - 8：把15分成10和5，10 - 8 = 2，2 + 5 = 7。',
        '12 - 7：把12分成10和2，10 - 7 = 3，3 + 2 = 5。'
      ]
    },
    labType: 'breakTen',
    challenges: [
      {
        id: 'g1_u10_q1',
        question: '用破十法计算 14 - 9，第一步用 10 - 9 = 1，第二步是（ ）。',
        options: ['1 + 4 = 5', '1 + 9 = 10', '4 - 1 = 3', '10 + 4 = 14'],
        answer: 0,
        explanation: '破十剩下的1加上原来的个位4，结果是 1 + 4 = 5。'
      },
      {
        id: 'g1_u10_q2',
        question: '想加算减法：想 7 + ( ) = 16，所以 16 - 7 = 9。',
        options: ['9', '8', '7', '10'],
        answer: 0,
        explanation: '因为 7 + 9 = 16，所以 16 - 7 = 9。'
      },
      {
        id: 'g1_u10_q3',
        question: '（变种题）有 12 只小鸡，跑掉了 5 只，还剩多少只？',
        options: ['7只', '8只', '6只', '9只'],
        answer: 0,
        explanation: '12 - 5 = 7只。'
      }
    ],
    boss: {
      name: '极地冰皇·雷格',
      avatar: '❄️',
      title: '寒霜破壁战神',
      hp: 3,
      badge: { id: 'badge_math_g1_u10', name: '破十寒冰锥', icon: '🗡️', desc: '破十秒算十几减几，心算如飞' },
      questions: [
        {
          question: '13 - 6 的结果是（ ）。',
          options: ['7', '8', '6', '9'],
          answer: 0,
          explanation: '10 - 6 = 4，4 + 3 = 7。'
        },
        {
          question: '15 比 8 多（ ）。',
          options: ['7', '8', '9', '6'],
          answer: 0,
          explanation: '求一个数比另一个数多多少用减法：15 - 8 = 7。'
        },
        {
          question: '（变种题）小丽折了 14 只纸鹤，小明折了 9 只，小明还要再折几只才能和小丽同样多？',
          options: ['5只', '6只', '4只', '23只'],
          answer: 0,
          explanation: '14 - 9 = 5只。'
        }
      ]
    }
  },

  {
    id: 'unit_11',
    semester: 'lower',
    number: 11,
    name: '分类与整理',
    theme: '奇趣百宝收纳屋',
    icon: '📦',
    color: '#14B8A6',
    bgColor: 'linear-gradient(135deg, #0ba360 0%, #3cba92 100%)',
    summary: '学会按不同标准（形状/颜色/大小）分类，看懂象形统计图并统计数量',
    knowledge: {
      concept: '分类的标准不同，分类的结果也不同，但物体的【总数是不变】的。分类整理后，可以用简单的象形统计图（由下往上涂格子）或统计表格来呈现数据。',
      tips: '先定标准再归类，相同特征聚一堆；标准虽异总数同，整齐漂亮又分明！',
      formula: '分类原则：标准统一，不重不漏',
      examples: [
        '给气球分类：既可以按【形状】分为心形、圆形，也可以按【颜色】分为红色、黄色。'
      ]
    },
    labType: 'classify',
    challenges: [
      {
        id: 'g1_u11_q1',
        question: '把苹果、香蕉、橡皮、梨放在一起，哪一个不是同一类的？',
        options: ['橡皮（文具类）', '苹果', '香蕉', '梨'],
        answer: 0,
        explanation: '苹果、香蕉、梨都是水果，橡皮是学习用品文具。'
      },
      {
        id: 'g1_u11_q2',
        question: '同一群小朋友，既可以按性别分（男/女），也可以按（ ）分。',
        options: ['年龄或身高', '衣服有无', '书包轻重', '不可再分'],
        answer: 0,
        explanation: '根据实际特征（如年龄、戴不戴眼镜、穿校服等）都可以作为新分类标准。'
      },
      {
        id: 'g1_u11_q3',
        question: '（变种题）不管按什么标准给全班同学分类，全班同学的（ ）永远不变。',
        options: ['总人数', '每组人数', '组数', '名字'],
        answer: 0,
        explanation: '分类方式改变，但总数恒定不变。'
      }
    ],
    boss: {
      name: '收纳大总管·多多',
      avatar: '🦝',
      title: '百宝屋典藏家',
      hp: 3,
      badge: { id: 'badge_math_g1_u11', name: '万象归纳匣', icon: '🗃️', desc: '按序分类条理清晰，数据分析小能手' },
      questions: [
        {
          question: '铅笔、尺子、转笔刀和书包都是（ ）。',
          options: ['文具用品', '水果蔬菜', '体育器材', '家用电器'],
          answer: 0,
          explanation: '它们都是学习常用的文具。'
        },
        {
          question: '把 10 块积木按颜色分成了 3 块红的和 7 块黄的，总数是（ ）。',
          options: ['10块', '4块', '21块', '7块'],
          answer: 0,
          explanation: '3 + 7 = 10块。'
        },
        {
          question: '（变种题）象形统计图中，通常记录数据是（ ）涂方格的。',
          options: ['从下往上', '从上往下', '从左往右', '随意涂'],
          answer: 0,
          explanation: '标准象形统计图习惯由底端基线从下往上依次涂格。'
        }
      ]
    }
  },

  {
    id: 'unit_12',
    semester: 'lower',
    number: 12,
    name: '100以内数的认识',
    theme: '百珠光芒圣殿',
    icon: '💯',
    color: '#8B5CF6',
    bgColor: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    summary: '数数与数的组成，认识百位，读数写数与比较两位数大小',
    knowledge: {
      concept: '10个十是100。数位顺序表：从右边起，第一位是个位，第二位是十位，第三位是【百位】。读数和写数都从【最高位】起。比较大小：先看十位，十位大的数就大；十位相同再看个位。',
      tips: '右起个、十、百三位，十个十是一百倍；高位读起高位写，十位相同比个位！',
      formula: '10个一是十 | 10个十是一百 | 比较大小：十位大则大，十位同看个位',
      examples: [
        '48 读作：四十八；它由 4个十 和 8个一 组成。',
        '比较 53 和 49：5个十大于4个十，所以 53 > 49。'
      ]
    },
    labType: 'placeValue',
    challenges: [
      {
        id: 'g1_u12_q1',
        question: '从右边起，第三位是（ ）。',
        options: ['百位', '十位', '个位', '千位'],
        answer: 0,
        explanation: '右起第一位是个位，第二位是十位，第三位是百位。'
      },
      {
        id: 'g1_u12_q2',
        question: '与 79 相邻的两个数是（ ）。',
        options: ['78 和 80', '77 和 78', '80 和 81', '69 和 89'],
        answer: 0,
        explanation: '79前面的数是78，后面的数是80。'
      },
      {
        id: 'g1_u12_q3',
        question: '（变种题）一个两位数，个位上是 7，十位上是 4，这个数写作（ ）。',
        options: ['47', '74', '11', '407'],
        answer: 0,
        explanation: '十位写在左边，个位写在右边，写作47。'
      }
    ],
    boss: {
      name: '百数星官·百里',
      avatar: '👑',
      title: '百数天幕主宰',
      hp: 3,
      badge: { id: 'badge_math_g1_u12', name: '百数灵珠', icon: '🔮', desc: '透析100以内数位排列与比大小法则' },
      questions: [
        {
          question: '100 是由（ ）个十组成的。',
          options: ['10', '1', '100', '0'],
          answer: 0,
          explanation: '10个十是一百。'
        },
        {
          question: '最大的两位数是（ ），最小的两位数是（ ）。',
          options: ['99，10', '100，10', '99，1', '90，10'],
          answer: 0,
          explanation: '最大两位数是99，最小两位数是10。'
        },
        {
          question: '（变种题）一个两位数，十位和个位上的数字相加得 8，这个两位数最大是（ ）。',
          options: ['80', '71', '88', '44'],
          answer: 0,
          explanation: '要使数最大，十位尽量大，十位取8，个位取0：8 + 0 = 8，所以是80。'
        }
      ]
    }
  },

  {
    id: 'unit_13',
    semester: 'lower',
    number: 13,
    name: '认识人民币（元角分）',
    theme: '欢乐小吃集市街',
    icon: '💴',
    color: '#F59E0B',
    bgColor: 'linear-gradient(135deg, #f9d423 0%, #ff4e50 100%)',
    summary: '认识各种面值人民币，掌握元、角、分的十进制进率与购物计算',
    knowledge: {
      concept: '人民币的单位有【元】、【角】、【分】。最大的是元，最小的是分。爱护人民币是每个公民的责任。1元可以换10个1角，1角可以换10个1分。',
      tips: '元角分是好朋友，相邻进率都是十；一元等于十个角，一角等于十分值！',
      formula: '1元 = 10角 | 1角 = 10分 | 1元 = 100分',
      examples: [
        '买一支铅笔 8 角，买一块橡皮 5 角，一共 8 + 5 = 13角 = 1元3角。',
        '拿 10 元钱买 6 元的故事书，应找回 10 - 6 = 4 元。'
      ]
    },
    labType: 'money',
    challenges: [
      {
        id: 'g1_u13_q1',
        question: '3 元 = （ ）角。',
        options: ['30', '3', '300', '13'],
        answer: 0,
        explanation: '因为 1元 = 10角，所以 3元 = 30角。'
      },
      {
        id: 'g1_u13_q2',
        question: '小明买了一根棒棒糖花去 5 角，他付了 1 元，应找回（ ）。',
        options: ['5角', '5元', '1元5角', '15角'],
        answer: 0,
        explanation: '1元 = 10角，10角 - 5角 = 5角。'
      },
      {
        id: 'g1_u13_q3',
        question: '（变种题）一张 50 元可以换（ ）张 10 元。',
        options: ['5张', '10张', '2张', '50张'],
        answer: 0,
        explanation: '50里面有5个10，所以可以换5张10元。'
      }
    ],
    boss: {
      name: '市集银库掌柜·金算盘',
      avatar: '💰',
      title: '集市商会总账目',
      hp: 3,
      badge: { id: 'badge_math_g1_u13', name: '金玉银钱袋', icon: '🪙', desc: '精明买卖零找零，元角分转换得心应手' },
      questions: [
        {
          question: '人民币最小的单位是（ ）。',
          options: ['分', '角', '元', '百元'],
          answer: 0,
          explanation: '人民币单位由大到小是：元、角、分。'
        },
        {
          question: '1 张 100 元可以换（ ）张 20 元。',
          options: ['5张', '2张', '10张', '4张'],
          answer: 0,
          explanation: '20 × 5 = 100，可换5张。'
        },
        {
          question: '（变种题）买一本 8 元的字帖，付了 10 元，找回 2 张 1 元，店员找得对吗？',
          options: ['对的，找回2元', '不对，找多了', '不对，找少了', '无法计算'],
          answer: 0,
          explanation: '10 - 8 = 2元，2张1元正好是2元，正确。'
        }
      ]
    }
  },

  {
    id: 'unit_14',
    semester: 'lower',
    number: 14,
    name: '100以内的加法和减法（一）',
    theme: '青铜试炼殿',
    icon: '➕',
    color: '#059669',
    bgColor: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    summary: '整十数加减整十数、两位数加减一位数（进位与退位初步），认识小括号',
    knowledge: {
      concept: '整十数加减整十数，就是几个十加减几个十。一个算式里有【小括号()】的，要先算小括号里面的！相同数位上的数才能直接相加减（个位加个位，十位加十位）。',
      tips: '整十相加减，十位算个完，末尾添个零；遇到小括号，先算括号里！',
      formula: '有括号先算括号：a + (b - c) 先算 (b - c) | 两位数加一位数：个位相加满十向十位进一',
      examples: [
        '30 + 20 = 50（3个十加2个十得5个十）',
        '25 + 2 = 27（个位5+2=7），25 + 20 = 45（十位2+2=4）',
        '10 - (2 + 3) = 10 - 5 = 5'
      ]
    },
    labType: 'arithmetic',
    challenges: [
      {
        id: 'g1_u14_q1',
        question: '计算 14 - (6 + 2) 的运算顺序是（ ）。',
        options: ['先算小括号里的 6+2=8', '先算 14-6', '从左往右算', '随便先算哪个'],
        answer: 0,
        explanation: '有小括号的算式，要先算小括号里面的。'
      },
      {
        id: 'g1_u14_q2',
        question: '计算 36 + 20 的结果是（ ）。',
        options: ['56', '38', '58', '66'],
        answer: 0,
        explanation: '3个十加2个十是5个十，个位还是6，得56。'
      },
      {
        id: 'g1_u14_q3',
        question: '（变种题）计算 28 + 5，个位 8 + 5 满十进一，十位变成（ ）。',
        options: ['3，结果是33', '2，结果是23', '3，结果是35', '4，结果是43'],
        answer: 0,
        explanation: '8+5=13，十位2加进位1变成3，结果33。'
      }
    ],
    boss: {
      name: '青铜守备将·泰坦',
      avatar: '🛡️',
      title: '青铜试炼长',
      hp: 3,
      badge: { id: 'badge_math_g1_u14', name: '小括号灵符', icon: '📜', desc: '精准辨别计算顺序，小括号先算无失误' },
      questions: [
        {
          question: '50 - 30 的得数是（ ）。',
          options: ['20', '80', '30', '10'],
          answer: 0,
          explanation: '5个十减3个十得2个十，即20。'
        },
        {
          question: '算式 18 - (9 - 3) 的计算结果是（ ）。',
          options: ['12', '6', '15', '10'],
          answer: 0,
          explanation: '先算括号 9-3=6，再算 18-6=12。'
        },
        {
          question: '（变种题）书架上有 45 本童话书，借走 20 本，又还回 5 本，现在有（ ）本。',
          options: ['30本', '25本', '35本', '40本'],
          answer: 0,
          explanation: '45 - 20 + 5 = 25 + 5 = 30本。'
        }
      ]
    }
  },

  {
    id: 'unit_15',
    semester: 'lower',
    number: 15,
    name: '找规律',
    theme: '星空霓虹迷宫',
    icon: '✨',
    color: '#EC4899',
    bgColor: 'linear-gradient(135deg, #f77062 0%, #fe5196 100%)',
    summary: '发现图形与数字循环、递增、递减的排列规律，学会接着往下画/填',
    knowledge: {
      concept: '规律是指事物按照一定的顺序不断重复出现。找规律时，通常先圈出一组重复的部分（这叫一组规律），再看后面是不是也按照这样重复。数字规律要注意相邻两个数的差是多少。',
      tips: '找准一组重复瞧，圈出规律不会跑；数字相差几加减，顺藤摸瓜填得巧！',
      formula: '周期重复规律：以一组为循环单元 | 等差规律：每次多几或每次少几',
      examples: [
        '⚪⚫⚪⚫⚪⚫，接下来是【⚪】（一组是⚪⚫）。',
        '2、4、6、8、（10）：每次都比前一个数多2。'
      ]
    },
    labType: 'patterns',
    challenges: [
      {
        id: 'g1_u15_q1',
        question: '按规律填数：3、6、9、12、（ ）。',
        options: ['15', '14', '16', '13'],
        answer: 0,
        explanation: '每次都增加3：12 + 3 = 15。'
      },
      {
        id: 'g1_u15_q2',
        question: '观察图形规律：▲●●▲●●▲●●，接下来应该画（ ）。',
        options: ['▲', '●', '■', '★'],
        answer: 0,
        explanation: '重复的周期是“▲●●”，一组结束后接着是▲。'
      },
      {
        id: 'g1_u15_q3',
        question: '（变种题）按规律填数：20、16、12、8、（ ）。',
        options: ['4', '6', '5', '0'],
        answer: 0,
        explanation: '每次都减少4：8 - 4 = 4。'
      }
    ],
    boss: {
      name: '极光幻术师·诺瓦',
      avatar: '🌌',
      title: '规律星轨领主',
      hp: 3,
      badge: { id: 'badge_math_g1_u15', name: '万律天机镜', icon: '🪞', desc: '洞悉一年级数学全部图形与数字玄机' },
      questions: [
        {
          question: '找规律填数：1、2、4、7、（ ）。',
          options: ['11', '10', '12', '9'],
          answer: 0,
          explanation: '差在递增：+1, +2, +3, +4，7 + 4 = 11。'
        },
        {
          question: '一串彩旗按“2面红、1面黄、2面红、1面黄”排列，第7面彩旗是（ ）色。',
          options: ['红', '黄', '蓝', '绿'],
          answer: 0,
          explanation: '3面一组（红红黄），前6面正好是两组，第7面是新一组的第一面，为红色。'
        },
        {
          question: '（变种题）仔细观察：5, 10, 15, 20, ( ), 30，括号里应填（ ）。',
          options: ['25', '24', '26', '22'],
          answer: 0,
          explanation: '每次加5，20 + 5 = 25。'
        }
      ]
    }
  }
];
