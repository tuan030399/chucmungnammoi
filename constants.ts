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

// File âm thanh duy nhất
// Dấu / ở đầu đảm bảo nó tìm ngay thư mục gốc (public)
export const MAIN_AUDIO_URL = "/loichuc.mp3";

// Âm thanh tiếng tíc tắc khi đếm ngược
export const TICK_SOUND_URL = "https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3";

export const FALLING_ITEMS = ["🏮", "🌸", "🌼", "🧧", "✨"];

// Dữ liệu lời chúc chạy chữ (Karaoke)
// LƯU Ý: Bạn hãy nghe thử file loichuc.mp3 để chỉnh sửa số giây (startTime) dưới đây cho khớp nhé
export const SYNCED_WISHES = [
  {
    startTime: 0.5, // Giây thứ 0.5
    text: "Em Tuấn kính chúc quý cô chú anh chị, các bạn, các em:"
  },
  {
    startTime: 4.5, 
    text: "Năm mới sức khỏe vô biên, kiếm được nhiều tiền, tình duyên phơi phới."
  },
  {
    startTime: 9.5, 
    text: "Chúc ai còn lẻ bóng thì sớm 'vớ' được cực phẩm,"
  },
  {
    startTime: 13, 
    text: "Ai đang say đắm thì nhanh chóng về dinh,"
  },
  {
    startTime: 15.5, 
    text: "Còn ai đã có vợ xinh thì... bớt sợ vợ một tí cho anh em được nhờ!"
  },
  {
    startTime: 20, 
    text: "Chúc mừng năm mới, vạn sự như ý, tình nồng ý hợp!"
  }
];