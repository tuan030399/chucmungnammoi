export const WISHES = [
  "Chúc Mừng Năm Mới! An Khang Thịnh Vượng.",
  // ... old simple wishes kept as backup if needed, but primary focus is SYNCED_WISHES
];

// Đường dẫn file ghi âm.
// Đã trỏ về file nội bộ của bạn. Hãy đảm bảo tên file là 'loichuc.mp3' chính xác.
export const VOICE_URL = "/loichuc.mp3"; 

export const COLORS = [
  '#FF0000', // Red
  '#FFD700', // Gold
  '#FFA500', // Orange
  '#00FF00', // Green
  '#00FFFF', // Cyan
  '#FF00FF', // Magenta
  '#FFFFFF', // White
];

// YouTube Video ID
export const YOUTUBE_VIDEO_ID = "CameKc-m39k";

// Clock ticking sound - Switched to MP3 for better compatibility (Safari often fails with OGG)
export const TICK_SOUND_URL = "https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3";

export const FALLING_ITEMS = ["🏮", "🌸", "🌼", "🧧", "✨"];

// Dữ liệu lời chúc đồng bộ với giọng đọc
// 'startTime': thời điểm (giây) dòng chữ bắt đầu hiện/sáng lên trong file ghi âm
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