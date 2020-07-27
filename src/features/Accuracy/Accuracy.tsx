import React, { useEffect, useState, useContext } from "react";
import "./Accuracy.css";
import {
  PageHeader,
  Statistic,
  Table,
  Row,
  Spin,
  message,
  Input,
  Space,
  Button,
} from "antd";
import { Services } from "../../app/api/agent";
import PredictionStore from "../../app/stores/prediction.store";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import dashboardStore from "../../app/stores/dashboard.store";

interface IAccuracy {
  [key: string]: any;
}

const subFilterCategoriesOriginal: { text: string; value: string }[] = [];
let subFilterCategories: { text: string; value: string }[] = [];
const superFilterCategories: { text: string; value: string }[] = [];

const Accuracy = () => {
  const { treeData } = useContext(PredictionStore);
  const { accData, setAccData } = useContext(dashboardStore);

  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  let searchInput: Input | null = null;

  const getColumnSearchProps = (dataIndex: string) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: any) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value: any, record: any) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible: boolean) => {
      if (visible) {
        setTimeout(() => searchInput!.select());
      }
    },
    render: (text: string) =>
      searchedColumn === dataIndex
        ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text.toString()}
          />
        )
        : (
          text
        ),
  });

  const handleSearch = (selectedKeys: any, confirm: any, dataIndex: any) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: any) => {
    clearFilters();
    setSearchText("");
  };

  useEffect(() => {
    let mounted = true;

    const loadAccuracy = async () => {
      try {
        subFilterCategoriesOriginal.length = 0;
        subFilterCategories.length = 0;
        superFilterCategories.length = 0;

        setLoading(true);
        const result = await Services.PredictionService.getAccuracy();
        if (mounted) {
          setAccData(result);
          populateFilters(result);
          setLoading(false);
        }
      } catch (error) {
        message.error("Unable to connect to server. Try again later.");
        if (mounted) setLoading(false);
      }
    };

    if (!accData) {
      loadAccuracy();
    }

    return () => {
      mounted = false;
    };
  }, []);

  const populateFilters = (value: any) => {
    value.items.forEach((item: any) => {
      if (
        !subFilterCategoriesOriginal.find(
          (value) => value.value === item.sub_category,
        )
      ) {
        subFilterCategoriesOriginal.push({
          text: item.sub_category,
          value: item.sub_category,
        });
      }

      if (
        !superFilterCategories.find(
          (value) => value.value === item.super_category,
        )
      ) {
        superFilterCategories.push({
          text: item.super_category,
          value: item.super_category,
        });
      }

      subFilterCategories = [...subFilterCategoriesOriginal];
    });
  };

  const columns: any[] = [
    {
      title: "Item Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Super Category",
      dataIndex: "super_category",
      key: "super_category",
      filters: superFilterCategories,
      filterMultiple: true,
      onFilter: (value: string, record: any) =>
        record.super_category.indexOf(value) === 0,
    },
    {
      title: "Sub Category",
      dataIndex: "sub_category",
      key: "sub_category",
      filters: subFilterCategories,
      filterMultiple: true,
      onFilter: (value: string, record: any) =>
        record.sub_category.indexOf(value) === 0,
    },
    {
      title: "Accuracy (%)",
      dataIndex: "accuracy",
      key: "accuracy",
      sorter: (a: any, b: any) => a.accuracy - b.accuracy,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Non Zeros (%)",
      dataIndex: "non_zeros",
      key: "non_zeros",
      sorter: (a: any, b: any) => a.non_zeros - b.non_zeros,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Zeros (%)",
      dataIndex: "zeros",
      key: "zeros",
      sorter: (a: any, b: any) => a.zeros - b.zeros,
      sortDirections: ["descend", "ascend"],
    },
  ];

  const onPageSizeChange = (current: number, size: number) => {
    setPageSize(size);
  };

  const handleOnTableChange = (
    pagination: any,
    filters: Record<string, React.ReactText[] | null>,
    sorter: any,
    extra: any,
  ) => {
    if (filters.super_category !== null) {
      subFilterCategories.length = 0;

      filters.super_category.forEach((value: any) => {
        const cat = treeData.find((c) => c.title === value);
        cat.children.forEach((subCat: any) => {
          subFilterCategories.push({
            text: subCat.title,
            value: subCat.title,
          });
        });
      });
    } else if (filters.super_category === null) {
      subFilterCategories.length = 0;
      subFilterCategoriesOriginal.forEach((v) => {
        subFilterCategories.push(v);
      });
    }
  };

  return (
    <div>
      <Spin spinning={loading}>
        <PageHeader
          className="site-page-header"
          title="Accuracy"
          subTitle="Displays the prediction accuracy of each item"
          extra={<Row>
            <Statistic
              title="Accuracy"
              suffix="%"
              precision={2}
              value={Number.parseFloat(!accData ? "0.00" : accData.accuracy)}
            />
            <Statistic
              title="Non Zeros"
              suffix="%"
              value={Number.parseFloat(!accData ? "0.00" : accData.non_zeros)}
              precision={2}
              style={{ margin: "0 60px" }}
            />
            <Statistic
              title="Zeros"
              suffix="%"
              precision={2}
              value={Number.parseFloat(!accData ? "0.00" : accData.zeros)}
            />
          </Row>}
        />
        <Table
          dataSource={!accData ? undefined : accData.items}
          style={{ margin: "0 20px" }}
          columns={columns}
          onChange={handleOnTableChange}
          pagination={{
            pageSize: pageSize,
            pageSizeOptions: ["10", "50", "100"],
            onShowSizeChange: onPageSizeChange,
            showSizeChanger: true,
            position: ["bottomRight"],
          }}
          scroll={{ y: 380 }}
          bordered
        />
      </Spin>
    </div>
  );
};

export default Accuracy;
