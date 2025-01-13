import ResourceBundle from "sap/base/i18n/ResourceBundle";
import MessageBox from "sap/m/MessageBox";
import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import JSONModel from "sap/ui/model/json/JSONModel";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import ResourceModel from "sap/ui/model/resource/ResourceModel";

/**
 * @namespace com.logaligroup.employees.utils
 */

export default class Utils {

    private controller : Controller;

    private model : ODataModel;

    private resourceBundle : ResourceBundle;

    constructor (controller : Controller) {
        this.controller = controller;
        this.model = (this.controller.getOwnerComponent() as UIComponent).getModel("zincidence") as ODataModel;
        this.resourceBundle = ((this.controller.getOwnerComponent() as UIComponent).getModel("i18n") as ResourceModel).getResourceBundle() as ResourceBundle;
    }

    public getEmail() : string {
        return "c24c313@logaligroup.com";
    }

    public async crud (action : string, object? : JSONModel) : Promise<void> {
        const resourceBundle = this.resourceBundle;
        const reference = this;

        MessageBox.confirm(resourceBundle.getText("question") || "no text defined" , {
            actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
            emphasizedAction: MessageBox.Action.OK,
            onClose: function (sAction : string) {
                if(sAction === MessageBox.Action.OK) {
                    switch (action) {
                        case 'create': reference.create(object);
                        case 'update': break;
                        case 'delete': break;
                    }
                }
            }
        });
    }

    private async create (object? : JSONModel) : Promise<void> {
        const url = object?.getProperty("/url");
        const data = object?.getProperty("/data");
        const resourceBundle = this.resourceBundle;

        this.model.create(url, data, {
            success: function () {
                MessageBox.success(resourceBundle.getText("success") || 'no text defined');
            },
            error: function () {
                MessageBox.error(resourceBundle.getText("error") || 'no text defined');
            }
        });
    }
}