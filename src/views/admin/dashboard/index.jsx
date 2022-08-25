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
import React, { useState } from "react";
import { displayMoney } from "helpers/utils";

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

const Dashboard = () => {
  // Column
  const [visible, setVisible] = useState(false);
  // Data Column

  const hide = () => {
    setVisible(false);
  };

  const handleVisibleChange = (newVisible) => {
    setVisible(newVisible);
  };

  useDocumentTitle("Welcome | Admin Dashboard");
  useScrollTop();

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
      render: () => (
        <Popover
          title="Detail"
          placement="left"
          content={
            <div>
              <Table columns={detailsColumns} dataSource={detailSource} />

              {/* <p>
                <Image
                  alt="genteng"
                  width={100}
                  src="https://firebasestorage.googleapis.com/v0/b/kalitemusuper.appspot.com/o/products%2F0tqU545lvhloQ2UusD49?alt=media&token=f978f740-be9e-4bdf-bfe1-394b7619f267"
                />
              </p>
              <span>10.000</span>
              <p>
                <Image
                  alt="genteng"
                  width={100}
                  src="https://firebasestorage.googleapis.com/v0/b/kalitemusuper.appspot.com/o/products%2F0tqU545lvhloQ2UusD49?alt=media&token=f978f740-be9e-4bdf-bfe1-394b7619f267"
                />
              </p>
              <span>30.000</span>
              <br />
              <a onClick={hide}>Close</a> */}
            </div>
          }
          trigger="click"
          visible={visible}
          onVisibleChange={handleVisibleChange}
        >
          <Button type="primary">Detail</Button>
        </Popover>
      ),
    },
  ];

  return (
    <div className="loader">
      <h2>Welcome to admin dashboard</h2>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default Dashboard;
