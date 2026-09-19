// ===== State =====
const state = {
  mode: "practice", // "practice" | "exam"
  selectedTopics: new Set(),
  quiz: [], // active question list
  idx: 0,
  score: 0,
  answers: [], // { q, chosen, correct, sol, topic }
  timer: null,
  timeLeft: 0,
  perQTime: 45,
  locked: false,
  examEndsAt: 0, // timestamp when exam time is over
};

// Topic groups for exam mode (real RRB Office Assistant sections).
const NUMERICAL_TOPICS = [
  "Simplification",
  "Number Series",
  "Percentage & Average",
  "Profit & Loss",
  "SI & CI",
  "Ratio & Ages",
  "Speed & Time",
  "Time & Work",
  "Data Interpretation",
];
const REASONING_TOPICS = [
  "Coding-Decoding",
  "Direction Sense",
  "Blood Relation",
  "Odd One & Series",
  "Inequality & Order",
  "Syllogism",
  "Puzzles & Seating",
];

// ===== Persistent storage (localStorage) =====
const STORE_KEY = "rrb_prep_store";
function loadStore() {
  try {
    return (
      JSON.parse(localStorage.getItem(STORE_KEY)) || {
        history: [],
        mistakes: [],
        streakDates: [],
      }
    );
  } catch {
    return { history: [], mistakes: [], streakDates: [] };
  }
}
function saveStore(s) {
  localStorage.setItem(STORE_KEY, JSON.stringify(s));
}
function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
// Record a finished test/exam and update streak.
function recordResult(mode, correct, total) {
  const s = loadStore();
  const pct = total ? Math.round((correct / total) * 100) : 0;
  s.history.push({ date: todayStr(), mode, correct, total, pct });
  if (s.history.length > 100) s.history = s.history.slice(-100);
  const t = todayStr();
  if (!s.streakDates.includes(t)) s.streakDates.push(t);
  saveStore(s);
}
// Save wrong questions (full objects) for the mistake notebook.
function addMistakes(list) {
  if (!list.length) return;
  const s = loadStore();
  list.forEach((q) => {
    if (!s.mistakes.some((m) => m.q === q.q)) s.mistakes.push(q);
  });
  if (s.mistakes.length > 200) s.mistakes = s.mistakes.slice(-200);
  saveStore(s);
}
function currentStreak() {
  const s = loadStore();
  const days = new Set(s.streakDates);
  let streak = 0;
  const d = new Date();
  // Count back from today while consecutive days exist.
  for (;;) {
    const key = d.toISOString().slice(0, 10);
    if (days.has(key)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else if (streak === 0 && key === todayStr()) {
      d.setDate(d.getDate() - 1); // allow yesterday if not practiced today yet
    } else {
      break;
    }
  }
  return streak;
}

// ===== Helpers =====
const $ = (id) => document.getElementById(id);
const shuffle = (arr) =>
  arr
    .map((v) => [Math.random(), v])
    .sort((a, b) => a[0] - b[0])
    .map((v) => v[1]);

function showScreen(id) {
  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.remove("active"));
  $(id).classList.add("active");
}

// ===== Build topic grid =====
function buildTopics() {
  const grid = $("topicGrid");
  grid.innerHTML = "";
  const makeCard = (topic) => {
    const data = QUESTION_BANK[topic];
    if (!data) return null;
    const el = document.createElement("div");
    el.className = "topic";
    el.dataset.topic = topic;
    el.innerHTML = `<span class="em">${data.emoji}</span> ${topic} <span class="cnt">${data.questions.length}</span>`;
    el.onclick = () => {
      el.classList.toggle("selected");
      if (el.classList.contains("selected")) state.selectedTopics.add(topic);
      else state.selectedTopics.delete(topic);
    };
    return el;
  };
  const section = (title, topics) => {
    const h = document.createElement("h3");
    h.className = "topic-section";
    h.textContent = title;
    grid.appendChild(h);
    const sub = document.createElement("div");
    sub.className = "topic-grid";
    topics.forEach((t) => {
      const card = makeCard(t);
      if (card) sub.appendChild(card);
    });
    grid.appendChild(sub);
  };
  section("🔢 Numerical Ability (Maths)", NUMERICAL_TOPICS);
  section("🧠 Reasoning", REASONING_TOPICS);
}

// Select or clear all topic cards at once.
function setAllTopics(selected) {
  document.querySelectorAll("#topicGrid .topic").forEach((el) => {
    const topic = el.dataset.topic;
    if (selected) {
      el.classList.add("selected");
      state.selectedTopics.add(topic);
    } else {
      el.classList.remove("selected");
      state.selectedTopics.delete(topic);
    }
  });
}

// ===== Start quiz =====
function startQuiz() {
  if (state.selectedTopics.size === 0) {
    alert("Please select at least one topic!");
    return;
  }
  const count = parseInt($("qCount").value, 10);
  state.perQTime = parseInt($("perQTime").value, 10);
  state.mode = "practice";
  if (typeof setDifficulty === "function") {
    const sel = $("difficulty");
    setDifficulty(sel ? sel.value : "easy");
  }

  const quiz = buildQuiz([...state.selectedTopics], count);
  state.quiz = shuffle(quiz);
  state.idx = 0;
  state.score = 0;
  state.answers = [];
  showScreen("quiz");
  renderQuestion();
}

// Build a list of unique questions from the given topics.
function buildQuiz(topicList, count) {
  const topics = shuffle([...topicList]);
  const quiz = [];
  const seen = new Set(); // question texts already added, to avoid repeats
  const usedFromBank = {};
  for (let i = 0; i < count; i++) {
    const topic = topics[i % topics.length];
    let q = null;
    if (typeof GENERATORS !== "undefined" && GENERATORS[topic]) {
      for (let tries = 0; tries < 25; tries++) {
        const cand = GENERATORS[topic]();
        if (!seen.has(cand.q)) {
          q = cand;
          break;
        }
      }
      if (!q) q = GENERATORS[topic]();
    } else {
      const bank = QUESTION_BANK[topic].questions;
      usedFromBank[topic] = usedFromBank[topic] || shuffle([...bank]);
      while (usedFromBank[topic].length) {
        const cand = usedFromBank[topic].pop();
        if (!seen.has(cand.q)) {
          q = cand;
          break;
        }
      }
      if (!q) q = pick(bank);
    }
    seen.add(q.q);
    quiz.push({ ...q, topic });
  }
  return quiz;
}

// ===== Start full exam (RRB Office Assistant style) =====
function startExam() {
  state.mode = "exam";
  // Real exam feel: use the hardest question level.
  if (typeof setDifficulty === "function") setDifficulty("exam");
  // 40 Numerical + 40 Reasoning = 80 questions, mixed order.
  const numerical = buildQuiz(NUMERICAL_TOPICS, 40);
  const reasoning = buildQuiz(REASONING_TOPICS, 40);
  state.quiz = shuffle([...numerical, ...reasoning]);
  state.idx = 0;
  state.score = 0;
  state.answers = new Array(state.quiz.length).fill(null); // per-question record
  state.examEndsAt = Date.now() + 45 * 60 * 1000; // 45 minutes
  showScreen("quiz");
  $("timerPill").style.display = "";
  startExamTimer();
  renderQuestion();
}

function startExamTimer() {
  clearInterval(state.timer);
  const tick = () => {
    const remain = Math.max(
      0,
      Math.round((state.examEndsAt - Date.now()) / 1000),
    );
    const m = String(Math.floor(remain / 60)).padStart(2, "0");
    const s = String(remain % 60).padStart(2, "0");
    $("timerPill").textContent = `⏱ ${m}:${s}`;
    if (remain <= 0) {
      clearInterval(state.timer);
      finishExam();
    }
  };
  tick();
  state.timer = setInterval(tick, 1000);
}

// ===== Render a question =====
function renderQuestion() {
  state.locked = false;
  const q = state.quiz[state.idx];
  const total = state.quiz.length;

  $("progressPill").textContent = `Q ${state.idx + 1} / ${total}`;
  $("scorePill").textContent = `✅ ${state.score}`;
  $("barFill").style.width = `${(state.idx / total) * 100}%`;
  $("qTopic").textContent = `${QUESTION_BANK[q.topic].emoji} ${q.topic}`;
  $("qText").textContent = q.q;
  $("feedback").textContent = "";
  $("feedback").className = "feedback";
  $("nextBtn").disabled = state.mode === "exam" ? false : true;
  $("explainBtn").hidden = true;
  $("explainBox").hidden = true;
  $("explainBox").innerHTML = "";

  const optBox = $("options");
  optBox.innerHTML = "";
  const keys = ["A", "B", "C", "D"];
  const prev = state.mode === "exam" ? state.answers[state.idx] : null;
  q.options.forEach((opt, i) => {
    const el = document.createElement("button");
    el.className = "opt";
    if (prev && prev.chosenIdx === i) el.classList.add("chosen");
    el.innerHTML = `<span class="key">${keys[i]}</span> ${opt}`;
    el.onclick = () => selectOption(i, el);
    optBox.appendChild(el);
  });

  if (state.mode === "exam") {
    // Exam: single global timer already running; just show attempted count.
    const attempted = state.answers.filter(Boolean).length;
    $("scorePill").textContent = `📝 ${attempted}/${total}`;
    $("nextBtn").textContent = state.idx === total - 1 ? "Submit ✅" : "Next ▶";
    $("prevBtn").hidden = state.idx === 0;
    return;
  }

  $("prevBtn").hidden = true;

  // Practice: per-question timer
  clearInterval(state.timer);
  if (state.perQTime > 0) {
    state.timeLeft = state.perQTime;
    $("timerPill").style.display = "";
    $("timerPill").textContent = `⏱ ${state.timeLeft}`;
    state.timer = setInterval(() => {
      state.timeLeft--;
      $("timerPill").textContent = `⏱ ${state.timeLeft}`;
      if (state.timeLeft <= 0) {
        clearInterval(state.timer);
        timeUp();
      }
    }, 1000);
  } else {
    $("timerPill").style.display = "none";
  }
}

// ===== Option selection =====
function selectOption(chosen, el) {
  const q = state.quiz[state.idx];

  // Exam mode: record answer, allow changing, no reveal.
  if (state.mode === "exam") {
    document
      .querySelectorAll(".opt")
      .forEach((o) => o.classList.remove("chosen"));
    el.classList.add("chosen");
    state.answers[state.idx] = {
      q: q.q,
      chosenIdx: chosen,
      chosen: q.options[chosen],
      correct: q.options[q.answer],
      ok: chosen === q.answer,
      sol: q.sol,
      topic: q.topic,
    };
    const attempted = state.answers.filter(Boolean).length;
    $("scorePill").textContent = `📝 ${attempted}/${state.quiz.length}`;
    return;
  }

  if (state.locked) return;
  state.locked = true;
  clearInterval(state.timer);

  const opts = document.querySelectorAll(".opt");
  opts.forEach((o) => o.classList.add("locked"));

  const isCorrect = chosen === q.answer;
  beep(isCorrect);
  if (isCorrect) {
    el.classList.add("correct");
    state.score++;
    $("scorePill").textContent = `✅ ${state.score}`;
    $("feedback").textContent = `Correct! 🎯  ${q.sol}`;
    $("feedback").className = "feedback ok";
  } else {
    el.classList.add("wrong");
    opts[q.answer].classList.add("correct");
    $("feedback").textContent =
      `Wrong ❌  Correct answer: ${q.options[q.answer]}. ${q.sol}`;
    $("feedback").className = "feedback no";
  }

  showExplainButton(q);

  state.answers.push({
    q: q.q,
    chosen: q.options[chosen],
    correct: q.options[q.answer],
    ok: isCorrect,
    sol: q.sol,
    topic: q.topic,
  });
  $("nextBtn").disabled = false;
}

function timeUp() {
  if (state.locked) return;
  state.locked = true;
  const q = state.quiz[state.idx];
  const opts = document.querySelectorAll(".opt");
  opts.forEach((o) => o.classList.add("locked"));
  opts[q.answer].classList.add("correct");
  $("feedback").textContent =
    `Time up! ⏰ Correct answer: ${q.options[q.answer]}. ${q.sol}`;
  $("feedback").className = "feedback no";
  showExplainButton(q);
  state.answers.push({
    q: q.q,
    chosen: "—",
    correct: q.options[q.answer],
    ok: false,
    sol: q.sol,
    topic: q.topic,
  });
  $("nextBtn").disabled = false;
}

// ===== Next =====
function nextQuestion() {
  if (state.mode === "exam") {
    if (state.idx >= state.quiz.length - 1) {
      finishExam();
      return;
    }
    state.idx++;
    renderQuestion();
    return;
  }
  state.idx++;
  if (state.idx >= state.quiz.length) showResult();
  else renderQuestion();
}

// ===== Exam result (with negative marking) =====
function finishExam() {
  clearInterval(state.timer);
  const total = state.quiz.length;
  let correct = 0,
    wrong = 0,
    attempted = 0;
  let numCorrect = 0,
    reaCorrect = 0;
  state.answers.forEach((a, i) => {
    if (!a) return;
    attempted++;
    if (a.ok) {
      correct++;
      if (NUMERICAL_TOPICS.includes(state.quiz[i].topic)) numCorrect++;
      else reaCorrect++;
    } else {
      wrong++;
    }
  });
  const negative = wrong * 0.25;
  const marks = Math.max(0, correct - negative);

  $("examScore").textContent = `${marks.toFixed(2)} / ${total}`;
  $("examAttempted").textContent = attempted;
  $("examCorrect").textContent = correct;
  $("examWrong").textContent = wrong;
  $("examNeg").textContent = `−${negative.toFixed(2)}`;
  $("examNumerical").textContent = `${numCorrect} / 40`;
  $("examReasoning").textContent = `${reaCorrect} / 40`;

  const pct = (marks / total) * 100;
  let emoji = "📄",
    msg = "Keep practicing full mocks to build stamina.";
  if (pct >= 60) {
    emoji = "🏆";
    msg = "Excellent! You're in a strong position.";
  } else if (pct >= 45) {
    emoji = "🎉";
    msg = "Good attempt! Push accuracy a little higher.";
  } else if (pct >= 30) {
    emoji = "💪";
    msg = "Decent start. Reduce wrong answers to avoid negatives.";
  }
  $("examEmoji").textContent = emoji;
  $("examMsg").textContent = msg;

  // Build review list
  const rev = $("examReview");
  rev.innerHTML = "";
  state.answers.forEach((a, i) => {
    const q = state.quiz[i];
    const el = document.createElement("div");
    const status = !a ? "skip" : a.ok ? "ok" : "no";
    el.className = "rev " + status;
    const icon = !a ? "⚪" : a.ok ? "✅" : "❌";
    const your = !a ? "Not attempted" : `Your answer: ${a.chosen}`;
    el.innerHTML = `<b>${i + 1}. ${q.q}</b>
      <div class="ans">${icon} ${your} ${a && a.ok ? "" : `· Correct: ${q.options[q.answer]}`} <br>💡 ${q.sol}</div>`;
    rev.appendChild(el);
  });

  recordResult("exam", correct, total);
  const wrongQs = state.quiz.filter(
    (q, i) => state.answers[i] && !state.answers[i].ok,
  );
  addMistakes(wrongQs);
  renderStats();

  showScreen("examResult");
}

// ===== Explain button =====
function showExplainButton(q) {
  const btn = $("explainBtn");
  const box = $("explainBox");
  btn.hidden = false;
  box.hidden = true;
  box.innerHTML = "";
  btn.onclick = () => {
    if (!box.hidden) {
      box.hidden = true;
      return;
    }
    box.hidden = false;
    box.innerHTML = buildExplanation(q);
  };
}

function buildExplanation(q) {
  // Prefer detailed steps/trick from the generator; fall back to short solution.
  const steps =
    q.explain && q.explain.length
      ? q.explain
          .map(
            (s, i) =>
              `<div class="step"><span class="num">${i + 1}</span> ${s}</div>`,
          )
          .join("")
      : `<div class="step"><span class="num">1</span> ${q.sol}</div>`;
  const trick = q.trick
    ? `<div class="trick"><b>⚡ Exam trick:</b> ${q.trick}</div>`
    : "";
  return `<div class="explain-title">📘 Step-by-step</div>${steps}${trick}`;
}

// ===== Result =====
function showResult() {
  clearInterval(state.timer);
  showScreen("result");
  const total = state.quiz.length;
  const correct = state.score;
  const wrong = total - correct;
  const pct = Math.round((correct / total) * 100);

  $("resultScore").textContent = `${correct} / ${total}`;
  $("statCorrect").textContent = correct;
  $("statWrong").textContent = wrong;
  $("statPct").textContent = `${pct}%`;

  let emoji = "😐",
    msg = "Keep practicing, you'll get there!";
  if (pct >= 80) {
    emoji = "🏆";
    msg = "Excellent! You're ready for RRB!";
  } else if (pct >= 60) {
    emoji = "🎉";
    msg = "Good score! Push your speed a bit more.";
  } else if (pct >= 40) {
    emoji = "💪";
    msg = "Not bad. Revise your weak topics.";
  }
  $("resultEmoji").textContent = emoji;
  $("resultMsg").textContent = msg;

  const rev = $("review");
  rev.innerHTML = "";
  state.answers.forEach((a, i) => {
    const el = document.createElement("div");
    el.className = "rev " + (a.ok ? "ok" : "no");
    el.innerHTML = `<b>${i + 1}. ${a.q}</b>
      <div class="ans">${a.ok ? "✅" : "❌"} Your answer: ${a.chosen} ${a.ok ? "" : `· Correct: ${a.correct}`} <br>💡 ${a.sol}</div>`;
    rev.appendChild(el);
  });

  // Save progress + wrong questions (skip when revising mistakes).
  if (state.mode !== "revise") {
    recordResult("practice", correct, total);
    const wrongQs = state.quiz.filter(
      (q, i) => state.answers[i] && !state.answers[i].ok,
    );
    addMistakes(wrongQs);
  }
  renderStats();
}

// ===== Theme + Sound =====
const prefs = {
  get theme() {
    return localStorage.getItem("rrb_theme") || "dark";
  },
  set theme(v) {
    localStorage.setItem("rrb_theme", v);
  },
  get sound() {
    return localStorage.getItem("rrb_sound") !== "off";
  },
  set sound(on) {
    localStorage.setItem("rrb_sound", on ? "on" : "off");
  },
};

function applyTheme() {
  document.body.classList.toggle("light", prefs.theme === "light");
  const btn = $("themeBtn");
  if (btn) btn.textContent = prefs.theme === "light" ? "☀️" : "🌙";
}
function toggleTheme() {
  prefs.theme = prefs.theme === "light" ? "dark" : "light";
  applyTheme();
}
function applySoundIcon() {
  const btn = $("soundBtn");
  if (btn) btn.textContent = prefs.sound ? "🔊" : "🔇";
}
function toggleSound() {
  prefs.sound = !prefs.sound;
  applySoundIcon();
  if (prefs.sound) beep(true);
}
// Short beep using Web Audio (no files needed).
let audioCtx = null;
function beep(correct) {
  if (!prefs.sound) return;
  try {
    audioCtx =
      audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.connect(g);
    g.connect(audioCtx.destination);
    o.frequency.value = correct ? 880 : 220;
    g.gain.value = 0.05;
    o.start();
    o.stop(audioCtx.currentTime + 0.12);
  } catch {
    /* audio not available */
  }
}

// ===== Formula & trick sheet =====
const FORMULA_SHEET = [
  {
    title: "🔢 Percentage",
    rows: [
      "x% of N = (x/100) × N",
      "1% = drop 2 zeros (3500 → 35)",
      "Increase/Decrease %: (change ÷ original) × 100",
      "Common: 25%=1/4, 20%=1/5, 12.5%=1/8, 10%=1/10",
    ],
  },
  {
    title: "💰 Profit & Loss",
    rows: [
      "Profit = SP − CP; Loss = CP − SP",
      "Profit% / Loss% = (difference ÷ CP) × 100",
      "SP = CP × (100 ± profit/loss%) / 100",
    ],
  },
  {
    title: "🏦 Simple & Compound Interest",
    rows: [
      "SI = (P × R × T) ÷ 100",
      "Trick: do R×T first, then that % of P",
      "CI Amount = P × (1 + R/100)^T",
      "CI (2 yrs) rate ≈ 2R + R²/100 %",
    ],
  },
  {
    title: "🚄 Speed, Time & Distance",
    rows: [
      "Speed = Distance ÷ Time",
      "km/h → m/s: × 5/18   |   m/s → km/h: × 18/5",
      "Distance = Speed × Time",
    ],
  },
  {
    title: "🛠️ Time & Work",
    rows: [
      "Work = Men × Days (stays constant)",
      "1 day work = 1 ÷ days",
      "Together: 1/A + 1/B ⇒ days = (A×B)/(A+B)",
    ],
  },
  {
    title: "⚖️ Ratio & Average",
    rows: [
      "Split total in a:b ⇒ each part = total ÷ (a+b)",
      "Average = Sum ÷ Count; Sum = Average × Count",
    ],
  },
  {
    title: "🧠 Reasoning quick tips",
    rows: [
      "Direction: N→E→S→W clockwise (Right=next, Left=prev)",
      "Coding: A=1 … Z=26; shift and wrap after Z",
      "Position from left = (Total − right position) + 1",
      "Syllogism: only what MUST be true follows",
    ],
  },
  {
    title: "✖️ Multiply/Divide speed",
    rows: [
      "Cancel common zeros first (1440÷120 → 144÷12)",
      "Division = reverse multiply ('what × 120 = 1440?')",
      "Break multiply: 12×18 = 12×10 + 12×8",
      "Memorise tables 2–20 & squares up to 25",
    ],
  },
];

function renderFormulas() {
  const box = $("formulaContent");
  if (!box) return;
  box.innerHTML = FORMULA_SHEET.map(
    (sec) =>
      `<div class="card"><h2>${sec.title}</h2><ul class="formula-list">${sec.rows
        .map((r) => `<li>${r}</li>`)
        .join("")}</ul></div>`,
  ).join("");
}

// ===== Dashboard stats + Revise Mistakes =====
function renderStats() {
  const s = loadStore();
  const tests = s.history.length;
  const best = tests ? Math.max(...s.history.map((h) => h.pct)) : 0;
  const avg = tests
    ? Math.round(s.history.reduce((a, h) => a + h.pct, 0) / tests)
    : 0;
  $("statTests").textContent = tests;
  $("statBest").textContent = `${best}%`;
  $("statAvg").textContent = `${avg}%`;
  $("statStreak").textContent = `${currentStreak()}🔥`;
  const mCount = s.mistakes.length;
  $("reviseBtn").textContent = `📌 Revise Mistakes (${mCount})`;
  $("reviseBtn").disabled = mCount === 0;
}

// Start a quiz built only from saved mistake questions.
function startRevise() {
  const s = loadStore();
  if (!s.mistakes.length) return;
  state.mode = "revise";
  state.perQTime = 0; // no per-question timer while revising
  state.quiz = shuffle([...s.mistakes]).slice(0, 20);
  state.idx = 0;
  state.score = 0;
  state.answers = [];
  showScreen("quiz");
  renderQuestion();
}

// ===== Bindings =====
window.addEventListener("DOMContentLoaded", () => {
  buildTopics();
  renderStats();
  applyTheme();
  applySoundIcon();
  renderFormulas();
  $("themeBtn").onclick = toggleTheme;
  $("soundBtn").onclick = toggleSound;
  // Dashboard navigation
  $("goPractice").onclick = () => showScreen("home");
  $("goExam").onclick = () => showScreen("examIntro");
  $("goFormulas").onclick = () => showScreen("formulas");
  $("backFromFormulas").onclick = () => showScreen("dashboard");
  $("reviseBtn").onclick = startRevise;
  $("backFromHome").onclick = () => showScreen("dashboard");
  $("backFromExam").onclick = () => showScreen("dashboard");
  $("startExamBtn").onclick = startExam;
  $("examAgainBtn").onclick = () => showScreen("dashboard");

  $("startBtn").onclick = startQuiz;
  $("selectAllBtn").onclick = () => setAllTopics(true);
  $("clearAllBtn").onclick = () => setAllTopics(false);
  $("nextBtn").onclick = nextQuestion;
  $("prevBtn").onclick = () => {
    if (state.idx > 0) {
      state.idx--;
      renderQuestion();
    }
  };
  $("quitBtn").onclick = () => {
    clearInterval(state.timer);
    if (state.mode === "exam") finishExam();
    else showResult();
  };
  $("againBtn").onclick = () => showScreen("home");
  $("resultHomeBtn").onclick = () => showScreen("dashboard");
  $("drillBtn").onclick = startDrill;
  $("drillQuitBtn").onclick = endDrill;
  $("drillAgainBtn").onclick = () => showScreen("home");
  $("drillHomeBtn").onclick = () => showScreen("dashboard");
});

// ===== PWA install prompt =====
let deferredPrompt = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const btn = $("installBtn");
  if (btn) {
    btn.hidden = false;
    btn.onclick = async () => {
      btn.hidden = true;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
    };
  }
});

// ===== Fast Math Drill =====
const drill = {
  timer: null,
  timeLeft: 0,
  correct: 0,
  wrong: 0,
  total: 0,
  type: "mix",
};

function drillQuestion() {
  const type =
    drill.type === "mix" ? (Math.random() < 0.5 ? "mul" : "div") : drill.type;
  let q, ans;
  if (type === "mul") {
    const a = Math.floor(Math.random() * 18) + 2; // 2..19
    const b = Math.floor(Math.random() * 11) + 2; // 2..12
    ans = a * b;
    q = `${a} × ${b} = ?`;
  } else {
    const b = Math.floor(Math.random() * 11) + 2; // divisor 2..12
    const res = Math.floor(Math.random() * 18) + 2; // quotient 2..19
    const a = b * res;
    ans = res;
    q = `${a} ÷ ${b} = ?`;
  }
  // 4 options
  const opts = new Set([ans]);
  while (opts.size < 4) {
    const d = ans + (Math.floor(Math.random() * 9) - 4);
    if (d > 0) opts.add(d);
  }
  const options = [...opts].sort(() => Math.random() - 0.5);
  return { q, ans, options };
}

let currentDrill = null;

function renderDrill() {
  currentDrill = drillQuestion();
  $("drillQ").textContent = currentDrill.q;
  $("drillFeedback").textContent = "";
  const box = $("drillOptions");
  box.innerHTML = "";
  currentDrill.options.forEach((opt) => {
    const el = document.createElement("button");
    el.className = "opt";
    el.textContent = opt;
    el.onclick = () => drillAnswer(opt, el);
    box.appendChild(el);
  });
}

function drillAnswer(chosen, el) {
  beep(chosen === currentDrill.ans);
  if (chosen === currentDrill.ans) {
    drill.correct++;
    el.classList.add("correct");
    $("drillFeedback").textContent = "Correct! 🎯";
    $("drillFeedback").className = "feedback ok";
  } else {
    drill.wrong++;
    el.classList.add("wrong");
    $("drillFeedback").textContent = `Wrong ❌ Correct: ${currentDrill.ans}`;
    $("drillFeedback").className = "feedback no";
  }
  drill.total++;
  $("drillScore").textContent = `✅ ${drill.correct}`;
  setTimeout(renderDrill, 250); // agli ki taraf jaldi badho
}

function startDrill() {
  drill.type = $("drillType").value;
  drill.timeLeft = parseInt($("drillTime").value, 10);
  drill.correct = 0;
  drill.wrong = 0;
  drill.total = 0;
  showScreen("drill");
  $("drillScore").textContent = "✅ 0";
  $("drillTimer").textContent = `⏱ ${drill.timeLeft}`;
  renderDrill();
  clearInterval(drill.timer);
  drill.timer = setInterval(() => {
    drill.timeLeft--;
    $("drillTimer").textContent = `⏱ ${drill.timeLeft}`;
    if (drill.timeLeft <= 0) endDrill();
  }, 1000);
}

function endDrill() {
  clearInterval(drill.timer);
  const duration = parseInt($("drillTime").value, 10);
  const perMin = duration > 0 ? Math.round((drill.correct / duration) * 60) : 0;
  $("drillFinalScore").textContent = `${drill.correct} solved`;
  $("drillCorrect").textContent = drill.correct;
  $("drillWrong").textContent = drill.wrong;
  $("drillSpeed").textContent = perMin;

  let emoji = "💪",
    msg = "Keep practicing, speed will come!";
  if (perMin >= 25) {
    emoji = "🏆";
    msg = "Rocket speed! Amazing!";
  } else if (perMin >= 15) {
    emoji = "🔥";
    msg = "Great speed!";
  } else if (perMin >= 8) {
    emoji = "⚡";
    msg = "Good! Practice daily to get faster.";
  }
  $("drillEmoji").textContent = emoji;
  $("drillMsg").textContent = msg;
  showScreen("drillResult");
}
