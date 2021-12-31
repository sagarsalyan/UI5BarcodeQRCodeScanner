/*!
 * SAPUI5
 * (c) Copyright 2009-2021 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/ui/thirdparty/jquery", './BarcodeScanner', './library', 'sap/ui/core/Control', './BarcodeScannerButtonRenderer'],
	function (q, B, l, C) {
		"use strict";
		var a = C.extend("app.BarCode.controls.BarcodeScanner.BarcodeScannerButton", {
			metadata: {
				library: "app.BarCode.controls.BarcodeScanner",
				properties: {
					provideFallback: {
						type: "boolean",
						defaultValue: true
					},
					visible: {
						type: "boolean",
						defaultValue: true
					},
					width: {
						type: "sap.ui.core.CSSSize",
						defaultValue: null
					},
					dialogTitle: {
						type: "string",
						defaultValue: null
					}
				},
				aggregations: {
					_btn: {
						type: "sap.m.Button",
						multiple: false,
						visibility: "hidden"
					}
				},
				events: {
					scanSuccess: {
						parameters: {
							text: {
								type: "string"
							},
							format: {
								type: "string"
							},
							cancelled: {
								type: "boolean"
							}
						}
					},
					scanFail: {},
					inputLiveUpdate: {
						parameters: {
							newValue: {
								type: "string"
							}
						}
					}
				}
			}
		});
		a.prototype.init = function () {
			var b;
			this.setAggregation("_btn", new sap.m.Button({
				icon: "sap-icon://bar-code",
				press: q.proxy(this._onBtnPressed, this),
				width: "100%"
			}));
			b = B.getStatusModel();
			this.setModel(b, "status");
		};
		a.prototype._onBtnPressed = function (e) {
			B.scan(q.proxy(this._onScanSuccess, this), q.proxy(this._onScanFail, this), q.proxy(this._onInputLiveUpdate, this), this.getProperty(
				"dialogTitle"));
		};
		a.prototype._onScanSuccess = function (A) {
			this.fireScanSuccess(A);
		};
		a.prototype._onScanFail = function (A) {
			this.fireScanFail(A);
		};
		a.prototype._onInputLiveUpdate = function (A) {
			this.fireInputLiveUpdate(A);
		};
		a.prototype.setProvideFallback = function (f) {
			var v = this.getProvideFallback();
			var b;
			f = !!f;
			if (v !== f) {
				this.setProperty("provideFallback", f);
				b = this.getAggregation("_btn");
				if (f) {
					b.unbindProperty("visible");
					b.setVisible(true);
				} else {
					b.bindProperty("visible", "status>/available");
				}
			}
			return this;
		};
		return a;
	});