'use strict'

async function readJSONFile(file) {
  const response = await fetch(file);
  return await response.json();
}

function insertTransaction(transaction) {
  const txnsContainer = document.getElementById('transactions');
  txnsContainer.innerHTML += (`
    <tr class="transaction" data-activity-id="${transaction.activity_id}">
      <td class="transaction__date">${transaction.date}</td>
      <td class="transaction__type">${transaction.type}</td>
      <td class="transaction__description">${'some description here'}</td>
      <td class="transaction__amount">${transaction.amount}</td>
      <td class="transaction__balance">${transaction.balance}</td>
    </tr>
  `);
}

function getUniqueTransactions(duplicateTransactions) {
  const uniqueIds = {};
  const uniqueTransactions = [];

  for (const transaction of duplicateTransactions) {
    if (uniqueIds[transaction.activity_id] === undefined) {
      uniqueIds[transaction.activity_id] = 0;
      uniqueTransactions.push(transaction);
    } else {
      uniqueIds[transaction.activity_id] += 1;
    }
  }

  return uniqueTransactions;
}

readJSONFile('data/simple_ledger.json').then((data) => {
  data.forEach(insertTransaction);
});

readJSONFile('data/duplicate_ledger.json').then((data) => {
  const uniqueTransactions = getUniqueTransactions(data);

  uniqueTransactions.sort((a, b) => a.activity_id - b.activity_id);
  uniqueTransactions.forEach(insertTransaction);
});