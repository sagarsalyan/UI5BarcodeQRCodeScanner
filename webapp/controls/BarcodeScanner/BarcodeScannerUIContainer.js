/*!
 * SAPUI5
 * (c) Copyright 2009-2021 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/ui/core/Control"], function (C) {
	"use strict";
	var B = C.extend("app.BarCode.controls.BarcodeScanner.BarcodeScannerUIContainer", {
		metadata: {
			properties: {
				"prefixId": "string"
			}
		},
		renderer: {
			apiVersion: 2,
			render: function (r, c) {
				r.openStart("div", c);
				r.class("sapNdcRTCDialogVideo");
				r.openEnd();
				r.openStart("video", c.getId() + "-video");
				r.attr("autoplay", "autoplay");
				r.attr("webkit-playsinline", "webkit-playsinline");
				r.attr("playsinline", "playsinline");
				r.class("sapNdcRTCDialogVideoContainer");
				r.openEnd();
				r.close("video");
				r.close("div");
				r.openStart("div", c.getId() + "-overlay");
				r.class("sapNdcRTCDialogOverlay");
				r.openEnd();
				r.openStart("div", c.getId() + "-overlay-box");
				r.class("sapNdcRTCDialogOverlayBox");
				r.openEnd();
				r.openStart("div", c.getId() + "-overlay-line");
				r.class("sapNdcRTCDialogOverlayLine");
				r.openEnd();
				r.close("div");
				r.openStart("div");
				r.class("sapNdcRTCDialogOverlayAngle");
				r.openEnd();
				r.close("div");
				r.close("div");
				r.close("div");
				r.openStart("div", c.getId() + "-highlight");
				r.attr("hidden", true);
				r.class("sapNdcRTCDialogHighlight");
				r.openEnd();
				r.close("div");
			}
		}
	});
	return B;
});