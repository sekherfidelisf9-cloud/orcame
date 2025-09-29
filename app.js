// Simple transactions using localStorage
const desc = id('description'), amt = id('amount'), addBtn = id('addBtn');
const transactionsEl = id('transactions'), balanceEl = id('balance');
const exportBtn = id('exportBtn'), clearBtn = id('clearBtn');

let tx = JSON.parse(localStorage.getItem('orcame_tx')||'[]');

function id(i){return document.getElementById(i)}

function save(){ localStorage.setItem('orcame_tx', JSON.stringify(tx)); render(); }

function addTransaction(){ 
  const d = desc.value.trim(); const a = parseFloat(amt.value);
  if(!d || isNaN(a)) return alert('Preencha descrição e valor válido');
  tx.push({id:Date.now(), description:d, amount:a});
  desc.value=''; amt.value=''; save();
}

function removeTransaction(id){
  tx = tx.filter(t=>t.id!==id); save();
}

function render(){
  transactionsEl.innerHTML='';
  let total = 0;
  tx.forEach(t=>{
    total += t.amount;
    const li = document.createElement('li');
    li.innerHTML = `<span>${t.description}</span><span>R$ ${t.amount.toFixed(2)} <button data-id="${t.id}" class="rm">x</button></span>`;
    transactionsEl.appendChild(li);
  });
  balanceEl.textContent = `R$ ${total.toFixed(2)}`;
  document.querySelectorAll('.rm').forEach(b=>b.addEventListener('click', e => removeTransaction(Number(e.target.dataset.id))));
}

function exportCSV(){
  if(tx.length===0) return alert('Sem transações');
  const header = ['id','description','amount','date'];
  const rows = tx.map(r=>[r.id, `"${r.description.replace(/"/g,'""')}"`, r.amount, new Date(r.id).toISOString()]);
  const csv = [header.join(','), ...rows.map(r=>r.join(','))].join('\n');
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'orcame_transactions.csv'; a.click();
  URL.revokeObjectURL(url);
}

addBtn.addEventListener('click', addTransaction);
exportBtn.addEventListener('click', exportCSV);
clearBtn.addEventListener('click', ()=>{ if(confirm('Limpar tudo?')){ tx=[]; save(); }});

render();
