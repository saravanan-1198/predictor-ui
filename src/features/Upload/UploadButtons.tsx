import React, { useEffect, useState, useContext } from "react";
import { Upload, message, Spin } from "antd";
import { InboxOutlined, ClockCircleOutlined } from "@ant-design/icons";
import PredictionStore from "../../app/stores/prediction.store";
import { Services } from "../../app/api/agent";
import moment from "moment";
import { TrainingStatus } from "../../app/models/training-status.enum";

const { Dragger } = Upload;

export const UploadButtons = () => {
  const { setFileUploaded, setPipelineInit, setTrainingCompleted } = useContext(
    PredictionStore
  );

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [nextUpload, setNextUpload] = useState("");

  const props = {
    name: "file",
    accept: ".xls",
    multiple: false,
    action: Services.UploadService.FileUploadURL,
    onChange(info: any) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      } else {
        setLoading(true);
        setFileUploaded(TrainingStatus.InProgress);
      }
      if (status === "done") {
        setTimeout(() => {
          setLoading(false);
          setDisabled(true);
          let next = moment().add(1, "week").toObject();
          setNextUpload(`${next.date}/${next.months+1}/${next.years}`);
          setFileUploaded(TrainingStatus.Completed);
          message.success(`${info.file.name} file uploaded successfully.`);
          setPipelineInit(TrainingStatus.InProgress);
          setTimeout(() => {
            setPipelineInit(TrainingStatus.Completed);
            setTrainingCompleted(TrainingStatus.InProgress);
          }, 2000);
        }, 3000);
      } else if (status === "error") {
        setLoading(false);
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    showUploadList: false,
  };

  let mounted = true;

  useEffect(() => {
    allowUpload();

    return () => {
      mounted = false;
    };
  }, []);

  const allowUpload = async () => {
    setLoading(true);
    const result = await Services.UploadService.allowUpload();
    if (mounted) {
      setDisabled(!result.allowUpload);
      setNextUpload(result.nextUpload);
      setLoading(false);
    }
  };

  return (
    <Dragger {...props} disabled={disabled}>
      <Spin spinning={loading}>
        {disabled ? (
          <div>
            <p className="ant-upload-drag-icon">
              <ClockCircleOutlined />
            </p>
            <p className="ant-upload-text">Next Upload Date - {nextUpload}</p>
            <p className="ant-upload-hint">
              Please bare with us, due to technical reasons, we allow uploading
              data only after 7 days from previous upload
            </p>
          </div>
        ) : (
          <div>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload (.xls)
            </p>
            <p className="ant-upload-hint">
              Please bare with us, due to technical reasons, we allow uploading
              data only after 7 days from previous upload
            </p>
          </div>
        )}
      </Spin>
    </Dragger>
  );
};
