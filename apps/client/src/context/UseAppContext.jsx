import { createContext, useContext, useEffect, useState } from "react"; // getting neccery method for creating app contect
import axios from "axios"; // importing axios to make api calls
import { toast } from "react-toastify"; // import toast to show success or error messages

const AppContext = createContext(); // creating context

export function UseAppContextProvider({ children }) {
  const [user, setUser] = useState({}); // setting user state empty by default
  const [products, setProducts] = useState([]); // setting products state empty by default
  const [categories, setCategories] = useState([]); // setting categories state empty by default
  const [featuredproducts, setFeaturedProducts] = useState([]); // setting featured products state empty by default
  const [cartItems, setCartItems] = useState([]); // setting cart item state empty by default
  const [loading, setLoading] = useState(true); // setting loading state true by default
  const [status, setStatus] = useState("start"); // set state for app start by default

  // headers for axios
  const headers = {
    withCredentials: true,
  };

  //! login function
  async function logIn(email, password) {
    // set load to true
    setLoading(true);

    try {
      // make api call to backend
      const { data } = await axios.post(
        "/api/user/login",
        {
          email,
          password,
        },
        {
          headers: headers,
        }
      );
      console.log(data);

      // set user to user state
      setUser(data.user);
      toast.success(`Welcome back ${data.user.name}!`);
      // loading false
      setLoading(false);

      return data;
    } catch (err) {
      // Handle Error Here
      console.error(err);
      toast.error(err.response.data.message);
      setLoading(false);
      return err.response.data;
    }
  }

  // ! signup function
  async function createAccount(name, email, password) {
    // loading true
    setLoading(true);
    try {
      // makeing  api call
      const { data } = await axios.post("/api/user/signup", {
        name,
        email,
        password,
      });
      console.log(data);

      // set user to user state
      // setUser(data.user); //berwyn: I think should redirect to login page after signing up
      setLoading(false);

      toast.success(data.message);

      return data;
    } catch (err) {
      // Handle Error Here
      console.error(err);
      toast.error(err.response.data.message);

      setLoading(false);
      return err.response.data;
    }
  }

  // ! logout functuion
  async function logOut() {
    // loading true
    setLoading(true);
    try {
      // make api call
      const { data } = await axios.get("/api/user/logout", {
        headers: headers,
      });

      // set user state to empty
      setUser({});

      // loading false
      setLoading(false);

      return data;
    } catch (err) {
      // Handle Error Here
      console.error(err);
      toast.error(err.response.data.message);

      setLoading(false);
      return err.response.data;
    }
  }

  // ! getting products

  async function getData() {
    try {
      // getting products from api call
      // console.log("call product api test")
      const { data } = await axios.get(`/api/product`);
      // console.log(data);

      // set products to products state
      setProducts(data.products);
      // console.log(products)
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
      return err.response.data;
    }
  }

  // ! getting categories
  async function getCategories() {
    try {
      // getting categories from api call
      const { data } = await axios.get(`/api/category`);
      // console.log(data);

      // set categories to categories state
      setCategories(data.categories);
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
      return err.response.data;
    }
  }

  // ! getting featured products
  async function getFeaturedProducts() {
    // initializing empy array to store unique category id
    // const uniqueIds = [];
    // const featuredProducts = [];

    // get all category ids
    try {
      const dataCat = await axios.get("/api/category");
      // console.log("cate", dataCat)
      const categories = dataCat.data.categories.map((cat) => {
        return cat._id;
      });
      // console.log(categories)

      const { data } = await axios.get(`/api/product`);
      // console.log(data.products);

      const featuredProducts = categories.map((cat) => {
        const found = data.products.find(
          (product) => product.category._id === cat
        );
        return found;
      });
      // console.log(featuredProducts);
      setFeaturedProducts(featuredProducts);
    } catch (error) {
      console.log(error);
    }

    // get 1 item from each category
    // const unique = categories.map(cat => {
    //   const item = async() => {
    //     const data = await axios.get(`/api/product/category/one/${cat}`);
    //     console.log(data)
    //     return data
    //   }
    //   return item
    // })

    // ! geting all products from api

    // ! filering  only one product from each category
    // if (data.length >= 0) {
    // const unique = data.products.filter((element) => {
    // if (element.category) {
    //   const isDuplicate = uniqueIds.includes(element.category._id);

    //   if (!isDuplicate) {
    //     uniqueIds.push(element.category._id);

    //     return true;
    //   }

    //   return false;
    // }
    // });

    // ! set unique products to featured products state

    // setFeaturedProducts(unique);
    // }
  }

  // ! function for add product to cart
  async function addToCart(productid, quantity) {
    // find product from products by id
    let producttoadd = products.find((product) => product._id === productid);
    //check if the action id exists in the addedItems
    let existed_item = cartItems.find((product) => productid === product._id);
    if (existed_item) {
      console.log(existed_item);

      // if item is already in cart increase its quantity
      existed_item.quantity += quantity;

      //  ! update cart in localstorage
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      // show success message
      toast.success("Product Added To Cart");
    } else {
      // if item is not in cart add product
      producttoadd.quantity = quantity;

      // update app state to update cart
      setStatus("update");

      // set cart items
      setCartItems((prevItems) => [...prevItems, producttoadd]);

      // show success message
      toast.success("Product Added To Cart");
    }
  }

  async function setquantitytocartitem(productid, quantity) {
    //let producttoadd = products.find(product => product._id === productid)
    //check if the action id exists in the addedItems
    let existed_item = cartItems.find((product) => productid === product._id);

    // update item quantity
    existed_item.quantity = quantity;

    // set items in local storage
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    // return cart
    return cartItems;
  }

  // ! remove item from cart
  async function removeFromCart(id) {
    // filter items by removing the product by given id
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== id));
  }

  // ! clean cart
  async function cleancart() {
    // remove all items
    localStorage.removeItem("cartItems");

    setCartItems([]);
  }

  useEffect(() => {
    //loading true

    setLoading(true);

    const unsubscribe = async () => {
      setLoading(true);

      try {
        // verify token , check f user is logged in

        const { data } = await axios.get("/api/user/refresh", {
          headers: headers,
        });
        console.log(data);
        // set user to state
        if (data.refresh === false) {
          setLoading(false);
          return;
        }
        setUser(data.user);

        // loading false
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }

      await getData(); // get products
      await getCategories(); // get categories
      await getFeaturedProducts(); // get featured products

      const cartItemsData = JSON.parse(localStorage.getItem("cartItems")); // get cart items

      if (cartItemsData) {
        console.log("items present");
        console.log(cartItemsData);
        setStatus("update"); // update app state
        setCartItems(cartItemsData); // set cart items in cartitems state
        setLoading(false); // loading false
      }
    };

    // return () => {
    //   unsubscribe();
    // };

    unsubscribe();
  }, []);

  useEffect(() => {
    if (status === "update") {
      // if cart get update then set item in localstorage
      console.log(cartItems);
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems, status]);

  // return all functions as a component with al props
  return (
    <AppContext.Provider
      value={{
        user,
        logIn,
        createAccount,
        loading,
        logOut,
        addToCart,
        products,
        removeFromCart,
        cartItems,
        setquantitytocartitem,
        cleancart,
        categories,
        featuredproducts,
        setUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

//! export the whole context
export function useAppContext() {
  return useContext(AppContext);
}
