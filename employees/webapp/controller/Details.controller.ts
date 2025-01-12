import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";

/**
 * @namespace com.logaligroup.employees.controller
 */

export default class Details extends BaseController {

    public onInit(): void {
        const router = this.getRouter();
        router.getRoute("RouteDetails")?.attachMatched(this.onObjectMatched.bind(this));
    }
    
    private onObjectMatched (event : Route$PatternMatchedEvent) : void {
        const modelView = this.getModel("view") as JSONModel;
        modelView.setProperty("/layout","TwoColumnsMidExpanded");

        const args = event.getParameter("arguments") as any;
        const index = args.index;
        const view = this.getView();

        view?.bindElement({
            path: '/Employees/'+index,
            model: 'employees'
        })
    }
}