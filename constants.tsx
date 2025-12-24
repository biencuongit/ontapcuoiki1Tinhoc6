
import { Question } from './types';

// Danh sách câu hỏi ban đầu (Sẽ được thay thế khi giáo viên nhập từ file Word/Excel)
export const INITIAL_MC_QUESTIONS: Question[] = [
  {
    id: 'mc1',
    type: 'MULTIPLE_CHOICE',
    content: 'Phát biểu nào sau đây là đúng về dữ liệu?',
    options: [
      { id: 'A', text: 'Dữ liệu chỉ có thể được hiểu bởi những người có trình độ cao.' },
      { id: 'B', text: 'Dữ liệu là những giá trị số do con người nghĩ ra.' },
      { id: 'C', text: 'Dữ liệu được thể hiện dưới dạng con số, văn bản, hình ảnh, âm thanh.' },
      { id: 'D', text: 'Dữ liệu chỉ có ở trong máy tính.' }
    ],
    correctAnswer: 'C',
    points: 0
  },
  {
    id: 'mc2',
    type: 'MULTIPLE_CHOICE',
    content: 'Các hoạt động xử lí thông tin gồm:',
    options: [
      { id: 'A', text: 'Đầu vào, đầu ra.' },
      { id: 'B', text: 'Thu nhận, xử lí, lưu trữ, truyền.' },
      { id: 'C', text: 'Nhìn, nghe, suy đoán, kết luận.' },
      { id: 'D', text: 'Mở bài, thân bài, kết luận.' }
    ],
    correctAnswer: 'B',
    points: 0
  },
  {
    id: 'mc3',
    type: 'MULTIPLE_CHOICE',
    content: 'Bàn phím, chuột, máy quét và webcam là những ví dụ về loại thiết bị nào của máy tính?',
    options: [
      { id: 'A', text: 'Thiết bị ra.' },
      { id: 'B', text: 'Thiết bị lưu trữ.' },
      { id: 'C', text: 'Thiết bị vào.' },
      { id: 'D', text: 'Bộ nhớ.' }
    ],
    correctAnswer: 'C',
    points: 0
  },
  {
    id: 'mc4',
    type: 'MULTIPLE_CHOICE',
    content: 'Thiết bị nào sau đây không phải là thiết bị ra của máy tính?',
    options: [
      { id: 'A', text: 'Micro.' },
      { id: 'B', text: 'Máy in.' },
      { id: 'C', text: 'Màn hình.' },
      { id: 'D', text: 'Loa.' }
    ],
    correctAnswer: 'A',
    points: 0
  },
  {
    id: 'mc5',
    type: 'MULTIPLE_CHOICE',
    content: 'Internet là gì?',
    options: [
      { id: 'A', text: 'Là một mạng máy tính của một công ty.' },
      { id: 'B', text: 'Là mạng kết nối các máy tính trên toàn thế giới.' },
      { id: 'C', text: 'Là một dịch vụ của Google.' },
      { id: 'D', text: 'Là phần mềm để lướt web.' }
    ],
    correctAnswer: 'B',
    points: 0
  },
  {
    id: 'mc6',
    type: 'MULTIPLE_CHOICE',
    content: 'Dịch vụ nào dưới đây KHÔNG phải là dịch vụ của Internet?',
    options: [
      { id: 'A', text: 'Thư điện tử.' },
      { id: 'B', text: 'Tìm kiếm thông tin.' },
      { id: 'C', text: 'Nấu ăn trực tuyến.' },
      { id: 'D', text: 'Mạng xã hội.' }
    ],
    correctAnswer: 'C',
    points: 0
  }
  // Ghi chú: Giáo viên sẽ nhập 56 câu trắc nghiệm thực tế thông qua chức năng "Nhập đề cương" ở Dashboard giáo viên.
];

export const INITIAL_ESSAY_QUESTIONS: Question[] = [
  {
    id: 'es1',
    type: 'ESSAY',
    content: 'Máy tìm kiếm là gì? Hãy nêu tên một số máy tìm kiếm phổ biến hiện nay.',
    correctAnswer: 'Máy tìm kiếm là một website đặc biệt, giúp người sử dụng tìm kiếm thông tin trên Internet một cách nhanh chóng, hiệu quả thông qua các từ khóa. Một số máy tìm kiếm phổ biến: Google, Bing, Yahoo, Cốc Cốc.',
    points: 0
  },
  {
    id: 'es2',
    type: 'ESSAY',
    content: 'Nêu những ưu, nhược điểm cơ bản của dịch vụ thư điện tử so với thư truyền thống.',
    correctAnswer: 'Ưu điểm: chi phí thấp (gần như miễn phí), tiết kiệm thời gian (nhận được ngay), thuận tiện (gửi cho nhiều người cùng lúc). Nhược điểm: cần có internet, nguy cơ lây nhiễm virus qua tệp đính kèm, thư rác (spam).',
    points: 0
  }
];
