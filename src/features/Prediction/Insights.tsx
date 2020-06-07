import React, { useState, useEffect, useContext } from "react";
import { Days } from "../../app/models/days.enum";
import { Input, Space, Button, Table, Result } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import PredictionStore from "../../app/stores/prediction.store";
import { IPredictionOutput } from "../../app/models/prediction-output.model";

const weekDayFilterList: { text: string; value: string }[] = [];

const defaultColumns = [
  {
    title: "Weekday",
    dataIndex: "weekday",
    key: "weekday",
    filters: weekDayFilterList,
    filterMultiple: true,
    onFilter: (value: string, record: any) =>
      record.weekday.indexOf(value) === 0,
  },
  {
    title: "Public Holiday",
    dataIndex: "publicHoliday",
    key: "publicHoliday",
    filters: [
      { text: "Yes", value: "Yes" },
      { text: "No", value: "No" },
    ],
    filterMultiple: true,
    onFilter: (value: string, record: any) =>
      record.publicHoliday.indexOf(value) === 0,
  },
];

export const Insights = () => {
  const { predictionOutput, setInsightData, insightData } = useContext(
    PredictionStore
  );

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const [columns, setColumns] = useState<any[]>([]);

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
      const insightData: any[] = [];

      const result = predictionOutput as IPredictionOutput;

      result.insights.forEach((insight) => {
        const data: { [key: string]: any } = {};

        data["key"] = insight.key;

        data["date"] = new Date(
          insight.year,
          insight.month - 1,
          insight.date
        ).toLocaleDateString("en-IN");

        console.log(data["date"]);

        if (insightData.find((v) => v["date"] === data["date"])) return;

        data["weekday"] = Days[insight.weekday];

        if (
          !weekDayFilterList.find((value) => value.value === data["weekday"])
        ) {
          weekDayFilterList.push({
            text: data["weekday"],
            value: data["weekday"],
          });
        }

        data["publicHoliday"] = insight.isPublicHoliday === 0 ? "No" : "Yes";

        insightData.push(data);
      });

      setInsightData(insightData);
    };

    const generateColumns = () => {
      const newColumns = [
        {
          title: "Date",
          dataIndex: "date",
          key: "date",
          ...getColumnSearchProps("date"),
        },
        ...defaultColumns,
      ];

      setColumns(newColumns);
    };

    generateColumns();
    generateData();
  }, [predictionOutput, searchText, searchedColumn]);

  const onPageSizeChange = (current: number, size: number) => {
    setPageSize(size);
  };

  return (
    <div>
      <Table
        dataSource={insightData}
        columns={columns}
        pagination={{
          pageSize: pageSize,
          pageSizeOptions: ["10", "50", "100"],
          showSizeChanger: true,
          onShowSizeChange: onPageSizeChange,
          position: ["bottomRight"],
        }}
        bordered
        scroll={{ y: 360 }}
      />
    </div>
  );
};
