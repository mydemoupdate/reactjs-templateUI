
import React, {Suspense, lazy} from "react";
import {Redirect, Switch, Route} from "react-router-dom";
import {LayoutSplashScreen, ContentRoute} from "../../_metronic/layout";
import {DashboardPage} from "../../app/pages/DashboardPage";
import Profile from "./profile/profile_pages/ProfilePage";
import {TransactionList} from "./transaction/transactionList"
import UserDetail from "./profile/profile_pages/UserDetail"
import {UpdateForm} from "./profile/profile_components/UpdateForm";
import {OrderPurchaseList} from "./purchase/purchase-list"
import {OrderPurchaseDetail} from "./purchase/purchase-detail"
import {ProductList} from "./products/productList";
import {ProductDetail} from "./products/productDetail";
import {ProductCreate} from "./products/productCreate";
import {ProductUpdate} from "./products/updateProduct"
import {UpdatePackage} from "./products/createPackage";
import {CreatePaymentOrder} from "./products/createPaymentOrder"
import {CreateWholesale} from "./products/createWholeSale"
import { UserCreate } from "./profile/profile_components/userCreate";
import ManageUser from "./manage_user/manageUser";
const OrderRoutes = lazy(() =>
    import("./order/OrderRoutes")
);
export default function AdminRoutes() {

    return (
        <Suspense fallback="Load">
            <Switch>
                {
                    /* Redirect from root URL to /dashboard. */
                    <Redirect exact from="/" to="/admin"/>
                }
                <ContentRoute path="/admin/purchase/:id" component={OrderPurchaseDetail}/>
                <Route path="/admin/orders" component={OrderRoutes}/>
                <ContentRoute path="/admin/purchase" component={OrderPurchaseList}/>
                <ContentRoute path="/admin/users/update/:id" component={UpdateForm}/>
                <ContentRoute path="/admin/users/:id" component={UserDetail}/>
                <ContentRoute path="/admin/profile/transaction" component={TransactionList}/>
                <ContentRoute path="/admin/profile" component={Profile}/>
                <ContentRoute
          path="/admin/user-manage/create"
          component={UserCreate}
        ></ContentRoute>
        <ContentRoute
          path="/admin/manage-user"
          component={ManageUser}
        ></ContentRoute>
                <ContentRoute path="/admin/product" component={ProductList}/>
                <ContentRoute path="/admin/products/detail/:id" component={ProductDetail}/>
                <ContentRoute path="/admin/createproduct" component={ProductCreate}/>
                <ContentRoute path="/admin/updateprodut/:id" component={ProductUpdate}/>
                <ContentRoute path="/admin/createpackage/:id" component={UpdatePackage}/>
                <ContentRoute path="/admin/createpaymentorder/:id" component={CreatePaymentOrder}/>
                <ContentRoute path="/admin/createwholesale/:id" component={CreateWholesale}/>
                <ContentRoute path="/admin" component={DashboardPage}/>
            </Switch>
        </Suspense>
    );
}