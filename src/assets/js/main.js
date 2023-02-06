'use strict'

async function readJSONFile(file) {
  const response = await fetch(file);
  return await response.json();
}

function insertTransaction(transaction) {
  const txnsContainer = document.getElementById('transactions');
  txnsContainer.innerHTML += (`
    <tr class="transaction">
      <td class="transaction__date">${transaction.date}</td>
      <td class="transaction__type">${transaction.type}</td>
      <td class="transaction__description">${'some description here'}</td>
      <td class="transaction__amount">${transaction.amount}</td>
      <td class="transaction__balance">${transaction.balance}</td>
    </tr>
  `);
}

readJSONFile('data/simple_ledger.json').then((data) => {
  data.forEach(insertTransaction);
});

