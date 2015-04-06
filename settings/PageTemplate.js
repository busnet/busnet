var moment = require('moment');

var sm = {
    Core:
      {
          Templates: [{
              Container: 'html', Template: 'RSS/Rss'
              , Templates: [{ Container: 'none', Template: 'Reminders/Reminders' },
                            { Container: 'none', Template: 'HomePage/CompanyDetails' },
                            { Container: 'none', Template: 'HomePage/FaviArea' },
                            { Container: 'none', Template: 'Agreement/Agreement' },
                            { Container: 'none', Template: 'Board/SubContactionRides' }]
          }]
      },
    HP:
   {
       Templates: [{

           Container: 'html', Template: 'Main/main',
           Data: { Responder: 'JsonResponder', Path: 'Main/main.json' },
           Templates: [
               {
                   Container: '#Pane', Template: 'Board/Board',
                   Data: { 
                            Responder: 'DBFindResponder', Collection: 'IndexCategories', Criteria: { }, Fileds: { none: 0 }, Options: { skip: 0, limit: 5 }
                       },
                   Templates: [{
                       Container: '#InnerPane', Template: 'HomePage/hp', Js: "InitSearch(); ClearInputs(); $('body').removeClass('BusBG');  initCitySearch();",
                       Data: {
                           Responder: 'DBFindResponder', Collection: 'Rides'
                           , Criteria: {
                               isApproved: { $ne: true }, username: { $ne: { $$Param: { From: "Cookie", Key: "username" } } }
                               , vehicleType: { $$Param: { From: "QueryString", Key: "vt" } }
                               , aviliableDate: { $$Param: { From: "QueryString", Key: "ad" } }
                               , aviliableDateObj: { $gte: { $$Param: { From: "System", Key: "today" } } }
                               , area: { $$Param: { From: "QueryString", Key: "area" } }
                               , $or: [ {area: { $$Param: { From: "QueryString", Key: "area", DefaultValue:"a" } }}
                                    , { cityID: { $$Param: { From: "Area", Key: "GetFaviCities", ParseFnc: '$in' } } }
                                    , { dstCityID: { $$Param: { From: "Area", Key: "GetFaviCities", ParseFnc: '$in' } } }
                               ]
                           }
                                , Fileds: { 'reuqests': 0 }, Options: { skip: 0, limit: 500, sort: { "aviliableDateObj": 1, "aviliableHour": 1 } }
                       }
                   }]
               }]
       }]
   },
    MyRides:
   {
       Templates: [{
           Container: 'html', Template: 'Main/main',
           Data: { Responder: 'JsonResponder', Path: 'Main/main.json' },
           Templates: [
               {
                   Container: '#Pane', Template: 'Board/Board', Js: " InitSearch();",
                   Data: { 
                       Responder: 'DBFindResponder', Collection: 'IndexCategories', Criteria: { }, Fileds: { none: 0 }, Options: { skip: 0, limit: 5 }
                   },
                   Templates: [{
                       Container: '#InnerPane', Template: 'MyRides/MyRides',
                       Data: {
                           Responder: 'DBFindResponder', Collection: 'Rides', Criteria: {
                               username: { $$Param: { From: "Cookie", Key: "username" } }
                               , isApproved: false
                               , aviliableDateObj: { $gte: { $$Param: { From: "System", Key: "today" } } }
                           }, Fileds: { none: 0 }, Options: { skip: 0, limit: 200, sort: { "aviliableDate": 1, "aviliableHour": 1 } }
                       }
                   }]
               }]
       }]
   },
    Agreement:
   {
       Templates: [{
           Container: 'html', Template: 'Main/main',
           Data: { Responder: 'JsonResponder', Path: 'Main/main.json' },
           Templates: [
               {
                   Container: '#Pane', Template: 'Agreement/SigndAgreement',
           Data: {
               Responder: 'AgreementResponder'
           }
               }]
       }]
   },

    PayCal:
      {
          Templates: [{
              Container: 'html', Template: 'Main/main',
              Data: { Responder: 'JsonResponder', Path: 'Main/main.json' },
              Templates: [
                  {
                      Container: '#Pane', Template: 'PayCal/PayCal',
                      Data: {
                          Responder: 'PayCalResponder'
                      }
                  }]
          }]
      },
    OwnerConfirmedRides: {
        Templates: [{
            Container: 'html', Template: 'Main/main',
            Data: { Responder: 'JsonResponder', Path: 'Main/main.json' },
            Templates: [
                {
                    Container: '#Pane', Template: 'Board/Board', Js: " InitSearch();",
                    Data: {
                        Responder: 'DBFindResponder', Collection: 'IndexCategories', Criteria: {}, Fileds: { none: 0 }, Options: { skip: 0, limit: 5 }
                    },
                    Templates: [{
                        Container: '#InnerPane', Template: 'Reports/OwnerConfirmedRides',
                        Data: {
                            Responder: 'DBFindResponder', Collection: 'Rides', Criteria: {
                                isApproved: true, username: { $$Param: { From: "Cookie", Key: "username" } }
                            },
                            Fileds: { none: 0 }, Options: { skip: 0, limit: 200 },
                           // ToArray: ['requests']
                        }
                    }]
                }]
        }]
    },
    UserConfirmedRides: {
        Templates: [{
            Container: 'html', Template: 'Main/main',
            Data: { Responder: 'JsonResponder', Path: 'Main/main.json' },
            Templates: [
                {
                    Container: '#Pane', Template: 'Board/Board', Js: " InitSearch();",
                    Data: {
                        Responder: 'DBFindResponder', Collection: 'IndexCategories', Criteria: {}, Fileds: { none: 0 }, Options: { skip: 0, limit: 5 }
                    },
                    Templates: [{
                        Container: '#InnerPane', Template: 'Reports/UserConfirmedRides',
                        Data: {
                           // Responder: 'DBFindResponder', Collection: 'Rides', Criteria: { isApproved: true, $exists: { $$Param: { From: "Cookie", Key: "username" }, prefix: "requests" } }, Fileds: { 'reuqests': 0 }, Options: { skip: 0, limit: 20 }
                            Responder: 'DBFindResponder', Collection: 'Rides', Criteria: { isApproved: true, soldTo: { $$Param: { From: "Cookie", Key: "username" } } }
                            , Fileds: { none: 0 }
                            , Options: { skip: 0, limit: 200 }
                            //, ToArray: ['requests']
                        }
                    }]
                }]
        }]
    },
    OpenRequests:
    {
        Templates: [{
            Container: 'html', Template: 'Main/main',
            Data: { Responder: 'JsonResponder', Path: 'Main/main.json' },
            Templates: [
                {
                    Container: '#Pane', Template: 'Board/Board', Js:" InitSearch();",
                    Data: {
                        Responder: 'DBFindResponder', Collection: 'IndexCategories', Criteria: {}, Fileds: { none: 0 }, Options: { skip: 0, limit: 5 }
                    },
                    Templates: [{
                        Container: '#InnerPane', Template: 'OpenRequests/OpenRequests', Js: " SetRowsBG();",
                        Data: {
                            Responder: 'DBFindResponder', Collection: 'Rides', Criteria: {
                                isApproved: { $ne: true }
                                , username: { $$Param: { From: "Cookie", Key: "username" } }
                                , aviliableDateObj: { $gte: { $$Param: { From: "System", Key: "today" } } }
                            },
                            Fileds: { none: 0 }, Options: { skip: 0, limit: 200, sort: { "aviliableDateObj":-1} },
                            ToArray:['requests']
                        }
                    }]
                }]
        }]
    },
    AddRide:
    {
        Templates: [{
            Container: 'html', Template: 'Main/main',
            Data: { Responder: 'JsonResponder', Path: 'Main/main.json' },
            Templates: [{
                Container: '#Pane', Template: 'Board/Board', Js: " InitSearch()",
                Data: {
                    Responder: 'DBFindResponder', Collection: 'IndexCategories', Criteria: {}, Fileds: { none: 0 }, Options: { skip: 0, limit: 5 }
                },
                Templates: [{
                    Container: '#InnerPane', Template: 'AddRide/AddRide', Js: "InitDates(); InitEditRideForm(); InitAutocomplete();",
                    Data: { Responder: 'DBFindResponder', Collection: 'Cities', Criteria: {}, Fileds: { none: 0 }, Options: { skip: 0, limit: 2000 , sort:{"area":1, "city":1} } }
                }]
                
            }]
        }]
    },

    Profile:
   {
       Templates: [{
           Container: 'html', Template: 'Main/main',
           Data: { Responder: 'JsonResponder', Path: 'Main/main.json' },
           Templates: [{
               Container: '#Pane', Template: 'Board/Board', Js: " InitSearch();",
               Data: {
                   Responder: 'DBFindResponder', Collection: 'IndexCategories', Criteria: {}, Fileds: { none: 0 }, Options: { skip: 0, limit: 5 }
               },
               Templates: [{
                   Container: '#InnerPane', Template: 'Profile/Profile', Js: "getBusCompanyDtl()",
                   Data: { Responder: 'JsonResponder', Path: 'HomePage/HomePage.json' }
               }]

           }]
       }]
   },

   Indexes:
   {
       Templates: [{
           Container: 'html', Template: 'Main/main',
           Data: { Responder: 'JsonResponder', Path: 'Main/main.json' },
           Templates: [
               {
                   Container: '#Pane', Template: 'Board/Board', Js: " InitSearch();",
                   Data: {
                       Responder: 'DBFindResponder', Collection: 'IndexCategories', Criteria: {}, Fileds: { none: 0 }, Options: { skip: 0, limit: 5 }
                   },
                   Templates: [{
                       Container: '#InnerPane', Template: 'Indexes/Indexes', Js: "InitialIndexesContainer()",
                       Data: { Responder: 'JsonResponder', Path: 'Indexes/Indexes.json' },
                       Templates: [{
                       Container: '.IndexSideMenuPane', Template: 'Indexes/Categories',
                       Data: { 
                            Responder: 'DBFindResponder', Collection: 'IndexCategories', Criteria: { }, Fileds: { none: 0 }, Options: { skip: 0, limit: 20 }
                       }
                       },
                       {
                       Container: '.IndexItemsPane', Template: 'Indexes/Businesses',
                       Data: { 
                            Responder: 'DBFindResponder', Collection: 'IndexBusinesses', Criteria: { category: {$$Param: { From: "QueryString", Key: "c", DefaultValue: "מוסכים" } } }, Fileds: { none: 0 }, Options: { skip: 0, limit: 20 }
                       }
                       }]
                   }]
               }]
       }]
   },

   Business:
   {
       Templates: [{
           Container: 'html', Template: 'Main/main',
           Data: { Responder: 'JsonResponder', Path: 'Main/main.json' },
           Templates: [
               {
                   Container: '#Pane', Template: 'Board/Board', Js: " InitSearch();",
                   Data: {
                       Responder: 'DBFindResponder', Collection: 'IndexCategories', Criteria: {}, Fileds: { none: 0 }, Options: { skip: 0, limit: 5 }
                   },
                   Templates: [{
                       Container: '#InnerPane', Template: 'Indexes/Indexes',
                       Data: { Responder: 'JsonResponder', Path: 'Indexes/Indexes.json' },
                       Templates: [{
                       Container: '.IndexSideMenuPane', Template: 'Indexes/Categories',
                       Data: { 
                            Responder: 'DBFindResponder', Collection: 'IndexCategories', Criteria: { }, Fileds: { none: 0 }, Options: { skip: 0, limit: 20 }
                            }
                       },
                       {
                       Container: '.IndexItemsPane', Template: 'Indexes/Business', Js: "InitialBusniessContainer()",
                       Data: { 
                            Responder: 'DBFindResponder', Collection: 'IndexBusinesses', Criteria: { _id: { $$Param: { From: "QueryString", Key: "b", ParseFnc: 'parseInt' } } }, Fileds: { none: 0 }, Options: { skip: 0, limit: 1 }
                       }
                       }]
                   }]
               }]
       }]
   },

    ContactUs:
    {
        Templates: [{
        Container: 'html', Template: 'Main/main',
        Data: { Responder: 'JsonResponder', Path: 'Main/main.json' },
        Templates: [
            {
                Container: '#Pane', Template: 'Board/Board', Js: " InitSearch();",
                Data: { 
                    Responder: 'DBFindResponder', Collection: 'IndexCategories', Criteria: { }, Fileds: { none: 0 }, Options: { skip: 0, limit: 5 }
                },
                Templates: [{
                    Container: '#InnerPane', Template: 'ContactUs/ContactUs', Js: " initContactUs();",
                    Data: { Responder: 'JsonResponder', Path: 'HomePage/HomePage.json' }
                }]
            }]
    }]
    }
    ,
   Ituran:
   {
       Templates: [{
           Container: 'html', Template: 'Main/main',
           Data: { Responder: 'JsonResponder', Path: 'Main/main.json' },
           Templates: [
               {
                   Container: '#Pane', Template: 'Board/Board', Js: " InitSearch();",
                   Data: { 
                       Responder: 'DBFindResponder', Collection: 'IndexCategories', Criteria: { }, Fileds: { none: 0 }, Options: { skip: 0, limit: 5 }
                   },
                   Templates: [{
                       Container: '#InnerPane', Template: 'Ituran/Ituran',
                       Data: { Responder: 'JsonResponder',  Path: 'HomePage/HomePage.json' }
                   }]
               }]
       }]
   },

   Pointer:
   {
       Templates: [{
           Container: 'html', Template: 'Main/main',
           Data: { Responder: 'JsonResponder', Path: 'Main/main.json' },
           Templates: [
               {
                   Container: '#Pane', Template: 'Board/Board', Js: " InitSearch();",
                   Data: { 
                       Responder: 'DBFindResponder', Collection: 'IndexCategories', Criteria: { }, Fileds: { none: 0 }, Options: { skip: 0, limit: 5 }
                   },
                   Templates: [{
                       Container: '#InnerPane', Template: 'Pointer/Pointer',
                       Data: { Responder: 'JsonResponder',  Path: 'HomePage/HomePage.json' }
                   }]
               }]
       }]
   },

   UserAccount:
   {
       Templates: [{
           Container: 'html', Template: 'Main/main',
           Data: { Responder: 'JsonResponder', Path: 'Main/main.json' },
           Templates: [
               {
                   Container: '#Pane', Template: 'Board/Board', Js: " InitSearch();",
                   Data: { 
                       Responder: 'DBFindResponder', Collection: 'IndexCategories', Criteria: { }, Fileds: { none: 0 }, Options: { skip: 0, limit: 5 }
                   },
                   Templates: [{
                       Container: '#InnerPane', Template: 'UserAccount/UserAccount',
                       Data: { Responder: 'JsonResponder',  Path: 'HomePage/HomePage.json' }
                   }]
               }]
       }]
   },
   
    Register1:
   {
       Templates: [{
           Container: 'html', Template: 'Main/main',
           Data: { Responder: 'JsonResponder', Path: 'Main/main.json' },
           Templates: [{
               Container: '#Pane', Template: 'Authentication/Register1',  Js:"InitRegister1();",
               Data: { Responder: 'JsonResponder', Path: 'HomePage/HomePage.json' }
           }]
       }]
   }
       ,
    Login:
  {
      Templates: [{
          Container: 'html', Template: 'Main/main',
          Data: { Responder: 'JsonResponder', Path: 'Main/main.json' },
          Templates: [{
              Container: '#Pane', Template: 'Authentication/Login', Js: "InitLoginInputs()",
              Data: { Responder: 'JsonResponder', Path: 'HomePage/HomePage.json' }
          }]
      }]
  },

  Admin:
    {
        Templates: [{
            Container: 'html', Template: 'Admin/Main/main',
            Data: { Responder: 'JsonResponder', Path: 'Admin/Main/main.json' },
            Templates: [{
              Container: '#SysPane', Template: 'Admin/ActiveRides/activeRides', Js: "",
              Data: { Responder: 'JsonResponder', Path: 'Admin/Main/main.json' }
          }]
        }]
    },

    RidesHistory:
    {
        Templates: [{
            Container: 'html', Template: 'Admin/Main/main',
            Data: { Responder: 'JsonResponder', Path: 'Admin/Main/main.json' },
            Templates: [{
              Container: '#SysPane', Template: 'Admin/RidesHistory/RidesHistory', Js: "",
              Data: { Responder: 'JsonResponder', Path: 'Admin/Main/main.json' }
          }]
        }]
    },

    Users:
    {
        Templates: [{
            Container: 'html', Template: 'Admin/Main/main',
            Data: { Responder: 'JsonResponder', Path: 'Admin/Main/main.json' },
            Templates: [{
              Container: '#SysPane', Template: 'Admin/Users/Users', Js: "",
              Data: { Responder: 'DBFindResponder', Collection: 'BusCompany', Criteria: {}, Fileds: { none: 0 }, Options: { skip: 0, limit: 5000 } }
          }]
        }]
    },

    BusCompanyCard:
   {
       Templates: [{
           Container: 'html', Template: 'Admin/Main/main',
           Data: { Responder: 'JsonResponder', Path: 'Admin/Main/main.json' },
           Templates: [{
               Container: '#SysPane', Template: 'Admin/Users/Profile', Js: "admin.getBusCompanyDtl()",
               Data: { Responder: 'JsonResponder', Path: 'Admin/Main/main.json' }
           }]
       }]
   },

    Advertisers:
    {
        Templates: [{
            Container: 'html', Template: 'Admin/Main/main',
            Data: { Responder: 'JsonResponder', Path: 'Admin/Main/main.json' },
            Templates: [{
              Container: '#SysPane', Template: 'Admin/Advertisers/Advertisers', Js: "",
              Data: { Responder: 'JsonResponder', Path: 'Admin/Main/main.json' }
          }]
        }]
    },

};


exports.pageTemplate = sm;

