// ===== Dynamic question generators =====
// Har call pe naye random numbers ke saath exam-level question banata hai.
// Return format app.js jaisa: { q, options: [4 strings], answer: index, sol }

const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[rnd(0, arr.length - 1)];

// ===== Difficulty control =====
// app.js calls setDifficulty() before building a quiz: "easy" | "medium" | "exam".
let DIFFICULTY = "easy";
function setDifficulty(level) {
  DIFFICULTY = level === "medium" || level === "exam" ? level : "easy";
}
// Return a value chosen by the current difficulty.
const D = (easy, medium, exam) =>
  DIFFICULTY === "exam" ? exam : DIFFICULTY === "medium" ? medium : easy;

// 4 unique options banata hai, correct answer random position pe.
function makeOptions(correct, distractors) {
  const set = new Set([String(correct)]);
  const opts = [String(correct)];
  for (const d of distractors) {
    const s = String(d);
    if (!set.has(s) && opts.length < 4) {
      set.add(s);
      opts.push(s);
    }
  }
  // agar kam pad gaye toh aas-paas ke numbers se bharo
  let delta = 1;
  while (opts.length < 4) {
    const cand = String(Number(correct) + delta);
    if (!set.has(cand)) {
      set.add(cand);
      opts.push(cand);
    }
    delta = delta > 0 ? -delta : -delta + 1;
  }
  const shuffled = opts.sort(() => Math.random() - 0.5);
  return { options: shuffled, answer: shuffled.indexOf(String(correct)) };
}

const GENERATORS = {
  Simplification: () => {
    const a = rnd(2, D(20, 50, 99)),
      b = rnd(2, D(20, 40, 60)),
      c = rnd(2, D(12, 60, 200));
    const type = rnd(1, 3);
    let q, ans, explain, trick;
    if (type === 1) {
      ans = a * b + c;
      q = `${a} × ${b} + ${c} = ?`;
      explain = [
        `Follow BODMAS: do multiplication before addition.`,
        `${a} × ${b} = ${a * b}`,
        `Now add ${c}: ${a * b} + ${c} = ${ans}`,
      ];
      trick = `Always multiply first, then add. Multiply in parts if needed: ${a}×${b} = ${a}×10 + ${a}×${b - 10 > 0 ? b - 10 : b}...`;
    } else if (type === 2) {
      const p = rnd(1, 4) * 25;
      const n = rnd(2, D(10, 25, 50)) * 20;
      ans = Math.round((p / 100) * n);
      q = `${p}% of ${n} = ?`;
      explain = [
        `"% of" means (percent ÷ 100) × number.`,
        `1% of ${n} = ${n} ÷ 100 = ${n / 100}`,
        `${p}% = ${n / 100} × ${p} = ${ans}`,
      ];
      trick = `Find 1% first (drop 2 zeros): ${n} → ${n / 100}. Then multiply by ${p}.`;
    } else {
      ans = a * b - c;
      q = `${a} × ${b} − ${c} = ?`;
      explain = [
        `Follow BODMAS: multiply before subtracting.`,
        `${a} × ${b} = ${a * b}`,
        `Now subtract ${c}: ${a * b} − ${c} = ${ans}`,
      ];
      trick = `Multiply first, then subtract. Break the multiplication into tens + units for speed.`;
    }
    const { options, answer } = makeOptions(ans, [
      ans + rnd(1, 9),
      ans - rnd(1, 9),
      ans + rnd(10, 20),
    ]);
    return { q, options, answer, sol: `= ${ans}`, explain, trick };
  },

  "Number Series": () => {
    const start = rnd(2, D(9, 15, 25));
    const step = pick(D([2, 3], [2, 3, 4], [3, 4, 5]));
    const type = rnd(1, 2);
    let seq = [start],
      sol,
      ans,
      explain,
      trick;
    if (type === 1) {
      for (let i = 1; i < 5; i++) seq.push(seq[i - 1] * step);
      ans = seq[4] * step;
      sol = `×${step} each time → ${ans}`;
      explain = [
        `Look at how each number relates to the previous one.`,
        `${seq[0]} × ${step} = ${seq[1]}, ${seq[1]} × ${step} = ${seq[2]} ... the pattern is ×${step}.`,
        `So the next term = ${seq[4]} × ${step} = ${ans}`,
      ];
      trick = `Divide two consecutive terms to spot the ratio. Here each is ${step}× the previous.`;
    } else {
      let add = rnd(2, D(5, 8, 12));
      const firstAdd = add;
      for (let i = 1; i < 5; i++) {
        seq.push(seq[i - 1] + add);
        add += 2;
      }
      ans = seq[4] + add;
      sol = `differences increase by 2 → ${ans}`;
      explain = [
        `Check the difference between consecutive terms.`,
        `Differences are +${firstAdd}, +${firstAdd + 2}, +${firstAdd + 4}, +${firstAdd + 6} ... increasing by 2 each time.`,
        `Next difference = +${add}, so next term = ${seq[4]} + ${add} = ${ans}`,
      ];
      trick = `When ratios don't match, check the differences — here they grow by a fixed amount (2).`;
    }
    const q = `${seq.join(", ")}, ?`;
    const { options, answer } = makeOptions(ans, [
      ans + rnd(2, 8),
      ans - rnd(2, 8),
      ans + rnd(9, 15),
    ]);
    return { q, options, answer, sol, explain, trick };
  },

  "Percentage & Average": () => {
    const type = rnd(1, 2);
    let q, ans, sol, explain, trick;
    if (type === 1) {
      const p = rnd(1, 8) * 5,
        k = rnd(3, D(12, 30, 60));
      ans = 20 * k;
      const val = (p / 5) * k; // exactly p% of ans, always a whole number
      q = `${p}% of a number is ${val}. Find the number.`;
      sol = `${val} ÷ ${p} × 100 = ${ans}`;
      explain = [
        `${p}% of the number = ${val}.`,
        `So 1% of the number = ${val} ÷ ${p} = ${val / p}`,
        `Full number (100%) = ${val / p} × 100 = ${ans}`,
      ];
      trick = `Find 1% by dividing the value by the percent, then ×100 for the whole number.`;
    } else {
      const n = rnd(3, D(6, 8, 12)),
        avg = rnd(10, D(40, 80, 150));
      ans = n * avg;
      q = `The average of ${n} numbers is ${avg}. Find their total sum.`;
      sol = `${avg} × ${n} = ${ans}`;
      explain = [
        `Average = Sum ÷ Count.`,
        `So Sum = Average × Count = ${avg} × ${n}`,
        `Sum = ${ans}`,
      ];
      trick = `Sum = Average × how many numbers. Just multiply.`;
    }
    const { options, answer } = makeOptions(ans, [
      ans + rnd(5, 20),
      ans - rnd(5, 20),
      ans + rnd(21, 40),
    ]);
    return { q, options, answer, sol, explain, trick };
  },

  "Profit & Loss": () => {
    const cp = rnd(2, D(20, 40, 80)) * 50,
      pct = rnd(1, D(5, 8, 12)) * 5;
    const profit = rnd(0, 1) === 1;
    const sp = profit
      ? Math.round(cp * (1 + pct / 100))
      : Math.round(cp * (1 - pct / 100));
    const type = rnd(1, 2);
    let q, ans, sol, explain, trick;
    if (type === 1) {
      q = `CP is ₹${cp}, ${profit ? "profit" : "loss"} ${pct}%. Find the SP.`;
      ans = sp;
      sol = `${cp} ${profit ? "+" : "−"} ${pct}% of ${cp} = ${sp}`;
      explain = [
        `${pct}% of CP = ${cp} × ${pct}/100 = ${(cp * pct) / 100}`,
        profit
          ? `Profit means add it to CP: ${cp} + ${(cp * pct) / 100} = ${sp}`
          : `Loss means subtract it from CP: ${cp} − ${(cp * pct) / 100} = ${sp}`,
      ];
      trick = `SP = CP ${profit ? "+" : "−"} (${pct}% of CP). Find the % part first, then ${profit ? "add" : "subtract"}.`;
    } else {
      q = `CP is ₹${cp}, SP is ₹${sp}. Find the ${profit ? "profit" : "loss"} %.`;
      ans = pct;
      sol = `${Math.abs(sp - cp)}/${cp} × 100 = ${pct}%`;
      explain = [
        `${profit ? "Profit" : "Loss"} = |SP − CP| = |${sp} − ${cp}| = ${Math.abs(sp - cp)}`,
        `% = (${profit ? "Profit" : "Loss"} ÷ CP) × 100 = (${Math.abs(sp - cp)} ÷ ${cp}) × 100`,
        `= ${pct}%`,
      ];
      trick = `Profit/Loss % is always calculated on CP: (difference ÷ CP) × 100.`;
      const { options, answer } = makeOptions(pct + "%", [
        pct + 5 + "%",
        pct - 5 + "%",
        pct + 10 + "%",
      ]);
      return { q, options, answer, sol, explain, trick };
    }
    const { options, answer } = makeOptions(ans, [
      ans + rnd(10, 40),
      ans - rnd(10, 40),
      ans + rnd(41, 80),
    ]);
    return { q, options, answer, sol, explain, trick };
  },

  "SI & CI": () => {
    const p = rnd(2, D(20, 40, 80)) * 500,
      r = rnd(1, D(5, 8, 12)) * 2,
      t = rnd(1, D(4, 6, 10));
    const si = (p * r * t) / 100;
    const q = `Find the SI on ₹${p} at ${r}% per annum for ${t} years.`;
    const { options, answer } = makeOptions(si, [
      si + rnd(20, 100),
      si - rnd(20, 100),
      si + rnd(101, 200),
    ]);
    return {
      q,
      options,
      answer,
      sol: `(${p}×${r}×${t})/100 = ${si}`,
      explain: [
        `Formula: SI = (P × R × T) ÷ 100`,
        `Here P = ${p}, R = ${r}, T = ${t}.`,
        `SI = (${p} × ${r} × ${t}) ÷ 100 = ${p * r * t} ÷ 100 = ${si}`,
      ],
      trick: `Do R × T first (= ${r * t}), then take that % of P: ${r * t}% of ${p} = ${si}.`,
    };
  },

  "Ratio & Ages": () => {
    const x = rnd(2, D(6, 9, 15)),
      y = rnd(2, D(6, 9, 15));
    if (x === y) return GENERATORS["Ratio & Ages"]();
    const mult = rnd(3, D(12, 30, 60));
    const total = (x + y) * mult;
    const big = Math.max(x, y);
    const bigPart = big * mult;
    const q = `Divide ₹${total} in the ratio ${x}:${y}. Find the larger share.`;
    const { options, answer } = makeOptions(bigPart, [
      bigPart + rnd(5, 30),
      bigPart - rnd(5, 30),
      Math.min(x, y) * mult,
    ]);
    return {
      q,
      options,
      answer,
      sol: `${total} × ${big}/${x + y} = ${bigPart}`,
      explain: [
        `Total ratio parts = ${x} + ${y} = ${x + y}`,
        `Value of 1 part = ${total} ÷ ${x + y} = ${mult}`,
        `Larger share = ${big} parts = ${big} × ${mult} = ${bigPart}`,
      ],
      trick: `Add ratio numbers (${x + y}), divide total by it to get 1 part (${mult}), then multiply by the larger ratio (${big}).`,
    };
  },

  "Speed & Time": () => {
    const speed = rnd(4, D(12, 20, 40)) * 10,
      time = rnd(2, D(6, 9, 14));
    const dist = speed * time;
    const type = rnd(1, 2);
    let q, ans, sol, explain, trick;
    if (type === 1) {
      q = `How many hours to cover ${dist} km at ${speed} km/h?`;
      ans = time;
      sol = `${dist} ÷ ${speed} = ${time} hrs`;
      explain = [
        `Formula: Time = Distance ÷ Speed`,
        `Time = ${dist} ÷ ${speed}`,
        `= ${time} hours`,
      ];
      trick = `Time = Distance ÷ Speed. Cancel common zeros: ${dist} ÷ ${speed} → ${dist / 10} ÷ ${speed / 10}.`;
    } else {
      q = `A vehicle covers ${dist} km in ${time} hours. Find the speed.`;
      ans = speed;
      sol = `${dist} ÷ ${time} = ${speed} km/h`;
      explain = [
        `Formula: Speed = Distance ÷ Time`,
        `Speed = ${dist} ÷ ${time}`,
        `= ${speed} km/h`,
      ];
      trick = `Speed = Distance ÷ Time. Think "what × ${time} = ${dist}?" → ${speed}.`;
    }
    const { options, answer } = makeOptions(ans, [
      ans + rnd(1, 3),
      ans - rnd(1, 3) > 0 ? ans - rnd(1, 3) : ans + 4,
      ans + rnd(4, 6),
    ]);
    return { q, options, answer, sol, explain, trick };
  },

  "Time & Work": () => {
    const men = rnd(3, D(10, 20, 40)) * 2,
      days = rnd(2, D(12, 24, 40));
    const total = men * days;
    const newMen = men / 2;
    const newDays = total / newMen;
    const q = `${men} men finish a work in ${days} days. How many days will ${newMen} men take?`;
    const { options, answer } = makeOptions(newDays, [
      newDays + rnd(2, 6),
      newDays - rnd(1, 4) > 0 ? newDays - rnd(1, 4) : newDays + 8,
      days,
    ]);
    return {
      q,
      options,
      answer,
      sol: `${men}×${days} = ${total}, ÷ ${newMen} = ${newDays}`,
      explain: [
        `Total work = Men × Days = ${men} × ${days} = ${total} man-days.`,
        `This total stays the same.`,
        `New days = Total ÷ New men = ${total} ÷ ${newMen} = ${newDays}`,
      ],
      trick: `Men × Days is constant. Fewer men → more days. Half the men (${newMen}) means double the days.`,
    };
  },

  "Coding-Decoding": () => {
    const words = [
      "CAT",
      "DOG",
      "SUN",
      "PEN",
      "CAP",
      "BAT",
      "CUP",
      "FAN",
      "MAP",
      "BUS",
    ];
    const w = pick(words);
    const shift = rnd(1, D(3, 5, 9));
    const code = (word, s) =>
      word
        .split("")
        .map((ch) =>
          String.fromCharCode(((ch.charCodeAt(0) - 65 + s) % 26) + 65),
        )
        .join("");
    const coded = code(w, shift);
    const q = `If each letter is shifted by +${shift}, then ${w} → ?`;
    const { options, answer } = makeOptions(coded, [
      code(w, shift + 1),
      code(w, shift + 25),
      w,
    ]);
    const letters = w
      .split("")
      .map(
        (ch) =>
          `${ch} → ${String.fromCharCode(((ch.charCodeAt(0) - 65 + shift) % 26) + 65)}`,
      )
      .join(", ");
    return {
      q,
      options,
      answer,
      sol: `each letter +${shift} → ${coded}`,
      explain: [
        `Move every letter forward by ${shift} in the alphabet.`,
        letters,
        `So ${w} becomes ${coded}.`,
      ],
      trick: `Memorise letter positions (A=1..Z=26). Add ${shift}; if you cross Z, wrap back to A.`,
    };
  },

  "Direction Sense": () => {
    const dirs = ["North", "East", "South", "West"];
    const start = rnd(0, 3);
    const turnRight = rnd(0, 1) === 1;
    const result = dirs[(start + (turnRight ? 1 : 3)) % 4];
    const q = `Facing ${dirs[start]}, you turn ${turnRight ? "right" : "left"}. Which direction now?`;
    const { options, answer } = makeOptions(
      result,
      dirs.filter((d) => d !== result),
    );
    return {
      q,
      options,
      answer,
      sol: `${dirs[start]} turn ${turnRight ? "right" : "left"} = ${result}`,
      explain: [
        `Picture the compass: North, East, South, West go clockwise.`,
        `A right turn moves clockwise, a left turn moves anticlockwise.`,
        `Facing ${dirs[start]}, turning ${turnRight ? "right" : "left"} → ${result}.`,
      ],
      trick: `Clockwise order: N → E → S → W → N. Right = next, Left = previous.`,
    };
  },

  "Data Interpretation": () => {
    // Small table: sales of 3 items across 2 shops, ask a computed question.
    const items = ["Pens", "Books", "Bags"];
    const shopA = items.map(() => rnd(2, D(20, 40, 80)) * 10);
    const shopB = items.map(() => rnd(2, D(20, 40, 80)) * 10);
    const table =
      `Shop A → ${items[0]}: ${shopA[0]}, ${items[1]}: ${shopA[1]}, ${items[2]}: ${shopA[2]}. ` +
      `Shop B → ${items[0]}: ${shopB[0]}, ${items[1]}: ${shopB[1]}, ${items[2]}: ${shopB[2]}.`;
    const type = rnd(1, 3);
    let q, ans, explain, trick;
    if (type === 1) {
      const i = rnd(0, 2);
      ans = shopA[i] + shopB[i];
      q = `${table}\nTotal ${items[i]} sold in both shops?`;
      explain = [
        `Add ${items[i]} from Shop A and Shop B.`,
        `${shopA[i]} + ${shopB[i]} = ${ans}`,
      ];
      trick = `For "total across shops", just add the two values in that column.`;
    } else if (type === 2) {
      const totalA = shopA[0] + shopA[1] + shopA[2];
      ans = totalA;
      q = `${table}\nTotal items sold by Shop A?`;
      explain = [
        `Add all three items of Shop A.`,
        `${shopA[0]} + ${shopA[1]} + ${shopA[2]} = ${ans}`,
      ];
      trick = `Row total = add every value in that shop's row.`;
    } else {
      const i = rnd(0, 2);
      const diff = Math.abs(shopA[i] - shopB[i]);
      ans = diff;
      q = `${table}\nDifference of ${items[i]} sold between Shop A and Shop B?`;
      explain = [
        `Subtract the smaller from the larger for ${items[i]}.`,
        `|${shopA[i]} − ${shopB[i]}| = ${ans}`,
      ];
      trick = `"Difference" = bigger value − smaller value in that column.`;
    }
    const { options, answer } = makeOptions(ans, [
      ans + rnd(5, 30),
      ans - rnd(5, 30) > 0 ? ans - rnd(5, 30) : ans + 40,
      ans + rnd(31, 60),
    ]);
    return { q, options, answer, sol: `= ${ans}`, explain, trick };
  },
};
