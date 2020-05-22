import React, { useState, useEffect, useContext } from "react";
import { Table, Button, Space, Input } from "antd";
import { observer } from "mobx-react-lite";
import PredictionStore from "../../app/stores/prediction.store";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

let subFilterCategories: { text: string; value: string }[] = [];
const subFilterCategoriesOriginal: { text: string; value: string }[] = [];
const superFilterCategories: { text: string; value: string }[] = [];

const defaultColumns: any[] = [
  {
    title: "Super Category",
    dataIndex: "super_category",
    key: "super_category",
    fixed: "left",
    width: 150,
    filters: superFilterCategories,
    filterMultiple: true,
    onFilter: (value: string, record: any) =>
      record.super_category.indexOf(value) === 0,
  },
  {
    title: "Sub Category",
    dataIndex: "sub_category",
    key: "sub_category",
    fixed: "left",
    width: 180,
    filters: subFilterCategories,
    filterMultiple: true,
    onFilter: (value: string, record: any) =>
      record.sub_category.indexOf(value) === 0,
  },
];

const PredictionQuantity = () => {
  const { predictionOutput, treeData } = useContext(PredictionStore);

  const [dataSource, setDataSource] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [pageSize, setPageSize] = useState(10);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  useEffect(() => {
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
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
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
        record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      onFilterDropdownVisibleChange: (visible: boolean) => {
        if (visible) {
          setTimeout(() => searchInput!.select());
        }
      },
      render: (text: string) =>
        searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text.toString()}
          />
        ) : (
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

    const generateData = () => {
      subFilterCategories.length = 0;
      subFilterCategoriesOriginal.length = 0;
      superFilterCategories.length = 0;

      const newDataSource: any[] = [];

      predictionOutput[Object.keys(predictionOutput)[0]].forEach(
        (item: any) => {
          const tableData: any = {};

          tableData["key"] = item.key;
          tableData["name"] = item.name;
          tableData["sub_category"] = item.sub_category;
          tableData["super_category"] = item.super_category;

          if (
            !superFilterCategories.find(
              (value) => value.value === item.super_category
            )
          ) {
            superFilterCategories.push({
              text: item.super_category,
              value: item.super_category,
            });
          }

          if (
            !subFilterCategoriesOriginal.find(
              (value) => value.value === item.sub_category
            )
          ) {
            subFilterCategoriesOriginal.push({
              text: item.sub_category,
              value: item.sub_category,
            });
          }

          Object.keys(item.predicion).forEach((v: string) => {
            tableData[v] = item.predicion[v].quantity;
          });

          newDataSource.push(tableData);
        }
      );

      subFilterCategoriesOriginal.forEach((v) => {
        subFilterCategories.push(v);
      });

      setDataSource(newDataSource);
    };

    const generateColumns = () => {
      const newColumns = [
        ...defaultColumns,
        {
          title: "Item Name",
          dataIndex: "name",
          key: "name",
          ...getColumnSearchProps("name"),
          width: 200,
          fixed: "left",
        },
      ];

      Object.keys(
        predictionOutput[Object.keys(predictionOutput)[0]][0].predicion
      ).forEach((v: string) => {
        if (v !== "total") {
          newColumns.push({
            title: v,
            dataIndex: v,
            key: v,
            sorter: (a: any, b: any) => a[v] - b[v],
            sortDirections: ["descend", "ascend"],
            width: 150,
          });
        }
      });

      newColumns.push({
        title: "Total Quantity",
        dataIndex: "total",
        key: "total",
        sorter: (a: any, b: any) => a["total"] - b["total"],
        sortDirections: ["descend", "ascend"],
        fixed: "right",
        width: 150,
      });
      setColumns(newColumns);
    };

    generateColumns();
    generateData();
  }, [predictionOutput, searchText, searchedColumn]);

  const handleOnTableChange = (
    pagination: any,
    filters: Record<string, React.ReactText[] | null>,
    sorter: any,
    extra: any
  ) => {
    console.log("filter");
    if (
      filters.super_category !== undefined &&
      filters.super_category !== null
    ) {
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
    } else if (
      filters.super_category !== undefined &&
      filters.super_category === null
    ) {
      subFilterCategories.length = 0;
      subFilterCategoriesOriginal.forEach((v) => {
        subFilterCategories.push(v);
      });
    }
  };

  const onPageSizeChange = (current: number, size: number) => {
    setPageSize(size);
  };

  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        onChange={handleOnTableChange}
        pagination={{
          pageSize: pageSize,
          pageSizeOptions: ["10", "20"],
          showSizeChanger: true,
          onShowSizeChange: onPageSizeChange,
          position: ["bottomRight"],
        }}
        bordered
        scroll={{ y: 360, x: 1000 }}
      />
    </div>
  );
};

export default observer(PredictionQuantity);
