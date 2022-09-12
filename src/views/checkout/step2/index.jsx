/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-nested-ternary */
import { Button, Modal, Space } from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Boundary } from "components/common";
import { CHECKOUT_STEP_1, CHECKOUT_STEP_3 } from "constants/routes";
import { Form, Formik } from "formik";
import { useDocumentTitle, useScrollTop } from "hooks";
import PropType from "prop-types";
import React, { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { setShippingDetails } from "redux/actions/checkoutActions";
import * as Yup from "yup";
import { StepTracker } from "../components";
import withCheckout from "../hoc/withCheckout";
// import ShippingForm from "./ShippingForm";
import ShippingTotal from "./ShippingTotal";
import { useEffect } from "react";
// Shipping form import
import { CustomInput, CustomMobileInput } from "components/formik";
import { Field, useFormikContext } from "formik";
// Shipping form import
// TreeSelect Import
import { TreeSelect } from "antd";
import { AppContext } from "context/app-context";

// const treeData = [
//   {
//     title: "Lombok Timur",
//     value: "Lombok Timur",
//     children: [
//       {
//         title: "Terara",
//         value: "Terara",
//         children: [
//           {
//             title: "Jenggik - Rp.10.000",
//             value: 10000,
//           },
//           {
//             title: "Rarang - Rp.8.000",
//             value: 8000,
//           },
//         ],
//       },
//       {
//         title: "Sikur",
//         value: "Sikur",
//         children: [
//           {
//             title: "Paok Motong - Rp.12.000",
//             value: 12000,
//           },
//           {
//             title: "Kotaraja - Rp.9.000",
//             value: 9000,
//           },
//         ],
//       },
//     ],
//   },
//   {
//     title: "Lombok Barat",
//     value: "Lombok Barat",
//     children: [
//       {
//         title: "Gerung",
//         value: "Gerung",
//         children: [
//           {
//             title: "Babussalam - Rp.50.000",
//             value: 50000,
//           },
//           {
//             title: "Banyu Urip - Rp.55.000",
//             value: 55000,
//           },
//         ],
//       },
//       {
//         title: "Kediri",
//         value: "Kediri",
//         children: [
//           {
//             title: "Banyumulek - Rp.60.000",
//             value: 60000,
//           },
//           {
//             title: "Dasan Baru - Rp.70.000",
//             value: 70000,
//           },
//         ],
//       },
//     ],
//   },
// ];
// TreeSelect

// Modal const
const { confirm } = Modal;

const FormSchema = Yup.object().shape({
  fullname: Yup.string()
    .required("Full name is required.")
    .min(2, "Full name must be at least 2 characters long.")
    .max(60, "Full name must only be less than 60 characters."),
  email: Yup.string()
    .email("Email is not valid.")
    .required("Email is required."),
  address: Yup.string().required("Shipping address is required."),
  mobile: Yup.object()
    .shape({
      country: Yup.string(),
      countryCode: Yup.string(),
      dialCode: Yup.string().required("Mobile number is required"),
      value: Yup.string().required("Mobile number is required"),
    })
    .required("Mobile number is required."),
  isInternational: Yup.boolean(),
  isDone: Yup.boolean(),
});

const ShippingDetails = ({ profile, shipping, subtotal }) => {
  useDocumentTitle("Check Out Step 2 | Getama Shop");
  useScrollTop();
  const dispatch = useDispatch();
  const history = useHistory();

  // Formik varibale
  const values = useFormikContext();

  // Ongkir Varibale

  const context = useContext(AppContext);
  console.log(context);

  const onChange = (newOngkir) => {
    context.setOngkir(newOngkir);
  };

  let finalTotal = subtotal + context.ongkir;

  // console.log(ongkir);

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

  // useEffect(() => {
  //   confirm({
  //     title: "PERHATIAN!!",
  //     icon: <ExclamationCircleOutlined />,
  //     content:
  //       "Mohon isi NOMOR  dan EMAIL anda dengan benar dan menggunakan kontak yang pribadi yang bisa dihubungi karena akan digunakan sebagai sarana komunikasi selama proses PENGIRIMAN BARANG",
  //     onOk() {
  //       console.log("OK");
  //     },

  //     onCancel() {
  //       console.log("Cancel");
  //     },
  //   });
  // }, []);

  const initFormikValues = {
    fullname: shipping.fullname || profile.fullname || "",
    email: shipping.email || profile.email || "",
    address: shipping.address || profile.address || "",
    mobile: shipping.mobile || profile.mobile || {},
    isInternational: shipping.isInternational || false,
    isDone: shipping.isDone || false,
  };

  const onSubmitForm = (form) => {
    dispatch(
      setShippingDetails({
        fullname: form.fullname,
        email: form.email,
        address: form.address,
        mobile: form.mobile,
        isInternational: form.isInternational,
        isDone: true,
      })
    );
    history.push(CHECKOUT_STEP_3);
  };

  return (
    <Boundary>
      <div className="checkout">
        <StepTracker current={2} />
        <div className="checkout-step-2">
          <h3 className="text-center">Delivery Details</h3>
          <Formik
            initialValues={initFormikValues}
            validateOnChange
            validationSchema={FormSchema}
            onSubmit={onSubmitForm}
          >
            {() => (
              <Form>
                {/* SHIPPING FORM */}
                {/* <ShippingForm /> */}
                <div className="checkout-shipping-wrapper">
                  <div className="checkout-shipping-form">
                    <div className="checkout-fieldset">
                      <div className="d-block checkout-field">
                        <Field
                          name="fullname"
                          type="text"
                          label="* Full Name"
                          placeholder="Enter your full name"
                          component={CustomInput}
                          style={{ textTransform: "capitalize" }}
                        />
                      </div>
                      <div className="d-block checkout-field">
                        <Field
                          name="email"
                          type="email"
                          label="* Email Address"
                          placeholder="Enter your email address"
                          component={CustomInput}
                        />
                      </div>
                    </div>
                    <div className="checkout-fieldset">
                      <div className="d-block checkout-field">
                        <Field
                          name="address"
                          type="text"
                          label="* Delivery Address"
                          placeholder="Enter full delivery address"
                          component={CustomInput}
                        />
                      </div>
                      <div className="d-block checkout-field">
                        <CustomMobileInput
                          name="mobile"
                          defaultValue="087762804486"
                        />
                      </div>
                    </div>
                    <div className="checkout-fieldset">
                      <Field name="isInternational">
                        {({ field, form, meta }) => (
                          <div className="checkout-field">
                            {meta.touched && meta.error ? (
                              <span className="label-input label-error">
                                {meta.error}
                              </span>
                            ) : (
                              // eslint-disable-next-line jsx-a11y/label-has-associated-control
                              <label
                                className="label-input"
                                htmlFor={field.name}
                              >
                                Delivery Option
                              </label>
                            )}
                            <div className="checkout-checkbox-field">
                              {/* <input
                                checked={field.value}
                                id={field.name}
                                onChange={(e) => {
                                  form.setValues({
                                    ...form.values,
                                    [field.name]: e.target.checked,
                                  });
                                }}
                                value={meta.value}
                                type="checkbox"
                              /> */}
                              {/* <label
                                className="d-flex w-100"
                                htmlFor={field.name}
                              >
                                <h5 className="d-flex-grow-1 margin-0">
                                  &nbsp; Ongkos Kirim &nbsp;
                                  <span className="text-subtle">1-2 days</span>
                                </h5>
                                <h4 className="margin-0">Rp 10.000,00</h4>
                              </label> */}
                              <TreeSelect
                                style={{
                                  width: "100%",
                                }}
                                value={context.ongkir}
                                dropdownStyle={{
                                  maxHeight: 400,
                                  overflow: "auto",
                                }}
                                treeData={context.dataOngkir}
                                placeholder="Please select"
                                onChange={onChange}
                              />
                            </div>
                          </div>
                        )}
                      </Field>
                    </div>
                  </div>
                </div>

                {/* SHIPPING FORM */}
                <br />
                {/*  ---- TOTAL --------- */}
                <ShippingTotal
                  finalTotal={finalTotal}
                  ongkir={context.ongkir}
                  subtotal={subtotal}
                />
                <br />
                {/*  ----- NEXT/PREV BUTTONS --------- */}
                <div className="checkout-shipping-action">
                  <button
                    className="button button-muted"
                    onClick={() => history.push(CHECKOUT_STEP_1)}
                    type="button"
                  >
                    <ArrowLeftOutlined />
                    &nbsp; Go Back
                  </button>
                  <button className="button button-icon" type="submit">
                    Next Step &nbsp;
                    <ArrowRightOutlined />
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Boundary>
  );
};

ShippingDetails.propTypes = {
  subtotal: PropType.number.isRequired,
  profile: PropType.shape({
    fullname: PropType.string,
    email: PropType.string,
    address: PropType.string,
    mobile: PropType.object,
  }).isRequired,
  shipping: PropType.shape({
    fullname: PropType.string,
    email: PropType.string,
    address: PropType.string,
    mobile: PropType.object,
    isInternational: PropType.bool,
    isDone: PropType.bool,
  }).isRequired,
};

export default withCheckout(ShippingDetails);
// export { ongkir };
