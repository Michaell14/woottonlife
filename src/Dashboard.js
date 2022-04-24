import "react-datepicker/dist/react-datepicker.css";
import React from 'react';
import CardGrid from "./components/CardGrid"
import { getAuth } from "firebase/auth";

const auth = getAuth();

function Dashboard(){
    

    return(
        <>  
            
            <CardGrid isDashboard={true}/>
        </>
        
    )
}


export default Dashboard;