// 中国主要城市及坐标（用于反向地理编码和命名）
export interface CityInfo {
  name: string;
  province: string;
  lat: number;
  lng: number;
}

export const MAJOR_CITIES: CityInfo[] = [
  { name: '北京市', province: '北京市', lat: 39.9042, lng: 116.4074 },
  { name: '上海市', province: '上海市', lat: 31.2304, lng: 121.4737 },
  { name: '广州市', province: '广东省', lat: 23.1291, lng: 113.2644 },
  { name: '深圳市', province: '广东省', lat: 22.5431, lng: 114.0579 },
  { name: '杭州市', province: '浙江省', lat: 30.2741, lng: 120.1551 },
  { name: '成都市', province: '四川省', lat: 30.5728, lng: 104.0668 },
  { name: '重庆市', province: '重庆市', lat: 29.4316, lng: 106.9123 },
  { name: '武汉市', province: '湖北省', lat: 30.5928, lng: 114.3055 },
  { name: '南京市', province: '江苏省', lat: 32.0603, lng: 118.7969 },
  { name: '西安市', province: '陕西省', lat: 34.3416, lng: 108.9398 },
  { name: '长沙市', province: '湖南省', lat: 28.2282, lng: 112.9388 },
  { name: '青岛市', province: '山东省', lat: 36.0671, lng: 120.3826 },
  { name: '大连市', province: '辽宁省', lat: 38.9140, lng: 121.6147 },
  { name: '厦门市', province: '福建省', lat: 24.4798, lng: 118.0894 },
  { name: '苏州市', province: '江苏省', lat: 31.2990, lng: 120.5853 },
  { name: '昆明市', province: '云南省', lat: 25.0389, lng: 102.7183 },
  { name: '哈尔滨市', province: '黑龙江省', lat: 45.8038, lng: 126.5350 },
  { name: '郑州市', province: '河南省', lat: 34.7466, lng: 113.6254 },
  { name: '天津市', province: '天津市', lat: 39.1252, lng: 117.1908 },
  { name: '济南市', province: '山东省', lat: 36.6512, lng: 117.1201 },
  { name: '合肥市', province: '安徽省', lat: 31.8206, lng: 117.2272 },
  { name: '南昌市', province: '江西省', lat: 28.6820, lng: 115.8579 },
  { name: '福州市', province: '福建省', lat: 26.0745, lng: 119.2965 },
  { name: '南宁市', province: '广西壮族自治区', lat: 22.8170, lng: 108.3665 },
  { name: '贵阳市', province: '贵州省', lat: 26.6470, lng: 106.6302 },
  { name: '兰州市', province: '甘肃省', lat: 36.0611, lng: 103.8343 },
  { name: '太原市', province: '山西省', lat: 37.8706, lng: 112.5489 },
  { name: '石家庄市', province: '河北省', lat: 38.0428, lng: 114.5149 },
  { name: '沈阳市', province: '辽宁省', lat: 41.8057, lng: 123.4315 },
  { name: '长春市', province: '吉林省', lat: 43.8178, lng: 125.3235 },
  { name: '呼和浩特市', province: '内蒙古自治区', lat: 40.8424, lng: 111.7490 },
  { name: '乌鲁木齐市', province: '新疆维吾尔自治区', lat: 43.8256, lng: 87.6168 },
  { name: '拉萨市', province: '西藏自治区', lat: 29.6500, lng: 91.1000 },
  { name: '西宁市', province: '青海省', lat: 36.6171, lng: 101.7785 },
  { name: '银川市', province: '宁夏回族自治区', lat: 38.4872, lng: 106.2309 },
  { name: '海口市', province: '海南省', lat: 20.0174, lng: 110.3492 },
  { name: '三亚市', province: '海南省', lat: 18.2528, lng: 109.5120 },
  { name: '桂林市', province: '广西壮族自治区', lat: 25.2736, lng: 110.2900 },
  { name: '洛阳市', province: '河南省', lat: 34.6181, lng: 112.4536 },
  { name: '黄山市', province: '安徽省', lat: 29.7147, lng: 118.3375 },
];

/** 计算两个坐标之间的距离 (km) */
export function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** 找到最近的已知城市 */
export function nearestCity(lat: number, lng: number): CityInfo {
  let best = MAJOR_CITIES[0];
  let bestDist = Infinity;
  for (const c of MAJOR_CITIES) {
    const d = distanceKm(lat, lng, c.lat, c.lng);
    if (d < bestDist) { bestDist = d; best = c; }
  }
  return best;
}
