export const WISHES = [
  "Chúc Mừng Năm Mới! An Khang Thịnh Vượng.",
];

export const COLORS = [
  '#FF0000', // Red
  '#FFD700', // Gold
  '#FFA500', // Orange
  '#00FF00', // Green
  '#00FFFF', // Cyan
  '#FF00FF', // Magenta
  '#FFFFFF', // White
];

export const PLAYBACK_SPEED = 1.0;

// 1. NHẠC NỀN (Background Music) - YouTube
export const YOUTUBE_VIDEO_ID = "CameKc-m39k";

// 2. GIỌNG ĐỌC (Voice) - MP3 File
// Khi deploy, hãy uncomment dòng dưới và đảm bảo file 'loichuc.mp3' nằm trong folder 'public'
// export const VOICE_URL = "/loichuc.mp3";

// Tạm thời dùng link online để không bị lỗi khi test:
export const VOICE_URL = "https://cdn.pixabay.com/audio/2023/01/22/audio_d062e7423e.mp3"; // Placeholder

export const TICK_SOUND_URL = "https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3";

export const FALLING_ITEMS = ["🏮", "🌸", "🌼", "🧧", "✨"];

// Dữ liệu lời chúc chạy khớp với file loichuc.mp3
export const SYNCED_WISHES = [
  {
    startTime: 0,
    text: "Em Tuấn kính chúc quý cô chú anh chị, các bạn, các em:"
  },
  {
    startTime: 4, 
    text: "Năm mới sức khỏe vô biên, kiếm được nhiều tiền, tình duyên phơi phới."
  },
  {
    startTime: 9, 
    text: "Chúc ai còn lẻ bóng thì sớm 'vớ' được cực phẩm,"
  },
  {
    startTime: 12.5, 
    text: "Ai đang say đắm thì nhanh chóng về dinh,"
  },
  {
    startTime: 15, 
    text: "Còn ai đã có vợ xinh thì... bớt sợ vợ một tí cho anh em được nhờ!"
  },
  {
    startTime: 19, 
    text: "Chúc mừng năm mới, vạn sự như ý, tình nồng ý hợp!"
  }
];