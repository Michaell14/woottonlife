import "react-datepicker/dist/react-datepicker.css";
import React, {useEffect} from 'react';
import CardGrid from "./components/CardGrid"
import { getAuth } from "firebase/auth";
import $ from "jquery";

const auth = getAuth();

function Dashboard(){

    useEffect(() => {
        $("#discover").removeClass("underline");
        $("#dashboard").addClass("underline");
    })

    return(
        <>  
            <CardGrid isDashboard={true}/>
        </>
    )
}


export default Dashboard;