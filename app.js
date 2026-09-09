let drugs = [];

const main = document.getElementById("main");
const search = document.getElementById("search");
const clearBtn = document.getElementById("clear");

function normalize(s){
  return (s||"").toLowerCase().replace(/[ 　\-ー]/g,"");
}

function remember(name){
  let r = JSON.parse(localStorage.getItem("medRecent") || "[]");
  r = [name, ...r.filter(x=>x!==name)].slice(0,5);
  localStorage.setItem("medRecent", JSON.stringify(r));
}

function home(){
  const recent = JSON.parse(localStorage.getItem("medRecent") || "[]");
  main.innerHTML = `
    <div class="hint">一般名・商品名のどちらでも検索できます。現在${drugs.length}剤を収録しています。</div>
    <div class="section-title">収録薬</div>
    <div class="chips">
      ${drugs.map(d=>`<button class="chip" data-name="${d.name}">${d.name}</button>`).join("")}
    </div>
    ${recent.length ? `
      <div class="section-title" style="margin-top:8px">最近見た薬</div>
      <div class="result-list">
        ${recent.map(n=>{
          const d=drugs.find(x=>x.name===n); if(!d) return "";
          return `<div class="result-item" data-id="${d.id}">
            <div><strong>${d.name}</strong><small>${d.className}</small></div><span class="arrow">›</span>
          </div>`;
        }).join("")}
      </div>` : `
      <div class="empty">
        薬名を入力すると、<br>
        <strong>「何の薬」「主な副作用」「観察ポイント」</strong><br>
        を優先して表示します。
      </div>`}
    <div class="disclaimer">
      <strong>利用上の注意：</strong><br>
      本ツールはケアマネジメント上の情報整理を補助するツールです。診断、処方、服薬変更、中止等の判断には使用しないでください。実際の対応は医師・薬剤師等に確認し、最新の電子添文を参照してください。
    </div>
    <div class="foot-note">Version 1.1.0</div>
  `;
  bindClickable();
}

function searchResults(q){
  const nq=normalize(q);
  if(!nq){home(); return;}
  const hits=drugs.filter(d =>
    d.aliases.some(a=>normalize(a).includes(nq) || nq.includes(normalize(a))) ||
    normalize(d.generic).includes(nq)
  );
  if(!hits.length){
    main.innerHTML = `
      <div class="empty">
        <strong>「${escapeHtml(q)}」は現在の収録データに未登録です。</strong><br><br>
        現在は${drugs.length}剤を収録しています。<br>
        収録薬は順次拡充していきます。
      </div>`;
    return;
  }
  main.innerHTML = `
    <div class="section-title">検索結果 ${hits.length}件</div>
    <div class="result-list">
      ${hits.map(d=>`<div class="result-item" data-id="${d.id}">
        <div><strong>${d.name}</strong><small>${d.generic} ・ ${d.className}</small></div>
        <span class="arrow">›</span>
      </div>`).join("")}
    </div>`;
  bindClickable();
}

function showDrug(id){
  const d=drugs.find(x=>x.id===id);
  if(!d) return;
  remember(d.name);
  search.value=d.name;
  clearBtn.style.display="block";
  main.innerHTML = `
    <button class="back" id="backBtn">← 検索に戻る</button>
    <section class="drug-head">
      <div class="drug-name">${d.name}</div>
      <div class="generic">一般名・成分：${d.generic}</div>
      <span class="tag">${d.className}</span>
    </section>

    <div class="priority-grid">
      <section class="card primary">
        <h2><span class="num">1</span>何の薬か</h2>
        <p>${d.what}</p>
      </section>

      <section class="card warn">
        <h2><span class="num">3</span>主な副作用</h2>
        <ul>${d.common.map(x=>`<li>${x}</li>`).join("")}</ul>
      </section>

      <section class="card care">
        <h2><span class="num">6</span>ケアマネとして観察するなら</h2>
        <ul>${d.care.map(x=>`<li>${x}</li>`).join("")}</ul>
        <div class="important-note">「薬が原因」と決めつけるためではなく、変化に気づいて医療職へつなぐための観察ポイントです。</div>
      </section>
    </div>

    <div class="secondary">
      <details>
        <summary><span><span class="num">2</span>何に使われるか</span></summary>
        <div class="detail-body"><ul>${d.use.map(x=>`<li>${x}</li>`).join("")}</ul></div>
      </details>
      <details>
        <summary><span><span class="num">4</span>見逃したくない副作用</span></summary>
        <div class="detail-body"><ul>${d.serious.map(x=>`<li>${x}</li>`).join("")}</ul></div>
      </details>
      <details>
        <summary><span><span class="num">5</span>服薬上の主な注意</span></summary>
        <div class="detail-body"><ul>${d.caution.map(x=>`<li>${x}</li>`).join("")}</ul></div>
      </details>
    </div>

    <section class="source">
      <div class="source-title">情報源：PMDA 電子添文</div>
      <p>${d.updated}。本ツールでは情報をケアマネ向けに要約しています。</p>
      <a href="${d.source}" target="_blank" rel="noopener noreferrer">PMDAの公式情報を開く ↗</a>
    </section>

    <div class="disclaimer">
      <strong>重要：</strong><br>
      本ツールは薬剤情報の確認を補助するもので、診断・処方・服薬変更・中止を判断するものではありません。症状や服薬について懸念がある場合は、医師・薬剤師等へ確認してください。
    </div>
  `;
  document.getElementById("backBtn").addEventListener("click",()=>{
    search.focus();
    searchResults(search.value);
  });
  window.scrollTo({top:0,behavior:"smooth"});
}

function bindClickable(){
  document.querySelectorAll("[data-id]").forEach(el=>{
    el.addEventListener("click",()=>showDrug(el.dataset.id));
  });
  document.querySelectorAll("[data-name]").forEach(el=>{
    el.addEventListener("click",()=>{
      search.value=el.dataset.name;
      clearBtn.style.display="block";
      const d=drugs.find(x=>x.name===el.dataset.name);
      if(d) showDrug(d.id);
    });
  });
}

function escapeHtml(str){
  return str.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

search.addEventListener("input", e=>{
  clearBtn.style.display=e.target.value ? "block" : "none";
  searchResults(e.target.value);
});
search.addEventListener("keydown", e=>{
  if(e.key==="Enter"){
    const q=normalize(search.value);
    const exact=drugs.find(d=>d.aliases.some(a=>normalize(a)===q) || normalize(d.generic)===q);
    if(exact) showDrug(exact.id);
  }
});
clearBtn.addEventListener("click",()=>{
  search.value="";
  clearBtn.style.display="none";
  search.focus();
  home();
});


function showLoadError() {
  main.innerHTML = `
    <div class="empty">
      <strong>薬剤データを読み込めませんでした。</strong><br><br>
      オンラインの場合は再読み込みしてください。<br>
      オフラインでは、一度オンラインで起動した後に利用できます。
    </div>`;
}

async function init() {
  try {
    const response = await fetch("./drugs.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!data || !Array.isArray(data.drugs)) throw new Error("invalid drugs.json");
    drugs = data.drugs;
    home();
  } catch (error) {
    console.error("Failed to load drugs.json", error);
    showLoadError();
  }
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(error => {
      console.error("Service Worker registration failed", error);
    });
  });
}

init();
