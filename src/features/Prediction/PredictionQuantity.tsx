import React, { useState, useEffect, useContext } from "react";
import { Table, Button, Space, Input, Typography } from "antd";
import { observer } from "mobx-react-lite";
import PredictionStore from "../../app/stores/prediction.store";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { IPredictionOutput } from "../../app/models/prediction-output.model";

let subFilterCategories: { text: string; value: string }[] = [];
const subFilterCategoriesOriginal: { text: string; value: string }[] = [];
const superFilterCategories: { text: string; value: string }[] = [];
const branchFilterList: { text: string; value: string }[] = [];

const defaultColumns: any[] = [
  {
    title: "Branch",
    dataIndex: "branch",
    key: "branch",
    fixed: "left",
    width: 150,
    filters: branchFilterList,
    filterMultiple: true,
    onFilter: (value: string, record: any) =>
      record.branch.indexOf(value) === 0,
  },
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

interface IProps {
  setZeros: (value: boolean) => void;
}

const PredictionQuantity: React.FC<IProps> = ({ setZeros }) => {
  const {
    predictionOutput,
    treeData,
    setTableData,
    setShowResult,
    toggleShowForm,
    tableData,
  } = useContext(PredictionStore);

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

      const result = predictionOutput as IPredictionOutput;

      result.branches.forEach((branch) => {
        branch.data.forEach((item: any) => {
          if (item.predicion["total"].quantity === 0) return;

          const tableData: any = {};

          tableData["key"] = item.key;
          tableData["branch"] = branch.branch;

          if (
            !branchFilterList.find(
              (value) => value.value === tableData["branch"]
            )
          ) {
            branchFilterList.push({
              text: tableData["branch"],
              value: tableData["branch"],
            });
          }

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
            if (v === "total")
              tableData["totalRev"] = item.predicion[v].revenue.toFixed(2);
            tableData[v] = item.predicion[v].quantity;
          });

          newDataSource.push(tableData);
        });
      });

      subFilterCategoriesOriginal.forEach((v) => {
        subFilterCategories.push(v);
      });

      setTableData(newDataSource);

      if (newDataSource.length === 0) {
        setZeros(true);
        setShowResult(false);
      } else {
        setZeros(false);
        setShowResult(true);
        toggleShowForm(false);
      }
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

      const result = predictionOutput as IPredictionOutput;
      Object.keys(result.branches[0].data[0].predicion).forEach((v: string) => {
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
      newColumns.push({
        title: "Total Revenue (₹)",
        dataIndex: "totalRev",
        key: "totalRev",
        sorter: (a: any, b: any) => a["totalRev"] - b["totalRev"],
        sortDirections: ["descend", "ascend"],
        fixed: "right",
        width: 160,
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
        dataSource={tableData}
        columns={columns}
        onChange={handleOnTableChange}
        pagination={{
          pageSize: pageSize,
          pageSizeOptions: ["10", "50", "100"],
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
