import { useDocumentTitle, useScrollTop } from "hooks";

import React, { useEffect, useState } from "react";
import { displayMoney } from "helpers/utils";
import { db } from "services/firebase";
import { ImageLoader } from "components/common";
import moment from "moment";

import {
  Card,
  Col,
  Row,
  Typography,
  Tooltip,
  Progress,
  Upload,
  message,
  Button,
  Timeline,
  Radio,
  Table,
  Tag,
} from "antd";
import {
  ToTopOutlined,
  MenuUnfoldOutlined,
  RightOutlined,
} from "@ant-design/icons";
import Paragraph from "antd/lib/typography/Paragraph";
import ReactApexChart from "react-apexcharts";

const Dashboard = () => {
  useDocumentTitle("Admin Dashboard");
  useScrollTop();

  const { Title, Text } = Typography;
  const [orders, setOrders] = useState([]);
  const [ordersDetail, setOrdersDetail] = useState([]);
  const [orderLine, setOrdersLine] = useState([]);
  const [orderLineY, setOrdersLineY] = useState([]);
  const [users, setUsers] = useState([]);
  const [product, setProduct] = useState([]);
  const [totalPembayaran, setTotalPembayaran] = useState(0);

  const fetchOrders = async () => {
    setOrders([]);
    setUsers([]);
    setProduct([]);

    let nomer = 1;
    const ordersItem = db.collection("orders");
    const usersItem = db.collection("users");
    const productItem = db.collection("products");

    const dataOrders = await ordersItem.get();
    dataOrders.docs.map((item) => {
      setOrdersDetail((oldArray, index) => [
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
        },
      ]);

      setOrders((oldArray, index) => [
        ...oldArray,
        {
          name: item.data().shipping.fullname,
          amount: item.data().amount,
        },
      ]);

      setOrdersLine((oldArray, index) => [...oldArray, item.data().amount]);
      setOrdersLineY((oldArray, index) => [
        ...oldArray,
        displayMoney(Math.floor(item.data().amount / 100)),
      ]);
    });

    const dataProdutcs = await productItem.get();
    dataProdutcs.docs.map((item) => {
      setProduct((oldArray, index) => [...oldArray, item.data()]);
    });

    const dataUsers = await usersItem.get();
    dataUsers.docs.map((item) => {
      setUsers((oldArray, index) => [...oldArray, item.data()]);
    });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // console.log("orders :");
  // console.log(orderLine);
  // console.log("users :");
  // console.log(users);
  // console.log("products :");
  // console.log(product);

  //   var nums = ['100','300','400','60','40'];
  var sum = 0;

  for (var i = 0; i < orders.length; i++) {
    sum += parseInt(orders[i].amount);
  }

  // console.log("products :");
  // console.log(orderLineY);

  const count = [
    {
      today: "Total Semua Pemasukan",
      title: displayMoney(Math.floor(sum / 100)),
      persent: "+30%",
      icon: "dollor",
      bnb: "bnb2",
    },
    {
      today: "Pembayaran Masuk",
      title: `${orders?.length} Kali`,
      persent: "+20%",
      icon: "profile",
      bnb: "bnb2",
    },
    {
      today: "Jumlah User",
      title: `${users?.length} User`,
      persent: "-20%",
      icon: "heart",
      bnb: "redtext",
    },
    {
      today: "Jumlah Produk",
      title: `${product?.length} Barang`,
      persent: "10%",
      icon: "cart",
      bnb: "bnb2",
    },
  ];

  const lineChart = {
    series: [
      {
        name: "Pembayaran Masuk",
        data: orderLine,
        offsetY: 0,
      },
      // {
      //   name: "Websites",
      //   data: [30, 90, 40, 140, 290, 290, 340, 230, 400],
      //   offsetY: 0,
      // },
    ],

    options: {
      chart: {
        width: "100%",
        height: 350,
        type: "area",
        toolbar: {
          show: false,
        },
      },

      legend: {
        show: false,
      },

      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },

      yaxis: {
        labels: {
          style: {
            fontSize: "14px",
            fontWeight: 600,
            colors: ["#8c8c8c"],
          },
        },
      },

      xaxis: {
        labels: {
          style: {
            fontSize: "14px",
            fontWeight: 600,
            colors: [
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
            ],
          },
        },
        categories: orderLineY,
      },

      tooltip: {
        y: {
          formatter: function (val) {
            return val;
          },
        },
      },
    },
  };

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
      <h2>Welcome to admin dashboard</h2>
      <div className="layout-content">
        <Row className="rowgap-vbox" gutter={[24, 0]}>
          {count.map((c, index) => (
            <Col
              key={index}
              xs={24}
              sm={24}
              md={12}
              lg={6}
              xl={6}
              className="mb-24"
            >
              <Card hoverable bordered={true} className="criclebox ">
                <div className="number">
                  <Row align="middle" gutter={[24, 0]}>
                    <Col>
                      <span>{c.today}</span>
                      <Title level={3}>
                        {/* {c.title} <small className={c.bnb}>{c.persent}</small> */}
                        {c.title}
                      </Title>
                    </Col>
                    {/* <Col xs={6}>
                      <div className="icon-box">{c.icon}</div>
                    </Col> */}
                  </Row>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <ReactApexChart
          className="full-width"
          options={lineChart.options}
          series={lineChart.series}
          type="area"
          height={350}
          width={"100%"}
        />

        <h2>Daftar Pesanan Masuk</h2>
        <Table
          columns={columns}
          dataSource={ordersDetail}
          pagination={{
            defaultPageSize: 4,
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
