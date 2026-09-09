(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const key = 'italia-honeymoon-planner-v1';
  const categories = ['예약', '서류·결제', '렌터카', '짐 챙기기', '출발 전', '기타'];
  const defaults = [
    ['예약', '항공권과 출발·도착 시간 확인'], ['예약', '도시별 숙소 예약'],
    ['예약', '두오모·산마르코·우피치 입장권 예약'], ['예약', '기념일 저녁 식당 예약'],
    ['서류·결제', '여권과 입국 요건 확인'], ['서류·결제', '국제운전면허증·한국 운전면허증 준비'],
    ['서류·결제', '여행자보험 가입'], ['서류·결제', '해외 결제 카드와 유로 현금 준비'],
    ['서류·결제', '항공·숙소·렌트 예약 내역 저장'],
    ['렌터카', '3/28 밀라노 수령·4/9 MXP 반납 예약'], ['렌터카', '부활절 수령 영업시간 확인'],
    ['렌터카', '보험·보증금·주유·겨울 장비 조건 확인'], ['렌터카', '숙소 주차장과 ZTL 진입 경로 확인'],
    ['짐 챙기기', '방풍 외투·보온 의류·장갑'], ['짐 챙기기', '편한 운동화와 미끄럼 방지 신발'],
    ['짐 챙기기', '충전기·보조배터리·멀티 어댑터'], ['짐 챙기기', '상비약과 개인 세면도구'],
    ['짐 챙기기', '스파용 수영복'], ['짐 챙기기', '베네치아 1박용 작은 가방'],
    ['출발 전', '해외 USIM/eSIM과 데이터 사용 준비'], ['출발 전', 'Google 지도 오프라인 지역 저장'],
    ['출발 전', '돌로미티 날씨·리프트 운영 재확인'], ['출발 전', '베네치아 입도료·숙박객 절차 확인'],
    ['출발 전', '공항 이동과 렌터카 반납 위치 확인']
  ];
  const initial = () => ({ tasks: defaults.map(([category, text], i) => ({ id: 'default-' + i, category, text, done: false })), expenses: [] });
  let state = initial();
  let canSave = true;
  const notice = text => { $('save-status').textContent = text; $('save-status').hidden = false; };
  function validState(s) {
    return s && Array.isArray(s.tasks) && Array.isArray(s.expenses) &&
      s.tasks.every(t => t && typeof t.id === 'string' && typeof t.text === 'string' && categories.includes(t.category) && typeof t.done === 'boolean') &&
      s.expenses.every(e => e && typeof e.id === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(e.date) && typeof e.item === 'string' &&
        Number.isSafeInteger(e.cents) && e.cents > 0 && ['EUR', 'KRW'].includes(e.currency) &&
        typeof e.method === 'string' && typeof e.payer === 'string' && typeof e.note === 'string');
  }
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!validState(parsed)) throw new Error('Invalid saved data');
      state = parsed;
    }
  } catch {
    canSave = false;
    notice('저장된 기록을 읽을 수 없습니다. 기존 기록을 보호하기 위해 저장을 중단했습니다. 브라우저 저장 설정을 확인하고 다시 열어주세요.');
  }
  function save() {
    if (!canSave) { notice('현재 변경 내용은 저장되지 않습니다. 브라우저 저장 설정을 확인하세요.'); return; }
    try { localStorage.setItem(key, JSON.stringify(state)); $('save-status').hidden = true; }
    catch { notice('이 브라우저에 저장하지 못했습니다. 페이지를 닫으면 최근 변경 내용이 사라질 수 있습니다.'); }
  }
  const uid = () => globalThis.crypto?.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).slice(2);
  const escape = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money = (cents, currency) => new Intl.NumberFormat('ko-KR', { style: 'currency', currency, minimumFractionDigits: currency === 'EUR' ? 2 : 0, maximumFractionDigits: currency === 'EUR' ? 2 : 0 }).format(cents / 100);

  const tabs = [...document.querySelectorAll('[role="tab"]')];
  function showTab(tab) {
    tabs.forEach(t => {
      const active = t === tab;
      t.setAttribute('aria-selected', String(active)); t.tabIndex = active ? 0 : -1;
      $(t.getAttribute('aria-controls')).hidden = !active;
    });
    if (tab.id === 'tab-itinerary' && typeof map !== 'undefined' && map) requestAnimationFrame(() => map.invalidateSize());
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => showTab(tab));
    tab.addEventListener('keydown', e => {
      let next;
      if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft') next = (i + tabs.length - 1) % tabs.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { e.preventDefault(); showTab(tabs[next]); tabs[next].focus(); }
    });
  });

  function updateProgress() {
    const count = state.tasks.filter(t => t.done).length;
    $('check-progress').textContent = `${state.tasks.length}개 중 ${count}개 완료`;
    $('check-meter').max = Math.max(state.tasks.length, 1); $('check-meter').value = count;
    categories.forEach((category, i) => {
      const group = state.tasks.filter(t => t.category === category);
      if ($('count-' + i)) $('count-' + i).textContent = `${group.filter(t => t.done).length}/${group.length}`;
    });
  }
  function renderTasks() {
    $('check-groups').innerHTML = categories.map((category, i) => {
      const group = state.tasks.filter(t => t.category === category);
      if (!group.length) return '';
      return `<section class="check-group"><h3>${category}<span id="count-${i}"></span></h3>${group.map(t => `<div class="check-row ${t.done ? 'done' : ''}"><label><input type="checkbox" data-task="${escape(t.id)}" ${t.done ? 'checked' : ''}><span>${escape(t.text)}</span></label><button class="icon-button" data-remove-task="${escape(t.id)}" aria-label="${escape(t.text)} 삭제">×</button></div>`).join('')}</section>`;
    }).join('') || '<p class="empty">준비 항목을 추가해 주세요.</p>';
    updateProgress();
  }
  $('check-groups').addEventListener('change', e => {
    const task = state.tasks.find(t => t.id === e.target.dataset.task);
    if (!task) return;
    task.done = e.target.checked; e.target.closest('.check-row').classList.toggle('done', task.done); save(); updateProgress();
  });
  $('check-groups').addEventListener('click', e => {
    const btn = e.target.closest('[data-remove-task]');
    if (!btn) return;
    const task = state.tasks.find(t => t.id === btn.dataset.removeTask);
    if (task && confirm(`“${task.text}” 항목을 삭제할까요?`)) { state.tasks = state.tasks.filter(t => t.id !== task.id); save(); renderTasks(); }
  });
  $('task-form').addEventListener('submit', e => {
    e.preventDefault(); const form = e.currentTarget;
    const text = form.elements.text.value.trim();
    if (!text) { form.elements.text.focus(); return; }
    state.tasks.push({ id: uid(), text, category: form.elements.category.value, done: false });
    save(); renderTasks(); form.elements.text.value = ''; form.elements.text.focus();
  });

  let editing = null;
  const expenseForm = $('expense-form');
  const expenseFields = Object.fromEntries([...expenseForm.elements].filter(el => el.name).map(el => [el.name, el]));
  function openExpense(id = null) {
    editing = id; expenseForm.reset();
    const fields = expenseFields;
    const record = state.expenses.find(e => e.id === id);
    $('expense-form-title').textContent = record ? '경비 수정' : '경비 추가';
    if (record) {
      ['date','item','currency','method','payer','note'].forEach(k => fields[k].value = record[k]);
      fields.amount.value = record.cents / 100;
    } else {
      const now = new Date();
      fields.date.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
    }
    fields.amount.step = fields.currency.value === 'KRW' ? '1' : '0.01';
    fields.amount.min = fields.currency.value === 'KRW' ? '1' : '0.01';
    $('expense-dialog').showModal();
  }
  $('new-expense').onclick = () => openExpense();
  $('close-expense').onclick = $('cancel-expense').onclick = () => $('expense-dialog').close();
  expenseFields.currency.onchange = () => {
    const isWon = expenseFields.currency.value === 'KRW';
    expenseFields.amount.step = isWon ? '1' : '0.01'; expenseFields.amount.min = isWon ? '1' : '0.01';
  };
  expenseForm.addEventListener('submit', e => {
    e.preventDefault();
    const f = expenseFields;
    if (!expenseForm.reportValidity()) return;
    const item = f.item.value.trim(), payer = f.payer.value.trim();
    if (!item || !payer) { (!item ? f.item : f.payer).focus(); return; }
    const cents = Math.round(Number(f.amount.value) * 100);
    if (!Number.isSafeInteger(cents) || cents <= 0) return;
    const record = { id: editing || uid(), date: f.date.value, item, cents, currency: f.currency.value, method: f.method.value, payer, note: f.note.value.trim() };
    if (editing) state.expenses = state.expenses.map(e => e.id === editing ? record : e);
    else state.expenses.push(record);
    save(); renderExpenses(); $('expense-dialog').close();
  });
  function renderExpenses() {
    $('expense-totals').innerHTML = ['EUR', 'KRW'].map(currency => {
      const total = state.expenses.filter(e => e.currency === currency).reduce((sum, e) => sum + e.cents, 0);
      return `<div><span>${currency === 'EUR' ? '유로' : '원화'} 합계</span><strong>${money(total, currency)}</strong></div>`;
    }).join('') + `<p>${state.expenses.length}건 · 통화별 합계</p>`;
    $('expense-empty').hidden = state.expenses.length > 0;
    $('expense-rows').innerHTML = [...state.expenses].sort((a, b) => a.date.localeCompare(b.date)).map(e => `<tr><td data-label="언제">${escape(e.date)}</td><td data-label="무엇에">${escape(e.item)}</td><td data-label="금액" class="money">${money(e.cents,e.currency)} <small>${e.currency}</small></td><td data-label="결제 방법">${escape(e.method)}</td><td data-label="결제자">${escape(e.payer)}</td><td data-label="비고" class="expense-note">${escape(e.note) || '—'}</td><td class="row-actions"><button data-edit="${escape(e.id)}">수정</button><button data-delete="${escape(e.id)}">삭제</button></td></tr>`).join('');
    $('payer-names').innerHTML = [...new Set(state.expenses.map(e => e.payer))].map(name => `<option value="${escape(name)}"></option>`).join('');
  }
  $('expense-rows').addEventListener('click', e => {
    const edit = e.target.closest('[data-edit]'), del = e.target.closest('[data-delete]');
    if (edit) openExpense(edit.dataset.edit);
    if (del) {
      const record = state.expenses.find(x => x.id === del.dataset.delete);
      if (record && confirm(`“${record.item}” 경비를 삭제할까요?`)) { state.expenses = state.expenses.filter(x => x.id !== record.id); save(); renderExpenses(); }
    }
  });
  window.addEventListener('storage', e => {
    if (e.key !== key || !e.newValue) return;
    try { const next = JSON.parse(e.newValue); if (validState(next)) { state = next; renderTasks(); renderExpenses(); } } catch { /* Keep the last valid state. */ }
  });
  renderTasks(); renderExpenses();
})();
