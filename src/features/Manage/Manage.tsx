import React, { useEffect, useState, useContext } from "react";
import { observer } from "mobx-react-lite";
import { AlignCenterOutlined } from "@ant-design/icons";
import { RouteComponentProps } from "react-router-dom";



const Manage: React.FC<RouteComponentProps>  = ()=>{
    return(
    <div>
        <AlignCenterOutlined>
        <h1>
            Currently working on it.....
        </h1>
        </AlignCenterOutlined>
    </div>
    );
}

export default observer(Manage);