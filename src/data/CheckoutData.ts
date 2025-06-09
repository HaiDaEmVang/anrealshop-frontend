export const dummyVietnamProvinces = [
  { value: 'hanoi', label: 'Hà Nội' },
  { value: 'hochiminh', label: 'Thành phố Hồ Chí Minh' },
  { value: 'danang', label: 'Đà Nẵng' },
  { value: 'haiphong', label: 'Hải Phòng' },
  { value: 'cantho', label: 'Cần Thơ' },
];

export const dummyVietnamDistricts: Record<string, { value: string; label: string }[]> = {
  'hanoi': [
    { value: 'badinh', label: 'Ba Đình' },
    { value: 'hoankien', label: 'Hoàn Kiếm' },
    { value: 'haibatrung', label: 'Hai Bà Trưng' },
    { value: 'dongda', label: 'Đống Đa' },
    { value: 'tayho', label: 'Tây Hồ' },
  ],
  'hochiminh': [
    { value: 'district1', label: 'Quận 1' },
    { value: 'district3', label: 'Quận 3' },
    { value: 'district4', label: 'Quận 4' },
    { value: 'district5', label: 'Quận 5' },
    { value: 'district7', label: 'Quận 7' },
    { value: 'binhthanh', label: 'Bình Thạnh' },
    { value: 'phunhuan', label: 'Phú Nhuận' },
  ],
  'danang': [
    { value: 'haichau', label: 'Hải Châu' },
    { value: 'thanhnhe', label: 'Thanh Khê' },
    { value: 'sontra', label: 'Sơn Trà' },
    { value: 'nguhanhson', label: 'Ngũ Hành Sơn' },
    { value: 'lienchieu', label: 'Liên Chiểu' },
  ],
};

export const dummyVietnamWards: Record<string, { value: string; label: string }[]> = {
  'district1': [
    { value: 'bennghe', label: 'Phường Bến Nghé' },
    { value: 'bendthanh', label: 'Phường Bến Thành' },
    { value: 'dakao', label: 'Phường Đa Kao' },
    { value: 'cauchongoi', label: 'Phường Cầu Ông Lãnh' },
    { value: 'nguyenthaibinh', label: 'Phường Nguyễn Thái Bình' },
  ],
  'district3': [
    { value: 'ward1', label: 'Phường 1' },
    { value: 'ward2', label: 'Phường 2' },
    { value: 'ward3', label: 'Phường 3' },
    { value: 'ward4', label: 'Phường 4' },
    { value: 'ward5', label: 'Phường 5' },
  ],
  'badinh': [
    { value: 'phucxa', label: 'Phường Phúc Xá' },
    { value: 'truongbach', label: 'Phường Trúc Bạch' },
    { value: 'vinhphuc', label: 'Phường Vĩnh Phúc' },
    { value: 'congvi', label: 'Phường Cống Vị' },
    { value: 'lieugiai', label: 'Phường Liễu Giai' },
  ],
};