import { Button, Modal, Space } from "antd";
import {
  ArrowLeftOutlined,
  CheckOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { ACCOUNT, CHECKOUT_STEP_1, CHECKOUT_STEP_2 } from "constants/routes";
import { Form, Formik } from "formik";
import { displayActionMessage, displayMoney } from "helpers/utils";
import { useDocumentTitle, useScrollTop } from "hooks";
import PropType from "prop-types";
import React, { useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import * as Yup from "yup";
import { StepTracker } from "../components";
import withCheckout from "../hoc/withCheckout";
import CreditPayment from "./CreditPayment";
import PayPalPayment from "./PayPalPayment";
import Total from "./Total";
// import { apiInstance } from "./../../../utils";
import { apiInstance } from "utils";
import firebase, { db } from "services/firebase";
import { clearBasket } from "redux/actions/basketActions";
import { useDispatch } from "react-redux";

const { confirm } = Modal;

const FormSchema = Yup.object().shape({
  name: Yup.string()
    .min(4, "Name should be at least 4 characters.")
    .required("Name is required"),
  cardnumber: Yup.string()
    .min(13, "Card number should be 13-19 digits long")
    .max(19, "Card number should only be 13-19 digits long")
    .required("Card number is required."),
  expiry: Yup.date().required("Credit card expiry is required."),
  ccv: Yup.string()
    .min(3, "CCV length should be 3-4 digit")
    .max(4, "CCV length should only be 3-4 digit")
    .required("CCV is required."),
  type: Yup.string().required("Please select paymend mode"),
});

const Payment = ({ shipping, payment, subtotal, basket, auth }) => {
  useDocumentTitle("Check Out Final Step | Getama Shop");
  useScrollTop();

  const stripe = useStripe();
  const elements = useElements();

  const [disabled, setDisabled] = useState(true);
  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState("");
  const dispatch = useDispatch();

  // Modal

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const history = useHistory();

  console.log("shipping :");
  console.log(shipping);
  console.log("payment :");
  console.log(payment);
  console.log("subtotal :");
  console.log(subtotal);
  console.log("basket :");
  console.log(basket);
  console.log("Auth :");
  console.log(auth);

  // const reBasket = basket.map((product, i) => {
  //   product;
  // });

  // console.log(reBasket);

  const initFormikValues = {
    name: payment.name || "",
    cardnumber: payment.cardnumber || "",
    expiry: payment.expiry || "",
    ccv: payment.ccv || "",
    type: payment.type || "paypal",
  };

  const handleFormSubmit = async (evt) => {
    evt.preventDefault();
    // setIsModalVisible(true);

    confirm({
      title: "PEMBERITAHUAN!!!",
      icon: <ExclamationCircleOutlined />,
      content:
        "Untuk proses PENGIRIMAN BARANG, admin akan menghubungi anda secara manual melalui NOMOR atau EMAIL yang anda masukan.",
      onOk() {
        console.log("OK");
      },

      onCancel() {
        console.log("Cancel");
      },
    });

    const cardElement = elements.getElement("card");

    apiInstance
      .post("/checkout/step3", {
        amount: Math.floor(subtotal + 10000) * 100,
        shipping: {
          name: shipping.fullname,
          address: {
            line1: shipping.address,
            country: "ID",
          },
        },
      })
      .then(({ data: clientSecret }) => {
        stripe
          .createPaymentMethod({
            type: "card",
            card: cardElement,
            billing_details: {
              name: payment.name,
              address: {
                line1: shipping.address,
                country: "ID",
              },
            },
          })
          .then(({ paymentMethod }) => {
            stripe
              .confirmCardPayment(clientSecret, {
                payment_method: paymentMethod.id,
              })
              .then(({ paymentIntent }) => {
                // console.log(paymentIntent);

                firebase.auth.onAuthStateChanged(function (user) {
                  if (user) {
                    db.collection("orders").doc().set({
                      orderUserID: user.uid,
                      orderID: paymentIntent.id,
                      createdDate: paymentIntent.created,
                      amount: paymentIntent.amount,
                      orderItem: basket,
                      shipping: shipping,
                      status: paymentIntent.status,
                    });

                    displayActionMessage("PEMBAYARAN BERHASIL!!!", "info");
                    // <Redirect to={ACCOUNT} />;
                    // history.push(ACCOUNT);
                    dispatch(clearBasket());
                    setTimeout(() => {
                      document.location.reload();
                    }, 3000);
                  } else {
                    console.log("tidak login");
                  }
                });
              });
          });
      });
    // history.replace("/orders");
  };

  if (!shipping || !shipping.isDone) {
    return <Redirect to={CHECKOUT_STEP_1} />;
  }
  return (
    <div className="checkout">
      <StepTracker current={3} />
      <div className="checkout-field margin-0">
        <div className="checkout-checkbox-field">
          <input checked={true} id="modeCredit" type="radio" />
          <label className="d-flex w-100" htmlFor="modeCredit">
            <div className="d-flex-grow-1 margin-left-s">
              <h4 className="margin-0">Credit Card</h4>
              <span className="text-subtle d-block margin-top-s">
                Pay with Visa, Master Card and other debit or credit card
              </span>
            </div>
            <div className="d-flex">
              <div className="payment-img payment-img-visa" />
              &nbsp;
              <div className="payment-img payment-img-mastercard" />
            </div>
          </label>
        </div>
      </div>
      <form
        className="checkout-step-3 checkout-collapse-sub"
        onSubmit={handleFormSubmit}
      >
        <label className="label-input">Nomor Rekening</label>
        <CardElement className="input-form" />
        <div className="basket-total text-right">
          <p className="basket-total-title">Total:</p>
          <h2 className="basket-total-amount">
            {displayMoney(Math.floor(subtotal + 10000))}
          </h2>
        </div>
        <br />
        <div className="checkout-shipping-action">
          <button
            className="button button-muted"
            onClick={() => <Redirect to={CHECKOUT_STEP_2} />}
            type="button"
          >
            <ArrowLeftOutlined />
            &nbsp; Go Back
          </button>
          <button className="button" disabled={processing} type="submit">
            <CheckOutlined />
            {processing ? <p>Processing</p> : " Confirm"}
          </button>
        </div>
      </form>
    </div>

    //
    // <div className="checkout">
    //   <StepTracker current={3} />
    //   <Formik
    //     initialValues={initFormikValues}
    //     validateOnChange
    //     validationSchema={FormSchema}
    //     validate={(form) => {
    //       if (form.type === 'paypal') {
    //         displayActionMessage('Feature not ready yet :)', 'info');
    //       }
    //     }}
    //     onSubmit={onConfirm}
    //   >
    //     {() => (
    //       <Form className="checkout-step-3">
    //         <CreditPayment />
    //         <PayPalPayment />
    //         <Total
    //           isInternational={shipping.isInternational}
    //           subtotal={subtotal}
    //         />
    //       </Form>
    //     )}
    //   </Formik>
    // </div>
  );
};

Payment.propTypes = {
  shipping: PropType.shape({
    isDone: PropType.bool,
    isInternational: PropType.bool,
  }).isRequired,
  payment: PropType.shape({
    name: PropType.string,
    cardnumber: PropType.string,
    expiry: PropType.string,
    ccv: PropType.string,
    type: PropType.string,
  }).isRequired,
  subtotal: PropType.number.isRequired,
};

export default withCheckout(Payment);
