sap.ui.define([
	"sap/m/App",
	"sap/m/Button",
	"sap/m/Page",
	"sap/m/library",
	"sap/ui/core/library",
	"sap/m/NotificationListItem",
	"sap/m/MessageToast",
	"sap/m/NotificationList",
	"sap/ui/core/Element",
	"sap/ui/model/json/JSONModel"
], function(
	App,
	Button,
	Page,
	mLibrary,
	coreLibrary,
	NotificationListItem,
	MessageToast,
	NotificationList,
	Element,
	JSONModel
) {
	"use strict";

	//shortcuts
	const AvatarColor = mLibrary.AvatarColor,
			Priority = coreLibrary.Priority;

	var app = new App("myApp", {initialPage:"tabBarPage"});
	app.placeAt("body");

	var compactSizeButton = new Button('toggleCompactModeButton', {
		text : 'Toggle Compact mode',
		press : function() {
			Element.getElementById("myApp").toggleStyleClass('sapUiSizeCompact');
		}
	});

	var listItem = new NotificationListItem('firstNotification', {
		title : 'Notification List Title Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent feugiat, turpis vel',
		description : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent feugiat, turpis vel ' +
				'scelerisque pharetra, tellus odio vehicula dolor, nec elementum lectus turpis at nunc. ' +
				'Mauris non elementum orci, ut sollicitudin ligula. Vestibulum in ligula imperdiet, posuere tortor id, dictum nunc.',
		showCloseButton : true,
		datetime : '1 hour',
		unread : true,
		authorName : 'Jean Doe',
		authorPicture : 'images/Woman_04.png',
		priority: Priority.None,
		buttons: [
			new Button({
				text: 'Accept',
				press: function () {
					MessageToast.show('Accept button pressed');
				}
			}),
			new Button({
				text: 'Cancel',
				press: function () {
					listItem2.close();
				}
			})
		]
	});

	var listItem2 = new NotificationListItem('secondNotification', {
		title: 'Notification List Long Title',
		description : 'Aliquam quis varius ligula. In justo lorem, lacinia ac ex at, vulputate dictum turpis.',
		showCloseButton : false,
		datetime : '3 days',
		priority : Priority.Low,
		authorName : 'Office Notification',
		authorPicture : 'sap-icon://group',
		buttons: [
			new Button('notificationAcceptButton', {
				id: 'button1',
				text: 'Accept',
				press: function () {
					MessageToast.show('Accept button pressed');
				}
			})
		]
	});

	var listItem2A = new NotificationListItem('notificationNoButtons', {
		title: 'Notification List Title',
		description : 'Notification List Item with no "Accept" and no "Reject" buttons.',
		showButtons: false,
		showCloseButton : true,
		datetime : '3 days',
		priority : Priority.Low,
		authorName : 'Office Notification',
		authorAvatarColor: AvatarColor.Accent8,
		authorInitials: 'SC',
		buttons: [
			new Button({
				id: 'button356',
				text: 'OK',
				press: function () {
					MessageToast.show('Accept button pressed');
				}
			})
		]
	});

	var listItem3 = new NotificationListItem("notificationOnlyOneActionButton", {
		title: 'Notification List Title',
		description : 'Aliquam quis varius ligula. In justo lorem, lacinia ac ex at, vulputate dictum turpis.',
		showCloseButton : true,
		datetime : '3 days',
		unread : true,
		priority : Priority.Medium,
		authorInitials: 'JM',
		authorAvatarColor: AvatarColor.Accent1,
		buttons: [
			new Button({
				id: 'button3',
				text: 'OK',
				press: function () {
					MessageToast.show('Accept button pressed');
				}
			})
		]
	});

	var listItem4 = new NotificationListItem("notificationNoDescription", {
		title: 'Notification List Title',
		showCloseButton : true,
		datetime : '3 days',
		unread : true,
		priority : Priority.High,
		authorName : 'John Smith',
		authorPicture : 'images/headerImg2.jpg',
		authorInitials: 'AM',
		buttons: [
			new Button({
				id: 'button5',
				text: 'Accept',
				press: function () {
					MessageToast.show('Accept button pressed');
				}
			}),
			new Button({
				id: 'button6',
				text: 'Cancel',
				press: function () {
					listItem2.close();
				}
			})
		]
	});

	var oData = {
		showClose : true,
		buttons : [
			{
				buttonText : "Action1"
			},
			{
				buttonText : "Action2"
			},
			{
				buttonText : "Action3"
			},
			{
				buttonText : "Action4"
			}
		]
	};

	var oModel = new JSONModel();
	oModel.setData(oData);

	var oButtonTemplate = new Button({
		text : "{buttonText}",
		type : "{buttonType}"
	});

	var listItem5 = new NotificationListItem("notificationBinding", {
		id : "lastNotification",
		title : 'Item with binding - ' +
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent feugiat, turpis vel ' +
		'scelerisque pharetra, tellus odio vehicula dolor, nec elementum lectus turpis at nunc. ' +
		'Mauris non elementum orci, ut sollicitudin ligula. Vestibulum in ligula imperdiet, posuere tortor id, dictum nunc.' +
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent feugiat, turpis vel ' +
		'scelerisque pharetra, tellus odio vehicula dolor, nec elementum lectus turpis at nunc. ' +
		'Mauris non elementum orci, ut sollicitudin ligula. Vestibulum in ligula imperdiet, posuere tortor id, dictum nunc.' +
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent feugiat, turpis vel ' +
		'scelerisque pharetra, tellus odio vehicula dolor, nec elementum lectus turpis at nunc. ' +
		'Mauris non elementum orci, ut sollicitudin ligula. Vestibulum in ligula imperdiet, posuere tortor id, dictum nunc.',
		description : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent feugiat, turpis vel ' +
		'scelerisque pharetra, tellus odio vehicula dolor, nec elementum lectus turpis at nunc. ' +
		'Mauris non elementum orci, ut sollicitudin ligula. Vestibulum in ligula imperdiet, posuere tortor id, dictum nunc.' +
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent feugiat, turpis vel ' +
		'scelerisque pharetra, tellus odio vehicula dolor, nec elementum lectus turpis at nunc. ' +
		'Mauris non elementum orci, ut sollicitudin ligula. Vestibulum in ligula imperdiet, posuere tortor id, dictum nunc.' +
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent feugiat, turpis vel ' +
		'scelerisque pharetra, tellus odio vehicula dolor, nec elementum lectus turpis at nunc. ' +
		'Mauris non elementum orci, ut sollicitudin ligula. Vestibulum in ligula imperdiet, posuere tortor id, dictum nunc.',
		showCloseButton : "{showClose}",
		datetime : '1 hour',
		unread : true,
		authorName : 'Jean Doedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoe',
		authorPicture : 'images/Woman_04.png',
		priority: Priority.None,
		buttons: {
			path : "/buttons",
			template : oButtonTemplate,
			templateShareable: true
		}
	});
	listItem5.setModel(oModel);

	var listItem6 = new NotificationListItem("notificationNoShowMoreButton", {
		id : "lastNotification2",
		title : 'Item with binding AND no "show more" option - ' +
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent feugiat, turpis vel ' +
		'scelerisque pharetra, tellus odio vehicula dolor, nec elementum lectus turpis at nunc. ' +
		'Mauris non elementum orci, ut sollicitudin ligula. Vestibulum in ligula imperdiet, posuere tortor id, dictum nunc.' +
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent feugiat, turpis vel ' +
		'scelerisque pharetra, tellus odio vehicula dolor, nec elementum lectus turpis at nunc. ' +
		'Mauris non elementum orci, ut sollicitudin ligula. Vestibulum in ligula imperdiet, posuere tortor id, dictum nunc.' +
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent feugiat, turpis vel ' +
		'scelerisque pharetra, tellus odio vehicula dolor, nec elementum lectus turpis at nunc. ' +
		'Mauris non elementum orci, ut sollicitudin ligula. Vestibulum in ligula imperdiet, posuere tortor id, dictum nunc.',
		description : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent feugiat, turpis vel ' +
		'scelerisque pharetra, tellus odio vehicula dolor, nec elementum lectus turpis at nunc. ' +
		'Mauris non elementum orci, ut sollicitudin ligula. Vestibulum in ligula imperdiet, posuere tortor id, dictum nunc.' +
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent feugiat, turpis vel ' +
		'scelerisque pharetra, tellus odio vehicula dolor, nec elementum lectus turpis at nunc. ' +
		'Mauris non elementum orci, ut sollicitudin ligula. Vestibulum in ligula imperdiet, posuere tortor id, dictum nunc.' +
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent feugiat, turpis vel ' +
		'scelerisque pharetra, tellus odio vehicula dolor, nec elementum lectus turpis at nunc. ' +
		'Mauris non elementum orci, ut sollicitudin ligula. Vestibulum in ligula imperdiet, posuere tortor id, dictum nunc.',
		showCloseButton : "{showClose}",
		hideShowMoreButton: true,
		datetime : '1 hour',
		unread : true,
		showButtons: false,
		authorName : 'Jean Doedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoe',
		authorPicture : 'images/Woman_04.png',
		priority: Priority.None,
		buttons: {
			path : "/buttons",
			template : oButtonTemplate,
			templateShareable: true
		}
	});
	listItem6.setModel(oModel);

	var listItem7 = new NotificationListItem("notificationNoTruncation", {
		id : "lastNotification3",
		title : 'Item with binding AND no truncation - ' +
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent feugiat, turpis vel ' +
		'scelerisque pharetra, tellus odio vehicula dolor, nec elementum lectus turpis at nunc. ' +
		'Mauris non elementum orci, ut sollicitudin ligula. Vestibulum in ligula imperdiet, posuere tortor id, dictum nunc.' +
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent feugiat, turpis vel ' +
		'scelerisque pharetra, tellus odio vehicula dolor, nec elementum lectus turpis at nunc. ' +
		'Mauris non elementum orci, ut sollicitudin ligula. Vestibulum in ligula imperdiet, posuere tortor id, dictum nunc.' +
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent feugiat, turpis vel ' +
		'scelerisque pharetra, tellus odio vehicula dolor, nec elementum lectus turpis at nunc. ' +
		'Mauris non elementum orci, ut sollicitudin ligula. Vestibulum in ligula imperdiet, posuere tortor id, dictum nunc.',
		description : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent feugiat, turpis vel ' +
		'scelerisque pharetra, tellus odio vehicula dolor, nec elementum lectus turpis at nunc. ' +
		'Mauris non elementum orci, ut sollicitudin ligula. Vestibulum in ligula imperdiet, posuere tortor id, dictum nunc.' +
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent feugiat, turpis vel ' +
		'scelerisque pharetra, tellus odio vehicula dolor, nec elementum lectus turpis at nunc. ' +
		'Mauris non elementum orci, ut sollicitudin ligula. Vestibulum in ligula imperdiet, posuere tortor id, dictum nunc.' +
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent feugiat, turpis vel ' +
		'scelerisque pharetra, tellus odio vehicula dolor, nec elementum lectus turpis at nunc. ' +
		'Mauris non elementum orci, ut sollicitudin ligula. Vestibulum in ligula imperdiet, posuere tortor id, dictum nunc.',
		showCloseButton : "{showClose}",
		truncate: false,
		datetime : '1 hour',
		unread : true,
		authorName : 'Jean Doedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoe',
		authorPicture : 'images/Woman_04.png',
		priority: Priority.None,
		buttons: {
			path : "/buttons",
			template : oButtonTemplate
		}
	});

	var listItem8 = new NotificationListItem({
		title: 'Busy Notification List Title',
		showCloseButton : true,
		// busy: true,
		datetime : '3 days',
		unread : true,
		priority : Priority.High,
		authorName : 'John Smith',
		authorPicture : 'images/headerImg2.jpg',
		buttons: [
			new Button({
				id: 'button51',
				text: 'Accept',
				press: function () {
					MessageToast.show('Accept button pressed');
				}
			}),
			new Button({
				id: 'button61',
				text: 'Cancel',
				press: function () {
					listItem8.close();
				}
			})
		]
	});

	var listItem9 = new NotificationListItem({
		title: 'Hidden Notification',
		showCloseButton : true,
		visible: false,
		busy: true,
		datetime : '3 days',
		unread : true,
		priority : Priority.High,
		authorName : 'John Smith',
		authorPicture : 'images/headerImg2.jpg'
	});

	var list = new NotificationList("listId", {
		items: [
			listItem,
			listItem2,
			listItem2A,
			listItem3,
			listItem4,
			listItem5,
			listItem6,
			listItem7,
			listItem8,
			listItem9
		]
	});

	// BCP: 2080142709
	var smallNotif = new NotificationListItem("smallNotif", {
		description: "Hello World Honorificabilitudinitatibus",
		title: "Data migration results available.",
		showCloseButton: false,
		truncate: false
	}).addStyleClass("smallNotif");

	var initialPage = new Page("tabBarPage", {
		showHeader: false,
		content: [compactSizeButton, list, smallNotif]
	});

	app.addPage(initialPage);

});