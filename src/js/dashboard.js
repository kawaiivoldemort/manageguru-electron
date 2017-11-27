var dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

function getRevenue() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            var data = JSON.parse(xhr.responseText)
            var date = new Date(data.month)
            document.getElementById('revenue-amount').innerHTML = data.revenue
            document.getElementById('revenue-date').innerHTML = monthNames[date.getMonth()] + " " + date.getFullYear()
            getTodaysOrderCount()
        }
    }
    xhr.open("GET", "https://manageguru.azurewebsites.net/revenue_this_month.php", true);
    xhr.send()
}

function getTodaysOrderCount() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            var data = JSON.parse(xhr.responseText)
            var date = new Date(data.time)
            document.getElementById('order-amount').innerHTML = data.num_of_orders
            document.getElementById('order-date').innerHTML = dayNames[date.getDay()] + ", " + date.getDate() + " " + monthNames[date.getMonth()] + " " + date.getFullYear()
            getFilledTables()
        }
    }
    xhr.open("GET", "https://manageguru.azurewebsites.net/number_of_orders_today.php", true);
    xhr.send()
}

function getFilledTables() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            var data = JSON.parse(xhr.responseText)
            var d = new Date()
            document.getElementById('filled-tables').innerHTML = data.current_num_of_tables
            document.getElementById('filled-tables-time').innerHTML = ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2)
            getWaiterOfTheDay()
        }
    }
    xhr.open("GET", "https://manageguru.azurewebsites.net/get_number_of_filled_tables.php", true)
    xhr.send()
}

function getWaiterOfTheDay() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            var data = JSON.parse(xhr.responseText)
            document.getElementById('waiter-of-the-day').innerHTML = data.user_name + " (" + data.user_id + ")"
            getDishOfTheDay()
        }
    }
    xhr.open("GET", "https://manageguru.azurewebsites.net/active_waiter.php", true)
    xhr.send()
}

function getDishOfTheDay() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            var data = JSON.parse(xhr.responseText)
            document.getElementById('dish-of-the-day').innerHTML = data.dish_name + " (" + data.dish_id + ")"
            getPaymentMethodOfTheDay()
        }
    }
    xhr.open("GET", "https://manageguru.azurewebsites.net/trending_dish.php", true)
    xhr.send()
}

function getPaymentMethodOfTheDay() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            var data = JSON.parse(xhr.responseText)
            document.getElementById('payment-method-of-the-day').innerHTML = data.most_popular_payment
            setTimeout(getRevenue, 60000)
        }
    }
    xhr.open("GET", "https://manageguru.azurewebsites.net/most_popular_payment.php", true)
    xhr.send()
}

window.onload = getRevenue