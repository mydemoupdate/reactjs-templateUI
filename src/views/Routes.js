import React, { useState, useEffect } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import {Layout} from "../_metronic/layout";
import BasePage from "./BasePage";
import { Logout, AuthPage } from "./admin/Auth"
import ErrorsPage from "../app/modules/ErrorsExamples/ErrorsPage";

export function Routes() {
//    const isAuthorized=()=>{

//        const user=localStorage.getItem("accessToken")
//        console.log('router ' , user)
//        if(user)return true
   
//    }
    const user = localStorage.getItem('accessToken')
    const [isAuthorized, setIsAuthorized]= useState()
   useEffect(()=>{
    if(user === null) setIsAuthorized(false)
    else setIsAuthorized(true)
   },[localStorage])
    return (
        <Switch>
            {!isAuthorized ? (

                <Route>
                    <AuthPage />
                </Route>
            ) : (
                /*Otherwise redirect to root page (`/`)*/
                <Redirect from="/auth" to="/"/>
            )}

            <Route path="/error" component={ErrorsPage}/>
            <Route path="/logout" component={Logout}/>

            {!isAuthorized ? (
                /*Redirect to `/auth` when user is not authorized*/
                <Redirect to="/auth/login"/>
            ) : (
                <Layout>
                    <BasePage/>
                </Layout>
            )}
        </Switch>
    );
}
