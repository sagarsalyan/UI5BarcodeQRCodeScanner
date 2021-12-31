/*!
 * SAPUI5
 * (c) Copyright 2009-2021 SAP SE. All rights reserved.
 */
sap.ui.define(['sap/m/library', 'sap/ui/core/library'], function (l, a) {
	"use strict";
	sap.ui.getCore().initLibrary({
		name: "app.BarCode.controls.BarcodeScanner",
		dependencies: ["sap.ui.core", "sap.m"],
		types: [],
		interfaces: [],
		controls: ["app.BarCode.controls.BarcodeScanner.BarcodeScannerButton"],
		elements: [],
		noLibraryCSS: true,
		version: "1.97.0"
	});
	return app.BarCode.controls.BarcodeScanner;
});