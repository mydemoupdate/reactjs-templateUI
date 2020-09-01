
import React, {Suspense, lazy} from "react";
import {Redirect, Switch, Route} from "react-router-dom";
import {LayoutSplashScreen, ContentRoute} from "../../../_metronic/layout";
import {OrderList} from "./order-list";
import {CreateWholesale} from "./create-wholesale";
import {CreateShipping} from "./create-shipping";
import {CreatePayment} from "./create-payment";
import {OrderDetail} from "./order-detail";
export default function OrderRoutes() {

    return (
        <Suspense fallback={<LayoutSplashScreen/>}>
            <Switch>
                {
                    <Redirect exact={true} from="/admin/orders" to="/admin/orders/list"/>
                }
                <ContentRoute path="/admin/orders/create-wholesale/:id" component={CreateWholesale}/>
                <ContentRoute path="/admin/orders/create-shippingpartner/:id" component={CreateShipping}/>
                <ContentRoute path="/admin/orders/create-paymentpartner/:id" component={CreatePayment}/>
                <ContentRoute path="/admin/orders/list" component={OrderList}/>

                <ContentRoute path="/admin/orders/create-wholesale" component={CreateWholesale}/>
                <ContentRoute path="/admin/orders/create-shippingpartner" component={CreateShipping}/>
                <ContentRoute path="/admin/orders/create-paymentpartner" component={CreatePayment}/>
          
         
                <ContentRoute path="/admin/orders/:id" component={OrderDetail}/>
            </Switch>
        </Suspense>
    );

}
