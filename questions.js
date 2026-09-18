// RRB Prelims practice question bank.
// Har question: { topic, q, options: [4], answer: index(0-3), sol: "short solution" }

const QUESTION_BANK = {
  Simplification: {
    emoji: "🧮",
    questions: [
      {
        q: "25% of 480 + 3/4 of 160 = ?",
        options: ["220", "240", "260", "200"],
        answer: 1,
        sol: "120 + 120 = 240",
      },
      {
        q: "√1444 + (12)² − 15 = ?",
        options: ["157", "167", "177", "147"],
        answer: 1,
        sol: "38 + 144 − 15 = 167",
      },
      {
        q: "144 ÷ 12 × 3 + 8 = ?",
        options: ["44", "36", "52", "40"],
        answer: 0,
        sol: "12 × 3 = 36, + 8 = 44",
      },
      {
        q: "40% of 250 + 15% of 200 = ?",
        options: ["120", "130", "140", "110"],
        answer: 1,
        sol: "100 + 30 = 130",
      },
      {
        q: "(18 × 12) ÷ 6 + 9 = ?",
        options: ["45", "36", "42", "48"],
        answer: 0,
        sol: "216 ÷ 6 = 36, + 9 = 45",
      },
      {
        q: "√625 + √441 − 10 = ?",
        options: ["36", "46", "26", "40"],
        answer: 0,
        sol: "25 + 21 − 10 = 36",
      },
      {
        q: "60% of 350 − 30% of 200 = ?",
        options: ["150", "160", "140", "170"],
        answer: 0,
        sol: "210 − 60 = 150",
      },
      {
        q: "(15)² − (11)² = ?",
        options: ["104", "94", "114", "84"],
        answer: 0,
        sol: "225 − 121 = 104",
      },
    ],
  },
  "Number Series": {
    emoji: "🔢",
    questions: [
      {
        q: "5, 11, 23, 47, 95, ?",
        options: ["189", "191", "185", "190"],
        answer: 1,
        sol: "×2 + 1 → 95×2+1 = 191",
      },
      {
        q: "3, 6, 12, 24, 48, ?",
        options: ["72", "96", "84", "108"],
        answer: 1,
        sol: "×2 har baar → 48×2 = 96",
      },
      {
        q: "2, 5, 10, 17, 26, ?",
        options: ["35", "37", "36", "38"],
        answer: 1,
        sol: "+3, +5, +7, +9, +11 → 26+11 = 37",
      },
      {
        q: "1, 4, 9, 16, 25, ?",
        options: ["30", "36", "49", "42"],
        answer: 1,
        sol: "Perfect squares → 6² = 36",
      },
      {
        q: "7, 14, 28, 56, ?",
        options: ["98", "112", "108", "120"],
        answer: 1,
        sol: "×2 → 56×2 = 112",
      },
      {
        q: "120, 99, 80, 63, 48, ?",
        options: ["35", "33", "37", "39"],
        answer: 0,
        sol: "−21, −19, −17, −15, −13 → 48−13 = 35",
      },
      {
        q: "4, 8, 16, 32, 64, ?",
        options: ["96", "128", "100", "120"],
        answer: 1,
        sol: "×2 → 64×2 = 128",
      },
      {
        q: "1, 2, 6, 24, 120, ?",
        options: ["600", "720", "480", "540"],
        answer: 1,
        sol: "×2, ×3, ×4, ×5, ×6 → 120×6 = 720",
      },
    ],
  },
  "Percentage & Average": {
    emoji: "📊",
    questions: [
      {
        q: "Ek number ka 40% = 240. Number kya hai?",
        options: ["600", "560", "620", "580"],
        answer: 0,
        sol: "240 ÷ 40 × 100 = 600",
      },
      {
        q: "5 numbers ka average 30. Ek number 50 hai. Baaki 4 ka average?",
        options: ["20", "25", "30", "22"],
        answer: 1,
        sol: "Total 150 − 50 = 100, ÷ 4 = 25",
      },
      {
        q: "60 ka kitna % 15 hai?",
        options: ["20%", "25%", "30%", "15%"],
        answer: 1,
        sol: "15/60 × 100 = 25%",
      },
      {
        q: "Ek sankhya mein 25% badha kar 500 mila. Original number?",
        options: ["400", "375", "425", "450"],
        answer: 0,
        sol: "500 ÷ 1.25 = 400",
      },
      {
        q: "First 5 even numbers ka average?",
        options: ["5", "6", "7", "8"],
        answer: 1,
        sol: "(2+4+6+8+10)/5 = 30/5 = 6",
      },
      {
        q: "800 ka 12.5% = ?",
        options: ["100", "90", "110", "120"],
        answer: 0,
        sol: "800 × 12.5/100 = 100",
      },
    ],
  },
  "Profit & Loss": {
    emoji: "💰",
    questions: [
      {
        q: "₹500 mein khareeda, ₹600 mein becha. Profit %?",
        options: ["15%", "20%", "25%", "10%"],
        answer: 1,
        sol: "100/500 × 100 = 20%",
      },
      {
        q: "CP ₹800, Loss 10%. SP kya?",
        options: ["₹720", "₹700", "₹740", "₹760"],
        answer: 0,
        sol: "800 × 0.9 = 720",
      },
      {
        q: "SP ₹1150 pe 15% profit. CP kya?",
        options: ["₹1000", "₹950", "₹1050", "₹900"],
        answer: 0,
        sol: "1150 ÷ 1.15 = 1000",
      },
      {
        q: "₹1200 mein becha, 20% profit. CP?",
        options: ["₹1000", "₹960", "₹1100", "₹1050"],
        answer: 0,
        sol: "1200 ÷ 1.2 = 1000",
      },
      {
        q: "CP ₹250, SP ₹200. Loss %?",
        options: ["25%", "20%", "15%", "10%"],
        answer: 1,
        sol: "50/250 × 100 = 20%",
      },
    ],
  },
  "SI & CI": {
    emoji: "🏦",
    questions: [
      {
        q: "₹2000 pe 5% saalana, 2 saal SI?",
        options: ["₹180", "₹200", "₹220", "₹210"],
        answer: 1,
        sol: "(2000×5×2)/100 = 200",
      },
      {
        q: "₹5000 pe 10% saalana, 3 saal SI?",
        options: ["₹1500", "₹1200", "₹1800", "₹1000"],
        answer: 0,
        sol: "(5000×10×3)/100 = 1500",
      },
      {
        q: "₹1000 pe 10% CI, 2 saal ka amount?",
        options: ["₹1210", "₹1200", "₹1100", "₹1220"],
        answer: 0,
        sol: "1000 × 1.1 × 1.1 = 1210",
      },
      {
        q: "Kitne saal mein ₹4000, 5% se ₹600 SI dega?",
        options: ["3 saal", "2 saal", "4 saal", "5 saal"],
        answer: 0,
        sol: "600 = (4000×5×T)/100 → T = 3",
      },
      {
        q: "₹8000 pe 2 saal 10% CI ka byaj?",
        options: ["₹1680", "₹1600", "₹1700", "₹1620"],
        answer: 0,
        sol: "8000×1.21 = 9680, − 8000 = 1680",
      },
    ],
  },
  "Ratio & Ages": {
    emoji: "⚖️",
    questions: [
      {
        q: "A:B = 3:5, total 40. B ki age?",
        options: ["25", "24", "15", "20"],
        answer: 0,
        sol: "40 × 5/8 = 25",
      },
      {
        q: "Do numbers 2:3 ratio mein, sum 60. Bada number?",
        options: ["36", "24", "40", "30"],
        answer: 0,
        sol: "60 × 3/5 = 36",
      },
      {
        q: "Pita:Putra = 5:2, pita 40 saal. Putra?",
        options: ["16", "18", "14", "20"],
        answer: 0,
        sol: "40 × 2/5 = 16",
      },
      {
        q: "₹720 ko 4:5 ratio mein baanto. Chhota hissa?",
        options: ["₹320", "₹400", "₹300", "₹360"],
        answer: 0,
        sol: "720 × 4/9 = 320",
      },
      {
        q: "A:B = 4:7, A = 24. B?",
        options: ["42", "35", "49", "28"],
        answer: 0,
        sol: "24/4 × 7 = 42",
      },
    ],
  },
  "Speed & Time": {
    emoji: "🚄",
    questions: [
      {
        q: "60 km/h se 300 km kitne ghante?",
        options: ["4", "5", "6", "3"],
        answer: 1,
        sol: "300 ÷ 60 = 5 hrs",
      },
      {
        q: "120 km 2 ghante mein. Speed?",
        options: ["50 km/h", "60 km/h", "70 km/h", "40 km/h"],
        answer: 1,
        sol: "120 ÷ 2 = 60 km/h",
      },
      {
        q: "72 km/h ko m/s mein?",
        options: ["18", "20", "25", "22"],
        answer: 1,
        sol: "72 × 5/18 = 20 m/s",
      },
      {
        q: "Ek train 90 km/h se 45 min mein kitna?",
        options: ["67.5 km", "60 km", "70 km", "75 km"],
        answer: 0,
        sol: "90 × 0.75 = 67.5 km",
      },
      {
        q: "150 km 50 km/h se. Time?",
        options: ["3 hrs", "2 hrs", "4 hrs", "2.5 hrs"],
        answer: 0,
        sol: "150 ÷ 50 = 3 hrs",
      },
    ],
  },
  "Time & Work": {
    emoji: "🛠️",
    questions: [
      {
        q: "A ek kaam 10 din mein karta hai. 1 din mein kitna?",
        options: ["1/10", "1/5", "1/20", "1/15"],
        answer: 0,
        sol: "1 din = 1/10 kaam",
      },
      {
        q: "A 12 din, B 6 din. Dono milkar?",
        options: ["4 din", "5 din", "6 din", "3 din"],
        answer: 0,
        sol: "1/12+1/6 = 1/4 → 4 din",
      },
      {
        q: "6 aadmi 10 din mein kaam. 3 aadmi kitne din?",
        options: ["20", "15", "12", "18"],
        answer: 0,
        sol: "6×10 = 60, ÷ 3 = 20",
      },
      {
        q: "A 8 din, B 8 din. Dono milkar?",
        options: ["4 din", "5 din", "6 din", "8 din"],
        answer: 0,
        sol: "2/8 = 1/4 → 4 din",
      },
      {
        q: "20 aadmi 5 din. 10 aadmi kitne din?",
        options: ["10", "8", "12", "15"],
        answer: 0,
        sol: "20×5 = 100, ÷ 10 = 10",
      },
      {
        q: "A 15 din, B 30 din. Dono milkar?",
        options: ["10 din", "12 din", "8 din", "9 din"],
        answer: 0,
        sol: "1/15+1/30 = 1/10 → 10 din",
      },
    ],
  },
  "Coding-Decoding": {
    emoji: "🔐",
    questions: [
      {
        q: "CAT → DBU toh DOG → ?",
        options: ["EPH", "EPG", "FPH", "DPH"],
        answer: 0,
        sol: "Har letter +1 → EPH",
      },
      {
        q: "PEN → 16-5-14 toh CAP → ?",
        options: ["3-1-16", "3-1-15", "4-1-16", "3-2-16"],
        answer: 0,
        sol: "Position: C=3,A=1,P=16",
      },
      {
        q: "SUN → TVO toh MOON → ?",
        options: ["NPPO", "NPOO", "MPPO", "NOOP"],
        answer: 0,
        sol: "+1 each → NPPO",
      },
      {
        q: "123 = ABC toh 231 = ?",
        options: ["BCA", "CAB", "ACB", "BAC"],
        answer: 0,
        sol: "2→B,3→C,1→A = BCA",
      },
      {
        q: "DOG ko ulta likho = ?",
        options: ["GOD", "DGO", "ODG", "GDO"],
        answer: 0,
        sol: "Reverse → GOD",
      },
      {
        q: "BAT = 2+1+20 = 23 toh CAT = ?",
        options: ["24", "23", "25", "22"],
        answer: 0,
        sol: "3+1+20 = 24",
      },
    ],
  },
  "Blood Relation": {
    emoji: "👨‍👩‍👧",
    questions: [
      {
        q: "Ram is Shyam's brother; Sita is Ram's mother. Sita is Shyam's?",
        options: ["Sister", "Mother", "Aunt", "Grandmother"],
        answer: 1,
        sol: "Sita is mother of both",
      },
      {
        q: "A is B's father. B is C's mother. A is C's?",
        options: ["Grandfather", "Father", "Uncle", "Brother"],
        answer: 0,
        sol: "Two generations up = Grandfather",
      },
      {
        q: "My mother's brother's wife is my?",
        options: ["Aunt (Mami)", "Aunt (Chachi)", "Aunt (Bua)", "Aunt (Mausi)"],
        answer: 0,
        sol: "Maternal uncle's wife = Mami",
      },
      {
        q: "What do you call your father's father?",
        options: [
          "Grandfather",
          "Maternal grandfather",
          "Uncle",
          "Elder uncle",
        ],
        answer: 0,
        sol: "Father's father = Grandfather",
      },
      {
        q: "My sister's daughter is my?",
        options: ["Niece", "Daughter", "Cousin", "Grandchild"],
        answer: 0,
        sol: "Sister's daughter = Niece",
      },
    ],
  },
  "Direction Sense": {
    emoji: "🧭",
    questions: [
      {
        q: "Facing North, you turn right. Which direction now?",
        options: ["East", "West", "South", "North"],
        answer: 0,
        sol: "North turn right = East",
      },
      {
        q: "Facing South, you turn left. Which direction?",
        options: ["East", "West", "North", "South"],
        answer: 0,
        sol: "South turn left = East",
      },
      {
        q: "Facing East, you turn around (180°). Which direction?",
        options: ["West", "North", "South", "East"],
        answer: 0,
        sol: "Opposite of East = West",
      },
      {
        q: "5 km North then 5 km East. Direction from start?",
        options: ["North-East", "North-West", "South-East", "South-West"],
        answer: 0,
        sol: "Up + right = North-East",
      },
      {
        q: "Facing West, you turn right. Which direction?",
        options: ["North", "South", "East", "West"],
        answer: 0,
        sol: "West turn right = North",
      },
    ],
  },
  "Odd One & Series": {
    emoji: "🧩",
    questions: [
      {
        q: "Find the odd one: 3, 5, 7, 9, 11",
        options: ["3", "5", "9", "11"],
        answer: 2,
        sol: "All are prime except 9",
      },
      {
        q: "Find the odd one: Dog, Cat, Cow, Rose",
        options: ["Dog", "Cat", "Rose", "Cow"],
        answer: 2,
        sol: "Rose is a flower, rest are animals",
      },
      {
        q: "Find the odd one: 2, 4, 8, 16, 20",
        options: ["8", "16", "20", "4"],
        answer: 2,
        sol: "20 is not a power of 2",
      },
      {
        q: "2, 4, 6, 8, ? (next)",
        options: ["9", "10", "11", "12"],
        answer: 1,
        sol: "+2 → 10",
      },
      {
        q: "Which day is 3 days after Monday?",
        options: ["Wednesday", "Thursday", "Friday", "Tuesday"],
        answer: 1,
        sol: "Mon +3 = Thursday",
      },
      {
        q: "1, 4, 9, 16, ? (next)",
        options: ["20", "25", "24", "36"],
        answer: 1,
        sol: "Squares → 5² = 25",
      },
    ],
  },
  "Inequality & Order": {
    emoji: "📐",
    questions: [
      {
        q: "If A > B and B > C, then?",
        options: ["A > C", "A < C", "A = C", "Can't say"],
        answer: 0,
        sol: "A > B > C, so A > C",
      },
      {
        q: "P < Q, Q < R. Who is the largest?",
        options: ["R", "P", "Q", "Can't say"],
        answer: 0,
        sol: "P < Q < R → R is largest",
      },
      {
        q: "In a line of 5, Ram is 2nd. How many are ahead of him?",
        options: ["1", "2", "3", "0"],
        answer: 0,
        sol: "2nd means 1 person ahead",
      },
      {
        q: "In a line of 10, Sita is 4th. How many are behind her?",
        options: ["6", "5", "7", "4"],
        answer: 0,
        sol: "10 − 4 = 6 behind",
      },
      {
        q: "X ≥ Y, Y > Z. Relation between X and Z?",
        options: ["X > Z", "X < Z", "X = Z", "Can't say"],
        answer: 0,
        sol: "X ≥ Y > Z → X > Z",
      },
      {
        q: "A < B < C < D. Who is the smallest?",
        options: ["A", "B", "C", "D"],
        answer: 0,
        sol: "A is the smallest",
      },
    ],
  },
  Syllogism: {
    emoji: "🔤",
    questions: [
      {
        q: "All cats are animals. All animals are living. Conclusion?",
        options: [
          "All cats are living",
          "No cat is living",
          "Some cats are not living",
          "Can't say",
        ],
        answer: 0,
        sol: "cats → animals → living, so all cats are living",
      },
      {
        q: "All pens are red. Some red are big. Conclusion: Some pens are big?",
        options: ["Follows", "Does not follow", "Both true", "None"],
        answer: 1,
        sol: "'Some red are big' need not include pens — does not follow",
      },
      {
        q: "No dog is a cat. All cats are pets. Conclusion?",
        options: [
          "Some pets are not dogs",
          "All pets are dogs",
          "No pet is a dog",
          "All dogs are pets",
        ],
        answer: 0,
        sol: "Cats are pets but not dogs → some pets are not dogs",
      },
      {
        q: "All roses are flowers. Some flowers fade quickly. Conclusion: Some roses fade quickly?",
        options: ["Follows", "Does not follow", "Definitely true", "None"],
        answer: 1,
        sol: "Fading flowers may not be roses — does not follow",
      },
      {
        q: "Some books are pens. All pens are blue. Conclusion?",
        options: [
          "Some books are blue",
          "All books are blue",
          "No book is blue",
          "Can't say",
        ],
        answer: 0,
        sol: "Books that are pens are blue → some books are blue",
      },
    ],
  },
  "Puzzles & Seating": {
    emoji: "🪑",
    questions: [
      {
        q: "5 friends in a row: A is 3rd from left, B is immediately right of A. B's position from left?",
        options: ["4th", "2nd", "5th", "3rd"],
        answer: 0,
        sol: "A is 3rd, immediately right = 4th",
      },
      {
        q: "In a circle of 6, P faces centre. Person opposite P is 3 seats away. True/False?",
        options: ["True", "False", "Can't say", "Depends"],
        answer: 0,
        sol: "In 6-seat circle, opposite = 3 seats away",
      },
      {
        q: "A row of 7: X is exactly in the middle. X's position from left?",
        options: ["4th", "3rd", "5th", "4th from right only"],
        answer: 0,
        sol: "Middle of 7 = (7+1)/2 = 4th",
      },
      {
        q: "6 people in a line. Ravi is 2nd from right. His position from left?",
        options: ["5th", "4th", "6th", "3rd"],
        answer: 0,
        sol: "6 − 2 + 1 = 5th from left",
      },
      {
        q: "P, Q, R, S sit in a row. P is left of Q, R is right of Q, S is right of R. Who is last?",
        options: ["S", "P", "Q", "R"],
        answer: 0,
        sol: "Order P Q R S → S is last",
      },
    ],
  },
  "Data Interpretation": {
    emoji: "📊",
    questions: [
      {
        q: "Shop sold — Pens: 120, Books: 80, Bags: 100. Total items sold?",
        options: ["300", "280", "320", "290"],
        answer: 0,
        sol: "120 + 80 + 100 = 300",
      },
      {
        q: "Class scores — Maths: 60, Science: 75, English: 65. Highest scoring subject?",
        options: ["Science", "Maths", "English", "Equal"],
        answer: 0,
        sol: "75 is the highest (Science)",
      },
      {
        q: "Sales — Jan: 200, Feb: 250. Difference between Feb and Jan?",
        options: ["50", "40", "60", "45"],
        answer: 0,
        sol: "250 − 200 = 50",
      },
    ],
  },
};
