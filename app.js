/**
 PACKAGE LIST

 # Meteor packages used by this project, one per line.
 #
 # 'meteor add' and 'meteor remove' will edit this file for you,
 # but you can also edit it by hand.

 insecure                # Allow all DB writes from clients (for prototyping)
 iron:router
 accounts-password
 ian:bootstrap-3
 ian:accounts-ui-bootstrap-3
 dbarrett:dropzonejs
 aldeed:autoform
 aldeed:collection2
 aldeed:autoform-select2
 natestrauser:select2
 zimme:select2-bootstrap3-css
 ongoworks:security
 meteorhacks:fast-render
 multiply:iron-router-progress
 dburles:collection-helpers
 accounts-base
 alanning:roles
 fortawesome:fontawesome
 aslagle:reactive-table
 anti:i18n
 email
 peerlibrary:server-autorun
 fezvrasta:bootstrap-material-design
 sacha:spin
 twbs:bootstrap

 */

var Func = {

    getReqString: function (label, autoform) {
        return {
            label: label || null,
            type: String,
            optional: false,
            autoform: autoform || {}
        }
    },

    getAFSelect: function (options) {
        return {
            type: "select",
            firstOption: ' ',
            options: function () {
                return options;
            }
        }
    },

    getAFSelectAvalible: function () {
        return {
            type: "select",
            firstOption: ' ',
            options: function () {
                return [
                    {label: '+', value: "true"},
                    {label: '-', value: "false"}
                ];
            }
        }
    },

    /**
     *  Комментарии ко вкладам
     */
    getAFsimpleComment: {
        label: function () {
            return i18n('comment');
        },
        type: String,
        optional: true,
        autoform: {
            afFieldInput: {
                type: "textarea"
            }
        }
    },

    getOwner: function () {
        return {
            type: String,
            optional: false,
            regEx: SimpleSchema.RegEx.Id,
            autoValue: function () {
                if (this.isInsert) {
                    return Meteor.userId();
                }
            }
        }
    },

    attachBank: {
        label: function () {
            return i18n('bankName');
        },
        type: String,
        optional: true,
        autoform: {
            type: "select",
            firstOption: ' ',
            options: function () {
                Meteor.subscribe('BankList');
                var bankList = BankList.find({}, {});
                var arrLabels = [];
                bankList.forEach(function (obj) {
                    arrLabels.push({label: obj.title, value: obj._id});
                });
                return arrLabels;
            }
        }
    }

}


////// COLLECTIONS  /////////////

ScoringProject = new Meteor.Collection('scoringProject');

ScoringQuestion = new Meteor.Collection('scoringQuestion');

ScoringInstance = new Meteor.Collection('scoringInstance');

CountryList = new Meteor.Collection('countryList');

CityList = new Meteor.Collection('cityList');

BankList = new Meteor.Collection('bankList');

BankDeposit = new Meteor.Collection('bankDeposit');

BankAddresses = new Meteor.Collection('bankAddresses');

////// END COLLECTIONS  /////////////

////// SCHEMAS  /////////////

ScoringProjectStructureSchema = new SimpleSchema({

    type: Func.getReqString(
        function () {
            return i18n('form.typeOfDisplay');
        },
        Func.getAFSelect([
            {label: i18n('listing'), value: "listing"},
            {label: i18n('autoload'), value: "autoload"}
        ])
    ),


    questions: {
        label: function () {
            return i18n('form.answersForScoring')
        },
        type: [Object],
        minCount: 1,
        maxCount: 5
    },

    'questions.$.questionId': {
        label: function () {
            return i18n('question');
        },
        type: String,
        optional: true,
        autoform: {
            type: "select",
            placeholder: function () {
                return i18n('selectQuestion');
            },
            firstOption: ' ',
            options: function () {
                Meteor.subscribe('ScoringQuestion');
                var scoringQuestion = ScoringQuestion.find({});
                var arrLabels = [];
                scoringQuestion.forEach(function (obj) {
                    arrLabels.push({label: obj.title, value: obj._id});
                });
                return arrLabels;
            }
        }
    }

});

ScoringProjectSchema = new SimpleSchema({

    title: {
        type: String,
        label: function () {
            return i18n('title') + ":";
        },
        max: 200,
        optional: true,
        autoform: {
            afFieldInput: {
                placeholder: function () {
                    return " " + i18n('title');
                }
            }
        }
    },
    type: {
        label: function () {
            return i18n('scoringType');
        },
        type: String,
        optional: true,
        autoform: {
            type: "select",
            firstOption: ' ',
            options: function () {
                return [
                    {label: "Application", value: "application"},
                    {label: "Behavioral", value: "behavioral"}
                ];
            }
        }
    },
    humanFrendlyUrl: {
        type: String,
        label: function () {
            return i18n('relScoringPage');
        },
        max: 200,
        optional: true
    },
    structure: {
        label: function () {
            return i18n('questionStruct');
        },
        type: ScoringProjectStructureSchema,
        optional: false
    },
    rangePointMessage: {
        label: function () {
            return i18n('commentsForPoints');
        },
        type: [Object]
    },
    'rangePointMessage.$.from': {
        label: function () {
            return i18n('from');
        },
        type: Number
    },
    'rangePointMessage.$.to': {
        label: function () {
            return i18n('before');
        },
        type: Number
    },
    'rangePointMessage.$.resultMessage': {
        label: function () {
            return i18n('commentForRange');
        },
        type: String
    },
    owner: Func.getOwner()

});

ScoringProject.attachSchema(ScoringProjectSchema);

ScoringQuestionSchema = new SimpleSchema({

    title: {
        type: String,
        label: function () {
            return i18n('question');
        },
        max: 200,
        optional: false
    },

    adminComment: {
        type: String,
        label: function () {
            return i18n('commentForAdmin');
        },
        max: 200,
        optional: true
    },

    answers: {
        label: function () {
            return i18n('answers');
        },
        type: [Object],
        optional: false,
        minCount: 1,
        maxCount: 100
    },

    'answers.$.text': {
        label: function () {
            return i18n('textAnswer');
        },
        optional: false,
        type: String
    },
    'answers.$.points': {
        type: Number,
        label: function () {
            return i18n('point');
        },
        optional: false,
        autoform: {
            afFieldInput: {
                type: "number"
            }
        }
    },
    owner: Func.getOwner()

});

ScoringQuestion.attachSchema(ScoringQuestionSchema);

ScoringResultSchema = new SimpleSchema({

    results: {
        label: function () {
            return i18n('resCount');
        },
        type: [Object],
        minCount: 1,
        maxCount: 5
    },

    'results.$.questionId': {
        label: function () {
            return i18n('question');
        },
        type: String,
        optional: true,
        autoform: {
            type: "select",
            firstOption: ' ',
            options: function () {
                Meteor.subscribe('ScoringQuestion');
                var scoringQuestion = ScoringQuestion.find({});
                var arrLabels = [];
                scoringQuestion.forEach(function (obj) {
                    arrLabels.push({label: obj.title, value: obj._id});
                });
                return arrLabels;
            }
        }
    },

    'results.$.answer': {
        label: function () {
            return i18n('answers');
        },
        type: String,
        optional: true,
        autoform: {
            type: "select-radio",
            options: function () {
//            if (Meteor.isClient) {
//                 var docId = '';
//                 docId = AutoForm.getFormValues("admin_insert");
//             }

                return [
                    {label: "Test", value: "test"},
                    {label: "Test 1", value: "test 1"}
                ];
            }
        }
    }
});


ScoringInstanceSchema = new SimpleSchema({

    title: {
        label: " ",
        type: String,
        max: 200,
        optional: true,
        autoform: {
            afFieldInput: {
                type: "hidden",
                value: "scoringInstance"
            }
        }
    },
    firstname: {
        type: String,
        label: function () {
            return i18n('name');
        },
        max: 200,
        optional: false
    },
    lastname: {
        type: String,
        label: function () {
            return i18n('surname');
        },
        max: 200,
        optional: false
    },
    phone: {
        label: function () {
            return i18n('phone');
        },
        type: String,
        optional: false,
        autoform: {
            afFieldInput: {
                type: "tel"
            }
        }
    },
    email: {
        type: String,
        label: "Email:",
        optional: false,
        autoform: {
            afFieldInput: {
                type: "email"
            }
        }
    },
    projectId: {
        type: String,
        label: function () {
            return i18n('projectName');
        },
        autoform: {
            optional: false,
            type: "select",
            firstOption: ' ',
            options: function () {
                Meteor.subscribe('ScoringProject', {}, {});
                var scoringProjects = ScoringProject.find({});
                var arrLabels = [];
                scoringProjects.forEach(function (obj) {
                    arrLabels.push({label: obj.title, value: obj._id});
                });
                return arrLabels;
            }
        }
    },
    points: {
        type: Number,
        label: function () {
            return i18n('totalPoints');
        },
        optional: true,
        autoform: {
            afFieldInput: {
                type: "number"
            }
        }
    },
    resultComment: {
        type: String,
        label: function () {
            return i18n('resultComment');
        },
        optional: true
    },
    /*answers: {
     label: "Результат подсчета:",
     type: ScoringResultSchema,
     },*/
    owner: Func.getOwner()

});

ScoringInstance.attachSchema(ScoringInstanceSchema);


CountryListSchema = new SimpleSchema({

    country: {
        type: String,
        label: function () {
            return i18n('country');
        },
        optional: true
    }

});

CountryList.attachSchema(CountryListSchema);

CityListSchema = new SimpleSchema({
    title: {
        type: String,
        label: function () {
            return i18n('city');
        },
        optional: true
    },
    countryId: {
        label: function () {
            return i18n('country');
        },
        type: String,
        optional: true,
        autoform: {
            type: "select",
            firstOption: ' ',
            options: function () {
                Meteor.subscribe('CountryList');
                var countryList = CountryList.find({});
                var arrLabels = [];
                countryList.forEach(function (obj) {
                    arrLabels.push({label: obj.country, value: obj._id});
                });
                return arrLabels;
            }
        }
    }
});

CityList.attachSchema(CityListSchema);

BankAddressesSchema = new SimpleSchema({

    bankId: Func.attachBank,

    addresses: {
        label: function () {
            return i18n('addresses')
        },
        type: [Object],
        minCount: 1,
        maxCount: 1000
    },

    'addresses.$.cityId': {
        label: function () {
            return i18n('city');
        },
        type: String,
        optional: true,
        autoform: {
            type: "select",
            placeholder: function () {
                return i18n('city');
            },
            firstOption: ' ',
            options: function () {
                Meteor.subscribe('CityList');
                var cityList = CityList.find({});
                var arrLabels = [];
                cityList.forEach(function (obj) {
                    arrLabels.push({label: obj.title, value: obj._id});
                });
                return arrLabels;
            }
        }
    },

    'addresses.$.regionAddresses': {
        label: function () {
            return i18n('regionAddresses')
        },
        type: [Object],
        minCount: 1,
        maxCount: 1000
    },

    'addresses.$.regionAddresses.$.fullAddress': {
        label: function () {
            return i18n('address');
        },
        type: String,
        max: 200,
        optional: true
    },

    'addresses.$.regionAddresses.$.phones': {
        type: Object,
        label: function () {
            return i18n('phones');
        },
        optional: false
    },

    'addresses.$.regionAddresses.$.phones.numbers': {
        label: function () {
            return i18n('phones');
        },
        type: String,
        max: 200,
        optional: true
    }
});

BankAddresses.attachSchema(BankAddressesSchema);

BankListSchema = new SimpleSchema({

    title: {
        type: String,
        label: function () {
            return i18n('bankName');
        },
        optional: false
    },

    urlName: {
        type: String,
        label: function () {
            return i18n('urlName');
        },
        optional: false
    },

    description: {
        type: String,
        label: function () {
            return i18n('description');
        },
        optional: false,
        autoform: {
            afFieldInput: {
                type: "textarea"
            }
        }
    },

    phones: {
        type: Object,
        label: function () {
            return i18n('phones');
        },
        optional: false
    },

    'phones.general': {
        type: String,
        label: function () {
            return i18n('general');
        },
        optional: false
    },

    linkToBank: {
        type: String,
        label: function () {
            return i18n('linkToBank');
        },
        optional: false,
        autoform: {
            afFieldInput: {
                type: "url"
            }
        }
    }
});

BankList.attachSchema(BankListSchema);

BankDepositSchema = new SimpleSchema({

    bankId: Func.attachBank,

    deposits: {
        label: function () {
            return i18n('deposits');
        },
        optional: true,
        type: [Object]
    },

    'deposits.$.title': {
        label: function () {
            return i18n('title');
        },
        type: String,
        optional: false
    },

    'deposits.$.rates': {
        label: function () {
            return i18n('rates');
        },
        optional: false,
        type: [Object]
    },

    'deposits.$.rates.$.currency': {
        label: function () {
            return i18n('currency');
        },
        type: String,
        optional: false,
        autoform: {
            type: "select",
            firstOption: ' ',
            options: function () {
                return [
                    {
                        label: function () {
                            return i18n('rub');
                        },
                        value: "rub"
                    },
                    {
                        label: function () {
                            return i18n('usd');
                        },
                        value: "usd"
                    },
                    {
                        label: function () {
                            return i18n('euro');
                        },
                        value: "eur"
                    },
                    {
                        label: function () {
                            return i18n('cny');
                        },
                        value: "cny"
                    }
                ];
            }
        }
    },

    'deposits.$.rates.$.sumFrom': {
        label: function () {
            return i18n('sumFrom');
        },
        type: [Object],
        optional: false
    },

    'deposits.$.rates.$.sumFrom.$.from': {
        label: function () {
            return i18n('from');
        },
        type: String,
        optional: false
    },

    'deposits.$.rates.$.sumFrom.$.time2percent': {
        label: function () {
            return i18n('time2percent');
        },
        type: [Object],
        optional: false
    },

    'deposits.$.rates.$.sumFrom.$.time2percent.$.timeFrom': {
        label: function () {
            return i18n('from');
        },
        type: String,
        optional: false
    },

    'deposits.$.rates.$.sumFrom.$.time2percent.$.ratePercent': {
        label: function () {
            return i18n('ratePercent');
        },
        type: String,
        optional: false
    },

    'deposits.$.payPercent': {
        label: function () {
            return i18n('payPercent');
        },
        type: Object,
        optional: false
    },

    'deposits.$.payPercent.type': {
        label: function () {
            return i18n('payPercent');
        },
        type: String,
        optional: false,
        autoform: {
            type: "select",
            firstOption: ' ',
            options: function () {
                return [
                    {
                        label: function () {
                            return i18n('inEndOfTerm');
                        },
                        value: "inEndOfTerm"
                    },
                    {
                        label: function () {
                            return i18n('monthly');
                        },
                        value: "monthly"
                    },
                    {
                        label: function () {
                            return i18n('dayly');
                        },
                        value: "dayly"
                    }
                ];
            }
        }
    },

    'deposits.$.payPercent.comment': Func.getAFsimpleComment,

    'deposits.$.capitalization': {
        label: function () {
            return i18n('capitalization');
        },
        type: Object,
        optional: false
    },

    'deposits.$.capitalization.avalible': {
        label: function () {
            return i18n('capitalization');
        },
        type: String,
        optional: true,
        autoform: Func.getAFSelectAvalible()
    },

    'deposits.$.capitalization.comment': Func.getAFsimpleComment,

    'deposits.$.specialDepo': {
        label: function () {
            return i18n('specialDepo');
        },
        type: Object,
        optional: false
    },

    'deposits.$.specialDepo.avalible': {
        label: function () {
            return i18n('specialDepo');
        },
        type: String,
        optional: true,
        autoform: Func.getAFSelectAvalible()
    },

    'deposits.$.specialDepo.comment': Func.getAFsimpleComment,

    'deposits.$.added': {
        label: function () {
            return i18n('added');
        },
        type: Object,
        optional: false
    },

    'deposits.$.added.avalible': {
        label: function () {
            return i18n('added');
        },
        type: String,
        optional: true,
        autoform: Func.getAFSelectAvalible()
    },

    'deposits.$.added.comment': Func.getAFsimpleComment
});

BankDeposit.attachSchema(BankDepositSchema);

////// END SCHEMAS  /////////////


if (Meteor.isServer) {

    ////// PERMISSIONS ///////////////////////
    Security.permit(['insert', 'update', 'remove']).collections(
        [
            ScoringProject,
            ScoringQuestion,
            ScoringInstance,
            CountryList,
            CityList,
            BankAddresses,
            BankList,
            BankDeposit
        ]
    ).apply();//*/


    Meteor.publish("ScoringProject", function (find, options) {
        return ScoringProject.find(find, options);
    });

    Meteor.publish("ScoringQuestion", function (find, options) {
        return ScoringQuestion.find(find, options);
    });

    Meteor.publish("ScoringInstance", function () {
        return ScoringInstance.find();
    });

    Meteor.publish("CountryList", function (find, options) {
        return CountryList.find(find, options);
    });

    Meteor.publish("CityList", function (find, options) {
        return CityList.find(find, options);
    });

    Meteor.publish("BankAddresses", function (find, options) {
        return BankAddresses.find(find, options);
    });

    Meteor.publish("BankDeposit", function (find, options) {
        return BankDeposit.find(find, options);
    });

    Meteor.publish("BankList", function (find, options) {
        return BankList.find(find, options);
    });


    Meteor.startup(function () {


        smtp = {
            username: 'mr.berdin@inbox.ru',
            password: '*******',
            server: 'smtp.mail.ru',
            port: 465
        }

        process.env.MAIL_URL = 'smtp://localhost';

    });

    //CountryList.remove({});

    if (CountryList.find({}, {}).count() === 0) {
        CountryList.insert({
            country: 'Russia'
        });

        CountryList.insert({
            country: 'England'
        });
    }

    //CityList.remove({});

    if (CityList.find({}, {}).count() === 0) {

        var Country = CountryList.find({}, {'country': 'Russia'});

        CityList.insert({
            title: 'Саратов',
            countryId: Country._id
        });

        CityList.insert({
            title: 'Москва',
            countryId: Country._id
        });

    }
}

if (Meteor.isClient) {

    Router.configure({
        layoutTemplate: 'layout',
        loadingTemplate: 'loading',
        waitOn: function () {
            return [
//                 Meteor.subscribe('NR'),
            ];
        },
        fastRender: true
    });

    Router.map(function () {
        this.route('Main', {
            path: '/',
            fastRender: true
//             disableProgress: true
        });
        this.route('resultMessage', {
            path: '/resultMessage/:project/:points',
//             disableProgress: true
            waitOn: function () {
                return Meteor.subscribe('ScoringProject', {}, {});
            },
            data: function () {
                var points = this.params.points;
                var project = this.params.project;

                var dataProject = ScoringProject.findOne(project);
                var resultMessage = 'Результат: ';

                if (dataProject.rangePointMessage !== 'undefined') {
                    dataProject.rangePointMessage.forEach(function (obj) {
                        if (points > obj.from && points < obj.to) {
                            resultMessage += obj.resultMessage;
                        }
                    });
                }

                return {
                    'resultMessage': resultMessage,
                    'project': project
                };
            },
            fastRender: true
        });
        this.route('scoringPass', {
            path: '/scoringPass/:humanFrendlyUrl',
            waitOn: function () {
                return Meteor.subscribe('ScoringProject', {}, {});
            },
            data: function () {
                return ScoringProject.findOne({'humanFrendlyUrl': this.params.humanFrendlyUrl});
            },
            fastRender: true
        });


        this.route('addScoringQuestion', {
            path: '/addScoringQuestion',
            fastRender: true
        });
        this.route('scoringQuestionList', {
            path: '/scoringQuestionList',
            waitOn: function () {
                return Meteor.subscribe('ScoringQuestion', {}, {});
            },
            fastRender: true
        });


        this.route('scoringProjectList', {
            path: '/scoringProjectList',
            waitOn: function () {
                return Meteor.subscribe('ScoringProject', {}, {});
            },
            fastRender: true
        });
        this.route('addScoringProject', {
            path: '/addScoringProject',
            waitOn: function () {
                return Meteor.subscribe('ScoringQuestion', {}, {});
            },
            fastRender: true
        });


        this.route('bankList', {
            path: '/bankList',
            waitOn: function () {
                return Meteor.subscribe('BankList', {}, {});
            },
            fastRender: true
        });
        this.route('addBank', {
            path: '/addBank',
            waitOn: function () {
                return Meteor.subscribe('BankList', {}, {});
            },
            fastRender: true
        });
        this.route('updateBank', {
            path: '/updatedBank/:_id',
            waitOn: function () {
                return Meteor.subscribe('BankList', {}, {});
            },
            data: function () {
                return BankList.findOne({'_id': this.params._id});
            },
            fastRender: true
        });
        this.route('viewBank', {
            path: '/viewBank/:_id',
            waitOn: function () {
                return Meteor.subscribe('BankList', {}, {});
            },
            data: function () {
                return BankList.findOne({'_id': this.params._id});
            },
            fastRender: true
        })


        this.route('bankAddressesList', {
            path: '/bankAddressesList',
            waitOn: function () {
                Meteor.subscribe('BankList', {}, {});
                return Meteor.subscribe('BankAddresses', {}, {});
            },
            fastRender: true
        });
        this.route('addBankAddresses', {
            path: '/addBankAddresses',
            waitOn: function () {
                Meteor.subscribe('BankList', {}, {});
                Meteor.subscribe('CityList', {}, {});
                return Meteor.subscribe('BankAddresses', {}, {});
            },
            fastRender: true
        });
        this.route('updateBankAddresses', {
            path: '/updatedBankAddresses/:_id',
            waitOn: function () {
                Meteor.subscribe('BankList', {}, {});
                Meteor.subscribe('CityList', {}, {});
                return Meteor.subscribe('BankAddresses', {}, {});
            },
            data: function () {
                return BankAddresses.findOne({'_id': this.params._id});
            },
            fastRender: true
        });


        this.route('bankDepositList', {
            path: '/bankDepositList',
            waitOn: function () {
                Meteor.subscribe('BankList', {}, {});
                return Meteor.subscribe('BankDeposit', {}, {});
            },
            fastRender: true
        });
        this.route('addBankDeposit', {
            path: '/addBankDeposit',
            waitOn: function () {
                Meteor.subscribe('BankList', {}, {});
                return Meteor.subscribe('BankDeposit', {}, {});
            },
            fastRender: true
        });
        this.route('updateBankDeposit', {
            path: '/updatedBankDeposit/:_id',
            waitOn: function () {
                Meteor.subscribe('BankList', {}, {});
                return Meteor.subscribe('BankDeposit', {}, {});
            },
            data: function () {
                return BankDeposit.findOne({'_id': this.params._id});
            },
            fastRender: true
        });


        this.route('cityList', {
            path: '/cityList',
            waitOn: function () {
                return Meteor.subscribe('CityList', {}, {});
            },
            fastRender: true
        });


        this.route('countryList', {
            path: '/countryList',
            waitOn: function () {
                return Meteor.subscribe('CountryList', {}, {});
            },
            fastRender: true
        });


    });

    Router.onBeforeAction('loading');


    Template.layout.helpers({
        postLayoutView: function () {
            var routeName = Router.current().route.getName();
            if (routeName === 'scoringPass') {
                return false;
            }
            return true;
        }
    });

    Template.Main.helpers({
        scoringProjects: function () {
            Meteor.subscribe('ScoringProject', {}, {});
            return ScoringProject.find({});
        }
    });


////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

    Template.scoringPassItem.helpers({
        scoringQuestion: function () {
            Meteor.subscribe('ScoringQuestion', {'_id': this.questionId}, {});
            return ScoringQuestion.findOne(this.questionId);
        }
    });

    Template.scoringPass.events({
        'click #scoreResultButton': function (event) {
            var points = 0;
            $('label.active').find('input').map(function () {
                var dataId = $(this).attr('data-id');
                points = points + parseInt(dataId);
            });

            Router.go('resultMessage', {
                'project': this._id,
                'points': points
            });
        }
    });

    Template.scoringPassItem.helpers({
        resultMessage: function () {
//            Meteor.subscribe('ScoringQuestion',{'_id':this.questionId},{});
//            return ScoringQuestion.findOne(this.questionId);
            return points;
        }
    });


////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

    Template.scoringQuestionList.events({
        'click .reactive-table tbody tr': function (event) {
            event.preventDefault();
            if (event.target.id == "deleteQuestion") {
                if (confirm(i18n('form.deleteConfirm'))) {
                    var selfScoringQuestion = this;
                    ScoringQuestion.remove(selfScoringQuestion._id)
                }
            }
        }
    });

    Template.scoringQuestionList.helpers({
        settings: function () {
            return {
                collection: ScoringQuestion,
                rowsPerPage: 10,
                showFilter: true,
                fields: [
                    {key: "title", label: i18n('title')},
                    {key: "_id", label: i18n('control'), fn: function (value, object) {
                        return new Spacebars.SafeString(
                            '<span id="deleteQuestion" class="glyphicon glyphicon-trash" aria-hidden="true"></span>'
                        );
                    }}
                ]
            };
        }
    });

    Template.addScoringQuestion.helpers({
        ScoringQuestionCollection: ScoringQuestion
    });

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

    Template.bankList.helpers({
        settings: function () {
            return {
                collection: BankList,
                rowsPerPage: 10,
                showFilter: true,
                fields: [
                    {key: "title", label: i18n('title')},
                    {key: "_id", label: i18n('control'), fn: function (value, object) {
                        return new Spacebars.SafeString(
                            '<span id="viewBank" class="glyphicon glyphicon-eye-open" aria-hidden="true"></span>' +
                                '&nbsp;&nbsp;<span id="updateBank" class="glyphicon glyphicon-pencil" aria-hidden="true"></span>' +
                                '&nbsp;&nbsp;<span id="deleteBank" class="glyphicon glyphicon-trash" aria-hidden="true"></span>'
                        );
                    }}
                ]
            };
        }
    });

    Template.bankList.events({
        'click .reactive-table tbody tr': function (event) {
            event.preventDefault();
            var selfBank = this;
            if (event.target.id == "deleteBank") {
                if (confirm(i18n('form.deleteConfirm'))) {
                    //BankList.remove(selfBank._id)
                }
            }

            if (event.target.id == "updateBank") {
                Router.go('updateBank', {
                    '_id': selfBank._id
                });
            }

            if (event.target.id == "viewBank") {
                Router.go('viewBank', {
                    '_id': selfBank._id
                });
            }
        }
    });

    Template.addBank.helpers({
        BankCollection: BankList
    });

    Template.updateBank.helpers({
        BankCollection: BankList
    });

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

    Template.bankAddressesList.helpers({
        settings: function () {
            return {
                collection: BankAddresses,
                rowsPerPage: 10,
                showFilter: true,
                fields: [
                    {key: "bankId", label: i18n('title'), fn: function (value, object) {
                        var bank = BankList.findOne({'_id': value});
                        return new Spacebars.SafeString(bank.title);
                    }},
                    {key: "_id", label: i18n('control'), fn: function (value, object) {
                        return new Spacebars.SafeString(
                            '&nbsp;&nbsp;<span id="updateBankAddresses" class="glyphicon glyphicon-pencil" aria-hidden="true"></span>' +
                                '&nbsp;&nbsp;<span id="deleteBankAddresses" class="glyphicon glyphicon-trash" aria-hidden="true"></span>'
                        );
                    }}
                ]
            };
        }
    });

    Template.bankAddressesList.events({
        'click .reactive-table tbody tr': function (event) {
            event.preventDefault();
            var selfBankAddresses = this;
            if (event.target.id == "deleteBankAddresses") {
                if (confirm(i18n('form.deleteConfirm'))) {
                    //BankAddresses.remove(selfBankAddresses._id);
                }
            }

            if (event.target.id == "updateBankAddresses") {
                Router.go('updateBankAddresses', {
                    '_id': selfBankAddresses._id
                });
            }
        }
    });

    Template.addBankAddresses.helpers({
        BankAddressesCollection: BankAddresses
    });

    Template.updateBankAddresses.helpers({
        BankAddressesCollection: BankAddresses
    });


    ////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////


    Template.bankDepositList.helpers({
        settings: function () {
            return {
                collection: BankDeposit,
                rowsPerPage: 10,
                showFilter: true,
                fields: [
                    {key: "bankId", label: i18n('title'), fn: function (value, object) {
                        var bank = BankList.findOne({'_id': value});
                        return new Spacebars.SafeString(bank.title);
                    }},
                    {key: "_id", label: i18n('control'), fn: function (value, object) {
                        return new Spacebars.SafeString(
                            '&nbsp;&nbsp;<span id="updateBankDeposit" class="glyphicon glyphicon-pencil" aria-hidden="true"></span>' +
                                '&nbsp;&nbsp;<span id="deleteBankDeposit" class="glyphicon glyphicon-trash" aria-hidden="true"></span>'
                        );
                    }}
                ]
            };
        }
    });

    Template.bankDepositList.events({
        'click .reactive-table tbody tr': function (event) {
            event.preventDefault();
            var selfBankDeposit = this;
            if (event.target.id == "deleteBankDeposit") {
                if (confirm(i18n('form.deleteConfirm'))) {
                    //BankDeposit.remove(selfBankDeposit._id);
                }
            }

            if (event.target.id == "updateBankDeposit") {
                Router.go('updateBankDeposit', {
                    '_id': selfBankDeposit._id
                });
            }
        }
    });

    Template.addBankDeposit.helpers({
        BankDepositCollection: BankDeposit
    });

    Template.updateBankDeposit.helpers({
        BankDepositCollection: BankDeposit
    });


////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////


    Template.addScoringProject.helpers({
        ScoringProjectCollection: ScoringProject
    });

    Template.scoringProjectList.helpers({
        settings: function () {
            return {
                collection: ScoringProject,
                rowsPerPage: 10,
                showFilter: true,
                fields: [
                    {key: "title", label: i18n('title')},
                    {key: "_id", label: i18n('control'), fn: function (value, object) {
                        return new Spacebars.SafeString(
                            '<span id="deleteProject" class="glyphicon glyphicon-trash" aria-hidden="true"></span>'
                        );
                    }}
                ]
            };
        }
    });

    Template.scoringProjectList.events({
        'click .reactive-table tbody tr': function (event) {
            event.preventDefault();
            if (event.target.id == "deleteProject") {
                if (confirm(i18n('form.deleteConfirm'))) {
                    var selfScoringProject = this;
                    ScoringProject.remove(selfScoringProject._id)
                }
            }
        }
    });


////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////		


    Template.countryList.helpers({
        settings: function () {
            return {
                collection: CountryList,
                rowsPerPage: 10,
                showFilter: true,
                fields: [
                    {key: "country", label: i18n('country')}
                ]
            };
        }
    });


////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

    Template.cityList.helpers({
        settings: function () {
            return {
                collection: CityList,
                rowsPerPage: 10,
                showFilter: true,
                fields: [
                    {key: "title", label: i18n('city')}
                ]
            };
        }
    });

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////


    Template.connectionTpl.helpers({
        status: function () {
            return Meteor.status().connected;
        }
    });

    Template.localisation.events({
        'click a': function (event) {
            Session.set('localisation', $(event.target).attr('id'));
        }
    });

    Template.localisation.helpers({
        lang: function() {
            return i18n.getLanguage();
        }
    });

    /**
     Иначе не работает выпадающий список
     */
    Template._loginButtons.events({
        'click .dropdown-toggle': function (event) {
            $('.dropdown-toggle').dropdown().click();
        }
    });

    Template.mainMenu.events({
        'click .dropdown-toggle': function (event) {
            $('.dropdown-toggle').dropdown().click();
        }
    });

    Tracker.autorun(function (c) {
        i18n.setLanguage(Session.get('localisation'));
    });


    /**
     Ловим события форм отрендериных autoform`ом
     */
    AutoForm.hooks({
        insertScoringProject: {
            onSuccess: function (doc) {
                Router.go('scoringProjectList');
                return true;
            }
        },
        insertScoringQuestion: {
            onSuccess: function (doc) {
                Router.go('scoringQuestionList');
                return true;
            }
        },
        insertBank: {
            onSuccess: function (doc) {
                Router.go('bankList');
                return true;
            }
        },
        updateBank: {
            onSuccess: function (doc) {
                Router.go('bankList');
                return true;
            }
        },
        insertBankAddresses: {
            onSuccess: function (doc) {
                Router.go('bankAddressesList');
                return true;
            }
        },
        updateBankAddresses: {
            onSuccess: function (doc) {
                Router.go('bankAddressesList');
                return true;
            }
        },
        insertBankDeposit: {
            onSuccess: function (doc) {
                Router.go('bankDepositList');
                return true;
            }
        },
        updateBankDeposit: {
            onSuccess: function (doc) {
                Router.go('bankDepositList');
                return true;
            }
        }
    });

    i18n.setLanguage('ru');

}///// END CLIENT //////////////////////////