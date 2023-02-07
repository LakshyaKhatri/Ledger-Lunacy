'use strict'

const LEDGERS = ['simple', 'duplicate', 'complicated'];

/**
 * reads the json file on the provided path and returns it as JS object
 * @param {String} file 
 * @returns {Object} a JS object representing the read json
 */
async function readJSONFile(file) {
  const response = await fetch(file);
  return await response.json();
}

/**
 * renders provided transaction inside the table as a new row
 * @param {Array} transaction 
 */
function displayTransaction(transaction) {
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

/**
 * @param {Array} duplicateTransactions 
 * @returns {Array} unique transactions
 */
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

/**
 * re-order transactions (in-place) that are on the same timestamp but are not
 * in correct order
 * @param {Array} transactions 
 */
function reorderSameTimestampTxns(transactions) {
  let balance = 0;
  for (let i = 0; i < transactions.length - 1; i++) {
    if (transactions[i].date !== transactions[i + 1].date) {
      balance = transactions[i].balance;
      continue;
    }

    // find the next transaction that makes sense
    let j = i;
    while (
      (j < transactions.length - 1) &&
      (transactions[j].date === transactions[j + 1].date) &&
      (balance + transactions[j].amount !== transactions[j].balance)
    ) {
      j++;
    }

    // reorder transaction
    [transactions[i], transactions[j]] = [transactions[j], transactions[i]];
    balance = transactions[i].balance;
  }
}

readJSONFile(`data/${LEDGERS[2]}_ledger.json`).then((data) => {
  const uniqueTransactions = getUniqueTransactions(data);

  uniqueTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));
  reorderSameTimestampTxns(uniqueTransactions);
  uniqueTransactions.forEach(displayTransaction);
});
