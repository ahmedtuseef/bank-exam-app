// Cloud sync via Supabase — saves your progress to your account.
// The publishable key below is public/safe for the browser (RLS protects data).
const SB_URL = "https://zmbhoznxzzivoifzsgkx.supabase.co";
const SB_KEY = "sb_publishable_BW3JEIVMnFY2XrNcMbkAdg_fLdt-Pxz";
const CLOUD_STORE_KEY = "rrb_prep_store";

let supa = null;
try {
  if (window.supabase && window.supabase.createClient) {
    supa = window.supabase.createClient(SB_URL, SB_KEY);
  }
} catch {
  supa = null;
}

const $c = (id) => document.getElementById(id);

function setAuthUI(user) {
  const status = $c("authStatus");
  const loginBtn = $c("loginBtn");
  const logoutBtn = $c("logoutBtn");
  if (user) {
    if (status)
      status.textContent = `✅ Logged in: ${user.email}. Progress cloud par save ho raha hai.`;
    if (loginBtn) loginBtn.hidden = true;
    if (logoutBtn) logoutBtn.hidden = false;
  } else {
    if (status)
      status.textContent =
        "Login karo taaki progress har device par safe rahe.";
    if (loginBtn) loginBtn.hidden = false;
    if (logoutBtn) logoutBtn.hidden = true;
  }
}

async function loadCloud(userId) {
  const { data, error } = await supa
    .from("progress")
    .select("data")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) return null;
  return data ? data.data : null;
}

async function pushCloud() {
  if (!supa) return;
  const res = await supa.auth.getUser();
  const user = res && res.data ? res.data.user : null;
  if (!user) return;
  const local = localStorage.getItem(CLOUD_STORE_KEY);
  const payload = local ? JSON.parse(local) : {};
  await supa.from("progress").upsert({
    user_id: user.id,
    data: payload,
    updated_at: new Date().toISOString(),
  });
}

// Debounced push so we don't hit the API on every tiny change.
let pushTimer = null;
window.cloudSync = function () {
  if (!supa) return;
  clearTimeout(pushTimer);
  pushTimer = setTimeout(pushCloud, 1500);
};

async function onLogin(user) {
  setAuthUI(user);
  const cloud = await loadCloud(user.id);
  if (cloud && Object.keys(cloud).length) {
    // Cloud is the source of truth on login.
    localStorage.setItem(CLOUD_STORE_KEY, JSON.stringify(cloud));
    if (typeof renderStats === "function") renderStats();
    if (typeof buildTopics === "function") buildTopics();
  } else {
    // First login on this account: seed cloud with local data.
    pushCloud();
  }
}

function openAuth() {
  const m = $c("authModal");
  if (m) m.hidden = false;
}
function closeAuth() {
  const m = $c("authModal");
  if (m) m.hidden = true;
}

async function doSignUp() {
  const email = $c("authEmail").value.trim();
  const pass = $c("authPass").value;
  const msg = $c("authMsg");
  if (!email || pass.length < 6) {
    msg.textContent = "Sahi email aur 6+ character ka password daalo.";
    return;
  }
  const { data, error } = await supa.auth.signUp({ email, password: pass });
  if (error) {
    msg.textContent = "⚠️ " + error.message;
    return;
  }
  if (data.session) {
    msg.textContent = "✅ Account ban gaya!";
    closeAuth();
  } else {
    msg.textContent =
      "✉️ Email par confirmation link bheja hai. Confirm karke Sign In karo.";
  }
}

async function doSignIn() {
  const email = $c("authEmail").value.trim();
  const pass = $c("authPass").value;
  const msg = $c("authMsg");
  const { error } = await supa.auth.signInWithPassword({
    email,
    password: pass,
  });
  if (error) {
    msg.textContent = "⚠️ " + error.message;
    return;
  }
  msg.textContent = "";
  closeAuth();
}

async function doSignOut() {
  await supa.auth.signOut();
  setAuthUI(null);
}

window.addEventListener("DOMContentLoaded", () => {
  const authCard = $c("authCard");
  if (!supa) {
    if (authCard) authCard.hidden = true;
    return;
  }
  if ($c("loginBtn")) $c("loginBtn").onclick = openAuth;
  if ($c("logoutBtn")) $c("logoutBtn").onclick = doSignOut;
  if ($c("authClose")) $c("authClose").onclick = closeAuth;
  if ($c("signInBtn")) $c("signInBtn").onclick = doSignIn;
  if ($c("signUpBtn")) $c("signUpBtn").onclick = doSignUp;

  supa.auth.onAuthStateChange((event, session) => {
    if (session && session.user) {
      if (event === "INITIAL_SESSION" || event === "SIGNED_IN")
        onLogin(session.user);
      else setAuthUI(session.user);
    } else {
      setAuthUI(null);
    }
  });
});
