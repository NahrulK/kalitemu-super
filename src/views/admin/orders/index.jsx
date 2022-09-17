import { useDocumentTitle, useScrollTop } from "hooks";
import {
  Button,
  Image,
  Radio,
  Space,
  Table,
  Tag,
  Pagination,
  Popover,
} from "antd";
import React, { useEffect, useState } from "react";
import { displayMoney } from "helpers/utils";
import { db } from "services/firebase";
import { ImageLoader } from "components/common";
import moment from "moment";

// Detail Source
const data = [
  {
    key: "1",
    name: "Nahrul Khayattullah",
    amount: displayMoney(Math.floor(40000)),
    address: "Bat kokok, terara.",
    status: ["success"],
  },
  {
    key: "2",
    name: "Emha Asqolani",
    amount: displayMoney(Math.floor(100000)),
    address: "Karang sukun . rt03",
    status: ["success"],
  },
  {
    key: "3",
    name: "Hery Rian",
    amount: displayMoney(Math.floor(70000)),
    address: "Selong No. 1 ",
    status: ["success"],
  },
];

const detailsColumns = [
  {
    key: "1",
    title: "Images",
    dataIndex: "image",
    render: (images) => <Image alt="genteng" width={50} src={images} />,
  },
  {
    key: "2",
    title: "Product",
    dataIndex: "product",
  },
  {
    key: "3",
    title: "Qty",
    dataIndex: "qty",
  },
  {
    key: "4",
    title: "Price",
    dataIndex: "price",
  },
];

const Orders = () => {
  // Column

  // Data Column
  const [orders, setOrders] = useState([]);

  useDocumentTitle("Admin Orders");
  useScrollTop();

  const fetchOrders = async () => {
    setOrders([]);

    let nomer = 1;
    const response = db.collection("orders");
    const data = await response.get();
    data.docs.map((item) => {
      setOrders((oldArray, index) => [
        ...oldArray,
        {
          key: nomer++,
          name: item.data().shipping.fullname,
          amount: displayMoney(Math.floor(item.data().amount / 100)),
          date: new Date(item.data().createdDate * 1000).toLocaleString(),
          address:
            item.data().shipping.address +
            "  tlp: " +
            item.data().shipping.mobile.value +
            " Email : " +
            item.data().shipping.email,
          status: [item.data().status],
          detail: item.data().orderItem,
          // no: nomer++,
          // id: item.data().orderID,
          // orderUserId: item.data().orderUserID,
          // amount: displayMoney(Math.floor(item.data().amount / 100)),
          // date: new Date(item.data().createdDate * 1000).toLocaleString(),
          // detail: item.data().orderItem,
          // number: item.data().shipping.mobile.value,
        },

        // console.log(item.data().shipping),
      ]);
    });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  console.log(orders);

  const [detailSource, setDetailSource] = useState([
    {
      image:
        "https://firebasestorage.googleapis.com/v0/b/kalitemusuper.appspot.com/o/products%2F5BwF0FlP5r2THRro3EY8?alt=media&token=65c5ae44-afd5-49e3-8a1b-dad2c43203d2",
      product: "Kalitemu Super",
      qty: 6,
      price: displayMoney(Math.floor(40000)),
    },
    {
      image:
        "https://firebasestorage.googleapis.com/v0/b/kalitemusuper.appspot.com/o/products%2F0tqU545lvhloQ2UusD49?alt=media&token=f978f740-be9e-4bdf-bfe1-394b7619f267",
      product: "Kalitemu Super",
      qty: 5,
      price: displayMoney(Math.floor(70000)),
    },
  ]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Date Added",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "status",
      key: "status",
      dataIndex: "status",
      render: (_, { status }) => (
        <>
          {status.map((tag) => {
            let color = tag.length > 7 ? "geekblue" : "green";

            if (tag === "pending") {
              color = "volcano";
            }

            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      key: "5",
      title: "Detail",
      dataIndex: "detail",
      render: (detail) => (
        <div>
          {detail.map(function (element, index) {
            return (
              <div className="basket-item">
                <div className="basket-item-wrapper">
                  <div className="basket-item-img-wrapper">
                    <ImageLoader
                      alt={element.name}
                      className="basket-item-img"
                      src={element.image}
                    />
                  </div>
                  <div className="basket-item-details">
                    <h4 className="underline basket-item-name">
                      {element.name}
                    </h4>

                    <div className="basket-item-specs">
                      <div>
                        <span className="spec-title">Quantity</span>
                        <h5 className="my-0">{element.quantity}</h5>
                      </div>
                      <div>
                        <span className="spec-title">Ukuran</span>
                        <h5 className="my-0">{element.selectedSize} mm</h5>
                      </div>
                      <div>
                        <span className="spec-title">Warna</span>
                        <div
                          style={{
                            backgroundColor:
                              element.selectedColor ||
                              element.availableColors[0],
                            width: "15px",
                            height: "15px",
                            borderRadius: "50%",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="basket-item-price">
                    <h4 className="my-0">
                      {displayMoney(element.price * element.quantity)}
                    </h4>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ),
    },
  ];

  return (
    <div className="loader">
      <h2>Daftar Pesanan Masuk</h2>
      <Table
        columns={columns}
        dataSource={orders}
        pagination={{
          defaultPageSize: 4,
        }}
      />
    </div>
  );
};

export default Orders;
