'use strict';

const mutationStack = require('mutationstack');

var tracker;

function redo(){
    tracker.redo();
}

function undo(){
    tracker.undo();
}

addEventListener("load", function(){
    var targetElem = document.getElementById("inputarea");
    tracker = new mutationStack.MutationTracker(targetElem);
    tracker.start();
});
document.getElementById("redoBtn").addEventListener("click", redo);
document.getElementById("undoBtn").addEventListener("click", undo);