/*!
 * SAPUI5
 * (c) Copyright 2009-2021 SAP SE. All rights reserved.
 */
sap.ui.loader.config({
	shim: {
		'app/BarCode/controls/BarcodeScanner/ZXing': {
			amd: true,
			exports: 'ZXing'
		}
	}
});
sap.ui.define(["sap/base/Log", 'sap/ui/model/json/JSONModel', 'sap/ui/model/resource/ResourceModel', 'sap/m/Input', 'sap/m/Label',
	'sap/m/Button', 'sap/m/Dialog', "sap/ui/dom/includeStylesheet", "./BarcodeScannerUIContainer"
], function (L, J, R, I, a, B, D, b, c) {
	"use strict";
	document.addEventListener("settingsDone", x);
	document.addEventListener("SettingCompleted", x);
	document.addEventListener("mockSettingsDone", x);
	b({
		url: sap.ui.require.toUrl("app/BarCode/controls/BarcodeScanner/sapNdcBarcodeScanner.css")
	});
	var d = {},
		C, z, Z, s = new J({
			available: false
		}),
		S = null,
		o = {},
		f = "",
		g = {
			audio: false,
			video: {
				height: {
					min: 480,
					ideal: 960,
					max: 1440
				},
				aspectRatio: 1.333333333,
				facingMode: 'environment'
			}
		},
		h = null,
		j, k, l, m = 0,
		n = 0,
		p = false,
		r = true,
		q = new R({
			bundleName: "sap.ndc.messagebundle"
		});

	function t() {
		try {
			C = cordova.plugins.barcodeScanner;
			if (C) {
				L.debug("Cordova BarcodeScanner plugin is available!");
			} else {
				L.error("BarcodeScanner: cordova.plugins.barcodeScanner is not available");
				u();
			}
		} catch (e) {
			L.info("BarcodeScanner: cordova.plugins is not available");
			u();
		}
	}

	function u() {
		sap.ui.require(["app/BarCode/controls/BarcodeScanner/ZXing"], function (e) {
			Z = e;
			if (Z) {
				z = new Z.BrowserMultiFormatReader();
				if (z) {
					L.debug("ZXing BrowserMultiFormatReader API is available!");
				} else {
					s.setProperty("/available", false);
					L.error("BarcodeScanner: ZXing BrowserMultiFormatReader API is not available");
				}
			} else {
				s.setProperty("/available", false);
				L.error("BarcodeScanner: Scanner API is not available");
			}
		}, function (e) {
			s.setProperty("/available", false);
			L.error("BarcodeScanner: ZXing is not available");
		});
	}

	function v() {
		return !!(window && window.navigator && window.navigator.mediaDevices && window.navigator.mediaDevices.getUserMedia);
	}

	function w() {
		try {
			if (self != top && typeof cordova === "undefined") {
				window.cordova = top.cordova;
			}
		} catch (e) {
			L.info("BarcodeScanner: cordova is not available in cross-origin iframe");
		}
	}

	function x() {
		w();
		C = null;
		z = null;
		Z = null;
		s.setProperty("/available", true);
		if (sap.Settings === undefined) {
			L.debug("No sap.Settings. No feature vector available.");
			t();
		} else if (sap.Settings && typeof sap.Settings.isFeatureEnabled === "function") {
			sap.Settings.isFeatureEnabled("cordova.plugins.barcodeScanner", function (e) {
				if (e) {
					t();
				} else {
					s.setProperty("/available", false);
					L.warning("BarcodeScanner: Feature disabled");
				}
			}, function () {
				L.warning("BarcodeScanner: Feature check failed");
			});
		} else {
			L.warning("BarcodeScanner: Feature vector (sap.Settings.isFeatureEnabled) is not available");
		}
	}

	function y(M) {
		if (M) {
			L.warning("isNoScanner. Message: " + M);
		}
		H();
		S.destroyContent();
		S.setTitle('');
		S.setStretch(false);
		S.setContentHeight('auto');
		S.removeStyleClass('sapUiNoContentPadding');
		S.setTitle(f);
		var e = new a(S.getId() + '-txt_barcode', {
			text: "{i18n>BARCODE_DIALOG_MSG}",
			visible: "{/isNoScanner}"
		});
		S.addContent(e);
		var i = new I(S.getId() + '-inp_barcode', {
			value: "{/barcode}",
			valueLiveUpdate: true,
			ariaLabelledBy: e.getId(),
			liveChange: function (K) {
				if (typeof o.onLiveUpdate === "function") {
					o.onLiveUpdate({
						newValue: K.getParameter("newValue")
					});
				}
			},
			placeholder: "{i18n>BARCODE_DIALOG_PLACEHOLDER}"
		});
		S.addContent(i);
		S.setBeginButton(new B(S.getId() + '-btn_barcode_ok', {
			text: "{i18n>BARCODE_DIALOG_OK}",
			press: function (K) {
				d.closeScanDialog();
				if (typeof o.onSuccess === "function") {
					o.onSuccess({
						text: S.getModel().getProperty("/barcode"),
						cancelled: false
					});
				}
			}
		}));
		S.setEndButton(new B({
			text: "{i18n>BARCODE_DIALOG_CANCEL}",
			press: function () {
				d.closeScanDialog();
			}
		}));
		S.setBusy(false);
		S.open();
	}

	function A() {
		if (navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices.getUserMedia(g).then(function (e) {
				if (z) {
					F();
				} else {
					S.getModel().setProperty("/isNoScanner", true);
					y();
				}
			}).catch(function () {
				S.getModel().setProperty("/isNoScanner", true);
				y();
			});
		} else {
			S.getModel().setProperty("/isNoScanner", true);
			y();
		}
	}

	function E(e, i, K, T) {
		var M;
		o.onSuccess = e;
		o.onFail = i;
		o.onLiveUpdate = K;
		if (!S || (S && S.getContent().length === 0)) {
			M = new J();
			S = new D('sapNdcBarcodeScannerDialog', {
				icon: 'sap-icon://bar-code',
				title: "",
				stretch: true,
				horizontalScrolling: false,
				verticalScrolling: false,
				endButton: new B({
					text: "{i18n>BARCODE_DIALOG_CANCEL}",
					enabled: false,
					press: function () {
						H();
						S.getModel().setProperty("/isNoScanner", false);
						y();
					}
				}),
				afterClose: function () {
					H();
					S.destroyContent();
					S.destroy();
					S = null;
				}
			});
			S.setEscapeHandler(function (N) {
				d.closeScanDialog();
				if (typeof e === "function") {
					e({
						text: M.getProperty("/barcode"),
						cancelled: true
					});
				}
				N.resolve();
			});
			S.setModel(M);
			S.setModel(q, "i18n");
		}
		if (typeof T === "string" && T != null && T.trim() != "") {
			f = T;
		}
		if (!C && v()) {
			A();
		} else {
			if (s.getProperty("/available")) {
				S.getModel().setProperty("/isNoScanner", false);
			} else {
				S.getModel().setProperty("/isNoScanner", true);
			}
			y();
		}
		return S;
	}

	function F() {
		S.attachAfterOpen(function () {
			S.getEndButton().setEnabled(true);
			S.setBusy(false);
			if (!l) {
				l = h ? h.getDomRef('highlight') : undefined;
			}
			if (!j) {
				j = h ? h.getDomRef('video') : undefined;
			}
			z.decodeFromVideoDevice(null, h.getId() + '-video', function (e, K) {
				G();
				if (e) {
					var M, N, O;
					var P = 0,
						Q = 0,
						T = 0,
						U = 0,
						i;
					if (l && !p) {
						l.innerHTML = '';
						p = true;
					}
					if (l) {
						N = j.clientWidth / j.videoWidth;
						O = j.clientHeight / j.videoHeight;
						if (e.resultPoints) {
							T = e.resultPoints[0].y;
							U = e.resultPoints[0].x;
							Q = e.resultPoints[0].x;
							P = e.resultPoints[0].y;
							for (i = 0; i < e.resultPoints.length; i++) {
								M = e.resultPoints[i];
								if (M.x < U && M.x < Q) {
									U = M.x;
								} else if (M.x > U && M.x > Q) {
									Q = M.x;
								}
								if (M.y < T && M.y < P) {
									T = M.y;
								} else if (M.y > T && M.y > P) {
									P = M.y;
								}
							}
						}
						l.hidden = false;
						l.style.top = T * O + 'px';
						l.style.left = U * N + 'px';
						l.style.width = (Q - U > 0 ? (Q - U + m) * N : 5) + 'px';
						l.style.height = (P - T > 0 ? (P - T + n) * O : 5) + 'px';
					}
					if (e.cancelled === "false" || !e.cancelled) {
						e.cancelled = false;
						if (typeof o.onSuccess === "function") {
							o.onSuccess(e);
						}
						H();
						d.closeScanDialog();
					}
				} else {
					if (l && p) {
						l.hidden = true;
						l.style.top = '0';
						l.style.left = '0';
						l.style.width = '0';
						l.style.height = '0';
					}
				}
				if (K && Z && !(K instanceof Z.NotFoundException)) {
					L.warning("Started continous decode failed.");
					if (typeof o.onFail === "function") {
						o.onFail(K);
						S.getModel().setProperty("/isNoScanner", true);
						y();
					}
				}
			});
		});
		S.destroyContent();
		l = undefined;
		k = undefined;
		j = undefined;
		h = new c();
		S.addContent(h);
		S.setContentWidth('100%');
		S.setContentHeight('100%');
		S.addStyleClass('sapUiNoContentPadding');
		S.setBusy(true);
		S.open();
		p = false;
	}

	function G() {
		var i = 0.15;
		if (!j || !j.videoHeight || !j.videoWidth) {
			return;
		}
		if (!k && h) {
			k = h.getDomRef('overlay');
		}
		if (k) {
			var e = j.clientWidth * (1 - 2 * i);
			var K = j.clientHeight * (1 - 2 * i);
			if (e <= K) {
				K = e * (1 - 2 * i);
			}
			var M = h.getDomRef('overlay-box');
			M.style.width = e + 'px';
			M.style.height = K + 'px';
			k.style.width = e + 'px';
			k.style.height = K + 'px';
			k.style.borderWidth = (j.clientHeight - K) / 2 + 'px ' + (j.clientWidth - e) / 2 + 'px';
		}
	}

	function H() {
		if (z) {
			z.reset();
			z.stopContinuousDecode();
			z.reader.reset();
		}
	}
	d.scan = function (e, i, K, M) {
		if (!r) {
			L.error("Barcode scanning is already in progress.");
			return;
		}
		r = false;
		if (s.getProperty("/available") == true && C == null && z == null) {
			t();
		}
		if (C) {
			C.scan(function (N) {
				if (N.cancelled === "false" || !N.cancelled) {
					N.cancelled = false;
					if (typeof e === "function") {
						e(N);
					}
				} else {
					E(e, i, K, M);
				}
				r = true;
			}, function (N) {
				L.error("Barcode scanning failed.");
				r = true;
				if (typeof i === "function") {
					if (typeof N === "string") {
						var O = N;
						N = {
							"text": O
						};
						L.debug("Change the type of oEvent from string to object");
					}
					i(N);
				}
			});
		} else {
			E(e, i, K, M);
		}
	};
	d.closeScanDialog = function () {
		if (S) {
			S.close();
			r = true;
		}
	};
	d.getStatusModel = function () {
		return s;
	};
	x();
	return d;
}, true);