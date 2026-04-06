
// 古建筑信息增强脚本
// 使用说明：在浏览器控制台运行，或使用Node.js + axios + cheerio

const buildingsToEnhance = [
  {
    "id": 5091,
    "name": "山西省灵石县静升镇",
    "province": "山西省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      111.8680468045748,
      36.89460612448929
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "山西省灵石县静升镇 山西省 古建筑 历史 朝代 年代",
    "keywords": [
      "山西"
    ]
  },
  {
    "id": 5092,
    "name": "江苏省昆山市周庄镇",
    "province": "江苏省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      120.8356319437256,
      31.13199650401059
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "江苏省昆山市周庄镇 江苏省 古建筑 历史 朝代 年代",
    "keywords": [
      "江苏"
    ]
  },
  {
    "id": 5093,
    "name": "江苏省吴江市同里镇",
    "province": "江苏省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      120.7186711465116,
      31.15184425794337
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "江苏省吴江市同里镇 江苏省 古建筑 历史 朝代 年代",
    "keywords": [
      "江苏"
    ]
  },
  {
    "id": 5094,
    "name": "江苏省苏州市吴中区甪直镇",
    "province": "江苏省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      120.8218793356102,
      31.2427186628057
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "江苏省苏州市吴中区甪直镇 江苏省 古建筑 历史 朝代 年代",
    "keywords": [
      "江苏"
    ]
  },
  {
    "id": 5095,
    "name": "浙江省嘉善县西塘镇",
    "province": "浙江省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      120.8771720862904,
      30.96262096574705
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "浙江省嘉善县西塘镇 浙江省 古建筑 历史 朝代 年代",
    "keywords": [
      "浙江"
    ]
  },
  {
    "id": 5096,
    "name": "浙江省桐乡市乌镇",
    "province": "浙江省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      120.4921383728354,
      30.73901342226975
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "浙江省桐乡市乌镇 浙江省 古建筑 历史 朝代 年代",
    "keywords": [
      "浙江"
    ]
  },
  {
    "id": 5097,
    "name": "福建省上杭县古田镇",
    "province": "福建省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      116.8191413600142,
      25.22644594225077
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "福建省上杭县古田镇 福建省 古建筑 历史 朝代 年代",
    "keywords": [
      "福建"
    ]
  },
  {
    "id": 5098,
    "name": "重庆市合川县涞滩镇",
    "province": "重庆市",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      106.467381106368,
      30.15992131428173
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "重庆市合川县涞滩镇 重庆市 古建筑 历史 朝代 年代",
    "keywords": [
      "重庆"
    ]
  },
  {
    "id": 5099,
    "name": "重庆市石柱县西沱镇",
    "province": "重庆市",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      108.2100016945724,
      30.40187253180629
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "重庆市石柱县西沱镇 重庆市 古建筑 历史 朝代 年代",
    "keywords": [
      "重庆"
    ]
  },
  {
    "id": 5100,
    "name": "重庆市潼南县双江镇",
    "province": "重庆市",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      105.7433394785391,
      30.21910435709625
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "重庆市潼南县双江镇 重庆市 古建筑 历史 朝代 年代",
    "keywords": [
      "重庆"
    ]
  },
  {
    "id": 5101,
    "name": "河北省蔚县暖泉镇",
    "province": "河北省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      114.4451036344638,
      39.80810113203847
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "河北省蔚县暖泉镇 河北省 古建筑 历史 朝代 年代",
    "keywords": [
      "河北"
    ]
  },
  {
    "id": 5102,
    "name": "山西省临县碛口镇",
    "province": "山西省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      110.792144499239,
      37.64125184628732
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "山西省临县碛口镇 山西省 古建筑 历史 朝代 年代",
    "keywords": [
      "山西"
    ]
  },
  {
    "id": 5103,
    "name": "辽宁省新宾满族自治县永陵镇",
    "province": "辽宁省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      124.8266383713113,
      41.70902107400154
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "辽宁省新宾满族自治县永陵镇 辽宁省 古建筑 历史 朝代 年代",
    "keywords": [
      "陵",
      "辽宁"
    ]
  },
  {
    "id": 5104,
    "name": "上海市金山区枫泾镇",
    "province": "上海市",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      121.0059853502204,
      30.89055497698215
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "上海市金山区枫泾镇 上海市 古建筑 历史 朝代 年代",
    "keywords": [
      "上海"
    ]
  },
  {
    "id": 5105,
    "name": "江苏省苏州市吴中区木渎镇",
    "province": "江苏省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      120.5116320422328,
      31.2601432414229
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "江苏省苏州市吴中区木渎镇 江苏省 古建筑 历史 朝代 年代",
    "keywords": [
      "江苏"
    ]
  },
  {
    "id": 5106,
    "name": "江苏省太仓市沙溪镇",
    "province": "江苏省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      121.0718659390485,
      31.55744699867325
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "江苏省太仓市沙溪镇 江苏省 古建筑 历史 朝代 年代",
    "keywords": [
      "江苏"
    ]
  },
  {
    "id": 5107,
    "name": "江苏省姜堰市溱潼镇",
    "province": "江苏省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      120.0774604807994,
      32.6444031111504
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "江苏省姜堰市溱潼镇 江苏省 古建筑 历史 朝代 年代",
    "keywords": [
      "江苏"
    ]
  },
  {
    "id": 5108,
    "name": "江苏省泰兴市黄桥镇",
    "province": "江苏省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      120.2417475484822,
      32.2444571640641
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "江苏省泰兴市黄桥镇 江苏省 古建筑 历史 朝代 年代",
    "keywords": [
      "桥",
      "江苏"
    ]
  },
  {
    "id": 5109,
    "name": "浙江省湖州市南浔区南浔镇",
    "province": "浙江省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      120.4133975544517,
      30.8519560621762
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "浙江省湖州市南浔区南浔镇 浙江省 古建筑 历史 朝代 年代",
    "keywords": [
      "浙江"
    ]
  },
  {
    "id": 5110,
    "name": "浙江省绍兴县安昌镇",
    "province": "浙江省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      120.4404941282061,
      30.07541460257491
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "浙江省绍兴县安昌镇 浙江省 古建筑 历史 朝代 年代",
    "keywords": [
      "浙江"
    ]
  },
  {
    "id": 5111,
    "name": "浙江省宁波市江北区慈城镇",
    "province": "浙江省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      121.445555177333,
      29.98041737560255
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "浙江省宁波市江北区慈城镇 浙江省 古建筑 历史 朝代 年代",
    "keywords": [
      "城",
      "浙江"
    ]
  },
  {
    "id": 5112,
    "name": "浙江省象山县石浦镇",
    "province": "浙江省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      121.9274357961867,
      29.20632318328008
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "浙江省象山县石浦镇 浙江省 古建筑 历史 朝代 年代",
    "keywords": [
      "浙江"
    ]
  },
  {
    "id": 5113,
    "name": "福建省邵武市和平镇",
    "province": "福建省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      117.2971859726732,
      27.16181066721886
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "福建省邵武市和平镇 福建省 古建筑 历史 朝代 年代",
    "keywords": [
      "福建"
    ]
  },
  {
    "id": 5114,
    "name": "江西省浮梁县瑶里镇",
    "province": "江西省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      117.5681970214932,
      29.532315737697
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "江西省浮梁县瑶里镇 江西省 古建筑 历史 朝代 年代",
    "keywords": [
      "江西"
    ]
  },
  {
    "id": 5115,
    "name": "河南省禹州市神垕镇",
    "province": "河南省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      113.2237461437165,
      34.12374909704639
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "河南省禹州市神垕镇 河南省 古建筑 历史 朝代 年代",
    "keywords": [
      "河南"
    ]
  },
  {
    "id": 5116,
    "name": "河南省淅川县荆紫关镇",
    "province": "河南省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      111.0192689103008,
      33.24537349360114
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "河南省淅川县荆紫关镇 河南省 古建筑 历史 朝代 年代",
    "keywords": [
      "河南"
    ]
  },
  {
    "id": 5117,
    "name": "湖北省监利县周老嘴镇",
    "province": "湖北省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      112.9791503873859,
      30.03649739085972
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "湖北省监利县周老嘴镇 湖北省 古建筑 历史 朝代 年代",
    "keywords": [
      "湖北"
    ]
  },
  {
    "id": 5118,
    "name": "湖北省红安县七里坪镇",
    "province": "湖北省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      114.6488518448136,
      31.46397183894051
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "湖北省红安县七里坪镇 湖北省 古建筑 历史 朝代 年代",
    "keywords": [
      "湖北"
    ]
  },
  {
    "id": 5119,
    "name": "湖南省龙山县里耶镇",
    "province": "湖南省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      109.2948544427801,
      28.78877024167626
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "湖南省龙山县里耶镇 湖南省 古建筑 历史 朝代 年代",
    "keywords": [
      "湖南"
    ]
  },
  {
    "id": 5120,
    "name": "广东省广州市番禺区沙湾镇",
    "province": "广东省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      113.3784937975131,
      22.94018287205919
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "广东省广州市番禺区沙湾镇 广东省 古建筑 历史 朝代 年代",
    "keywords": [
      "广东"
    ]
  },
  {
    "id": 5121,
    "name": "广东省吴川市吴阳镇",
    "province": "广东省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      110.6877100999462,
      21.34960905848011
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "广东省吴川市吴阳镇 广东省 古建筑 历史 朝代 年代",
    "keywords": [
      "广东"
    ]
  },
  {
    "id": 5122,
    "name": "广西灵川县大圩镇",
    "province": "广西壮族自治区",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      110.4185942904278,
      25.18838631809545
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "广西灵川县大圩镇 广西壮族自治区 古建筑 历史 朝代 年代",
    "keywords": [
      "广西"
    ]
  },
  {
    "id": 5123,
    "name": "重庆市渝北区龙兴镇",
    "province": "重庆市",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      106.7912243330034,
      29.69895084606657
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "重庆市渝北区龙兴镇 重庆市 古建筑 历史 朝代 年代",
    "keywords": [
      "重庆"
    ]
  },
  {
    "id": 5124,
    "name": "重庆市江津市中山镇",
    "province": "重庆市",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      106.3328004367096,
      28.8583992100053
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "重庆市江津市中山镇 重庆市 古建筑 历史 朝代 年代",
    "keywords": [
      "重庆"
    ]
  },
  {
    "id": 5125,
    "name": "重庆市酉阳县龙潭镇",
    "province": "重庆市",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      107.101509568581,
      29.44662859406727
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "重庆市酉阳县龙潭镇 重庆市 古建筑 历史 朝代 年代",
    "keywords": [
      "重庆"
    ]
  },
  {
    "id": 5126,
    "name": "四川省邛崃市平乐镇",
    "province": "四川省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      103.3347655485781,
      30.34553032556391
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "四川省邛崃市平乐镇 四川省 古建筑 历史 朝代 年代",
    "keywords": [
      "四川"
    ]
  },
  {
    "id": 5127,
    "name": "四川省大邑县安仁镇",
    "province": "四川省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      103.6141445381525,
      30.51686102663697
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "四川省大邑县安仁镇 四川省 古建筑 历史 朝代 年代",
    "keywords": [
      "四川"
    ]
  },
  {
    "id": 5128,
    "name": "四川省阆中市老观镇",
    "province": "四川省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      106.1660145694945,
      31.74962286717702
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "四川省阆中市老观镇 四川省 古建筑 历史 朝代 年代",
    "keywords": [
      "观",
      "四川"
    ]
  },
  {
    "id": 5129,
    "name": "四川省宜宾市翠屏区李庄镇",
    "province": "四川省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      104.8029276416676,
      28.77819684075997
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "四川省宜宾市翠屏区李庄镇 四川省 古建筑 历史 朝代 年代",
    "keywords": [
      "四川"
    ]
  },
  {
    "id": 5130,
    "name": "贵州省贵阳市花溪区青岩镇",
    "province": "贵州省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      106.7177453910931,
      26.29483718229552
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "贵州省贵阳市花溪区青岩镇 贵州省 古建筑 历史 朝代 年代",
    "keywords": [
      "贵州"
    ]
  },
  {
    "id": 5131,
    "name": "贵州省习水县土城镇",
    "province": "贵州省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      106.0043795585084,
      28.2665868896556
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "贵州省习水县土城镇 贵州省 古建筑 历史 朝代 年代",
    "keywords": [
      "城",
      "贵州"
    ]
  },
  {
    "id": 5132,
    "name": "云南省禄丰县黑井镇",
    "province": "云南省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      101.7441572096921,
      25.37273615257296
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "云南省禄丰县黑井镇 云南省 古建筑 历史 朝代 年代",
    "keywords": [
      "云南"
    ]
  },
  {
    "id": 5133,
    "name": "甘肃省宕昌县哈达铺镇",
    "province": "甘肃省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      104.2258040515744,
      34.22850404151836
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "甘肃省宕昌县哈达铺镇 甘肃省 古建筑 历史 朝代 年代",
    "keywords": [
      "甘肃"
    ]
  },
  {
    "id": 5134,
    "name": "新疆鄯善县鲁克沁镇",
    "province": "新疆维吾尔自治区",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      89.75812425890341,
      42.74673776469613
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "新疆鄯善县鲁克沁镇 新疆维吾尔自治区 古建筑 历史 朝代 年代",
    "keywords": [
      "新疆"
    ]
  },
  {
    "id": 5135,
    "name": "河北省永年县广府镇",
    "province": "河北省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      114.7303727306803,
      36.71234019592228
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "河北省永年县广府镇 河北省 古建筑 历史 朝代 年代",
    "keywords": [
      "府",
      "河北"
    ]
  },
  {
    "id": 5136,
    "name": "山西省襄汾县汾城镇",
    "province": "山西省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      111.2744522654478,
      35.81886338970959
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "山西省襄汾县汾城镇 山西省 古建筑 历史 朝代 年代",
    "keywords": [
      "城",
      "山西"
    ]
  },
  {
    "id": 5137,
    "name": "山西省平定县娘子关镇",
    "province": "山西省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      113.8682969263806,
      37.96019355067634
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "山西省平定县娘子关镇 山西省 古建筑 历史 朝代 年代",
    "keywords": [
      "山西"
    ]
  },
  {
    "id": 5138,
    "name": "黑龙江省海林市横道河子镇",
    "province": "黑龙江省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      129.3735684924249,
      44.5914092627628
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "黑龙江省海林市横道河子镇 黑龙江省 古建筑 历史 朝代 年代",
    "keywords": [
      "黑龙江"
    ]
  },
  {
    "id": 5139,
    "name": "上海市青浦区朱家角镇",
    "province": "上海市",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      121.0419786281566,
      31.10561570259187
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "上海市青浦区朱家角镇 上海市 古建筑 历史 朝代 年代",
    "keywords": [
      "上海"
    ]
  },
  {
    "id": 5140,
    "name": "江苏省高淳县淳溪镇",
    "province": "江苏省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      118.8870411401556,
      31.3298004785382
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "江苏省高淳县淳溪镇 江苏省 古建筑 历史 朝代 年代",
    "keywords": [
      "江苏"
    ]
  },
  {
    "id": 5141,
    "name": "江苏省昆山市千灯镇",
    "province": "江苏省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      121.0208777005693,
      31.25735874052624
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "江苏省昆山市千灯镇 江苏省 古建筑 历史 朝代 年代",
    "keywords": [
      "江苏"
    ]
  },
  {
    "id": 5142,
    "name": "江苏省东台市安丰镇",
    "province": "江苏省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      120.3971837097732,
      32.73717750378367
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "江苏省东台市安丰镇 江苏省 古建筑 历史 朝代 年代",
    "keywords": [
      "江苏"
    ]
  },
  {
    "id": 5143,
    "name": "浙江省绍兴市越城区东浦镇",
    "province": "浙江省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      120.5779231296532,
      29.9917381639487
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "浙江省绍兴市越城区东浦镇 浙江省 古建筑 历史 朝代 年代",
    "keywords": [
      "城",
      "浙江"
    ]
  },
  {
    "id": 5144,
    "name": "浙江省宁海县前童镇",
    "province": "浙江省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      121.3439591485963,
      29.23107732268855
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "浙江省宁海县前童镇 浙江省 古建筑 历史 朝代 年代",
    "keywords": [
      "浙江"
    ]
  },
  {
    "id": 5145,
    "name": "浙江省义乌市佛堂镇",
    "province": "浙江省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      120.0126521443498,
      29.19898780488824
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "浙江省义乌市佛堂镇 浙江省 古建筑 历史 朝代 年代",
    "keywords": [
      "浙江"
    ]
  },
  {
    "id": 5146,
    "name": "浙江省江山市廿八都镇",
    "province": "浙江省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      118.4811340782847,
      28.30038156221583
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "浙江省江山市廿八都镇 浙江省 古建筑 历史 朝代 年代",
    "keywords": [
      "浙江"
    ]
  },
  {
    "id": 5147,
    "name": "安徽省肥西县三河镇",
    "province": "安徽省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      117.2460488639717,
      31.51692869626591
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "安徽省肥西县三河镇 安徽省 古建筑 历史 朝代 年代",
    "keywords": [
      "安徽"
    ]
  },
  {
    "id": 5148,
    "name": "安徽省六安市金安区毛坦厂镇",
    "province": "安徽省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      116.5631681988314,
      31.35117215437301
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "安徽省六安市金安区毛坦厂镇 安徽省 古建筑 历史 朝代 年代",
    "keywords": [
      "安徽"
    ]
  },
  {
    "id": 5149,
    "name": "江西省鹰潭市龙虎山风景区上清镇",
    "province": "江西省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      117.030556687623,
      28.0482503010521
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "江西省鹰潭市龙虎山风景区上清镇 江西省 古建筑 历史 朝代 年代",
    "keywords": [
      "江西"
    ]
  },
  {
    "id": 5150,
    "name": "河南省社旗县赊店镇",
    "province": "河南省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      112.9415171342971,
      33.05492613658761
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "河南省社旗县赊店镇 河南省 古建筑 历史 朝代 年代",
    "keywords": [
      "河南"
    ]
  },
  {
    "id": 5151,
    "name": "湖北省洪湖市瞿家湾镇",
    "province": "湖北省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      113.1886780089716,
      29.96614723277089
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "湖北省洪湖市瞿家湾镇 湖北省 古建筑 历史 朝代 年代",
    "keywords": [
      "湖北"
    ]
  },
  {
    "id": 5152,
    "name": "湖北省监利县程集镇",
    "province": "湖北省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      112.6389252527046,
      29.93993109010812
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "湖北省监利县程集镇 湖北省 古建筑 历史 朝代 年代",
    "keywords": [
      "湖北"
    ]
  },
  {
    "id": 5153,
    "name": "湖北省郧西县上津镇",
    "province": "湖北省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      110.0386184328131,
      33.1443106820219
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "湖北省郧西县上津镇 湖北省 古建筑 历史 朝代 年代",
    "keywords": [
      "湖北"
    ]
  },
  {
    "id": 5154,
    "name": "广东省开平市赤坎镇",
    "province": "广东省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      112.5735639180536,
      22.33000744694463
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "广东省开平市赤坎镇 广东省 古建筑 历史 朝代 年代",
    "keywords": [
      "广东"
    ]
  },
  {
    "id": 5155,
    "name": "广东省珠海市唐家湾镇",
    "province": "广东省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      113.5922228619702,
      22.35649335730346
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "广东省珠海市唐家湾镇 广东省 古建筑 历史 朝代 年代",
    "keywords": [
      "广东"
    ]
  },
  {
    "id": 5156,
    "name": "广东省陆丰市碣石镇",
    "province": "广东省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      115.825956888619,
      22.82041001463944
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "广东省陆丰市碣石镇 广东省 古建筑 历史 朝代 年代",
    "keywords": [
      "广东"
    ]
  },
  {
    "id": 5157,
    "name": "广西壮族自治区昭平县黄姚镇",
    "province": "广西壮族自治区",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      111.194619681993,
      24.25124022875936
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "广西壮族自治区昭平县黄姚镇 广西壮族自治区 古建筑 历史 朝代 年代",
    "keywords": [
      "广西"
    ]
  },
  {
    "id": 5158,
    "name": "广西壮族自治区阳朔县兴坪镇",
    "province": "广西壮族自治区",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      110.5510959228834,
      24.95535498531762
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "广西壮族自治区阳朔县兴坪镇 广西壮族自治区 古建筑 历史 朝代 年代",
    "keywords": [
      "广西"
    ]
  },
  {
    "id": 5159,
    "name": "海南省三亚市崖城镇",
    "province": "海南省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      109.5079162754885,
      18.25470504970178
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "海南省三亚市崖城镇 海南省 古建筑 历史 朝代 年代",
    "keywords": [
      "城",
      "海南"
    ]
  },
  {
    "id": 5160,
    "name": "重庆市北碚区金刀峡镇",
    "province": "重庆市",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      106.6527332222787,
      30.00234561015461
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "重庆市北碚区金刀峡镇 重庆市 古建筑 历史 朝代 年代",
    "keywords": [
      "重庆"
    ]
  },
  {
    "id": 5161,
    "name": "重庆市江津市塘河镇",
    "province": "重庆市",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      106.0470391003797,
      28.95858708320764
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "重庆市江津市塘河镇 重庆市 古建筑 历史 朝代 年代",
    "keywords": [
      "重庆"
    ]
  },
  {
    "id": 5162,
    "name": "重庆市綦江县东溪镇",
    "province": "重庆市",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      106.6553449934599,
      28.76781805112518
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "重庆市綦江县东溪镇 重庆市 古建筑 历史 朝代 年代",
    "keywords": [
      "重庆"
    ]
  },
  {
    "id": 5163,
    "name": "四川省双流县黄龙溪镇",
    "province": "四川省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      103.9834040634008,
      30.33264716207522
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "四川省双流县黄龙溪镇 四川省 古建筑 历史 朝代 年代",
    "keywords": [
      "四川"
    ]
  },
  {
    "id": 5164,
    "name": "四川省自贡市沿滩区仙市镇",
    "province": "四川省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      104.865949430191,
      29.3531392730752
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "四川省自贡市沿滩区仙市镇 四川省 古建筑 历史 朝代 年代",
    "keywords": [
      "四川"
    ]
  },
  {
    "id": 5165,
    "name": "四川省合江县尧坝镇",
    "province": "四川省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      105.6351241168482,
      28.75222827483161
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "四川省合江县尧坝镇 四川省 古建筑 历史 朝代 年代",
    "keywords": [
      "四川"
    ]
  },
  {
    "id": 5166,
    "name": "四川省古蔺县太平镇",
    "province": "四川省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      106.0745175102068,
      28.11582729430764
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "四川省古蔺县太平镇 四川省 古建筑 历史 朝代 年代",
    "keywords": [
      "四川"
    ]
  },
  {
    "id": 5167,
    "name": "贵州省黄平县旧州镇",
    "province": "贵州省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      107.7795517814002,
      26.99406516980443
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "贵州省黄平县旧州镇 贵州省 古建筑 历史 朝代 年代",
    "keywords": [
      "贵州"
    ]
  },
  {
    "id": 5168,
    "name": "贵州省雷山县西江镇",
    "province": "贵州省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      108.1690053082824,
      26.49703392386069
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "贵州省雷山县西江镇 贵州省 古建筑 历史 朝代 年代",
    "keywords": [
      "贵州"
    ]
  },
  {
    "id": 5169,
    "name": "云南省剑川县沙溪镇",
    "province": "云南省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      99.84545837450518,
      26.31742917820934
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "云南省剑川县沙溪镇 云南省 古建筑 历史 朝代 年代",
    "keywords": [
      "云南"
    ]
  },
  {
    "id": 5170,
    "name": "云南省腾冲县和顺镇",
    "province": "云南省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      98.44733819548784,
      25.02127764282787
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "云南省腾冲县和顺镇 云南省 古建筑 历史 朝代 年代",
    "keywords": [
      "云南"
    ]
  },
  {
    "id": 5171,
    "name": "西藏自治区乃东县昌珠镇",
    "province": "西藏自治区",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      91.7715090293692,
      29.1901991122524
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "西藏自治区乃东县昌珠镇 西藏自治区 古建筑 历史 朝代 年代",
    "keywords": [
      "西藏"
    ]
  },
  {
    "id": 5172,
    "name": "甘肃省榆中县青城镇",
    "province": "甘肃省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      104.1858798733221,
      36.32750324331013
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "甘肃省榆中县青城镇 甘肃省 古建筑 历史 朝代 年代",
    "keywords": [
      "城",
      "甘肃"
    ]
  },
  {
    "id": 5173,
    "name": "甘肃省永登县连城镇",
    "province": "甘肃省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      102.8461013603776,
      36.58668239004998
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "甘肃省永登县连城镇 甘肃省 古建筑 历史 朝代 年代",
    "keywords": [
      "城",
      "甘肃"
    ]
  },
  {
    "id": 5174,
    "name": "甘肃省古浪县大靖镇",
    "province": "甘肃省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      103.4207296527086,
      37.48620894812429
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "甘肃省古浪县大靖镇 甘肃省 古建筑 历史 朝代 年代",
    "keywords": [
      "甘肃"
    ]
  },
  {
    "id": 5175,
    "name": "新疆维吾尔自治区霍城县惠远镇",
    "province": "新疆维吾尔自治区",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      80.90477819397215,
      43.99272890725403
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "新疆维吾尔自治区霍城县惠远镇 新疆维吾尔自治区 古建筑 历史 朝代 年代",
    "keywords": [
      "城",
      "新疆"
    ]
  },
  {
    "id": 5176,
    "name": "北京市密云县古北口镇",
    "province": "北京市",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      117.1844039243213,
      40.66443051580419
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "北京市密云县古北口镇 北京市 古建筑 历史 朝代 年代",
    "keywords": [
      "北京"
    ]
  },
  {
    "id": 5177,
    "name": "天津市西青区杨柳青镇",
    "province": "天津市",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      117.0090199397527,
      39.12735857198711
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "天津市西青区杨柳青镇 天津市 古建筑 历史 朝代 年代",
    "keywords": [
      "天津"
    ]
  },
  {
    "id": 5178,
    "name": "河北省邯郸市峰峰矿区大社镇",
    "province": "河北省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      114.2353454074903,
      36.54759816163808
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "河北省邯郸市峰峰矿区大社镇 河北省 古建筑 历史 朝代 年代",
    "keywords": [
      "河北"
    ]
  },
  {
    "id": 5179,
    "name": "河北省井陉县天长镇",
    "province": "河北省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      114.0170445544079,
      37.99168534372112
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "河北省井陉县天长镇 河北省 古建筑 历史 朝代 年代",
    "keywords": [
      "河北"
    ]
  },
  {
    "id": 5180,
    "name": "山西省泽州县大阳镇",
    "province": "山西省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      112.7918324486474,
      35.6644243884087
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "山西省泽州县大阳镇 山西省 古建筑 历史 朝代 年代",
    "keywords": [
      "山西"
    ]
  },
  {
    "id": 5181,
    "name": "内蒙古自治区喀喇沁旗王爷府镇",
    "province": "内蒙古自治区",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      118.5026566374783,
      41.81093913366556
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "内蒙古自治区喀喇沁旗王爷府镇 内蒙古自治区 古建筑 历史 朝代 年代",
    "keywords": [
      "府",
      "内蒙古"
    ]
  },
  {
    "id": 5182,
    "name": "内蒙古自治区多伦县多伦淖尔镇",
    "province": "内蒙古自治区",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      116.4791835149222,
      42.20135639474108
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "内蒙古自治区多伦县多伦淖尔镇 内蒙古自治区 古建筑 历史 朝代 年代",
    "keywords": [
      "内蒙古"
    ]
  },
  {
    "id": 5183,
    "name": "辽宁省海城市牛庄镇",
    "province": "辽宁省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      122.5310411964901,
      40.94705038264692
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "辽宁省海城市牛庄镇 辽宁省 古建筑 历史 朝代 年代",
    "keywords": [
      "城",
      "辽宁"
    ]
  },
  {
    "id": 5184,
    "name": "吉林省四平市铁东区叶赫镇",
    "province": "吉林省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      124.403733919692,
      43.15937468800389
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "吉林省四平市铁东区叶赫镇 吉林省 古建筑 历史 朝代 年代",
    "keywords": [
      "吉林"
    ]
  },
  {
    "id": 5185,
    "name": "吉林省吉林市龙潭区乌拉街镇",
    "province": "吉林省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      126.5563316625443,
      43.90830952405119
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "吉林省吉林市龙潭区乌拉街镇 吉林省 古建筑 历史 朝代 年代",
    "keywords": [
      "吉林"
    ]
  },
  {
    "id": 5186,
    "name": "黑龙江省黑河市爱辉镇",
    "province": "黑龙江省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      127.5026075328492,
      50.07929065520727
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "黑龙江省黑河市爱辉镇 黑龙江省 古建筑 历史 朝代 年代",
    "keywords": [
      "黑龙江"
    ]
  },
  {
    "id": 5187,
    "name": "上海市南汇区新场镇",
    "province": "上海市",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      121.6467421143602,
      31.04389068199687
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "上海市南汇区新场镇 上海市 古建筑 历史 朝代 年代",
    "keywords": [
      "上海"
    ]
  },
  {
    "id": 5188,
    "name": "上海市嘉定区嘉定镇",
    "province": "上海市",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      121.2615543142995,
      31.37646079722354
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "上海市嘉定区嘉定镇 上海市 古建筑 历史 朝代 年代",
    "keywords": [
      "上海"
    ]
  },
  {
    "id": 5189,
    "name": "江苏省昆山市锦溪镇",
    "province": "江苏省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      120.897467738501,
      31.183617431827
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "江苏省昆山市锦溪镇 江苏省 古建筑 历史 朝代 年代",
    "keywords": [
      "江苏"
    ]
  },
  {
    "id": 5190,
    "name": "江苏省江都市邵伯镇",
    "province": "江苏省",
    "city": "未知",
    "dynasty": "清",
    "type": "古镇",
    "year": "清代",
    "yearNum": 1900,
    "coordinates": [
      119.5140847907661,
      32.52372494436027
    ],
    "status": "保存完好",
    "description": "古建筑",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?w=400",
    "source": "中国历史文化名镇名单​​.xlsx",
    "searchQuery": "江苏省江都市邵伯镇 江苏省 古建筑 历史 朝代 年代",
    "keywords": [
      "江苏"
    ]
  }
];

// 示例：如何处理一个建筑
function enhanceBuilding(building) {
  console.log('搜索:', building.searchQuery);
  console.log('关键词:', building.keywords);
  console.log('当前信息:', {
    name: building.name,
    dynasty: building.dynasty,
    year: building.year,
    description: building.description
  });
  
  // TODO: 使用网络搜索API获取详细信息
  // 返回增强后的建筑信息
  return {
    ...building,
    dynasty: '从搜索结果获取',
    year: '从搜索结果获取',
    description: '从搜索结果获取'
  };
}

// 批量处理
const enhancedBuildings = buildingsToEnhance.map(enhanceBuilding);

console.log('增强后的建筑数量:', enhancedBuildings.length);
console.log('示例:', enhancedBuildings[0]);
