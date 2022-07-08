//Page1
> (Get) List of City
# http://localhost:9100/location

> (Get) List of Restaurants
# http://localhost:9100/restaurants
> (Get) List of restaurants wrt city
# http://localhost:9100/restaurants?stateId=2
> (Get) List of mealType
# http://localhost:9100/mealType

//Page2
> (Get) Restaurants wrt to mealType
# http://localhost:9100/restaurants?mealId=3
> (Get) Filter wrt to cost
# http://localhost:9100/filter/2?lcost=500&hcost=1000
> (Get) Filter wrt to Cuisine
# http://localhost:9100/filter/2?cuisine=1
> (Get) Sort on basis of Price
# http://localhost:9100/filter/2?sort=-1
> (Get) Pagination
# http://localhost:9100/filter/2?skip=15&limit=5

//Page3
> (Get) Details of restaurant
# http://localhost:9100/details/618776b162a1816f885956c3
> (Get) Menu of restaurant
# http://localhost:9100/menu/5

//Page4
> (Post) All the menu details
# http://localhost:9100/menuItem
# {"id":[8,4,9]}
> (Post) Place order
# http://llocalhost:9100/placeOrder
{
	"orderId":3,
	"name": "Nikita",
    "email": "niki@gmail.com",
    "address": "Hom 12",
    "phone": 934645457,
     "cost": 765,
     "menuItem": [24,45,1]
}


//Page5
> (Get) list of Order Placed
# http://localhost:9100/orders
> (Get) Order wrt to email
# http://localhost:9100/Orders?email=niki@gmail.com

> (Put) update order
# http://localhost:9100/updateOrder
{
	"_id":"62c79f4c2e096fe84f48e92f",
	"status":"Delivered"
}

> (Delete) Delete order
# http://localhost:9100/removeOrder
{
	"_id":"62c79f4c2e096fe84f48e92f"
}