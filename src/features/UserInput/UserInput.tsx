import React, { useState, useEffect, useContext } from "react";
import {
  DatePicker,
  Form,
  Select,
  Button,
  PageHeader,
  Spin,
  TreeSelect,
  message,
  Checkbox,
  Row,
  Col,
} from "antd";
import { Services } from "../../app/api/agent";
import * as Moment from "moment";
import { extendMoment } from "moment-range";
import {
  IYear,
  IPredictionInput,
} from "../../app/models/prediction-input.model";
import PredictionStore from "../../app/stores/prediction.store";
import CompareStore from "../../app/stores/compare.store";
import InputStore from "../../app/stores/input.store";
import { observer } from "mobx-react-lite";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { SHOW_PARENT } = TreeSelect;

const moment = extendMoment(Moment);

interface IProps {
  route: string;
}

const UserInput: React.FC<IProps> = ({ route }) => {
  const {
    setPredictionOutput,
    setTableLoading,
    setShowResult,
    branchList,
    setBranchList,
    treeData,
    setTreeData,
    setDateInput,
    setStoreCriteria,
    dateInput,
    setCategories,
    categories,
    predictionOutput,
  } = useContext(PredictionStore);

  const {
    setCompareOuput,
    setShowCompareResult,
    compareOutput,
    setCompareTableLoading,
    setCompareMethod,
  } = useContext(CompareStore);

  const {
    branchesDisabled,
    categoriesDisabled,
    setBranchesDiabled,
    setCategoriesDiabled,
    setBranchesSelectAll,
    setCategoriesSelectAll,
    branchesSelectAll,
    categoriesSelectAll,
  } = useContext(InputStore);

  const [form] = Form.useForm();
  const [criteria, setCriteria] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadAssets = async () => {
      setFormLoading(true);

      const resultBranch = await Services.AssetService.getBranches();

      if (mounted) {
        setBranchList(resultBranch);
        const resultCat = await Services.AssetService.getCategories();
        if (mounted) {
          setTreeData(resultCat);
          form.setFieldsValue({
            criteria: criteria,
            branch: [resultBranch[0].key],
            categories: categories,
            range: dateInput,
            selectAll: categoriesSelectAll,
            selectAllBranch: branchesSelectAll,
          });
          setFormLoading(false);
        }
      }
    };

    if (treeData.length === 0 || branchList.length === 0) {
      loadAssets();
    } else {
      form.setFieldsValue({
        criteria: criteria,
        branch: [branchList[0].key],
        categories: categories,
        range: dateInput,
        selectAll: categoriesSelectAll,
        selectAllBranch: branchesSelectAll,
      });
    }

    return () => {
      mounted = false;
    };
  }, [criteria, dateInput, form, setBranchList, setTreeData]);

  const handleCriteriaChange = (value: number) => {
    setCriteria(value);
  };

  const generateCatInput = (value: string[]) => {
    const catInput: any[] = [];
    value.forEach((input) => {
      const splitValues = input.split("-");
      if (splitValues.length === 2) {
        const subCats: any[] = [];
        const superCat = treeData[Number.parseInt(splitValues[1])];
        superCat.children.map((ch: any) => subCats.push(ch.title));
        catInput.push({
          super: superCat.title,
          sub: subCats,
        });
      } else {
        const superCat = treeData[Number.parseInt(splitValues[1])];
        let ip: any = catInput.find((c) => c.super === superCat.title);
        if (ip === undefined) {
          ip = {
            super: superCat.title,
            sub: [],
          };
          catInput.push(ip);
        }
        ip.sub.push(superCat.children[Number.parseInt(splitValues[2])].title);
      }
    });

    return catInput;
  };

  const generateCalendarInput = (
    startDate: moment.Moment,
    endDate: moment.Moment,
    criteria: number
  ) => {
    if (criteria === 1) {
      startDate = moment(new Date(startDate.year(), startDate.month(), 1));
      endDate = moment(
        new Date(endDate.year(), endDate.add(1, "month").month(), 0)
      );
    }

    const years: IYear[] = [];

    for (let yr of moment()
      .range(startDate, endDate)
      .by("year", { excludeEnd: false })) {
      if (years.filter((v) => v.year === yr.year()).length === 0) {
        years.push({ year: yr.year(), months: [] });
      }
    }

    for (let day of moment()
      .range(startDate, endDate)
      .by("day", { excludeEnd: false })) {
      const months = years.find((v) => v.year === day.year())?.months;

      if (months!.filter((v) => v.month === day.month() + 1).length === 0) {
        months!.push({ month: day.month() + 1, dates: [] });
      }

      let month = months!.find((v) => v.month === day.month() + 1);
      month?.dates.push(day.date());
    }

    return years;
  };

  const generateCriteriaInput = (
    startDate: moment.Moment,
    endDate: moment.Moment,
    criteria: number
  ): number => {
    if (criteria === 0) {
      if (
        startDate.date() === endDate.date() &&
        startDate.month() === endDate.month() &&
        startDate.year() === endDate.year()
      ) {
        return 2;
      } else {
        return 0;
      }
    } else {
      if (
        startDate.month() === endDate.month() &&
        startDate.year() === endDate.year()
      ) {
        return 0;
      } else {
        return 1;
      }
    }
  };

  const onFinish = async (value: any) => {
    try {
      const input: IPredictionInput = {
        criteria: generateCriteriaInput(
          value.range[0],
          value.range[1],
          value.criteria
        ),
        branch: branchesSelectAll
          ? branchList.map((branch) => branch.key)
          : value.branch,
        category: generateCatInput(
          categoriesSelectAll
            ? [
                "0-0",
                "0-1",
                "0-2",
                "0-3",
                "0-4",
                "0-5",
                "0-6",
                "0-7",
                "0-8",
                "0-9",
              ]
            : value.categories
        ),
        years: generateCalendarInput(
          value.range[0],
          value.range[1],
          value.criteria
        ),
      };
      setCategories(value.categories);
      setDateInput(value.range);
      setStoreCriteria(value.criteria);
      setTableLoading(true);
      setLoading(true);
      if (route === "/predict") {
        const result = await Services.PredictionService.getPrediction(input);
        setPredictionOutput(result);
        setLoading(false);
        setTableLoading(false);
        setShowResult(true);
      } else {
        setCompareMethod(1);
        const result = await Services.CompareService.getCompareFly(input);
        setCompareOuput(result);
        setLoading(false);
        setCompareTableLoading(false);
        setShowCompareResult(true);
      }
    } catch (error) {
      message.error("Server Error. Please try again later.");
      setLoading(false);
      setTableLoading(false);
      setCompareTableLoading(false);
      if (predictionOutput) {
        setShowResult(true);
      }
      if (compareOutput) {
        setShowCompareResult(true);
      }
    }
  };

  const tProps = {
    treeData,
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    placeholder: "Please select",
    showSearch: true,
    style: {
      width: "100%",
    },
  };

  // const handleChangeTree = (value: any, labelList: any, extra: any) => {
  //   if (allSelected && !value.includes("0-0")) {
  //     form.setFieldsValue({
  //       categories: [],
  //     });

  //     allSelected = false;
  //   }

  //   if (allSelected) {
  //     form.setFieldsValue({
  //       categories: value.filter((v: string) => v !== "0-0"),
  //     });

  //     allSelected = false;

  //     return;
  //   }

  //   if (value.includes("0-0")) {
  //     form.setFieldsValue({
  //       categories: [
  //         "0-0",
  //         "0-1",
  //         "0-2",
  //         "0-3",
  //         "0-4",
  //         "0-5",
  //         "0-6",
  //         "0-7",
  //         "0-8",
  //         "0-9",
  //         "0-10",
  //       ],
  //     });

  //     allSelected = true;
  //   }
  // };

  const handleSelectAll = (e: any) => {
    if (e.target.checked) {
      form.setFieldsValue({
        categories: ["All"],
      });
      setCategoriesSelectAll(true);
      setCategoriesDiabled(true);
    } else {
      form.setFieldsValue({ categories: [] });
      setCategoriesSelectAll(false);
      setCategoriesDiabled(false);
    }
  };

  const handleSelectAllBranch = (e: any) => {
    if (e.target.checked) {
      form.setFieldsValue({
        branch: ["All"],
        // branch: branchList.map((branch) => branch.key),
      });
      setBranchesSelectAll(true);
      setBranchesDiabled(true);
    } else {
      form.setFieldsValue({ branch: [1] });
      setBranchesSelectAll(false);
      setBranchesDiabled(false);
    }
  };
  return (
    <div>
      {route === "/predict" && (
        <PageHeader
          className="site-page-header"
          title="Prediction Input"
          subTitle="Provide the inputs"
        />
      )}

      <Spin spinning={formLoading}>
        <Form
          form={form}
          size="middle"
          layout="vertical"
          style={{ margin: "0 20px" }}
          onFinish={onFinish}
        >
          <Form.Item name="criteria" label="Criteria">
            <Select value={criteria} onChange={handleCriteriaChange}>
              <Option value={0}>Date</Option>
              <Option value={1}>Month</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label={criteria === 0 ? "Date Range" : "Month Range"}
            name="range"
            rules={[{ required: true, message: "Please select the duration" }]}
          >
            {criteria === 0 ? (
              <RangePicker
                format="DD-MM-YYYY"
                inputReadOnly={true}
                style={{ width: "100%" }}
              />
            ) : (
              <RangePicker
                format="MM-YYYY"
                picker="month"
                inputReadOnly={true}
                style={{ width: "100%" }}
              />
            )}
          </Form.Item>
          <Form.Item
            label="Categories"
            name="categories"
            rules={[
              { required: true, message: "Please select the categories" },
            ]}
          >
            <TreeSelect disabled={categoriesDisabled} {...tProps} />
          </Form.Item>
          <Form.Item
            label="Branch"
            name="branch"
            rules={[{ required: true, message: "Please select the branches" }]}
          >
            <Select
              disabled={branchesDisabled}
              mode="multiple"
              placeholder="Please Select Branches"
            >
              {branchList.map((v: { key: number; name: string }) => (
                <Option value={v.key} key={v.key}>
                  {v.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Row>
            <Col span={12}>
              <Form.Item name="selectAll">
                <Checkbox
                  value={categoriesSelectAll}
                  onChange={handleSelectAll}
                >
                  Select All Categories
                </Checkbox>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="selectAllBranch">
                <Checkbox
                  value={branchesSelectAll}
                  onChange={handleSelectAllBranch}
                >
                  Select All Branches
                </Checkbox>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              {route === "/predict" ? "Make Prediction" : "Compare"}
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default observer(UserInput);
