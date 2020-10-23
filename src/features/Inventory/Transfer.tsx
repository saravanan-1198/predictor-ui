import React, { useEffect, useState, useContext } from "react";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import { Services } from "../../app/api/agent";
import {
    PageHeader,
    Descriptions,
    Statistic,
    Table,
    Row,
    Spin,
    message,
    Input,
    Space,
    Button,
     Select
  } from "antd";
  
const Transfer = ()=>{

    return(
        <p>working Transfer</p>
    );
}

export default observer(Transfer);