import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Container } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useAppContext } from "../context/UseAppContext";

const Cart = ({ user }) => {
  const navigate = useNavigate(); // navigate for redirecting from other state

  const { cartItems, setquantitytocartitem, removeFromCart } = useAppContext(); // function to manage cart
  const [total, setTotal] = useState(0);

  //! increment quantity in cart
  const addquantity = async (productid, price) => {
    let quantity =
      parseInt(document.getElementById(`quantity-${productid}`).value) + 1;
    await setquantitytocartitem(productid, quantity);
    document.getElementById(`quantity-${productid}`).value = quantity;
    document.getElementById(`total-${productid}`).innerHTML = price * quantity;
    updatetotal();
  };

  // ! decrement quantity in cart
  const subtractquantity = async (productid, price) => {
    console.log(productid);

    let quantity =
      parseInt(document.getElementById(`quantity-${productid}`).value) - 1;

    if (quantity >= 1) {
      await setquantitytocartitem(productid, quantity);
      document.getElementById(`quantity-${productid}`).value = quantity;
      document.getElementById(`total-${productid}`).innerHTML =
        price * quantity;
      updatetotal();
    }
  };

  // ! remove product from cart
  const removeproduct = async (productid) => {
    await removeFromCart(productid);
    setTimeout(() => {
      updatetotal();
    }, 1000);
  };

  //!  update total
  const updatetotal = () => {
    var t = cartItems.reduce(
      (total, item) => total + +item.price * +item.quantity,
      0
    );

    setTotal(t);
  };

  // first run
  useEffect(() => {
    updatetotal();
  }, [cartItems, total]);

  // ! go to checkout
  const gotocheckout = () => {
    if (user) {
      navigate("/checkout");
    } else navigate("/signin");
  };

  //rendering our ui
  return (
    <>
      <Header user={user} />
      <br />
      <h2 className="text-center">Your Cart</h2>
      <br />
      <Container>
        <div className="basket">
          <div className="basket-labels">
            <ul>
              <li className="item item-heading">Item</li>
              <li className="price">Price</li>
              <li className="quantity">Quantity</li>
              <li className="subtotal">Subtotal</li>
            </ul>
          </div>
          {cartItems.map((v, i) => {
            return (
              <div className="basket-product" key={i}>
                <div className="item">
                  <div className="product-image">
                    <img
                      src={v.images[0]}
                      alt="Placholder Image 2"
                      className="product-frame"
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <div className="product-details">
                    <h4>{v.name}</h4>
                  </div>
                </div>
                <div className="price pricecol">{v.price}</div>
                <div className="quantity quantitycol">
                  <div className="input-group quantity-container">
                    <span className="input-group-btn">
                      <button
                        type="button"
                        onClick={() => subtractquantity(v._id, v.price)}
                        className="quantity-left-minus btn btn-number"
                        data-type="minus"
                        data-field=""
                      >
                        <span className="glyphicon glyphicon-minus">-</span>
                      </button>
                    </span>
                    <input
                      type="text"
                      id={`quantity-${v._id}`}
                      name="quantity"
                      className="form-control input-number"
                      value={v.quantity}
                      min="1"
                      max="100"
                      readOnly
                    />
                    <span className="input-group-btn">
                      <button
                        type="button"
                        onClick={() => addquantity(v._id, v.price)}
                        className="quantity-right-plus btn btn-number"
                        data-type="plus"
                        data-field=""
                      >
                        <span className="glyphicon glyphicon-plus">+</span>
                      </button>
                    </span>
                  </div>{" "}
                </div>
                <div className="subtotal subtotalcol" id={"total-" + v._id}>
                  {v.price * v.quantity}
                </div>
                <div className="remove">
                  <button
                    className="btn btn-sm btn-remove"
                    onClick={() => removeproduct(v._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="summerytab">
          <div className="summary">
            <div className="summary-total-items">
              <span className="total-items"></span>Cart Overview
            </div>
            <div className="summary-subtotal">
              <div className="subtotal-title">Total</div>
              <div className="subtotal-value final-value" id="basket-subtotal">
                {total}
              </div>
            </div>
            {/* <div className="summary-total">
                            <div className="total-title">Total</div>
                            <div className="total-value final-value" id="basket-total">130.00</div>
                        </div> */}
            <div className="summary-checkout">
<<<<<<< HEAD
              <button
                className="checkout-cta"
                style={{
                  background: "#04AA6D",
                }}
                onClick={gotocheckout}
              >
=======
              <button className="checkout-cta" style={{
                  background: "#04AA6D",
                }}
                onClick={gotocheckout}>
>>>>>>> cdcc6972c79816df4f273554cca72a3107d1ceae
                Go to Secure Checkout
              </button>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Cart;
