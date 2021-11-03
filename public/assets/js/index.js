let transactions = [];
let myChart;

/////////////////////////////////////////////////////////////
// INPUT VARIABLES
/////////////////////////////////////////////////////////////

const nameEl = document.querySelector('#t-name');
const amountEl = document.querySelector('#t-amount');
const errorEl = document.querySelector('.form .error');

///////////////////////////////////////////////////////
// API REQUESTS: GET
///////////////////////////////////////////////////////

const getAllTransactions = () => {
  fetch('/api/transaction')
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      handlePopulate(data);
    });
};

getAllTransactions();

//////////////////////////////////////////////////////////////
// BEFORE POPULATE - VERIFY ITEMS IN INDEXDB
//////////////////////////////////////////////////////////////

const handlePopulate = (data) => {
  if (verifyIndexedDB()) {
    useIndexedDB('BudgetDB', 'BudgetStore', 'get').then((results) => {
      // FOR EACH RESULT IN INDEXDB, POST TO MONGODB
      results.forEach((result) => {
        sendToDatabase(result);
      });

      // ONCE POSTED TO MONGODB, CLEAR THE INDEXDB
      clearStore('BudgetDB', 'BudgetStore');

      // THE GLOBAL TRANSACTIONS ARRAY IS NOW EQUAL TO THE DATA FROM THE GET REQUEST
      transactions = data;
      //POPULATE THE TOTAL + TABLE + CHART
      populate();
    });
  }
};

//////////////////////////////////////////////////////////////
// POPULATE
//////////////////////////////////////////////////////////////

const populate = () => {
  populateTotal();
  populateTable();
  populateChart();
};

//////////////////////////////////////////////////////////////
// POPULATE: CHARTS + TABLE + TOTALS
//////////////////////////////////////////////////////////////

const populateTotal = () => {
  // reduce transaction amounts to a single total value
  let total = transactions.reduce((total, t) => {
    return total + parseInt(t.value);
  }, 0);

  let totalEl = document.querySelector('#total');
  totalEl.textContent = total;
};

const populateTable = () => {
  let tbody = document.querySelector('#tbody');
  tbody.innerHTML = '';

  transactions.forEach((transaction) => {
    // create and populate a table row
    let tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${transaction.name}</td>
      <td>${transaction.value}</td>
    `;

    tbody.appendChild(tr);
  });
};

const populateChart = () => {
  // copy array and reverse it
  let reversed = transactions.slice().reverse();
  let sum = 0;

  // create date labels for chart
  let labels = reversed.map((t) => {
    let date = new Date(t.date);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  });

  // create incremental values for chart
  let data = reversed.map((t) => {
    sum += parseInt(t.value);
    return sum;
  });

  // remove old chart if it exists
  if (myChart) {
    myChart.destroy();
  }

  let ctx = document.getElementById('myChart').getContext('2d');

  myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Total Over Time',
          fill: true,
          backgroundColor: '#6666ff',
          data,
        },
      ],
    },
  });
};

//////////////////////////////////////////////////////////////
// SEND TRANSACTIONS
//////////////////////////////////////////////////////////////
const sendTransaction = (isAdding) => {
  // FORM INPUT VALIDATION
  if (nameEl.value === '' || amountEl.value === '') {
    errorEl.textContent = 'Missing Information';
    return;
  } else {
    errorEl.textContent = '';
  }

  // TRANSACTION OBJECT
  let transaction = {
    name: nameEl.value,
    value: parseFloat(amountEl.value).toFixed(2),
    date: new Date().toISOString(),
  };

  // IF SUBSTRACT FUNDS, CONVERT TO NEGATIVE
  if (!isAdding) {
    transaction.value *= -1;
  }

  // USING UNSHIFT TO ADD THE DATA TO THE BEGINNING OF DATA
  transactions.unshift(transaction);

  // UPDATE POPULATE DATA
  populate();

  // SEND DATA TO BE POSTED
  sendToDatabase(transaction);
};

//////////////////////////////////////////////////////////////
// SEND TO INDEXDB DATABASE
//////////////////////////////////////////////////////////////

const sendToDatabase = (data) => {
  fetch('/api/transaction', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // IF ERROR WITH POSTING DATA
      if (data.errors) {
        errorEl.textContent = 'Missing Information';
      } else {
        clearFormInputs();
      }
    })
    .catch((err) => {
      // IF THERE WAS AN ERROR, IT MEANS THE CONNECTION IS LOST
      // THEREFORE, USE INDEXDB AS BACKUP
      useIndexedDB('BudgetDB', 'BudgetStore', 'put', data);
      clearFormInputs();
    });
};

//////////////////////////////////////////////////////////////
// CLEAR FORM INPUTS
//////////////////////////////////////////////////////////////

const clearFormInputs = () => {
  nameEl.value = '';
  amountEl.value = '';
};

//////////////////////////////////////////////////////////////
// EVENT LISTENERS
//////////////////////////////////////////////////////////////

document.querySelector('#add-btn').onclick = () => {
  sendTransaction(true);
};

document.querySelector('#sub-btn').onclick = () => {
  sendTransaction(false);
};

//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
// INDEXDB
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////

// FOR VERIFYING IF INDEXDB IS POSSIBLE
// The latest versions of Firefox, Chrome, Opera, Safar, iOS Safari, and Android all fully support IndexedDB, and Internet Explorer and Blackberry feature partial support.
const verifyIndexedDB = () => {
  if (!window.indexedDB) {
    alert("Your browser doesn't support IndexedDB.");
    return false;
  } else {
    return true;
  }
};

// IF INDEXDB IS ACTIVATED
const useIndexedDB = (dbName, strName, method, object) => {
  return new Promise((resolve, reject) => {
    // OPEN DATABASE
    const request = window.indexedDB.open(dbName, 1);
    let db, tx, store;

    // CREATE STORE
    request.onupgradeneeded = function (e) {
      const db = request.result;
      db.createObjectStore(strName, { keyPath: 'key', autoIncrement: true });
    };

    // ON ERROR IF ANY ISSUES CREATING
    request.onerror = function (e) {
      //Log an error if needed.
      console.log('There was an error');
      alert('Something went wrong with IndexedDB.');
    };

    //////////////////////////////////////////////////////
    // INDEXDB: ON SUCCESS
    //////////////////////////////////////////////////////
    request.onsuccess = (e) => {
      // ESTABLISH THE DATABASE vs. REQUEST
      db = request.result;
      // CREATE TRANSACTION IN DB = BudgetStore
      tx = db.transaction(strName, 'readwrite');
      store = tx.objectStore(strName);

      // HANDLING INDEXDB ERRORS
      db.onerror = function (e) {
        console.log('error');
        alert('Something went wrong trying to access the correct store.');
      };

      // PUT = STORE
      if (method === 'put') {
        store.put(object);

        console.log('successfylly added to IndexedDB');
      } else if (method === 'get') {
        // GET ALL
        const all = store.getAll();

        all.onsuccess = function () {
          //Resolve the promise.
          resolve(all.result);
        };
        // DELETE
      } else if (method === 'delete') {
        store.delete(object._id);
      }
      tx.oncomplete = function () {
        // ON COMPLETE: CLOSE THE DATABASE
        db.close();
      };
    };
  });
};

//////////////////////////////////////////////////////
// INDEXDB: TO CLEAR TRANSACTIONS IN DATABASE
//////////////////////////////////////////////////////

const clearStore = (dbName, strName) => {
  const request = window.indexedDB.open(dbName, 1);

  // IF REQUEST IS SUCCESSFUL, CLEAR THE DATABASE AS THE DATA WILL HAVE REACHED THE REMOTE MONGODB
  request.onsuccess = () => {
    db = request.result;

    let deleteTransaction = db.transaction(strName, 'readwrite');

    deleteTransaction.onerror = () => {
      console.log('Something went wrong while deleting transaction.');
    };

    let objectStore = deleteTransaction.objectStore(strName);

    let objectStoreRequest = objectStore.clear();

    objectStoreRequest.onsuccess = () => {
      console.log('IndexDB data successfully deleted');
    };
  };
};
