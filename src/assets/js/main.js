'use strict'

const LEDGERS = ['simple', 'duplicate', 'complicated'];

/**
 * Returns a displayable transaction description
 * @param {Object} transaction 
 * @returns {String} transaction description
 */
function getFormattedDescription(transaction) {
  const destination = transaction.destination.id == 76510190788 ? 'You' : titleize(transaction.destination.description);
  let source = 'You';
  if (transaction.source.id !== 76510190788) {
    source = transaction.source.description && titleize(transaction.source.description);
    if (source === undefined) {
      source = transaction.source.type && titleize(transaction.source.type + ' type account');
    }
  }

  if (transaction.amount < 0) {
    return `${titleize(transaction.type)} from ${source} to ${destination}`;
  }

  return `${titleize(transaction.type)} from ${source} 
   ${transaction.requester ? ('for your ' + titleize(transaction.requester.type)) : ''}
  `;
}

/**
 * renders provided transaction inside the table as a new row
 * @param {Array} transaction 
 */
function displayTransaction(transaction) {
  const txnsContainer = document.getElementById('transactions');
  const negativeAmountModifier = transaction.amount < 0 ? 'transaction__data--negative-txn' : '';

  txnsContainer.innerHTML += (`
    <tr class="transaction" data-activity-id="${transaction.activity_id}">
      <td class="transaction__data">${getFormattedDate(new Date(transaction.date))}</td>
      <td class="transaction__data transaction__data--type">${titleize(transaction.type)}</td>
      <td class="transaction__data">${getFormattedDescription(transaction)}</td>
      <td class="transaction__data ${negativeAmountModifier}">${getFormattedCurrency(transaction.amount)}</td>
      <td class="transaction__data">${getFormattedCurrency(transaction.balance)}</td>
    </tr>
  `);
}

/**
 * Shows formatted balance in the balance section on screen
 * @param {Number} balance -- The amount to display 
 */
function displayBalance(balance) {
  document.getElementById('balance').innerText = getFormattedCurrency(balance);
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

window.onload = () => {
  readJSONFile(`data/${LEDGERS[2]}_ledger.json`).then((data) => {
    const uniqueTransactions = getUniqueTransactions(data);

    uniqueTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));
    reorderSameTimestampTxns(uniqueTransactions);
    uniqueTransactions.forEach(displayTransaction);
    displayBalance(uniqueTransactions[uniqueTransactions.length - 1].balance);
  });
};
