# food-truck-front-end
The "food-truck-front-end" project is a frontend project designed to showcase information related to food trucks.
[![node](https://img.shields.io/badge/node-16.14.2-green.svg?style=plastic)](https://nodejs.org/en/) [![umi](https://img.shields.io/badge/UmiMax-4.0.9-green.svg?style=plastic)](https://umijs.org/)  [![react](https://img.shields.io/badge/react-18.0.33-green.svg?style=plastic)](https://react.dev/)

# Initialize the project
* Install dependency packages.  
  ```
  npm install
  ```
* Run the project.
  ```
  npm run dev
  ```
* Build the project.
  ```
  npm run build
  ```
# Configure the backend server
Run the backend project with the server address and port number configured in the 'proxy.target' property in the '。umirc.dev' file.
```
proxy: {
    '/food-truck-frontend-api': {
      target: 'http://[food-truck-back-end hostname]:[port]',
      changeOrigin: true,
      pathRewrite: { '^/food-truck-frontend-api': '' },
    },
  },
```
# Page description
* QueryFoodTrucks page  
  Querying food truck information by specified conditions.  
  ![Image](https://github.com/chensheng-alt/food-truck-front-end/blob/dev/src/assets/readme-imgs/query-food-trucks.png)

* FoodTruckLocation page  
  Display the locations of food trucks from the query results on the map.  
  ![Image](https://github.com/chensheng-alt/food-truck-front-end/blob/dev/src/assets/readme-imgs/food-truck-location.png)

# Expected feature additions
* After selecting a specific food truck, display the navigation route from the user's current location to the food truck.