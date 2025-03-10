import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CartCard from "../Containers/CartCard";
import StripeCheckout from "react-stripe-checkout";
import "../Containers/CartCard.css";
import "../Containers/Cart.css";
import { initializeCart, remove } from "../store/actions/actions";

const Cart = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initializeCart());
  }, [dispatch]);
  const [noItems, setNoItems] = useState(true);
  const tavara = { name: "esimerkki", price: 1 };

  let totalPrice = 0;
  let itemNames = "";

  const cartList = useSelector((state) => state.cart);

  useEffect(() => {
    if (cartList.length > 0) {
      setNoItems(false);
    }
  });

  cartList.forEach((element) => {
    totalPrice = totalPrice + element.hinta;
    itemNames = itemNames + element.nimi + ", ";
  });

  tavara.price = totalPrice;
  tavara.name = itemNames;

  let cartItems = [];

  const makePayment = (token) => {
    const body = {
      token,
      tavara,
    };

    const headers = {
      "Content-Type": "application/json",
    };
    return fetch(`https://stripe-payment-artisaanz.herokuapp.com/maksu`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
      .then((response) => {
        //const { status } = response;
        emptyCart();
      })
      .then(() => {
        window.location.assign("/onnistui");
      })
      .catch(() => {
        window.location.assign("/epäonnistui");
      });
  };

  const emptyCart = () => {
    cartList.forEach((el) => {
      dispatch(remove(el));
    });
  };

  cartItems = cartList.map((tuote) => {
    return (
      <>
        <div className="cart" key={tuote.id}>
          <CartCard
            id={tuote.id}
            key={tuote.id}
            kuva={tuote.kuva[0].kuva}
            nimi={tuote.nimi}
            hinta={tuote.hinta}
            removeBtn={
              <button
                className="removeBtn"
                onClick={() => dispatch(remove(tuote))}
              >
                Poista
              </button>
            }
          />
        </div>
      </>
    );
  });

  return (
    <main id="cart">
      <h1 className="cartside">Ostoskori</h1>
      <div>
        {noItems ? (
          <h2 className="cartside">Ostoskorisi on tyhjä</h2>
        ) : (
          <>
            {cartItems}
            <h2 className="cartside">Yhteensä {totalPrice} €</h2>

            <StripeCheckout
              stripeKey={process.env.REACT_APP_KEY}
              token={makePayment}
              name={itemNames}
              amount={totalPrice * 100}
              shippingAddress
              billingAddress
              currency="EUR"
            >
              <button className="cartBtn">Maksamaan</button>
            </StripeCheckout>
          </>
        )}
      </div>
    </main>
  );
};

export default Cart;
