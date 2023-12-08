package main

import (
	"log"
	"os"

	"github.com/codingsince1985/geo-golang/opencage"
	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/models"
	// uncomment once you have at least one .go migration file in the "migrations" directory
	// _ "yourpackage/migrations"
)

func main() {

	openCageGeo := opencage.Geocoder("187f948b5a9d4c5696cdb9df9c42a22f")

	app := pocketbase.New()

	// loosely check if it was executed using "go run"
	/* isGoRun := strings.HasPrefix(os.Args[0], os.TempDir()) */

	/* migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		// enable auto creation of migration files when making collection changes in the Admin UI
		// (the isGoRun check is to enable it only during development)
		Automigrate: isGoRun,
	}) */
	// On update address, also update the address geoPoints
	app.OnRecordBeforeUpdateRequest("address").Add(func(e *core.RecordUpdateEvent) error {
		admin, _ := e.HttpContext.Get(apis.ContextAdminKey).(*models.Admin)
		if admin != nil {
			return nil // ignore for admins as the pocketbase is performing the action
		}

		authRecord, _ := e.HttpContext.Get(apis.ContextAuthRecordKey).(*models.Record)
		if authRecord == nil {
			return apis.NewUnauthorizedError("Authenticated user not found for request", nil) // ignore for unauthed user
		}
		if e.Record.TableName() == "address" {
			// Doesn't matter user or worker, only 1 address allowed
			if authRecord.GetString("address") != e.Record.Id {
				return apis.NewUnauthorizedError("Cannot modify address", nil)
			}
			// Need to add functionality to find GeoCode Address from normal address
			// If this fails, block the creation of address -  Need to do the same for update
			if e.Record.TableName() == "address" {
				var addresQuery = e.Record.GetString("addressLine1") + "," + e.Record.GetString("city") + "," + e.Record.GetString("country") + "," + e.Record.GetString("postCode")
				log.Println("AddressQuery ", addresQuery)
				location, errGeocode := openCageGeo.Geocode(addresQuery)
				if errGeocode != nil {
					log.Println("AddressQuery ReverseGeocode Error", errGeocode)
				}
				if location != nil {
					/* log.Println("%s location is (%.6f, %.6f)\n", e.Record.GetString("addressLine1"), location.Lat, location.Lng) */

					addressReverseGeoCode, errReverseGeocode := openCageGeo.ReverseGeocode(location.Lat, location.Lng)
					if errReverseGeocode != nil {
						log.Println("AddressQuery ReverseGeocode Error", errReverseGeocode)
					}
					if addressReverseGeoCode != nil {
						e.Record.Set("longitude", location.Lng)
						e.Record.Set("latitude", location.Lat)
						e.Record.Set("addressLine1", addressReverseGeoCode.Street+","+addressReverseGeoCode.HouseNumber)
						e.Record.Set("formattedAddress", addressReverseGeoCode.FormattedAddress)
						e.Record.Set("street", addressReverseGeoCode.Street)
						e.Record.Set("houseNumber", addressReverseGeoCode.HouseNumber)
						e.Record.Set("suburb", addressReverseGeoCode.Suburb)
						e.Record.Set("state", addressReverseGeoCode.State)
						e.Record.Set("stateCode", addressReverseGeoCode.StateCode)
						e.Record.Set("county", addressReverseGeoCode.County)
						e.Record.Set("city", addressReverseGeoCode.City)
						e.Record.Set("country", addressReverseGeoCode.Country)
						e.Record.Set("countryCode", addressReverseGeoCode.CountryCode)
						e.Record.Set("postCode", addressReverseGeoCode.Postcode)
					} else {
						return apis.NewBadRequestError("Incorrect address, could not find place", nil)
					}
				} else {
					return apis.NewBadRequestError("Incorrect address, could not find place", nil)
				}
			}
		}

		return nil
	})

	// Validate the correct roles can create records. Also add GeoPoints from Provided User address
	app.OnRecordBeforeCreateRequest().Add(func(e *core.RecordCreateEvent) error {
		admin, _ := e.HttpContext.Get(apis.ContextAdminKey).(*models.Admin)
		if admin != nil {
			return nil // ignore for admins as the pocketbase is performing the action
		}
		if e.Record.TableName() != "users" {
			authRecord, _ := e.HttpContext.Get(apis.ContextAuthRecordKey).(*models.Record)
			if authRecord == nil {
				return apis.NewUnauthorizedError("Authenticated user not found for request", nil) // ignore for unauthed user
			}
			if e.Record.GetString("role") == "USER" && (e.Record.TableName() == "service" || e.Record.TableName() == "availability") {
				return apis.NewForbiddenError("User doesn't have access to create "+e.Record.TableName(), nil)
			}
			if e.Record.TableName() == "address" || e.Record.TableName() == "service" || e.Record.TableName() == "availability" || e.Record.TableName() == "bankAccount" || e.Record.TableName() == "bankCard" || e.Record.TableName() == "billingAddress" || e.Record.TableName() == "address" {
				// Setting the record with userId to indicate who is the admin on the record
				e.Record.Set("userId", authRecord.Id)
			}
			// Need to add functionality to find GeoCode Address from normal address
			// If this fails, block the creation of address -  Need to do the same for update
			if e.Record.TableName() == "address" {
				// Doesn't matter user or worker, only 1 address allowed
				if authRecord.GetString("address") != "" {
					return apis.NewBadRequestError("User already has a Address set, Cannot create another address", nil)
				}

				var addresQuery = e.Record.GetString("addressLine1") + "," + e.Record.GetString("city") + "," + e.Record.GetString("country") + "," + e.Record.GetString("postCode")
				log.Println("AddressQuery ", addresQuery)
				location, errGeocode := openCageGeo.Geocode(addresQuery)
				if errGeocode != nil {
					log.Println("AddressQuery Geocode Error ", errGeocode.Error())
				}
				if location != nil {
					/* log.Println("%s location is (%.6f, %.6f)\n", e.Record.GetString("addressLine1"), location.Lat, location.Lng) */

					addressReverseGeoCode, errReverseGeocode := openCageGeo.ReverseGeocode(location.Lat, location.Lng)
					if errReverseGeocode != nil {
						log.Println("AddressQuery ReverseGeocode Error", errReverseGeocode)
					}

					if addressReverseGeoCode != nil {
						e.Record.Set("longitude", location.Lng)
						e.Record.Set("latitude", location.Lat)
						e.Record.Set("addressLine1", addressReverseGeoCode.Street+","+addressReverseGeoCode.HouseNumber)
						e.Record.Set("formattedAddress", addressReverseGeoCode.FormattedAddress)
						e.Record.Set("street", addressReverseGeoCode.Street)
						e.Record.Set("houseNumber", addressReverseGeoCode.HouseNumber)
						e.Record.Set("suburb", addressReverseGeoCode.Suburb)
						e.Record.Set("state", addressReverseGeoCode.State)
						e.Record.Set("stateCode", addressReverseGeoCode.StateCode)
						e.Record.Set("county", addressReverseGeoCode.County)
						e.Record.Set("city", addressReverseGeoCode.City)
						e.Record.Set("country", addressReverseGeoCode.Country)
						e.Record.Set("countryCode", addressReverseGeoCode.CountryCode)
						e.Record.Set("postCode", addressReverseGeoCode.Postcode)
					} else {
						return apis.NewBadRequestError("Incorrect address, could not find place", nil)
					}
				} else {
					return apis.NewBadRequestError("Incorrect address, could not find place", nil)
				}
			}

		}
		return nil
	})
	// On create request
	app.OnRecordAfterCreateRequest("service", "availability", "bankAccount", "bankCard", "billingAddress", "address").Add(func(e *core.RecordCreateEvent) error {
		admin, _ := e.HttpContext.Get(apis.ContextAdminKey).(*models.Admin)
		if admin != nil {
			return nil // ignore for admins as the pocketbase is performing the action
		}

		authRecord, _ := e.HttpContext.Get(apis.ContextAuthRecordKey).(*models.Record)
		if authRecord == nil {
			return apis.NewForbiddenError("Authenticated user not found for request", nil) // ignore for unauthed user
		}

		if e.Record.TableName() == "service" {
			// Get the newly inserted settings record
			serviceId := e.Record.Id
			servicesUserGet := authRecord.GetStringSlice("services")
			if servicesUserGet == nil {
				return apis.NewBadRequestError("User is not created properly,service contact support", nil) // ignore for unauthed user
			}
			authRecord.Set("services", append(servicesUserGet, serviceId))
			app.Dao().SaveRecord(authRecord)
		}
		if e.Record.TableName() == "availability" {
			// Get the newly inserted settings record
			availabilityId := e.Record.Id
			availabilitiesUserGet := authRecord.GetStringSlice("availabilities")
			if availabilitiesUserGet == nil {
				return apis.NewBadRequestError("User is not created properly,availability issue contact support", nil) // ignore for unauthed user
			}
			authRecord.Set("availabilities", append(availabilitiesUserGet, availabilityId))
			app.Dao().SaveRecord(authRecord)
		}
		if e.Record.TableName() == "bankCard" {
			// Get the newly inserted settings record
			bankCardId := e.Record.Id
			bankCardsUserGet := authRecord.GetStringSlice("bankCards")
			if bankCardsUserGet == nil {
				return apis.NewBadRequestError("User is not created properly,bankCard issue contact support", nil) // ignore for unauthed user
			}

			authRecord.Set("bankCards", append(bankCardsUserGet, bankCardId))
			app.Dao().SaveRecord(authRecord)
		}
		if e.Record.TableName() == "bankAccount" {
			// Get the newly inserted settings record
			bankAccountId := e.Record.Id
			bankAccountsUserGet := authRecord.GetStringSlice("bankAccounts")
			if bankAccountsUserGet == nil {
				return apis.NewBadRequestError("User is not created properly,bankAccount issue contact support", nil) // ignore for unauthed user
			}
			authRecord.Set("bankAccounts", append(bankAccountsUserGet, bankAccountId))
			app.Dao().SaveRecord(authRecord)
		}
		if e.Record.TableName() == "billingAddress" {
			// Get the newly inserted settings record
			billingAddressId := e.Record.Id
			billingAddressUserGet := authRecord.GetString("billingAddress")
			if billingAddressUserGet != "" {
				// User already has a billing Address set and is trying to add another
				return apis.NewBadRequestError("User already has a billing Address set and is trying to add another, Cannot create another billing address", nil)
			}
			authRecord.Set("billingAddress", billingAddressId)
			app.Dao().SaveRecord(authRecord)
		}
		if e.Record.TableName() == "address" {
			// Get the newly inserted settings record
			addressId := e.Record.Id
			addressUserGet := authRecord.GetString("address")
			if addressUserGet != "" {
				// User already has a billing Address set and is trying to add another
				return apis.NewBadRequestError("User already has a work Address set and is trying to add another, Cannot create another work address", nil)
			}
			// Setting the record with userId to indicate who is the admin on the record
			authRecord.Set("address", addressId)
			app.Dao().SaveRecord(authRecord)
		}
		return nil
	})

	// serves static files from the provided public dir (if exists)
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.GET("/health", func(c echo.Context) error {
			return c.String(200, "ok")
		})
		e.Router.GET("/*", apis.StaticDirectoryHandler(os.DirFS("./pb_public"), false))
		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}

//// Don't Delete Extra information

/*
func try(geocoder geo.Geocoder) {
	location, _ := geocoder.Geocode(addr)
	if location != nil {
		log.Println("%s location is (%.6f, %.6f)\n", addr, location.Lat, location.Lng)
	} else {
		fmt.Println("got <nil> location")
	}
	address, _ := geocoder.ReverseGeocode(lat, lng)
	if address != nil {
		log.Println("Address of (%.6f,%.6f) is %s\n", lat, lng, address.FormattedAddress)
		log.Println("Detailed address: %#v\n", address)
	} else {
		fmt.Println("got <nil> address")
	}
	fmt.Print("\n")
}

app.OnRecordBeforeUpdateRequest("service", "availability", "bankAccount", "bankCard", "billingAddress", "address").Add(func(e *core.RecordUpdateEvent) error {
		admin, _ := e.HttpContext.Get(apis.ContextAdminKey).(*models.Admin)
		if admin != nil {
			return nil // ignore for admins
		}
		user, _ := e.HttpContext.Get(apis.ContextAuthRecordKey).(*models.Record)
		if user == nil {
			return apis.NewBadRequestError("Authenticated user not found for request", nil) // ignore for unauthed user
		}
		// overwrite the submitted "active" field value to false
		e.Record.Set("active", false)

		// or you can also prevent the create event by returning an error, eg.:
		if e.Record.GetString("userId") != user.Id {
			return apis.NewUnauthorizedError("Cannot update/modify resource, unauthorized mofication", nil)
		}
		return nil
	})

// On Delete request after succesfull for Nested Relational Tables
app.OnRecordAfterDeleteRequest("service", "availability", "bankAccount", "bankCard", "billingAddress", "address").Add(func(e *core.RecordDeleteEvent) error {
	admin, _ := e.HttpContext.Get(apis.ContextAdminKey).(*models.Admin)
	if admin != nil {
		return nil // ignore for admins as the pocketbase is performing the action
	}
	user, _ := e.HttpContext.Get(apis.ContextAuthRecordKey).(*models.Record)
	if user == nil {
		return apis.NewBadRequestError("Authenticated user not found for request", nil) // ignore for unauthed user
	}
	if e.Record.TableName() == "service" {
		// Get the newly deletet settings record
		serviceId := e.Record.Id
		servicesUserGet := cast.ToStringSlice(user.Get("services"))
		if servicesUserGet == nil {
			return apis.NewBadRequestError("User is not created properly,service contact support", nil) // ignore for unauthed user
		}
		n := 0
		for _, val := range servicesUserGet {
			if val == serviceId {
				servicesUserGet[n] = val
				n++
			}
		}

		servicesUserGet = servicesUserGet[:n]
		user.Set("services", servicesUserGet)
		app.Dao().SaveRecord(user)
	}

	return nil
})

app.OnModelAfterCreate("settings").Add(func(e *core.ModelEvent) error {
	// Get the newly inserted settings record
	settings := e.Model.(*models.Record)

	// Get the user who created this settings record
	user := app.Dao().RecordQuery("users").Where(dbx.NewExp("id = {:id}", dbx.Params{"id": settings.Get("userId")})).One()
	if err != nil {
		return err
	}

	// Add the settings id to the user record
	user.Set("settingsId", settings.Get("id"))
	if _, err := app.Dao().RecordUpdate("users", user); err != nil {
		return err
	}

	return nil
})

app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
	e.Router.AddRoute(echo.Route{
		Method: http.MethodPost,
		Path:   "/upsert-settings",
		Handler: func(c echo.Context) error {
			data := map[string]any{}

			// load request data
			if err := c.Bind(&data); err != nil {
				return err
			}

			settingsCollection, err := app.Dao().FindCollectionByNameOrId("settings")
			if err != nil {
				return apis.NewBadRequestError("Failed to upsert settings", err)
			}

			app.Dao().RunInTransaction(func(txDao *daos.Dao) error {
				for k, v := range data {
					record, _ := txDao.FindFirstRecordByData("settings", "key", k)

					// create if missing
					if record == nil {
						record = models.NewRecord(settingsCollection)
						record.Set("key", k)
					}

					record.Set("value", v)

					if err := txDao.Save(record); err != nil {
						return apis.NewBadRequestError("Failed to upsert setting "+k, err)
					}
				}

				return nil
			})

			return c.NoContent(http.StatusNoContent)
		},
		Middlewares: []echo.MiddlewareFunc{
			apis.ActivityLogger(app),
			// add other middleware to guard the request if necessary...
			// you can check https://pocketbase.io/docs/router/#middlewares
		},
	})

	return nil
})

// fires only for "users" and "members"
app.OnModelAfterCreate("user").Add(func(e *core.ModelEvent) error {
	log.Println("--- OnModelAfterCreate ---")
	log.Println(e.BaseModelEvent.Model)
	log.Println(e.Model.TableName())
	log.Println(e.Model.GetId())
	log.Println("*** OnModelAfterCreate ***")
	return nil
})

// fires only for "users" auth collections
app.OnRecordAuthRequest("user").Add(func(e *core.RecordAuthEvent) error {
	log.Println("--- OnRecordAuthRequest ---")
	log.Println(e.Collection.BaseModel)
	log.Println(e.HttpContext)
	log.Println(e.Record)
	log.Println(e.Token)
	log.Println(e.Meta)
	log.Println("*** OnRecordAuthRequest ***")
	return nil
})


app.OnRecordAfterCreateRequest("service", "availability", "bankAccount", "bankCard", "billingAddress", "address").Add(func(e *core.RecordCreateEvent) error {
	admin, _ := e.HttpContext.Get(apis.ContextAdminKey).(*models.Admin)
	if admin != nil {
		return nil // ignore for admins as the pocketbase is performing the action
	}

	user, _ := e.HttpContext.Get(apis.ContextAuthRecordKey).(*models.Record)
	if user == nil {
		return apis.NewBadRequestError("Authenticated user not found for request", nil) // ignore for unauthed user
	}
	serviceCollection, err := app.Dao().FindCollectionByNameOrId("service")
	if err != nil {
		return apis.NewBadRequestError("Failed to create a service", err)
	}
	app.Dao().RunInTransaction(func(txDao *daos.Dao) error {
	for k, v := range data {
		record, _ := txDao.FindFirstRecordByData("settings", "key", k)

		// create if missing
		if record == nil {
			record = models.NewRecord(serviceCollection)
			record.Set("key", k)
		}

		record.Set("value", v)

		if err := txDao.Save(record); err != nil {
			return apis.NewBadRequestError("Failed to upsert setting "+k, err)
		}
	}

	return nil
	})
	// or you can also prevent the create event by returning an error, eg.:
	/* if e.Record.GetString("status") != "pending" {
	return apis.NewBadRequestError("status must be pending", nil)
	}

		return nil
	})
*/
