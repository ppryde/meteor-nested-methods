if (Meteor.isClient) {
  Template.hello.created = function(){
    Session.set("methodQueue", {obj: null, index: -1});
    Session.set("methodQueue.methods", ["method1","method2","method3"]);
    //Our callback for the procs passing in obj as our context
    var cb_func = function(err, obj){
        if (Session.get("methodQueue.index")<Session.get("methodQueue.methods").length-1)
            Session.set("methodQueue.index", Session.get("methodQueue.index")+1);
        else
            Session.set("methodQueue.index", false);
        Session.set("methodQueue.obj", obj);
    };
    //Watch for changes to the index
    this.autorun(function(){
        var next = Session.get("methodQueue.index");
        if (next !== false && new Number(next) && next>=0)//pernickity zero=false hack
            Meteor.call(Session.get("methodQueue.methods")[next], Session.get("methodQueue.obj"), cb_func);
    });
  }
  Template.hello.events({
    'click button': function () {
        //Change index, kick off the autorun
        Session.set("methodQueue.index", 0);
        Session.set("methodQueue.obj", {});
    }
  });
  Template.hello.helpers({
    'queueResult': function(){
        //Display the results on the page
        return Session.get("methodQueue.obj");
    }
  });
}
if (Meteor.isServer) {
  Meteor.startup(function () {
     //Our generic methods that take the object from previous method and add a result to prove it happened
     Meteor.methods({
        method1: function(){
          var obj = {result:"result1"};
          return obj;
        },
        method2: function(obj){
          _.extend(obj, {result2:"result2"});
          Meteor._sleepForMs(3000); //Pause execution to show it waiting for the next result
          return obj;
        },
        method3: function(obj){
          _.extend(obj, {result3:"result3"});
          return obj;
        }
     });
  });
}
