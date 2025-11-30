// Select form elements
const amount = document.querySelector("#amount");
const expense = document.querySelector("#expense");
const category = document.querySelector("#category");
const form = document.querySelector("form");

const expenseList = document.querySelector("ul");
const expensesQuantity = document.querySelector("aside header p span");
const expensesTotal = document.querySelector("aside header h2");

// ------------------------------
// FORMAT INPUT VALUE (NO EURO €)
// ------------------------------

function formatNumberDE(value) {
  return value.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

amount.addEventListener("input", () => {
  let digits = amount.value.replace(/\D/g, ""); // remove tudo que não é número

  if (!digits) {
    amount.value = "";
    return;
  }

  const number = Number(digits) / 100;
  amount.value = formatNumberDE(number); // exibe assim: 12,50
});

// ------------------------------
// FORMAT CURRENCY FOR OUTPUT (€)
// ------------------------------

function formatCurrencyEUR(value) {
  return value.toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
  });
}

// ------------------------------
// HANDLE FORM SUBMIT
// ------------------------------
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const expenseName = expense.value.trim();
  const categoryId = category.value;
  const amountValue = amount.value.trim();

  if (!expenseName || !categoryId || !amountValue) {
    alert("Preencha todos os campos.");
    return;
  }

  const categoryName =
    category.options[category.selectedIndex]?.text || "Sem categoria";

  const newExpense = {
    expense: expenseName,
    category_id: categoryId,
    category_name: categoryName,
    amount: amountValue, // ex: "12,50" (sem €)
  };

  expenseAdd(newExpense);
});

// ------------------------------
// Add item to the list
// ------------------------------
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

    // amount vem SEM €, aqui a gente adiciona o símbolo
    expenseAmount.innerHTML =
      `<small>€</small>` +
      newExpense.amount.trim();

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

// ------------------------------
// Update totals
// ------------------------------
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
        .replace(/[^\d,]/g, "") // pega só números e vírgula
        .replace(",", "."); // vírgula para ponto

      value = parseFloat(value);

      if (isNaN(value)) {
        alert("Unable to calculate total.");
        return;
      }

      total += Number(value);
    }

    const symbolEUR = document.createElement("small");
    symbolEUR.textContent = "€";

    let totalFormatted = formatCurrencyEUR(total).replace("€", "").trim();

    expensesTotal.innerHTML = "";
    expensesTotal.append(symbolEUR, totalFormatted);
  } catch (error) {
    console.log(error);
    alert("Unable to update totals.");
  }
}

// ------------------------------
// Remove items
// ------------------------------
expenseList.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-icon")) {
    const item = event.target.closest(".expense");
    item.remove();
    updateTotals();
  }
});

// ------------------------------
// Clear form
// ------------------------------
function formClear() {
  expense.value = "";
  category.value = "";
  amount.value = "";
  expense.focus();
}
