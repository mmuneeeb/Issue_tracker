'use strict';
const mongoose = require("mongoose");
const IssueModel = require("../models").Issue;
const ProjectModel = require("../models").Project;

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      
    })
    
    .post(function (req, res){
      let project = req.params.project;
      
      const issue_title = req.body.issue_title;
      const issue_text = req.body.issue_text;
      const created_by = req.body.created_by;
      const assigned_to = req.body.assigned_to;
      const status_text = req.body.status_text;
      
      if (!issue_title || !issue_title || !created_by){
        res.json({error: 'required field(s) missing'});
      }
      else {
        const newIssue = new IssueModel({
          issue_title: issue_title,
          issue_text: issue_text,
          created_by: created_by,
          asigned_to: assigned_to,
          status_text: status_text,
          created_on: Date(),
          updated_on: Date(),
          open: true,
          _id:_id,
        });
        res.send(newIssue);
      }
      
    })
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
