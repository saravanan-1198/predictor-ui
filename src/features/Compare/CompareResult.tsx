import React, { useContext, useEffect, useState } from "react";
import { PageHeader, Space, Button, Input, Table, Tag, message } from "antd";
import CompareStore from "../../app/stores/compare.store";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import Highlighter from "react-highlight-words";
import PredictionStore from "../../app/stores/prediction.store";
import { Services } from "../../app/api/agent";
import download from "downloadjs";

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

const CompareResult = () => {
  const {
    toggleShowCompareForm,
    showCompareForm,
    setTableDataCompare,
    tableDataCompare,
    setShowCompareResult,
    totalAccuracy,
    totalActualRevenue,
    totalErrorRevenue,
    totalPredictedRevenue,
    compareOutput,
  } = useContext(CompareStore);
  const { treeData } = useContext(PredictionStore);

  const [columns, setColumns] = useState<any[]>([]);
  const [pageSize, setPageSize] = useState(10);

  const [loading, setLoading] = useState(false);

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
        {
          title: "Quantity",
          dataIndex: "quantity",
          key: "quantity",
          sorter: (a: any, b: any) => a["quantity"] - b["quantity"],
          sortDirections: ["descend", "ascend"],
          width: 160,
        },
        {
          title: "Revenue",
          dataIndex: "revenue",
          key: "revenue",
          sorter: (a: any, b: any) => a["revenue"] - b["revenue"],
          sortDirections: ["descend", "ascend"],
          width: 160,
        },
        {
          title: "Actual Quantity",
          dataIndex: "actual_quantity",
          key: "actual_quantity",
          sorter: (a: any, b: any) =>
            a["actual_quantity"] - b["actual_quantity"],
          sortDirections: ["descend", "ascend"],
          width: 160,
        },
        {
          title: "Actual Revenue",
          dataIndex: "actual_revenue",
          key: "actual_revenue",
          sorter: (a: any, b: any) => a["actual_revenue"] - b["actual_revenue"],
          sortDirections: ["descend", "ascend"],
          width: 160,
        },
        {
          title: "Quantity Accuracy",
          dataIndex: "quantity_accuracy",
          key: "quantity_accuracy",
          sorter: (a: any, b: any) =>
            a["quantity_accuracy"] - b["quantity_accuracy"],
          sortDirections: ["descend", "ascend"],
          width: 160,
        },
        {
          title: "Quantity Error",
          dataIndex: "quantity_error",
          key: "quantity_error",
          sorter: (a: any, b: any) => a["quantity_error"] - b["quantity_error"],
          sortDirections: ["descend", "ascend"],
          width: 160,
        },
        {
          title: "Revenue Accuracy",
          dataIndex: "revenue_accuracy",
          key: "revenue_accuracy",
          sorter: (a: any, b: any) =>
            a["revenue_accuracy"] - b["revenue_accuracy"],
          sortDirections: ["descend", "ascend"],
          width: 160,
        },
        {
          title: "Revenue Error",
          dataIndex: "revenue_error",
          key: "revenue_error",
          sorter: (a: any, b: any) => a["revenue_error"] - b["revenue_error"],
          sortDirections: ["descend", "ascend"],
          width: 160,
        },
      ];

      setColumns(newColumns);
    };

    const generateData = () => {
      subFilterCategories.length = 0;
      subFilterCategoriesOriginal.length = 0;
      superFilterCategories.length = 0;

      const newDataSource: any[] = [];

      compareOutput.branches.forEach((branch: any) => {
        branch.data.forEach((item: any) => {
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

          tableData["quantity"] = item.quantity;
          tableData["revenue"] = Number.parseFloat(item.revenue.toFixed(2));
          tableData["actual_quantity"] = item.actual_quantity;
          tableData["actual_revenue"] = Number.parseFloat(
            item.actual_revenue.toFixed(2)
          );
          tableData["quantity_accuracy"] = item.quantity_accuracy
            ? Number.parseFloat(item.quantity_accuracy.toFixed(2))
            : 0;
          tableData["quantity_error"] = item.quantity_error;
          tableData["revenue_accuracy"] = item.revenue_accuracy
            ? Number.parseFloat(item.revenue_accuracy.toFixed(2))
            : 0;
          tableData["revenue_error"] = Number.parseFloat(
            item.revenue_error.toFixed(2)
          );

          newDataSource.push(tableData);
        });
      });

      subFilterCategoriesOriginal.forEach((v) => {
        subFilterCategories.push(v);
      });

      setTableDataCompare(newDataSource);

      if (newDataSource.length === 0) {
        setShowCompareResult(true);
      } else {
        setShowCompareResult(true);
        toggleShowCompareForm(false);
      }
    };

    generateColumns();
    generateData();
  }, [compareOutput, searchText, searchedColumn]);

  const onPageSizeChange = (current: number, size: number) => {
    setPageSize(size);
  };

  const handleDownloadCSV = async () => {
    setLoading(true);
    try {
      const result = await Services.ExportService.exportCSV(tableDataCompare);
      setLoading(false);
      download(result, "Report.csv");
    } catch (error) {
      message.error(
        "Server Error. Please try again later / report bug to admin"
      );
      setLoading(false);
    }
  };

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

  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="Compare Result"
        tags={[
          <Tag key={3} color="orange">
            Revenue Accuracy - {totalAccuracy}%
          </Tag>,
          <Tag key={0} color="blue">
            Predicted Revenue - ₹{totalPredictedRevenue}
          </Tag>,
          <Tag key={1} color="green">
            Actual Revenue - ₹{totalActualRevenue}
          </Tag>,
          <Tag key={2} color="red">
            Revenue Error - ₹{totalErrorRevenue}
          </Tag>,
        ]}
        onBack={() => {
          toggleShowCompareForm(true);
          setShowCompareResult(false);
        }}
        backIcon={<ArrowLeftOutlined />}
        extra={[
          <Button
            key="0"
            type="primary"
            onClick={handleDownloadCSV}
            loading={loading}
          >
            Export
          </Button>,
        ]}
      />
      <Table
        dataSource={tableDataCompare}
        columns={columns}
        onChange={handleOnTableChange}
        style={{ margin: "0 20px" }}
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

export default observer(CompareResult);
