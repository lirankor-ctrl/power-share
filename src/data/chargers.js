export const demoChargers = [
  {
    id: 'c1',
    ownerName: 'יוסי כהן',
    ownerPhone: '050-1234567',
    address: 'רחוב הרצל 24',
    city: 'תל אביב',
    distanceKm: 1.8,
    hours: '08:00 - 22:00',
    rating: 4.8,
    reviewsCount: 23,
    description: 'עמדת טעינה ביתית עם חיבור Type 2, חניה בחצר פרטית.',
    notes: 'יש להחנות בחנייה השמאלית. השער נפתח עם קוד 1234. הכבל נמצא בתיבה שליד העמודה.',
    cableType: 'Type 2',
    powerKw: 7.4,
    reviews: [
      { id: 'r1', author: 'דנה ל.', rating: 5, text: 'עמדה מעולה, יוסי אדיב מאוד.' },
      { id: 'r2', author: 'אמיר ב.', rating: 4, text: 'נוח להגיע, חנייה נגישה.' }
    ]
  },
  {
    id: 'c2',
    ownerName: 'מירב לוי',
    ownerPhone: '052-9876543',
    address: 'שדרות בן גוריון 18',
    city: 'חיפה',
    distanceKm: 3.2,
    hours: '18:00 - 08:00',
    rating: 4.6,
    reviewsCount: 15,
    description: 'עמדה מהירה בכניסה לבניין, נגישה גם בלילה.',
    notes: 'יש לצלצל בדירה 7 בהגעה. הכבל באורך 5 מטר.',
    cableType: 'Type 2',
    powerKw: 11,
    reviews: [
      { id: 'r3', author: 'רן ש.', rating: 5, text: 'מהירה ונקייה.' }
    ]
  },
  {
    id: 'c3',
    ownerName: 'אורן ביטון',
    ownerPhone: '054-5551122',
    address: 'רחוב יפו 102',
    city: 'ירושלים',
    distanceKm: 5.4,
    hours: '00:00 - 23:59',
    rating: 4.9,
    reviewsCount: 41,
    description: 'עמדה זמינה 24/7, חניה רחבה ומקורה.',
    notes: 'הכניסה דרך החנייה התת-קרקעית. קוד שער: 8800#.',
    cableType: 'Type 2',
    powerKw: 22,
    reviews: [
      { id: 'r4', author: 'נועה ק.', rating: 5, text: 'הכי טוב באזור.' },
      { id: 'r5', author: 'גלעד מ.', rating: 5, text: 'אורן מאוד נחמד וזמין.' }
    ]
  },
  {
    id: 'c4',
    ownerName: 'שירה גולן',
    ownerPhone: '053-7778899',
    address: 'רחוב סוקולוב 5',
    city: 'רמת גן',
    distanceKm: 2.4,
    hours: '07:00 - 23:00',
    rating: 4.5,
    reviewsCount: 9,
    description: 'עמדת טעינה בכניסה לחנייה הפרטית.',
    notes: 'נא להודיע בטלפון לפני ההגעה.',
    cableType: 'Type 2',
    powerKw: 7.4,
    reviews: []
  },
  {
    id: 'c5',
    ownerName: 'דוד אברהמי',
    ownerPhone: '050-4443322',
    address: 'רחוב הנביאים 12',
    city: 'באר שבע',
    distanceKm: 7.1,
    hours: '09:00 - 21:00',
    rating: 4.3,
    reviewsCount: 6,
    description: 'עמדה ביתית עם גישה נוחה מהרחוב.',
    notes: 'יש להחנות מקדימה. אין צורך בקוד.',
    cableType: 'Type 2',
    powerKw: 11,
    reviews: []
  },
  {
    id: 'c6',
    ownerName: 'נועה ברק',
    ownerPhone: '052-1112233',
    address: 'רחוב ויצמן 88',
    city: 'כפר סבא',
    distanceKm: 4.0,
    hours: '06:00 - 23:30',
    rating: 4.7,
    reviewsCount: 18,
    description: 'עמדה חדשה ומהירה, חניה מקורה.',
    notes: 'הכבל בארון שמשמאל לעמדה. נא לסגור היטב לאחר השימוש.',
    cableType: 'Type 2',
    powerKw: 22,
    reviews: [
      { id: 'r6', author: 'יעל ר.', rating: 5, text: 'מקום מצוין ונקי מאוד.' }
    ]
  }
];

export const getChargerById = (id) => demoChargers.find((c) => c.id === id);
