class Bill {
    constructor(id, time, amount, customerName, paymentType, tableNumber) {
        this.id = id
        this.time = time
        this.amount = amount
        this.customerName = customerName
        this.paymentType = paymentType
        this.tableNumber = tableNumber
    }
}

class TableBills {
    constructor(tableNumber) {
        this.tableNumber = tableNumber
        this.bills = new Array()
        this.tableDisplay = document.getElementById("tables")
    }
    addBill(bill) {
        this.bills.push(bill)
    }
    resetBills() {
        this.bills = new Array()
    }
    displayTable() {
        this.tableDisplay.innerHTML = ""
        var outerDiv = document.createElement("div")
        outerDiv.classList.add("col-lg-12")
        var outerBlock = document.createElement("div")
        outerBlock.classList.add("block")
        var title = document.createElement("div")
        title.classList.add("title")
        title.innerHTML = "<strong>Table " + this.tableNumber + "</strong>"
        var table = document.createElement("table")
        table.classList.add("table", "table-striped", "table-hover")
        var thead = document.createElement("thead")
        thead.innerHTML = "<tr><th>#</th><th>Bill Number</th><th>Customer</th><th>Bill Amount</th><th>Bill Time</th><th>Payment Method</th></tr>"
        var tbody = document.createElement("tbody")
        for(var billNum in this.bills) {
            var row = document.createElement("tr")
            row.innerHTML = "<tr><th scope='row'>" + (parseInt(billNum) + 1) + "</th><td>" + this.bills[billNum].id + "</td><td>" + this.bills[billNum].customerName + "</td><td>" + this.bills[billNum].amount + "</td><td>" + this.bills[billNum].time + "</td><td>" + this.bills[billNum].paymentType + "</td></tr>"
            tbody.appendChild(row)
        }
        table.appendChild(thead)
        table.appendChild(tbody)
        outerBlock.appendChild(title)
        outerBlock.appendChild(table)
        outerDiv.appendChild(outerBlock)
        this.tableDisplay.appendChild(outerDiv)
    }
    displayTableWithNumber() {
        this.tableDisplay.innerHTML = ""
        var outerDiv = document.createElement("div")
        outerDiv.classList.add("col-lg-12")
        var outerBlock = document.createElement("div")
        outerBlock.classList.add("block")
        var title = document.createElement("div")
        title.classList.add("title")
        title.innerHTML = "<strong>Table " + this.tableNumber + "</strong>"
        var table = document.createElement("table")
        table.classList.add("table", "table-striped", "table-hover")
        var thead = document.createElement("thead")
        thead.innerHTML = "<tr><th>#</th><th>Bill Number</th><th>Customer</th><th>Bill Amount</th><th>Bill Time</th><th>Payment Method</th><th>Table Number</th></tr>"
        var tbody = document.createElement("tbody")
        for(var billNum in this.bills) {
            var row = document.createElement("tr")
            row.innerHTML = "<tr><th scope='row'>" + (parseInt(billNum) + 1) + "</th><td>" + this.bills[billNum].id + "</td><td>" + this.bills[billNum].customerName + "</td><td>" + this.bills[billNum].amount + "</td><td>" + this.bills[billNum].time + "</td><td>" + this.bills[billNum].paymentType + "</td><td>" + this.bills[billNum].tableNumber + "</td></tr>"
            tbody.appendChild(row)
        }
        table.appendChild(thead)
        table.appendChild(tbody)
        outerBlock.appendChild(title)
        outerBlock.appendChild(table)
        outerDiv.appendChild(outerBlock)
        this.tableDisplay.appendChild(outerDiv)
    }
}

class BillData {
    constructor() {
        this.tb = new TableBills()
    }
    getBillDataByTableNumber(tableNumber) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(tableNumber) {
            if(xhr.readyState == 4 && xhr.status == 200) {
                var billsData = JSON.parse(xhr.responseText)
                for(var billNum in billsData) {
                    var billData = billsData[billNum]
                    this.tb.addBill(new Bill(billData.bill_id, billData.bill_time, billData.amount, billData.customer_name, billData.payment_type, tableNumber))
                }
                var breadcrumbItems = document.getElementById("breadcrumb-items")
                var billsLink = breadcrumbItems.lastElementChild
                breadcrumbItems.innerHTML += `<li class="breadcrumb_item active h5">Table ` + tableNumber + `</li>`
                this.tb.displayTable(this.tableDisplay)
                this.tb.resetBills()
                setTimeout(this.getBillDataByTableNumber, 60000)
            }
        }.bind(this, tableNumber)
        xhr.open("GET", "https://manageguru.azurewebsites.net/bill_log_by_table.php?table=" + tableNumber + ".php", true);
        xhr.send()
    }
    getBillData()  {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if(xhr.readyState == 4 && xhr.status == 200) {
                var billsData = JSON.parse(xhr.responseText)
                for(var billNum in billsData) {
                    var billData = billsData[billNum]
                    this.tb.addBill(new Bill(billData.bill_id, billData.bill_time, billData.amount, billData.customer_name, billData.payment_type, billData.table_id))
                }
                var breadcrumbItems = document.getElementById("breadcrumb-items")
                var billsLink = breadcrumbItems.lastElementChild
                breadcrumbItems.innerHTML += `<li class="breadcrumb_item active h5">All Tables</li>`
                this.tb.displayTableWithNumber(this.tableDisplay)
                this.tb.resetBills()
                setTimeout(this.getBillData, 60000)
            }
        }.bind(this)
        xhr.open("GET", "https://manageguru.azurewebsites.net/bill_log.php", true);
        xhr.send()
    }
}

function getTables() {
    var xhr = new XMLHttpRequest();
    var bd = new BillData()
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            var jsonResponse = JSON.parse(xhr.responseText)
            var tablesDiv = document.getElementById("tables")
            tablesDiv.innerHTML = ""
            var fluidContainer = document.createElement("div")
            fluidContainer.classList.add("container-fluid")
            var row = document.createElement("div")
            row.classList.add("row")
            for(var i = 1; i <= jsonResponse.current_num_of_tables; i += 1) {
                var table = document.createElement("div")
                table.classList.add("col-lg-4")
                table.classList.add("table-block")
                var tableBlock = document.createElement("div")
                tableBlock.classList.add("user-block", "block", "text-center")
                tableBlock.innerHTML = 
                   `<img src="img/dining-table-DB6574.svg" alt="..." class="img-fluid">
                    <h3 class="h5 user-title">Table ` + i + `</h3>`
                table.onclick = bd.getBillDataByTableNumber.bind(bd, i)
                table.appendChild(tableBlock)
                row.appendChild(table)
            }
            fluidContainer.appendChild(row)
            tablesDiv.appendChild(fluidContainer)            
        }
    }
    document.getElementById("all-table").onclick = bd.getBillData.bind(bd)
    xhr.open("GET", "https://manageguru.azurewebsites.net/get_number_of_tables.php", true);
    xhr.send()
}

function resetTables() {
    document.getElementById("breadcrumb-items").innerHTML = `
    <li class="breadcrumb_item active h5" onclick="resetTables()">Bills / </li>`
    getTables()
}

window.onload = getTables