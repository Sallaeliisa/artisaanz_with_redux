import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import CartCard from "../Containers/CartCard";
import { Link } from "react-router-dom";
import StripeCheckout from "react-stripe-checkout";
import "../Containers/CartCard.css";

const Cart = () => {
  const [product, setProduct] = useState({
    name: "React from fb",
    price: 10,
    productBy: "facebook",
  });
  let cartItems = [];

  const makePayment = (token) => {
    const body = {
      token,
      product,
    };
    const headers = {
      "Content-Type": "application/json",
    };
    return fetch(`http://localhost:4000/maksu`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
      .then((response) => {
        console.log("RESPONSE ", response);
        const { status } = response;
        console.log("STATUS ", status);
      })
      .catch((error) => console.log(error));
  };

  const maksa = () => {
    fetch("http://localhost:3001/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [
          { id: 1, quantity: 1 },
          { id: 2, quantity: 1 },
        ],
      }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        return res.json().then((json) => Promise.reject(json));
      })
      .then(({ url }) => {
        window.location = url;
      })
      .catch((e) => [console.log(e.error)]);
  };

  const cartList = useSelector((state) => state.cart);

  cartItems = cartList.map((tuote) => {
    return (
      <div className="cart" key={tuote.id}>
        <CartCard
          id={tuote.id}
          key={tuote.id}
          kuva={tuote.kuva}
          nimi={tuote.nimi}
          hinta={tuote.hinta}
          removeBtn={"Poista"}
        />
      </div>
    );
  });

  return (
    <main id="cart">
      <h1>Ostoskori</h1>
      <div className="cartItems">{cartItems}</div>
      <h2>Yhteensä €</h2>
      {/* <Link to="/kassalle"> Maksamaan mars! </Link> */}
      <a href="https://artisaanz.herokuapp.com/checkout">
        {" "}
        Herokuun maksamaan tästä!{" "}
      </a>
      <button onClick={() => maksa()}>Maksa nodella</button>
      <StripeCheckout
        stripeKey={process.env.REACT_APP_KEY}
        token={makePayment}
        name="Buy a product"
        amount={product.price * 100}
        shippingAddress
        billingAddress
      >
        <button className="removeBtn">Maksamaan</button>
      </StripeCheckout>
    </main>
  );
};

export default Cart;
