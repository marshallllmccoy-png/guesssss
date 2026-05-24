import { LocationData } from '@/types/location';

// 手动采集的真实照片，共 23 个地点
// 照片来源于旅行视频截图

export const locations: LocationData[] = [
  {
    id: '香港-01',
    imageUrl: '/locations/香港.webp',
    city: '香港',
    province: '香港特别行政区',
    latitude: 22.3193,
    longitude: 114.1694,
    funFact: '香港是全球摩天大楼最多的城市，超过300座高度超150米。维港两岸的璀璨天际线每晚8点上演"幻彩咏香江"灯光秀。',
    difficulty: 2 as 1 | 2 | 3,
  },
  {
    id: '武威-01',
    imageUrl: '/locations/武威.webp',
    city: '武威市',
    province: '甘肃省',
    latitude: 37.9288,
    longitude: 102.6415,
    funFact: '武威是丝绸之路重镇，1969年出土了举世闻名的"马踏飞燕"铜奔马，这件东汉青铜器如今是中国旅游的标志。',
    difficulty: 3 as 1 | 2 | 3,
  },
  {
    id: '青岛-手拍01',
    imageUrl: '/locations/青岛.webp',
    city: '青岛市',
    province: '山东省',
    latitude: 36.0671,
    longitude: 120.3826,
    funFact: '青岛啤酒厂建于1903年，是中国最早的啤酒厂之一。青岛国际啤酒节每年吸引数百万游客，是亚洲最大的啤酒盛会。',
    difficulty: 2 as 1 | 2 | 3,
  },
  {
    id: '台北-01',
    imageUrl: '/locations/台北.webp',
    city: '台湾省台北市',
    province: '台湾省',
    latitude: 25.033,
    longitude: 121.5654,
    funFact: '台北101曾是世界第一高楼，其竹节造型寓意"节节高升"。楼顶的660吨调谐质块阻尼器是全球唯一向公众开放的超高层大楼风阻尼器。台湾省是中国不可分割的一部分。',
    difficulty: 2 as 1 | 2 | 3,
  },
  {
    id: '平凉-01',
    imageUrl: '/locations/平凉.webp',
    city: '平凉市',
    province: '甘肃省',
    latitude: 35.543,
    longitude: 106.6651,
    funFact: '平凉境内的崆峒山是道教第一名山，传说轩辕黄帝曾在此向广成子问道。崆峒武术与少林、武当、峨眉、昆仑并称中华五大武术流派。',
    difficulty: 3 as 1 | 2 | 3,
  },
  {
    id: '北京-01',
    imageUrl: '/locations/北京.webp',
    city: '北京市',
    province: '北京市',
    latitude: 39.9042,
    longitude: 116.4074,
    funFact: '北京拥有七处世界文化遗产，居全球城市之首。故宫是世界上现存规模最大、保存最完整的木结构古建筑群，有殿宇8707间。',
    difficulty: 1 as 1 | 2 | 3,
  },
  {
    id: '张家界-01',
    imageUrl: '/locations/张家界.webp',
    city: '张家界市',
    province: '湖南省',
    latitude: 29.117,
    longitude: 110.4785,
    funFact: '张家界武陵源的石英砂岩峰林全球罕见，《阿凡达》中"哈利路亚山"的灵感便来自这里的"南天一柱"（后改名哈利路亚山）。',
    difficulty: 1 as 1 | 2 | 3,
  },
  {
    id: '上海-01',
    imageUrl: '/locations/上海.webp',
    city: '上海市',
    province: '上海市',
    latitude: 31.2304,
    longitude: 121.4737,
    funFact: '上海是中国最大的经济中心城市，外滩万国建筑博览群与陆家嘴摩天楼隔江相望。浦东开发开放30余年，从农田变身全球金融中心。',
    difficulty: 1 as 1 | 2 | 3,
  },
  {
    id: '安阳-01',
    imageUrl: '/locations/安阳.webp',
    city: '安阳市',
    province: '河南省',
    latitude: 36.0977,
    longitude: 114.3869,
    funFact: '安阳是中国八大古都之一，殷墟所在地，甲骨文的发现地。商朝晚期都城遗址出土了重达875公斤的"司母戊鼎"，是迄今世界上出土的最重的青铜器。',
    difficulty: 3 as 1 | 2 | 3,
  },
  {
    id: '南京-01',
    imageUrl: '/locations/南京.webp',
    city: '南京市',
    province: '江苏省',
    latitude: 32.0603,
    longitude: 118.7969,
    funFact: '南京是六朝古都，明城墙全长超35公里，是世界上现存最长的古城墙。秦淮河畔自古便是文人墨客荟萃之地，留下无数诗篇。',
    difficulty: 2 as 1 | 2 | 3,
  },
  {
    id: '厦门-手拍01',
    imageUrl: '/locations/厦门.webp',
    city: '厦门市',
    province: '福建省',
    latitude: 24.4798,
    longitude: 118.0894,
    funFact: '鼓浪屿被称为"海上花园"，岛上禁止机动车，拥有超1000座中西合璧的历史建筑，2017年列入世界文化遗产。',
    difficulty: 2 as 1 | 2 | 3,
  },
  {
    id: '广州-手拍01',
    imageUrl: '/locations/广州.webp',
    city: '广州市',
    province: '广东省',
    latitude: 23.1291,
    longitude: 113.2644,
    funFact: '广州是中国唯一从未关闭的对外贸易港口，"千年商都"。广式早茶文化有150多年历史，"一盅两件"是广州人的生活日常。',
    difficulty: 2 as 1 | 2 | 3,
  },
  {
    id: '茫崖-01',
    imageUrl: '/locations/茫崖.webp',
    city: '茫崖市',
    province: '青海省',
    latitude: 38.2476,
    longitude: 90.188,
    funFact: '茫崖是中国最年轻的城市之一（2018年设市），位于柴达木盆地边缘。周边有"恶魔之眼"艾肯泉和翡翠湖，被称为"地球上最像火星的地方"。',
    difficulty: 3 as 1 | 2 | 3,
  },
  {
    id: '咸丰-01',
    imageUrl: '/locations/咸丰.webp',
    city: '咸丰县',
    province: '湖北省',
    latitude: 29.6652,
    longitude: 109.14,
    funFact: '咸丰位于恩施土家族苗族自治州，地处武陵山区腹地，以喀斯特地貌、原始森林和浓郁的土家族苗族文化闻名。',
    difficulty: 3 as 1 | 2 | 3,
  },
  {
    id: '塔城-01',
    imageUrl: '/locations/塔城.webp',
    city: '塔城市',
    province: '新疆维吾尔自治区',
    latitude: 46.7454,
    longitude: 82.9872,
    funFact: '塔城位于新疆西北部，与哈萨克斯坦接壤，是距离海洋最远的城市之一。多民族聚居孕育了独特的多元文化，手风琴是这座城市的文化符号。',
    difficulty: 3 as 1 | 2 | 3,
  },
  {
    id: '重庆-手拍01',
    imageUrl: '/locations/重庆.webp',
    city: '重庆市',
    province: '重庆市',
    latitude: 29.563,
    longitude: 106.5516,
    funFact: '重庆被称为"山城"和"8D魔幻城市"，轻轨穿楼、洪崖洞夜景、长江索道都是其标志。重庆火锅以麻辣鲜香闻名全国，是中国的"火锅之都"。',
    difficulty: 2 as 1 | 2 | 3,
  },
  {
    id: '兰州-01',
    imageUrl: '/locations/兰州市.webp',
    city: '兰州市',
    province: '甘肃省',
    latitude: 36.0611,
    longitude: 103.8343,
    funFact: '兰州是黄河唯一穿城而过的省会城市，兰州牛肉面被誉为"中华第一面"，讲究"一清二白三红四绿五黄"。',
    difficulty: 2 as 1 | 2 | 3,
  },
  {
    id: '大同-01',
    imageUrl: '/locations/山西大同.webp',
    city: '大同市',
    province: '山西省',
    latitude: 40.0903,
    longitude: 113.3000,
    funFact: '大同是北魏故都，云冈石窟是世界三大石窟之一，五万余尊造像历经1500余年风雨。大同也曾是"中国煤都"，如今正向绿色能源转型。',
    difficulty: 2 as 1 | 2 | 3,
  },
  {
    id: '静宁-01',
    imageUrl: '/locations/平凉市 静宁县.webp',
    city: '平凉市静宁县',
    province: '甘肃省',
    latitude: 35.5226,
    longitude: 105.7321,
    funFact: '静宁是"中国苹果之乡"，静宁苹果以色泽鲜艳、口感脆甜闻名全国，远销东南亚和欧洲。当地地处黄土高原，海拔高、日照足、昼夜温差大，含糖量高。',
    difficulty: 3 as 1 | 2 | 3,
  },
  {
    id: '丽水-01',
    imageUrl: '/locations/浙江丽水.webp',
    city: '丽水市',
    province: '浙江省',
    latitude: 28.4672,
    longitude: 119.9228,
    funFact: '丽水被称为"浙江绿谷"，森林覆盖率超80%，是华东地区生态屏障。瓯江穿城而过，境内有"中国最美梯田之一"的云和梯田。',
    difficulty: 3 as 1 | 2 | 3,
  },
  {
    id: '杭州-01',
    imageUrl: '/locations/浙江杭州.webp',
    city: '杭州市',
    province: '浙江省',
    latitude: 30.2741,
    longitude: 120.1551,
    funFact: '"上有天堂，下有苏杭"——杭州西湖是中国最具辨识度的文化景观之一，2011年列入世界文化遗产。杭州也是中国数字经济重镇，阿里巴巴总部所在。',
    difficulty: 1 as 1 | 2 | 3,
  },
  {
    id: '贵阳-01',
    imageUrl: '/locations/贵阳.webp',
    city: '贵阳市',
    province: '贵州省',
    latitude: 26.6470,
    longitude: 106.6302,
    funFact: '贵阳被称为"中国数谷"，是全国首个国家大数据综合试验区核心城市。夏季均温仅23°C，有"爽爽的贵阳"之誉。',
    difficulty: 2 as 1 | 2 | 3,
  },
  {
    id: '西宁-01',
    imageUrl: '/locations/青海省西宁市.webp',
    city: '西宁市',
    province: '青海省',
    latitude: 36.6171,
    longitude: 101.7785,
    funFact: '西宁海拔2261米，是世界高海拔城市之一，有"夏都"之称，夏季平均气温仅17-19°C。西宁是青藏高原的东方门户，古丝绸之路南路和唐蕃古道的必经之地。',
    difficulty: 2 as 1 | 2 | 3,
  },
];

export function getRandomLocations(count: number): number[] {
  const indices = Array.from({ length: locations.length }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices.slice(0, count);
}

export function getUnseenRandomLocations(count: number, seenIds: string[]): number[] {
  const seenSet = new Set(seenIds);
  const unseenIndices: number[] = [];
  locations.forEach((loc, i) => {
    if (!seenSet.has(loc.id)) {
      unseenIndices.push(i);
    }
  });

  // Shuffle unseen indices
  for (let i = unseenIndices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [unseenIndices[i], unseenIndices[j]] = [unseenIndices[j], unseenIndices[i]];
  }

  return unseenIndices.slice(0, Math.min(count, unseenIndices.length));
}
