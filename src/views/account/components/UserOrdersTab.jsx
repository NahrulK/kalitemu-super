import React, { useEffect, useState } from "react";
import { Image, Table, Button, Pagination, Popover } from "antd";
import { displayMoney } from "helpers/utils";
import moment from "moment";
import { BasketItem } from "components/basket";
import { useDispatch } from "react-redux";
import { ImageLoader } from "components/common";
import firebase, { db } from "services/firebase";

const UserOrdersTab = () => {
  const [visible, setVisible] = useState(false);

  const [orders, setOrders] = useState([]);
  let { userFav } = useState([]);

  const dispatch = useDispatch();

  const fetchOrders = async () => {
    setOrders([]);

    let nomer = 1;
    const response = db.collection("orders");
    const data = await response.get();
    data.docs.map((item) => {
      setOrders((oldArray, index) => [
        ...oldArray,
        {
          no: nomer++,
          id: item.data().orderID,
          orderUserId: item.data().orderUserID,
          amount: displayMoney(Math.floor(item.data().amount / 100)),
          date: new Date(item.data().createdDate * 1000).toLocaleString(),
          detail: item.data().orderItem,
          // number: item.data().shipping.mobile.value,
        },

        // console.log(item.data().shipping),
      ]);
    });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // const launchOptimistic = orders.map((elem) =>
  //   elem.detail.map((item) => ({
  //     image: item.image,
  //     product: item.name,
  //     qty: item.quantity,
  //     price: displayMoney(Math.floor(item.price)),
  //   }))
  // );

  console.log(orders);
  // console.log(launchOptimistic);

  userFav = orders.filter(
    (item) => item.orderUserId === firebase.auth.currentUser.uid
  );

  console.log(userFav);
  // console.log(firebase.auth.currentUser.uid === orders.orderUserId);

  const hide = () => {
    setVisible(false);
  };

  const handleVisibleChange = (newVisible) => {
    setVisible(newVisible);
  };

  const [dataSource, setDataSource] = useState([
    {
      no: 1,
      id: "ASDW123DCXSSW21",
      amount: displayMoney(Math.floor(40000)),
      date: new Date(1660448345 * 1000).toLocaleString(),
      address: "Kebon Dewa- Jl. Mataram-Sikur",
    },
  ]);

  // Detail Source
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

  // Column
  const detailsColumns = [
    {
      key: "1",
      title: "Images",
      dataIndex: "images",
      render: (images) => <Image width={100} height={100} src={images} />,
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

  const columns = [
    {
      key: "1",
      title: "No",
      dataIndex: "no", // this is the value that is parsed from the DB / server side
    },
    {
      key: "2",
      title: "ID",
      dataIndex: "id",
    },
    {
      key: "3",
      title: "Amount",
      dataIndex: "amount",
    },
    {
      key: "4",
      title: "Date",
      dataIndex: "date",
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
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
    <div>
      <Table
        columns={columns}
        dataSource={userFav}
        pagination={{
          defaultPageSize: 2,
        }}
      />
    </div>
  );
};

export default UserOrdersTab;
