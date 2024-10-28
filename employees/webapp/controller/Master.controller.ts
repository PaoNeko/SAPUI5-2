import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace com.logaligroup.employees.controller
 */
export default class Master extends BaseController {

    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {
        this.loadEmployees();
    }

    private loadEmployees () : void {
        const model = new JSONModel();
        model.loadData("../model/Employees.json");
        this.setModel(model,"employees");
    }
}