const form = document.querySelector("form");
const expense = document.getElementById("expense");
const category = document.getElementById("category");
const amount = document.getElementById("amount");

const expensesList = document.querySelector("ul");
const expensesQuantity = document.querySelector("aside header p span");
const totalAmountElement = document.querySelector("aside header h2")


amount.addEventListener("input", (event) => {
    event.preventDefault();
    let value = amount.value.replace(/\D/g, "")
    value = Number(value)/100
    amount.value = formatCurrencyBRL(value);

});

function formatCurrencyBRL(value) {
    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
    return value;
}

form.onsubmit = (event) => {
    event.preventDefault();

    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date().toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }),
    }

    expenseTemplate(newExpense)
    clearForm()
}

function expenseTemplate(newExpense) {
    try {
        const expenseItem = document.createElement("li")
        expenseItem.classList.add("expense")
        const expenseIcon = document.createElement("img")
        expenseIcon.setAttribute("src", `img/${newExpense.category}.svg`)
        expenseIcon.setAttribute("alt", newExpense.category_name)

        const expenseInfo = document.createElement("div")
        expenseInfo.classList.add("expense-info")

        const expenseName = document.createElement("strong")
        expenseName.textContent = newExpense.expense

        const expenseCategory = document.createElement("span")
        expenseCategory.textContent = newExpense.category_name

        expenseInfo.append(expenseName, expenseCategory)
        
        

        const expenseAmount = document.createElement("span")
        expenseAmount.classList.add("expense-amount")
        expenseAmount.innerHTML = `<small>R$</small> ${newExpense.amount.toUpperCase().replace("R$", "")}`


      

        const removeExpenseIcon = document.createElement("img")
        removeExpenseIcon.classList.add("remove-icon")
        removeExpenseIcon.setAttribute("src", "img/remove.svg")
        removeExpenseIcon.setAttribute("alt", "Remover despesa")
        

        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeExpenseIcon)
        expensesList.append(expenseItem)

        updateTotalAmount()
                
    } catch(error){
        alert("Ocorreu um erro ao tentar criar o template do item de despesa. Por favor, tente novamente.")
        console.log(error)
    }
}


function updateTotalAmount(){
    try{
        const items = expensesList.children 
        expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`

        let totalAmount = 0
        for (let i = 0; i < items.length; i++) {
            const item = items[i]
            const amountElement = item.querySelector(".expense-amount")
            const amountText = amountElement.textContent.replace(/[^\d,]/g, "").replace(",", ".")
            const value = parseFloat(amountText)

            if(isNaN(value)){
                return alert("Ocorreu um erro ao tentar calcular o valor total das despesas. Por favor, tente novamente.")
            }
            totalAmount += Number(value)

        }
        
        
        totalAmountElement.innerHTML = `<small>R$</small>${formatCurrencyBRL(totalAmount).replace("R$", "")}`


    }catch(error){
        alert("Ocorreu um erro ao tentar atualizar o valor total das despesas. Por favor, tente novamente.")
        console.log(error)
    }
}

expensesList.addEventListener("click", (event) => {
    if(event.target.classList.contains("remove-icon")){
        const item = event.target.closest(".expense")
        item.remove()
    }
    updateTotalAmount()

})

function clearForm(){
    expense.value = ""
    category.value = ""
    amount.value = ""

    expense.focus()
}