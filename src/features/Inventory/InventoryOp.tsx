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
     Select,
     Tabs
  } from "antd";
import { TransactionOutlined, PlusSquareOutlined, MinusSquareOutlined, FormOutlined} from "@ant-design/icons";  
import Add from "./Add";
import Set from "./Set";
import Remove from "./Remove";
import Transfer from "./Transfer";

const {TabPane} = Tabs;
  
const InventoryOp = ()=>{

    return(
       <Tabs defaultActiveKey="1" tabPosition="left" type="card">
           <TabPane tab={
               <span>
                   <PlusSquareOutlined />
                   Add
                </span>
           } key="1">
               <Add></Add>
           </TabPane>
           <TabPane tab={
               <span> 
                   <MinusSquareOutlined />
                   Remove 
                </span>
           } key="2">
               <Remove></Remove>
           </TabPane>
           <TabPane tab={
               <span>
                   <FormOutlined />
                   Set
               </span>
           } key="3">
               <Set></Set>
           </TabPane>
           <TabPane tab={
               <span>
                   <TransactionOutlined />
                   Transfer
               </span>
           } key="4">
               <Transfer></Transfer>
           </TabPane>
       </Tabs>
    );
}

export default observer(InventoryOp);