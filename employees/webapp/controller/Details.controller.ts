import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import Panel from "sap/m/Panel";
import Button, { Button$PressEvent } from "sap/m/Button";
import Toolbar from "sap/m/Toolbar";
import Context from "sap/ui/model/Context";
import Utils from "../utils/Utils";

/**
 * @namespace com.logaligroup.employees.controller
 */

export default class Details extends BaseController {

    panel : Panel

    public onInit(): void {
        const router = this.getRouter();
        router.getRoute("RouteDetails")?.attachMatched(this.onObjectMatched.bind(this));
    }

    private formModel () : void {
        const model = new JSONModel([]);
        this.setModel(model,"form");
    }
    
    private onObjectMatched (event : Route$PatternMatchedEvent) : void {
        //reset
        this.removeAllContent();
        this.formModel();
       
        const modelView = this.getModel("view") as JSONModel;
        modelView.setProperty("/layout","TwoColumnsMidExpanded");

        const args = event.getParameter("arguments") as any;
        const index = args.index;
        const view = this.getView();

        view?.bindElement({
            path: "/Employees("+index+")",
            model: 'northwind'
        })
    }

    public onClosePress () : void {
        //console.log("cerrar")
        const router = this.getRouter();
        const viewModel = this.getModel("view") as JSONModel;
        viewModel.setProperty("/layout","OneColumn");
        router.navTo("RouteMaster");
    }

    private removeAllContent () : void {
        const panel = this.byId("tableIncidence") as Panel;
        panel.removeAllContent();
    }

    public async onCreatePress () : Promise<void> {
        const panel = this.byId("tableIncidence") as Panel;
        
        const formModel = this.getModel("form") as JSONModel;
        const data = formModel.getData();
        const index = data.length;
        data.push({Index: index + 1});
        formModel.refresh();

        this.panel = await <Promise<Panel>> this.loadFragment({
            name: "com.logaligroup.employees.fragment.NewIncidence"
        });

        this.panel.bindElement({
            path:'form>/'+index,
            model:'form'
        })

        panel.addContent(this.panel);
    }

    public async onSave (event: Button$PressEvent) : Promise<void> {
        console.log("aqui toy");
        const button = event.getSource() as Button;
        const toolbar = button.getParent() as Toolbar;
        const panel = toolbar.getParent() as Panel;
        const form = panel.getBindingContext("form");
        const northwind = this.getView()?.getBindingContext("northwind") as Context;
        const utils = new Utils(this);

        const object = {
            url: "/IncidentsSet",
            data: {
                SapId: utils.getEmail(),
                EmployeeId: (northwind.getProperty("EmployeeID")as number).toString() ,
                CreationDate: form?.getProperty("CreationDate"),
                Type: form?.getProperty("Type"),
                Reason: form?.getProperty("Reason")
            }
        }

        await utils.crud('create',new JSONModel(object));

        console.log(object)
    }
}