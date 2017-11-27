class Order {
    constructor(orderId, dishId, dishName, table, time) {
        this.orderId = orderId
        this.dishId = dishId
        this.dishName = dishName
        this.table = table
        this.time = time
    }
}

class Orders {
    constructor() {
        this.orders = new Array()
        this.ordersDisplay = document.getElementById("orders")
    }
    addOrder(order) {
        this.orders.push(order)
    }
    resetOrders() {
        this.orders = new Array()
    }
    displayTable() {
        this.ordersDisplay.innerHTML = ""
        var outerDiv = document.createElement("div")
        outerDiv.classList.add("col-lg-12")
        var outerBlock = document.createElement("div")
        outerBlock.classList.add("block")
        var title = document.createElement("div")
        title.classList.add("title")
        title.innerHTML = "<strong>Orders</strong>"
        var table = document.createElement("table")
        table.classList.add("table", "table-striped", "table-hover")
        var thead = document.createElement("thead")
        thead.innerHTML = "<tr><th>Order ID</th><th>Dish ID</th><th>Dish Name</th><th>Table</th><th>Order Time</th></tr>"
        var tbody = document.createElement("tbody")
        for(var orderNum in this.orders) {
            var row = document.createElement("tr")
            row.innerHTML = "<tr><th scope='row'>" + this.orders[orderNum].orderId + "</td><td>" + this.orders[orderNum].dishId + "</td><td>" + this.orders[orderNum].dishName + "</td><td>" + this.orders[orderNum].table + "</td><td>" + this.orders[orderNum].time + "</td></tr>"
            tbody.appendChild(row)
        }
        table.appendChild(thead)
        table.appendChild(tbody)
        outerBlock.appendChild(title)
        outerBlock.appendChild(table)
        outerDiv.appendChild(outerBlock)
        this.ordersDisplay.appendChild(outerDiv)
    }
}

function getOrders() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            var ordersData = JSON.parse(xhr.responseText)
            var orders = new Orders()
            for(var orderNum in ordersData) {
                var order = ordersData[orderNum]
                orders.addOrder(new Order(order.order_id, order.dish_id, order.dish_name, order.table_id, order.order_time))
            }
            orders.displayTable()
            setTimeout(getOrders, 60000)
        }
    }
    xhr.open("GET", "https://manageguru.azurewebsites.net/order_log.php", true)
    xhr.send()
}

window.onload = getOrders