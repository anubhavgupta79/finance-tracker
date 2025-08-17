const loginPage=document.getElementById('loginPage');
const dashboardPage=document.getElementById('dashboardPage');
const loginForm=document.getElementById('loginForm');
const logoutBtn=document.getElementById('logoutBtn');
const txnForm=document.getElementById('txnForm');
const txnTable=document.getElementById('txnTable');
const totalIncome=document.getElementById('totalIncome');
const totalExpenses=document.getElementById('totalExpenses');
const totalSavings=document.getElementById('totalSavings');

// Demo credentials
const USER={username:'admin',password:'1234'};
let transactions=JSON.parse(localStorage.getItem('transactions')||'[]');

// Charts
let pieChart,lineChart;
function renderCharts(){
  const ctx1=document.getElementById('pieChart').getContext('2d');
  const ctx2=document.getElementById('lineChart').getContext('2d');
  const catTotals={};
  transactions.forEach(t=>{if(t.type==='expense'){catTotals[t.category]=(catTotals[t.category]||0)+t.amount;}});
  if(pieChart) pieChart.destroy();
  pieChart=new Chart(ctx1,{type:'pie',data:{labels:Object.keys(catTotals),datasets:[{data:Object.values(catTotals)}]}});
  if(lineChart) lineChart.destroy();
  lineChart=new Chart(ctx2,{type:'line',data:{labels:transactions.map((_,i)=>i+1),datasets:[
    {label:'Income',data:transactions.map(t=>t.type==='income'?t.amount:0),borderColor:'green'},
    {label:'Expenses',data:transactions.map(t=>t.type==='expense'?t.amount:0),borderColor:'red'}]}});
}

function updateUI(){
  txnTable.innerHTML='';
  let income=0,expenses=0;
  transactions.forEach(t=>{
    const row=document.createElement('tr');
    row.innerHTML=`<td>${t.desc}</td><td>₹${t.amount}</td><td>${t.type}</td><td>${t.category}</td>`;
    txnTable.appendChild(row);
    if(t.type==='income') income+=t.amount; else expenses+=t.amount;
  });
  totalIncome.textContent=income;
  totalExpenses.textContent=expenses;
  totalSavings.textContent=income-expenses;
  renderCharts();
}

loginForm.addEventListener('submit',e=>{
  e.preventDefault();
  const u=document.getElementById('username').value;
  const p=document.getElementById('password').value;
  if(u===USER.username && p===USER.password){
    loginPage.classList.remove('active');
    dashboardPage.classList.add('active');
    updateUI();
  }else alert('Invalid credentials');
});

logoutBtn.addEventListener('click',()=>{
  dashboardPage.classList.remove('active');
  loginPage.classList.add('active');
});

txnForm.addEventListener('submit',e=>{
  e.preventDefault();
  const t={
    desc:document.getElementById('desc').value,
    amount:parseFloat(document.getElementById('amount').value),
    type:document.getElementById('type').value,
    category:document.getElementById('category').value
  };
  transactions.push(t);
  localStorage.setItem('transactions',JSON.stringify(transactions));
  txnForm.reset();
  updateUI();
});
