"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouterError = void 0;
/**
 * Router SDK errors
 */
var RouterError;
(function (RouterError) {
    RouterError["InvalidPercentage"] = "Total percentage must equal 100%";
    RouterError["NoDestinations"] = "No destinations provided";
    RouterError["InvalidAmount"] = "Amount must be greater than 0";
    RouterError["InvalidRouter"] = "Invalid router address";
    RouterError["InvalidDestination"] = "Invalid destination address";
    RouterError["Unauthorized"] = "You are not authorized to perform this action";
})(RouterError || (exports.RouterError = RouterError = {}));
