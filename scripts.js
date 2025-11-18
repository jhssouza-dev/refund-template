// Select form elements
const amount = document.querySelector("#amount");
const expense = document.querySelector("#expense");
const category = document.querySelector("#category");
const form = document.querySelector("form");

const expenseList = document.querySelector("ul");
const expensesQuantity = document.querySelector("aside header p span");
const expensesTotal = document.querySelector("aside header h2");

// Input event for formatting currency
amount.oninput = () => {
  let value = amount.value.replace(/\D/g, "");
  value = Number(value) / 100;
  amount.value = formatCurrencyEUR(value);
};

// Format number to EUR (German format)
function formatCurrencyEUR(value) {
  return value.toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
  });
}

// Handle form submission
form.onsubmit = (event) => {
  event.preventDefault();

  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  };

  expenseAdd(newExpense);
};

// Add item to the list
function expenseAdd(newExpense) {
  try {
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");

    const expenseIcon = document.createElement("img");
    expenseIcon.src = `img/${newExpense.category_id}.svg`;

    const expenseInfo = document.createElement("div");
    expenseInfo.classList.add("expense-info");

    const expenseName = document.createElement("strong");
    expenseName.textContent = newExpense.expense;

    const expenseCategory = document.createElement("span");
    expenseCategory.textContent = newExpense.category_name;

    expenseInfo.append(expenseName, expenseCategory);

    const expenseAmount = document.createElement("span");
    expenseAmount.classList.add("expense-amount");
    expenseAmount.innerHTML =
      `<small>€</small>` +
      newExpense.amount.replace("€", "").trim();

    const removeIcon = document.createElement("img");
    removeIcon.classList.add("remove-icon");
    removeIcon.src = "img/remove.svg";
    removeIcon.alt = "remove";

    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);

    expenseList.append(expenseItem);

    formClear();
    updateTotals();
  } catch (error) {
    alert("Unable to update the list.");
    console.log(error);
  }
}

// Update totals
function updateTotals() {
  try {
    const items = expenseList.children;

    expensesQuantity.textContent = `${items.length} ${
      items.length > 1 ? "expenses" : "expense"
    }`;

    let total = 0;

    for (let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount");

      let value = itemAmount.textContent
        .replace(/[^\d,]/g, "")
        .replace(",", ".");

      value = parseFloat(value);

      if (isNaN(value)) return alert("Unable to calculate total.");

      total += Number(value);
    }

    const symbolEUR = document.createElement("small");
    symbolEUR.textContent = "€";

    total = formatCurrencyEUR(total).replace("€", "").trim();

    expensesTotal.innerHTML = "";
    expensesTotal.append(symbolEUR, total);
  } catch (error) {
    console.log(error);
    alert("Unable to update totals.");
  }
}

// Click event for removing items
expenseList.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-icon")) {
    const item = event.target.closest(".expense");
    item.remove();
    updateTotals();
  }
});

// Clear form fields
function formClear() {
  expense.value = "";
  category.value = "";
  amount.value = "";
  expense.focus();
}
