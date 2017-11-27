class Order {
    constructor(id, name, quantity, uid, time, costPerUnit) {
        this.id = id
        this.name = name
        this.quantity = parseInt(quantity)
        this.uid = uid
        this.time = time
        this.costPerUnit = parseInt(costPerUnit)
        this.cost = quantity * costPerUnit
    }
}

class PredictedOrder {
    constructor(id, name, quantity, costPerUnit) {
        this.id = id
        this.name = name
        this.quantity = parseInt(quantity)
        this.costPerUnit = parseInt(costPerUnit)
    }
}

class InventoryOrders {
    constructor() {
        this.orders = new Array()
        this.predictedOrders = new Array()
        this.ordersDisplay = document.getElementById("orders")
    }
    addOrder(order) {
        this.orders.push(order)
    }
    addPredictedOrder(predictedOrder) {
        this.predictedOrders.push(predictedOrder)
    }
    resetOrders() {
        this.orders = new Array()
        this.predictedOrders = new Array()
    }
    displayTable() {
        this.ordersDisplay.innerHTML = ""
        var outerDiv = document.createElement("div")
        outerDiv.classList.add("col-lg-7")
        var outerBlock = document.createElement("div")
        outerBlock.classList.add("block")
        var title = document.createElement("div")
        title.classList.add("title")
        title.innerHTML = "<strong>Inventory Orders</strong>"
        var table = document.createElement("table")
        table.classList.add("table", "table-striped", "table-hover")
        var thead = document.createElement("thead")
        thead.innerHTML = "<tr><th>Order ID</th><th>Item</th><th>Quantity</th><th>Orderer</th><th>Time of Order</th><th>Cost</th></tr>"
        var tbody = document.createElement("tbody")
        for(var orderNum in this.orders) {
            var row = document.createElement("tr")
            row.innerHTML = "<tr><th scope='row'>" + this.orders[orderNum].id + "</td><td>" + this.orders[orderNum].name + "</td><td>" + this.orders[orderNum].quantity + "</td><td>" + this.orders[orderNum].uid + "</td><td>" + this.orders[orderNum].time + "</td><td>" + this.orders[orderNum].cost + "</td></tr>"
            tbody.appendChild(row)
        }
        table.appendChild(thead)
        table.appendChild(tbody)
        outerBlock.appendChild(title)
        outerBlock.appendChild(table)
        outerDiv.appendChild(outerBlock)
        this.ordersDisplay.appendChild(outerDiv)
        
        outerDiv = document.createElement("div")
        outerDiv.classList.add("col-lg-5")
        outerBlock = document.createElement("div")
        outerBlock.classList.add("block")
        title = document.createElement("div")
        title.classList.add("title")
        title.innerHTML = "<strong>Predicted Order Requirements</strong>"
        table = document.createElement("table")
        table.classList.add("table", "table-striped", "table-hover")
        thead = document.createElement("thead")
        thead.innerHTML = "<tr><th>Item ID</th><th>Item</th><th>Quantity</th><th>Cost Per Unit</th></tr>"
        tbody = document.createElement("tbody")
        for(var predictedOrderNum in this.predictedOrders) {
            var row = document.createElement("tr")
            row.innerHTML = "<tr><th scope='row'>" + this.predictedOrders[predictedOrderNum].id + "</td><td>" + this.predictedOrders[predictedOrderNum].name + "</td><td>" + this.predictedOrders[predictedOrderNum].quantity + "</td><td>" + this.predictedOrders[predictedOrderNum].costPerUnit + "</td></tr>"
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

class GetOrders {
    constructor() {
        this.io = new InventoryOrders()
        this.orderTime = null
    }
    getPredictedOrders() {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if(xhr.readyState == 4 && xhr.status == 200) {
                var predictedOrdersData = JSON.parse(xhr.responseText)
                for(var predictedOrderNum in predictedOrdersData) {
                    var predictedOrder = predictedOrdersData[predictedOrderNum]
                    this.io.addPredictedOrder(new PredictedOrder(predictedOrder.item_code, predictedOrder.item_name, predictedOrder.quantity, predictedOrder.cost_per_unit))
                }
                this.io.displayTable()
                setTimeout(this.getLastOrderTime.bind(this), 60000)
            }
        }.bind(this)
        xhr.open("GET", "https://manageguru.azurewebsites.net/predicted_inventory_orders.php", true)
        xhr.send()
    }
    getInventoryOrders() {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if(xhr.readyState == 4 && xhr.status == 200) {
                var ordersData = JSON.parse(xhr.responseText)
                for(var orderNum in ordersData) {
                    var order = ordersData[orderNum]
                    this.io.addOrder(new Order(order.item_code, order.item_name, order.quantity, order.user_id, order.order_time, order.cost_per_unit))
                }
                this.getPredictedOrders()
            }
        }.bind(this)
        xhr.open("GET", "https://manageguru.azurewebsites.net/inventory_orders_log.php", true)
        xhr.send()
    }
    getLastOrderTime() {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if(xhr.readyState == 4 && xhr.status == 200) {
                var data = JSON.parse(xhr.responseText)
                var new_time = data.last_inventory_order_time
                if(this.order_time == null) {
                    this.order_time = new_time
                    this.getInventoryOrders()
                } else if(new_time != this.order_time) {
                    if(!!window.cordova) {
                        navigator.notification.alert(
                            "A new item has been ordered and added to the inventory",
                            function() {
                                window.location.href = "inventory.html"
                            },
                            "New Inventory Orders"
                        )
                    } else {
                        var notification = new Notification("New Inventory Orders", {body: "A new item has been ordered and added to the inventory", icon: window.location.pathname.replace("inventory.html", "img/ingredients.jpg")})
                        notification.onclick = function() {
                            window.location.href = "inventory.html"
                        }
                    }
                    this.getInventoryOrders()
                } else {
                    setTimeout(this.getLastOrderTime.bind(this), 60000)
                }
            }
        }.bind(this)
        xhr.open("GET", "https://manageguru.azurewebsites.net/last_inventory_order_time.php", true)
        xhr.send()
    }
}

window.onload = function() {
    new GetOrders().getLastOrderTime()
}