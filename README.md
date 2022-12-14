# TECH BAR Web App

## 🧐 About this Web App

Tech Bar is a gadgets e-commerce web app that enables end users to perform all nesesary <b>CRUD</b> operations and HTTP requests to achieve the <b>folowing results:</b>

##

- ### View Featured Products on the Home Page
  ![Imgur](https://i.imgur.com/qommxji.png)
- ### View All Products & All Categories pages individually
  ![Imgur](https://i.imgur.com/NUCOnXw.png)
- ### View the individual Product Page
  ![Imgur](https://i.imgur.com/Q0xYLDC.png)
- ### Add multiple products to cart via <b>“Add to Cart”</b> button featured directly on the <b>product card</b>
  ![Imgur](https://i.imgur.com/xYirHLu.png)
- ### Add multiple products on the Cart page
  ![Imgur](https://i.imgur.com/Anxzjm6.png)
- ### Increment/Decrement product quantity on the Cart page
  ![Imgur](https://i.imgur.com/1nmmlsC.png)
- ### Proceed to the Checkout (if already have an account or logged in). If not just yet proceed to => SignUp
  ![Imgur](https://i.imgur.com/tWTOIWn.png)
- ### SignUp (Create a new account) and proceed to => Login
  ![Imgur](https://i.imgur.com/FhtXV6s.png)
- ### Login
  ![Imgur](https://i.imgur.com/EhO2knW.png)
- ### Checkout / Create an Order (submit shipping info)
  ![Imgur](https://i.imgur.com/GGNNyqO.png)

## On "My Orders" Page:

- ### View all my order

  ![Imgur](https://i.imgur.com/7Ihw0dB.png)

- ### Click on "View Order Details"

  ![Imgur](https://i.imgur.com/ZVyYkID.png)

- ### Update my profile

  ![Imgur](https://i.imgur.com/ULGzLs5.png)

- ### Logout

  ![Imgur](https://i.imgur.com/Ju8W8pc.png)

- ### <b>Cancel Order</b> on the OrderDetail page
  ![Imgur](https://i.imgur.com/yPbFxys.png)

## 🧩 Tech Bar Wireframing

### SITE ARCHITECTURE

![Imgur](https://i.imgur.com/wKRYVfi.png)

### FRONTEND

![Imgur](https://i.imgur.com/obGNZ9q.png)

### BACKEND

![Imgur](https://i.imgur.com/7VqdZAr.png)

## 💻 Technologies & Libraries Used

| <b>Backend</b>   | <b>Frontend</b>     |
| ---------------- | ------------------- |
| express          | bootstrap           |
| express-session  | react-bootstrap     |
| mongoose         | react-toastify      |
| cors             | react-router-dom    |
| dotenv           | react-image-gallery |
| bcrypt           | axios               |
| morgan           | validator           |
| dev.dep: nodemon | react               |
|                  | react-dom           |

## 👨🏽‍💻 Project Development Approach

### Tech Bar Development approach consists of 3 major parts:

1. <b>Project Type & Wireframing:</b>

- Define general project functionality
- Define DB Models
- Deciding on libraries
- Research & Create Seed Data
- Design Site Architecture
- Design schematic depiction of front and backend

2. <b>Frontend design and functionality:</b>

- Designing Components
- Designing Pages
- Writing & configuring routes as it contains all navigation paths to all pages
- Writing UseAppContext as it wraps the app and contains all major functions with API calls
- Layering navigation and respective data functionality in Pages and Components
- Custom CSS was researched on and written in parallel with the rest of the frontend
- Tech Bar Web App’s interface responsiveness is achieved via @media quieries

3. <b>Backend functionality with connection to the frontend:</b>

- Create the backend using MVC model
- Modularise backend functionality: controller, model, route, config
- Create APIs based on the requirements of the frontend
- Use express-session to create a cookie to send to the front end for authentication
- Use connect-mongo to store the cookies in MongoDB

## 🧰 Tech Bar Installation

To run Tech Bar app locally:

1. Clone this project to your local machine

```
git clone https://github.com/berwyntan/techbar.git
```

2. Install the packages in techbar folder (top most directory)

```
npm install
```

3. In the tech bar folder run the command below once (no need to run back and front end induvidually)

```
npm run dev
```

ALTERNATIVELY
👉 [CHECK OUT TECH BAR HERE](sore-blue-turtle-hat.cyclic.app/)

## 🔉 Site Images & Product Description Courtesy

- Amazon.com (Products)
- Unsplash.com (Home page carousel)

## ❗ Disclaimer

This is a student project that was designed for learning and training purposes only and is not intended for any commercial use.
