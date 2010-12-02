cjaf.define({
	"root": {
		"form_test":{

			"heading":"Update Personal Information",
			"instructions":"To update your information, enter your changes in the form below. Before saving your changes, please be sure the information you entered is correct. When you are done, click on the \"Update My Information\" button at the bottom. ",

			"form":{
				"information":{
					"success":"Success!",
					"button":"Update My Information",
					"heading1":"Mailing Address",
					"heading2":"Contact Information",
					"phoneexample":"  ex. (555) 123-4567 ",
					"instructions":"NOTE: Please make sure your email address is correct. Your email address will be used only for customer service purposes and will not be used to communicate secure information about your card.",
					"error":{
	                    "addressError": "There was an error updating your address. Please ensure your card is active."
                    },
					"address1":{
						"label":"Address 1",
						"error":{
							"empty":"Please enter your address."
						}
					},
					"address2":{
						"label":"Address 2",
						"error":{
							"empty":"Please enter your address."
						}
					},
					"city":{
						"label":"City",
						"error":{
							"invalid":"Please only use valid characters.",
							"maximumLength":"City name too long.",
							"empty":"Please enter your city."
						}
					},
					"state":{
						"label":"State",
						"error":{
						}
					},
					"zip":{
						"label":"Zip",
						"error":{
							"empty":"Please enter your zip.",
							"minimumLength":"Zip codes must have a minimum of 5 (five) characters.",
							"invalid":"ZIP codes consist of 5 (five) numbers (0-9)",
							"zipStateMisMatch": "Please ensure your zip code is in the selected state"
						}
					},
					"email":{

						"label":"Email address",
						"error":{
							"emailAddressInvalidMxRecord":"Please verify that your email address is valid.",
							"invalid":"Please check and re-enter your email address.",
							"empty":"Please enter your email address."
						}
					},
					"homephone":{
						"label":"Home phone",
						"error":{
							"empty":"Please enter your home phone number.",
							"minimumLength":"Your home phone number must be 10 (ten) characters long."
						}
					},
					"cellphone":{
						"label":"Cell phone",
						"error":{
							"empty":"Please enter your cell phone number.",
							"minimumLength":"Your cell phone number must be 10 (ten) characters long."
						}
					}
				},

				"kba":{
					"success":"Success!",
					"heading":"Security Information",
					"button":"Update My Security Information",

					"kba1":{
						"label":"Security Question #1",
						"error":{
							"empty":"Please answer Security Question #1",
							"no_kba_selected":"We have no security information for your account. Please update your security information below."
						}
					},
					"kba2":{
						"label":"Security Question #2",
						"error":{
							"empty":"Please answer Security Question #2",
							"no_kba_selected":"We have no security information for your account. Please update your security information below."
						}
					},
					"kba1select":{

						"error":{

							"notEqualMatch":"You must select 2 different security questions to answer.",
							"no_kba_selected":"We have no security information for your account. Please update your security information below."
						}
					},
					"kba2select":{

						"error":{
							"notEqualMatch":"You must select 2 different security questions to answer.",
							"no_kba_selected":"We have no security information for your account. Please update your security information below."
						}
					}

				},

				"password":{
						"success":"Success!",
						"heading":"Password",
						"instructions":"NOTE: Your password is case sensitive and must be 6 - 20 characters",
						"button":"Update My Password",
						"password":{

							"label":"New Password",
							"error":{
								"minimumLength":"Password must be a minimum of 6 characters.",
								"maximumLength":"Password cannot exceed 20 characters.",
								"empty": "You must enter a new password.",
								"match": "Password fields must match."
						}
						},

						"confirmpass":{
							"label":"Confirm New Password",
							"error":{
								"minimumLength":"Password must be a minimum of 6 characters.",
								"maximumLength":"Password cannot exceed 20 characters.",
								"empty": "You must enter a new password.",
								"match": "Password fields must match."
							}
						},
						"error":{
							"unknown_error":"We are unable to change your password at this time."
						}

				}

			}

		},




		"navigation": {
			"links": {
				"home": "Home",
				"base": "Base Objects",
				"model": "Models",
				"widget": "Widgets" 
			}
		}
	}
});